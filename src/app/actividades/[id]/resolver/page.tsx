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
import {
  ArrowLeft,
  Plus,
  SendHorizontal,
  X,
  BookOpen,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  MessageCircle,
  PenLine,
  ChevronRight,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { MessageBubble, type ChatMessage, getAvatarColor, getInitials } from '@/components/chat/message-bubble';
import AskProfessor from '@/components/chat/ask-professor';

/* ─── Types ─────────────────────────────────────────────────────── */

interface ActivityData {
  id: string;
  subject: string;
  courseSlug: string;
  periodId: string;
  periodName: string;
  title: string;
  type: string;
  difficulty: string;
  estimatedTime: string;
  description: string;
  sortOrder: number;
}

interface SubmissionData {
  id: string;
  content: string;
  grade: number | null;
  feedback: string | null;
  status: string;
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

const POLL_INTERVAL_MS = 5000;

const difficultyColors: Record<string, string> = {
  'Fácil': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50',
  'Easy': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50',
  'Medio': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/50',
  'Medium': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/50',
  'Difícil': 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800/50',
  'Hard': 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800/50',
};

/* ─── Helpers ───────────────────────────────────────────────────── */

function getSubjectColor(subject: string) {
  if (subject === 'historia') return 'emerald';
  if (subject === 'matematicas') return 'purple';
  return 'blue';
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ─── Component ─────────────────────────────────────────────────── */

export default function ResolverActividadPage() {
  const params = useParams();
  const router = useRouter();
  const activityId = params.id as string;
  const { user, loading: authLoading } = useAuth();

  // State
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [submission, setSubmission] = useState<SubmissionData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [contextExpanded, setContextExpanded] = useState(true);
  const [showAskProfessor, setShowAskProfessor] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const color = activity ? getSubjectColor(activity.subject) : 'emerald';

  // ── Redirect if not logged in ──
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // ── Fetch activity details ──
  useEffect(() => {
    if (!user || !activityId) return;

    async function fetchActivity() {
      try {
        const res = await fetch(`/api/activities/${activityId}`);
        if (res.ok) {
          const data = await res.json();
          setActivity(data.activity);
        } else {
          router.push('/materias');
        }
      } catch {
        router.push('/materias');
      } finally {
        setLoadingActivity(false);
      }
    }

    fetchActivity();
  }, [user, activityId, router]);

  // ── Fetch existing submission ──
  useEffect(() => {
    if (!user || !activityId) return;

    async function fetchSubmission() {
      try {
        const res = await fetch(`/api/activities/${activityId}/submission`);
        if (res.ok) {
          const data = await res.json();
          if (data.submission) {
            setSubmission(data.submission);
          }
        }
      } catch {
        // silently fail
      }
    }

    fetchSubmission();
  }, [user, activityId]);

  // ── Fetch conversation messages (if linked) ──
  useEffect(() => {
    if (!user || !activityId || loadingActivity) return;

    async function fetchConversationMessages() {
      try {
        const res = await fetch(`/api/chat/conversations?activityId=${activityId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.conversations && data.conversations.length > 0) {
            const convId = data.conversations[0].id;
            const msgRes = await fetch(`/api/chat/conversations/${convId}/messages`);
            if (msgRes.ok) {
              const msgData = await msgRes.json();
              setMessages(msgData.messages || []);
            }
          }
        }
      } catch {
        // silently fail
      } finally {
        setLoadingMessages(false);
      }
    }

    fetchConversationMessages();
  }, [user, activityId, loadingActivity]);

  // ── Auto-scroll to bottom ──
  useEffect(() => {
    if (!loadingMessages && messagesEndRef.current) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
      });
    }
  }, [loadingMessages]);

  useEffect(() => {
    if (!loadingMessages && messagesEndRef.current) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, [messages.length, loadingMessages]);

  // ── Poll for new messages ──
  useEffect(() => {
    if (!user || !activityId || loadingActivity) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/chat/conversations?activityId=${activityId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.conversations && data.conversations.length > 0) {
            const convId = data.conversations[0].id;
            const msgRes = await fetch(`/api/chat/conversations/${convId}/messages`);
            if (msgRes.ok) {
              const msgData = await msgRes.json();
              const newMessages: ChatMessage[] = msgData.messages || [];
              if (newMessages.length > 0) {
                setMessages(newMessages);
              }
            }
          }
        }
      } catch {
        // silently fail
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [user, activityId, loadingActivity]);

  // ── Send message ──
  const handleSend = useCallback(async () => {
    if (!user || !activityId) return;
    if (!textInput.trim() && pendingFiles.length === 0) return;
    if (sending || uploading) return;

    setSending(true);

    try {
      // Check if there's a conversation for this activity
      let convRes = await fetch(`/api/chat/conversations?activityId=${activityId}`);
      let conversations = [];

      if (convRes.ok) {
        const convData = await convRes.json();
        conversations = convData.conversations || [];
      }

      let conversationId: string;

      if (conversations.length === 0) {
        // Create conversation with a professor
        const profRes = await fetch('/api/chat/professors');
        if (!profRes.ok) throw new Error('No professors available');
        const profData = await profRes.json();
        const professors = profData.professors || [];
        if (professors.length === 0) throw new Error('No professors available');

        const createRes = await fetch('/api/chat/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            participantId: professors[0].id,
            activityId: activityId,
            subject: activity?.subject || '',
            courseSlug: activity?.courseSlug || '',
            activityTitle: activity?.title || '',
            activityType: activity?.type || '',
          }),
        });

        if (!createRes.ok) throw new Error('Failed to create conversation');
        const createData = await createRes.json();
        conversationId = createData.conversation.id;
      } else {
        conversationId = conversations[0].id;
      }

      // Send message(s)
      if (pendingFiles.length > 0) {
        for (const file of pendingFiles) {
          const res = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content: '',
              type: file.type,
              fileUrl: file.url,
              fileName: file.fileName,
              fileSize: file.fileSize,
              mimeType: file.mimeType,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            setMessages((prev) => [...prev, data.message]);
          }
        }
      }

      if (textInput.trim()) {
        const res = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: textInput.trim(),
            type: 'text',
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setMessages((prev) => [...prev, data.message]);
        }
      }

      setTextInput('');
      setPendingFiles([]);

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch {
      setMessage({ type: 'error', text: 'Error al enviar el mensaje' });
    } finally {
      setSending(false);
      setTimeout(() => setMessage(null), 3000);
    }
  }, [user, activityId, textInput, pendingFiles, sending, uploading, activity]);

  // ── Submit activity answer ──
  const handleSubmitActivity = useCallback(async () => {
    if (!user || !activityId) return;
    if (!textInput.trim() && pendingFiles.length === 0) return;
    if (submitting) return;

    setSubmitting(true);

    try {
      const res = await fetch(`/api/activities/${activityId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: textInput.trim(),
          fileUrls: pendingFiles.map((f) => f.url),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSubmission(data.submission);
        setMessage({ type: 'success', text: 'Actividad enviada con exito!' });
        setTextInput('');
        setPendingFiles([]);

        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
      } else {
        setMessage({ type: 'error', text: 'Error al enviar la actividad' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error al enviar la actividad' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(null), 4000);
    }
  }, [user, activityId, textInput, pendingFiles, submitting]);

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
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/chat/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          setPendingFiles((prev) => [
            ...prev,
            {
              url: data.url,
              fileName: data.fileName,
              fileSize: data.fileSize,
              mimeType: data.mimeType,
              type: data.type,
            },
          ]);
        }
      }
    } catch {
      // silently fail
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, []);

  const removePendingFile = useCallback((index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // ── Context info ──
  const contextParts: string[] = useMemo(() => {
    if (!activity) return [];
    const parts: string[] = [];
    parts.push(activity.periodName);
    parts.push(`Actividad: ${activity.type}`);
    return parts;
  }, [activity]);

  // ── Loading state ──
  if (authLoading || !user) {
    return (
      <div className="h-screen flex flex-col bg-white dark:bg-[#1C1C1E]">
        <ResolverHeaderSkeleton />
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
            href={activity ? `/materias/${activity.subject}/${activity.courseSlug}/actividades` : '/materias'}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors -ml-1"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5 text-[#007AFF] dark:text-[#5AC8FA]" />
          </Link>

          {/* Activity icon */}
          <div className={`flex items-center justify-center w-9 h-9 rounded-xl bg-${color}-100 dark:bg-${color}-900/40 shrink-0`}>
            <PenLine className={`w-[18px] h-[18px] text-${color}-600 dark:text-${color}-400`} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[15px] text-foreground truncate">
                {loadingActivity ? 'Cargando...' : activity?.title || 'Actividad'}
              </span>
              {activity && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${difficultyColors[activity.difficulty] || 'bg-muted text-muted-foreground'}`}>
                  {activity.difficulty}
                </span>
              )}
            </div>
            {contextParts.length > 0 && (
              <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                {contextParts.join(' · ')}
              </p>
            )}
          </div>

          {/* Status badge */}
          {!loadingActivity && submission && (
            <Badge
              variant="outline"
              className={`text-[10px] px-2 py-0.5 shrink-0 ${
                submission.status === 'pending'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/50'
                  : submission.status === 'reviewed' && submission.grade && submission.grade >= 6
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800/50'
              }`}
            >
              {submission.status === 'pending' && (
                <><Clock className="w-3 h-3 mr-0.5" /> Pendiente</>
              )}
              {submission.status === 'reviewed' && (
                <><CheckCircle2 className="w-3 h-3 mr-0.5" /> {submission.grade}/10</>
              )}
            </Badge>
          )}
        </div>

        {/* ── Activity context (expandable) ── */}
        {activity && (
          <div className="border-t border-gray-100 dark:border-white/5">
            <button
              onClick={() => setContextExpanded(!contextExpanded)}
              className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Contexto de la actividad</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
                  contextExpanded ? 'rotate-90' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {contextExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-3 space-y-2">
                    {/* Student info */}
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-semibold"
                        style={{ backgroundColor: getAvatarColor(user.name) }}
                      >
                        {getInitials(user.name)}
                      </div>
                      <span className="text-xs font-medium text-foreground">{user.name}</span>
                    </div>

                    {/* Subject + Period */}
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl px-3 py-2 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-semibold text-foreground">
                          Tema: {activity.periodName}
                        </span>
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                          {activity.type}
                        </Badge>
                      </div>
                      <p className="text-[12px] text-muted-foreground leading-relaxed">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activity.estimatedTime}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded-full ${difficultyColors[activity.difficulty] || ''}`}>
                          {activity.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* Grade & Feedback */}
                    {submission && submission.status === 'reviewed' && (
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl px-3 py-2 space-y-1">
                        {submission.grade != null && (
                          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                            Nota: {submission.grade}/10
                          </p>
                        )}
                        {submission.feedback && (
                          <p className="text-xs text-emerald-600 dark:text-emerald-300">
                            {submission.feedback}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </header>

      {/* ── Messages / Chat area ── */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4"
      >
        {/* Loading messages */}
        {loadingMessages && (
          <div className="space-y-4 py-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                <Skeleton className="h-10 w-48 rounded-2xl" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loadingMessages && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-white/10 mb-4">
              <MessageCircle className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-base font-semibold text-foreground mb-1">
              Resolvé la actividad
            </p>
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              Escribí tu respuesta, adjuntá archivos o preguntá al profesor si tenés dudas.
            </p>
          </div>
        )}

        {/* Messages */}
        {!loadingMessages && messages.length > 0 && (
          <div className="max-w-2xl mx-auto">
            {messages.map((msg, idx) => {
              const isFirst = idx === 0 || messages[idx - 1].senderId !== msg.senderId;
              const isLast = idx === messages.length - 1 || messages[idx + 1]?.senderId !== msg.senderId;

              return (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isOwn={msg.senderId === user.id}
                  isFirstInGroup={isFirst}
                  isLastInGroup={isLast}
                  showAvatar={true}
                  otherParticipant={{
                    id: '',
                    name: msg.senderId === user.id ? '' : (msg.sender?.name || 'Profesor'),
                    role: msg.sender?.role || 'PROFESSOR',
                  }}
                />
              );
            })}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        )}
      </div>

      {/* ── Flash message ── */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mx-4 mb-2"
          >
            <div
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium ${
                message.type === 'success'
                  ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              {message.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Input area (iMessage style) ── */}
      <div className="shrink-0 border-t border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-lg z-20">
        {/* Pending file chips */}
        <AnimatePresence>
          {pendingFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 px-4 pt-3 pb-1 max-w-2xl mx-auto flex-wrap">
                {pendingFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-gray-100 dark:bg-white/10 rounded-full px-3 py-1.5 text-sm"
                  >
                    {file.type === 'image' ? (
                      <img src={file.url} alt="" className="w-5 h-5 rounded object-cover" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                    <span className="truncate text-foreground max-w-[120px]">{file.fileName}</span>
                    <span className="text-muted-foreground text-xs">{formatFileSize(file.fileSize)}</span>
                    <button
                      type="button"
                      onClick={() => removePendingFile(idx)}
                      className="flex items-center justify-center w-5 h-5 rounded-full hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                    >
                      <X className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                ))}
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
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-end gap-2 px-3 py-2.5 max-w-2xl mx-auto"
        >
          {/* File input (hidden) */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            aria-hidden="true"
          />

          {/* Attach button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || sending || submitting}
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
              placeholder="Escribí tu respuesta o pregunta..."
              disabled={sending || submitting}
              rows={1}
              className="w-full resize-none rounded-[20px] bg-gray-100 dark:bg-white/10 border-none text-foreground placeholder:text-muted-foreground px-4 py-2 text-[15px] leading-[1.3] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 transition-all disabled:opacity-60 max-h-[120px] custom-scrollbar"
              style={{
                minHeight: '36px',
              }}
            />
          </div>

          {/* Send message button */}
          <button
            type="submit"
            disabled={sending || (!textInput.trim() && pendingFiles.length === 0)}
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

        {/* ── Action buttons row ── */}
        <div className="flex items-center gap-2 px-4 pb-3 max-w-2xl mx-auto">
          {/* Submit activity button */}
          {!submission || submission.status === 'pending' ? (
            <button
              onClick={handleSubmitActivity}
              disabled={submitting || (!textInput.trim() && pendingFiles.length === 0)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-semibold transition-colors disabled:opacity-40 ${
                color === 'purple'
                  ? 'bg-purple-600 hover:bg-purple-700 text-white disabled:bg-purple-300 dark:disabled:bg-purple-900'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-emerald-300 dark:disabled:bg-emerald-900'
              }`}
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : submission ? (
                <><PenLine className="w-4 h-4" /> Reenviar actividad</>
              ) : (
                <><SendHorizontal className="w-4 h-4" /> Enviar actividad</>
              )}
            </button>
          ) : (
            <div className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-semibold ${
              submission.status === 'reviewed' && submission.grade && submission.grade >= 6
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300'
            }`}>
              <CheckCircle2 className="w-4 h-4" />
              {submission.status === 'reviewed' && submission.grade != null
                ? `Actividad calificada: ${submission.grade}/10`
                : 'Actividad enviada'}
            </div>
          )}

          {/* Ask professor button */}
          {activity && (
            <div className="shrink-0">
              <AskProfessor activity={activity} variant="button" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Skeleton for header ───────────────────────────────────────── */

function ResolverHeaderSkeleton() {
  return (
    <header className="shrink-0 border-b border-gray-200 dark:border-white/10 bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-md">
      <div className="flex items-center gap-3 px-3 py-2">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="w-9 h-9 rounded-xl" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
    </header>
  );
}
