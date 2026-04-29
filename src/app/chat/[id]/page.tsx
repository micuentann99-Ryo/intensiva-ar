'use client';

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isYesterday, isSameYear } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  ArrowLeft,
  Plus,
  SendHorizontal,
  X,
  MessageCircle,
  BookOpen,
  Loader2,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/auth-context';
import { MessageBubble, type ChatMessage, getAvatarColor, getInitials } from '@/components/chat/message-bubble';

/* ─── Types ─────────────────────────────────────────────────────── */

interface ConversationData {
  id: string;
  otherParticipant: { id: string; name: string; role: string };
  subject: string;
  courseSlug: string | null;
  activityId: string | null;
  activityTitle: string | null;
  activityType: string | null;
  lastMessageAt: string | null;
  lastMessagePreview: string | null;
  unreadCount: number;
  createdAt: string;
}

interface PendingFile {
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  type: string;
}

/* ─── Constants ─────────────────────────────────────────────────── */

const GROUP_THRESHOLD_MS = 3 * 60 * 1000; // 3 minutes
const POLL_INTERVAL_MS = 3000;
const MAX_INITIAL_PAGES = 10; // Up to 300 messages

/* ─── Helpers ───────────────────────────────────────────────────── */

function formatDateSeparator(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();

  if (isToday(date)) return 'Hoy';
  if (isYesterday(date)) return 'Ayer';
  if (isSameYear(date, now)) {
    return format(date, "d 'de' MMMM", { locale: es });
  }
  return format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function groupMessages(messages: ChatMessage[]): {
  messages: ChatMessage[];
  isFirstInGroup: boolean[];
  isLastInGroup: boolean[];
  dateSeparators: { index: number; label: string }[];
} {
  const isFirstInGroup: boolean[] = [];
  const isLastInGroup: boolean[] = [];
  const dateSeparators: { index: number; label: string }[] = [];

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const prev = i > 0 ? messages[i - 1] : null;

    // Date separator check
    if (!prev || !isSameDay(prev.createdAt, msg.createdAt)) {
      dateSeparators.push({ index: i, label: formatDateSeparator(msg.createdAt) });
    }

    // Grouping check: same sender, within threshold, same day
    const sameSender = prev && prev.senderId === msg.senderId;
    const withinThreshold =
      prev && new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime() < GROUP_THRESHOLD_MS;
    const sameDay = prev && isSameDay(prev.createdAt, msg.createdAt);

    const firstInGroup = !(sameSender && withinThreshold && sameDay);
    isFirstInGroup.push(firstInGroup);

    // Look ahead to check if last in group
    const next = i < messages.length - 1 ? messages[i + 1] : null;
    const sameSenderNext = next && next.senderId === msg.senderId;
    const withinThresholdNext =
      next && new Date(next.createdAt).getTime() - new Date(msg.createdAt).getTime() < GROUP_THRESHOLD_MS;
    const sameDayNext = next && isSameDay(msg.createdAt, next.createdAt);
    const lastInGroup = !(sameSenderNext && withinThresholdNext && sameDayNext);
    isLastInGroup.push(lastInGroup);
  }

  return { messages, isFirstInGroup, isLastInGroup, dateSeparators };
}

function isSameDay(dateStr1: string, dateStr2: string): boolean {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/* ─── Component ─────────────────────────────────────────────────── */

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id as string;
  const { user, loading: authLoading } = useAuth();

  // State
  const [conversation, setConversation] = useState<ConversationData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [sending, setSending] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [pendingFile, setPendingFile] = useState<PendingFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastPolledMessageIdRef = useRef<string | null>(null);
  const isAtBottomRef = useRef(true);

  // ── Redirect if not logged in ──
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // ── Fetch conversation details ──
  useEffect(() => {
    if (!user || !conversationId) return;

    async function fetchConversation() {
      try {
        const res = await fetch(`/api/chat/conversations/${conversationId}`);
        if (res.ok) {
          const data = await res.json();
          setConversation(data.conversation);
        } else if (res.status === 404 || res.status === 403) {
          router.push('/chat');
        }
      } catch {
        // silently fail
      }
    }

    fetchConversation();
  }, [user, conversationId, router]);

  // ── Fetch all messages (initial load) ──
  useEffect(() => {
    if (!user || !conversationId) return;

    let cancelled = false;

    async function fetchAllMessages() {
      setLoadingMessages(true);
      try {
        const allMessages: ChatMessage[] = [];
        let cursor: string | null = null;
        let hasMore = true;
        let pages = 0;

        while (hasMore && pages < MAX_INITIAL_PAGES) {
          const url = cursor
            ? `/api/chat/conversations/${conversationId}/messages?cursor=${encodeURIComponent(cursor)}`
            : `/api/chat/conversations/${conversationId}/messages`;

          const res = await fetch(url);
          if (!res.ok || cancelled) break;

          const data = await res.json();
          allMessages.push(...(data.messages || []));
          hasMore = data.hasMore;
          cursor = data.nextCursor;
          pages++;
        }

        if (!cancelled) {
          setMessages(allMessages);
          lastPolledMessageIdRef.current =
            allMessages.length > 0 ? allMessages[allMessages.length - 1].id : null;
        }
      } catch {
        // silently fail
      } finally {
        if (!cancelled) {
          setLoadingMessages(false);
          setInitialLoadDone(true);
        }
      }
    }

    fetchAllMessages();
    return () => {
      cancelled = true;
    };
  }, [user, conversationId]);

  // ── Auto-scroll to bottom after initial load ──
  useEffect(() => {
    if (initialLoadDone && messagesEndRef.current) {
      // Small delay to let React render
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
      });
    }
  }, [initialLoadDone]);

  // ── Auto-scroll on new messages (only if at bottom) ──
  useEffect(() => {
    if (!initialLoadDone) return;
    if (isAtBottomRef.current && messagesEndRef.current) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, [messages.length, initialLoadDone]);

  // ── Track scroll position ──
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const threshold = 80;
    isAtBottomRef.current =
      container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  }, []);

  // ── Poll for new messages ──
  useEffect(() => {
    if (!user || !conversationId || !initialLoadDone) return;

    const interval = setInterval(async () => {
      try {
        const cursorId = lastPolledMessageIdRef.current;
        const url = cursorId
          ? `/api/chat/conversations/${conversationId}/messages?cursor=${encodeURIComponent(cursorId)}`
          : `/api/chat/conversations/${conversationId}/messages`;

        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        const newMessages: ChatMessage[] = data.messages || [];

        if (newMessages.length > 0) {
          setMessages((prev) => [...prev, ...newMessages]);
          lastPolledMessageIdRef.current =
            newMessages[newMessages.length - 1].id;

          // Update conversation preview
          setConversation((prev) => {
            if (!prev) return prev;
            const lastMsg = newMessages[newMessages.length - 1];
            return {
              ...prev,
              lastMessageAt: lastMsg.createdAt,
              lastMessagePreview: lastMsg.content || lastMsg.fileName || 'Archivo adjunto',
            };
          });
        }
      } catch {
        // silently fail
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [user, conversationId, initialLoadDone]);

  // ── Send message ──
  const handleSend = useCallback(async () => {
    if (!user || !conversationId) return;
    if (!textInput.trim() && !pendingFile) return;
    if (sending || uploading) return;

    setSending(true);

    try {
      const payload: Record<string, unknown> = {
        content: textInput.trim() || '',
        type: pendingFile ? pendingFile.type : 'text',
      };

      if (pendingFile) {
        payload.fileUrl = pendingFile.url;
        payload.fileName = pendingFile.fileName;
        payload.fileSize = pendingFile.fileSize;
        payload.mimeType = pendingFile.mimeType;
      }

      const res = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const newMsg: ChatMessage = data.message;
        setMessages((prev) => {
          // Avoid duplicates from polling
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
        lastPolledMessageIdRef.current = newMsg.id;
        setTextInput('');
        setPendingFile(null);

        // Reset textarea height
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
      }
    } catch {
      // silently fail
    } finally {
      setSending(false);
    }
  }, [user, conversationId, textInput, pendingFile, sending, uploading]);

  // ── Handle key press ──
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  // ── Handle text input change + auto-resize ──
  const handleTextInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTextInput(e.target.value);
      const el = e.target;
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    },
    []
  );

  // ── File upload ──
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/chat/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setPendingFile({
          url: data.url,
          fileName: data.fileName,
          fileSize: data.fileSize,
          mimeType: data.mimeType,
          type: data.type,
        });
      }
    } catch {
      // silently fail
    } finally {
      setUploading(false);
      // Reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, []);

  const removePendingFile = useCallback(() => {
    setPendingFile(null);
  }, []);

  // ── Group messages for display ──
  const { isFirstInGroup, isLastInGroup, dateSeparators } = useMemo(
    () => groupMessages(messages),
    [messages]
  );

  const dateSeparatorSet = useMemo(() => {
    const set = new Set<number>();
    dateSeparators.forEach((ds) => set.add(ds.index));
    return set;
  }, [dateSeparators]);

  const dateSeparatorMap = useMemo(() => {
    const map = new Map<number, string>();
    dateSeparators.forEach((ds) => map.set(ds.index, ds.label));
    return map;
  }, [dateSeparators]);

  // ── Context info ──
  const contextParts: string[] = useMemo(() => {
    if (!conversation) return [];
    const parts: string[] = [];
    if (conversation.courseSlug) {
      parts.push(
        conversation.courseSlug.charAt(0).toUpperCase() +
          conversation.courseSlug.slice(1).replace(/-/g, ' ')
      );
    }
    if (conversation.activityTitle) {
      parts.push(conversation.activityTitle);
    }
    if (conversation.activityType) {
      parts.push(conversation.activityType);
    }
    if (parts.length === 0 && conversation.subject) {
      parts.push(conversation.subject);
    }
    return parts;
  }, [conversation]);

  const otherParticipant = conversation?.otherParticipant;

  const roleBadgeClass = otherParticipant?.role === 'PROFESSOR'
    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';

  const roleLabel = otherParticipant?.role === 'PROFESSOR' ? 'Profesor' : 'Alumno';

  // ── Submit handler for form ──
  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      handleSend();
    },
    [handleSend]
  );

  // ── Loading state ──
  if (authLoading || !user) {
    return (
      <div className="h-screen flex flex-col bg-white dark:bg-[#1C1C1E]">
        <ChatHeaderSkeleton />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-[#1C1C1E] overflow-hidden">
      {/* ── Header ── */}
      <header className="shrink-0 border-b border-gray-200 dark:border-white/10 bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-md z-20">
        <div className="flex items-center gap-3 px-3 py-2">
          {/* Back button */}
          <Link
            href="/chat"
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors -ml-1"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5 text-[#007AFF] dark:text-[#5AC8FA]" />
          </Link>

          {/* Avatar */}
          {otherParticipant && (
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
              style={{ backgroundColor: getAvatarColor(otherParticipant.name) }}
            >
              {getInitials(otherParticipant.name)}
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[15px] text-foreground truncate">
                {otherParticipant?.name || 'Cargando...'}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${roleBadgeClass}`}>
                {roleLabel}
              </span>
            </div>
            {contextParts.length > 0 && (
              <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                {contextParts.join(' · ')}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* ── Messages area ── */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4"
      >
        {/* Loading state */}
        {loadingMessages && (
          <div className="space-y-4 py-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                <Skeleton className="h-10 w-48 rounded-2xl" />
              </div>
            ))}
          </div>
        )}

        {/* Empty chat state */}
        {!loadingMessages && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-white/10 mb-4">
              <MessageCircle className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-base font-semibold text-foreground mb-1">
              Iniciá la conversación
            </p>
            {contextParts.length > 0 && (
              <div className="flex items-center gap-2 mt-3 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 max-w-xs text-center">
                <BookOpen className="w-4 h-4 text-muted-foreground shrink-0" />
                <p className="text-sm text-muted-foreground">{contextParts.join(' · ')}</p>
              </div>
            )}
          </div>
        )}

        {/* Message list */}
        {!loadingMessages && messages.length > 0 && (
          <div className="max-w-2xl mx-auto">
            {messages.map((msg, idx) => (
              <div key={msg.id}>
                {/* Date separator */}
                {dateSeparatorSet.has(idx) && (
                  <div className="flex items-center justify-center my-4">
                    <span className="text-[12px] font-medium text-muted-foreground bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-full">
                      {dateSeparatorMap.get(idx)}
                    </span>
                  </div>
                )}

                {/* Message bubble */}
                <MessageBubble
                  message={msg}
                  isOwn={msg.senderId === user.id}
                  isFirstInGroup={isFirstInGroup[idx]}
                  isLastInGroup={isLastInGroup[idx]}
                  showAvatar={true}
                  otherParticipant={
                    conversation?.otherParticipant || { id: '', name: '?', role: 'STUDENT' }
                  }
                />
              </div>
            ))}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        )}
      </div>

      {/* ── Input area ── */}
      <div className="shrink-0 border-t border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-lg z-20">
        {/* Pending file chip */}
        <AnimatePresence>
          {pendingFile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 px-4 pt-3 pb-1 max-w-2xl mx-auto">
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/10 rounded-full px-3 py-1.5 text-sm flex-1 min-w-0">
                  <SendHorizontal className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate text-foreground">{pendingFile.fileName}</span>
                  <span className="text-muted-foreground text-xs shrink-0">
                    {formatFileSize(pendingFile.fileSize)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={removePendingFile}
                  className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                  aria-label="Quitar archivo"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload spinner */}
        {uploading && (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            <span className="text-xs text-muted-foreground ml-2">Subiendo archivo...</span>
          </div>
        )}

        {/* Input form */}
        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-2 px-3 py-2.5 max-w-2xl mx-auto"
        >
          {/* File input (hidden) */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
            aria-hidden="true"
          />

          {/* Attach button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || sending}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-muted-foreground disabled:opacity-40 shrink-0 mb-0.5"
            aria-label="Adjuntar archivo"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Text input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={textInput}
              onChange={handleTextInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Mensaje"
              disabled={sending}
              rows={1}
              className="w-full resize-none rounded-[20px] bg-gray-100 dark:bg-white/10 border-none text-foreground placeholder:text-muted-foreground px-4 py-2 text-[15px] leading-[1.3] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 transition-all disabled:opacity-60 max-h-[120px] custom-scrollbar"
              style={{
                minHeight: '36px',
              }}
            />
          </div>

          {/* Send button */}
          <button
            type="submit"
            disabled={sending || (!textInput.trim() && !pendingFile)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#007AFF] dark:bg-[#0A84FF] text-white disabled:opacity-40 disabled:bg-gray-300 dark:disabled:bg-gray-600 hover:bg-[#0066D6] dark:hover:bg-[#0077ED] transition-colors shrink-0 mb-0.5"
            aria-label="Enviar mensaje"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <SendHorizontal className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Skeleton for header ───────────────────────────────────────── */

function ChatHeaderSkeleton() {
  return (
    <header className="shrink-0 border-b border-gray-200 dark:border-white/10 bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-md">
      <div className="flex items-center gap-3 px-3 py-2">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="w-9 h-9 rounded-full" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
    </header>
  );
}
