'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Search,
  PenSquare,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/auth-context';
import SiteNavbar from '@/components/site-navbar';
import { getAvatarColor, getInitials } from '@/components/chat/message-bubble';

/* ─── Types ─────────────────────────────────────────────────────── */

interface OtherParticipant {
  id: string;
  name: string;
  role: string;
}

interface Conversation {
  id: string;
  otherParticipant: OtherParticipant;
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

/* ─── Helpers ───────────────────────────────────────────────────── */

function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Ahora';
  if (diffMin < 60) return `Hace ${diffMin} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;

  // Use date-fns for day-level checks
  const yesterdayStart = new Date(now);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  yesterdayStart.setHours(0, 0, 0, 0);

  if (date >= yesterdayStart && diffDays < 2) return 'Ayer';

  const day = date.getDate();
  const monthNames = [
    'ene', 'feb', 'mar', 'abr', 'may', 'jun',
    'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  if (year === now.getFullYear()) {
    return `${day} ${month}`;
  }
  return `${day} ${month} ${year}`;
}

function getContextLabel(conv: Conversation): string {
  const parts: string[] = [];
  if (conv.courseSlug) {
    parts.push(conv.courseSlug.charAt(0).toUpperCase() + conv.courseSlug.slice(1).replace(/-/g, ' '));
  }
  if (conv.activityTitle) {
    parts.push(conv.activityTitle);
  }
  if (parts.length === 0 && conv.subject) {
    parts.push(conv.subject);
  }
  return parts.join(' · ') || conv.subject;
}

/* ─── Conversation Row Skeleton ─────────────────────────────────── */

function ConversationSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Skeleton className="w-12 h-12 rounded-full shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-48" />
      </div>
      <div className="flex flex-col items-end gap-2">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
    </div>
  );
}

/* ─── Conversation Row ──────────────────────────────────────────── */

function ConversationRow({ conv }: { conv: Conversation }) {
  const { name, role } = conv.otherParticipant;
  const avatarBg = getAvatarColor(name);
  const initials = getInitials(name);

  const roleBadgeClass =
    role === 'PROFESSOR'
      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';

  const roleLabel = role === 'PROFESSOR' ? 'Profesor' : 'Alumno';

  return (
    <Link href={`/chat/${conv.id}`} className="block">
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer active:bg-gray-200 dark:active:bg-white/10">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-semibold"
            style={{ backgroundColor: avatarBg }}
          >
            {initials}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 justify-between">
            <span className="font-semibold text-[15px] text-foreground truncate">
              {name}
            </span>
            <span className="text-xs text-muted-foreground shrink-0 ml-2">
              {formatRelativeTime(conv.lastMessageAt)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[11px] px-1.5 py-0.5 rounded-full font-medium text-muted-foreground bg-muted/70 dark:bg-white/10 truncate max-w-[180px]">
              {getContextLabel(conv)}
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${roleBadgeClass}`}>
              {roleLabel}
            </span>
          </div>

          <div className="flex items-center justify-between mt-1">
            <p className="text-sm text-muted-foreground truncate pr-2">
              {conv.lastMessagePreview || 'Sin mensajes'}
            </p>
            {conv.unreadCount > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-full bg-[#007AFF] text-white text-[11px] font-bold shrink-0">
                {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
              </span>
            )}
          </div>
        </div>

        {/* Chevron */}
        <ChevronRight className="w-4 h-4 text-muted-foreground/50 shrink-0" />
      </div>
    </Link>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────── */

export default function ChatListPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch conversations
  useEffect(() => {
    if (authLoading || !user) return;

    async function fetchConversations() {
      try {
        const res = await fetch('/api/chat/conversations');
        if (res.ok) {
          const data = await res.json();
          setConversations(data.conversations || []);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    fetchConversations();
  }, [user, authLoading]);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Filter conversations by search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter(
      (c) =>
        c.otherParticipant.name.toLowerCase().includes(q) ||
        (c.lastMessagePreview || '').toLowerCase().includes(q) ||
        (c.subject || '').toLowerCase().includes(q) ||
        (c.activityTitle || '').toLowerCase().includes(q)
    );
  }, [conversations, searchQuery]);

  // Poll for new conversations
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/chat/conversations');
        if (res.ok) {
          const data = await res.json();
          setConversations(data.conversations || []);
        }
      } catch {
        // silently fail
      }
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, [user]);

  // ── Loading state ──
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-[#1C1C1E]">
        <SiteNavbar />
        <div className="flex-1 max-w-2xl mx-auto w-full">
          {/* Header skeleton */}
          <div className="flex items-center justify-between px-4 py-4">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
          {/* Search skeleton */}
          <div className="px-4 pb-3">
            <Skeleton className="h-9 w-full rounded-xl" />
          </div>
          {/* Rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <ConversationSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // ── Auth guard ──
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#1C1C1E]">
      <SiteNavbar />

      <div className="flex-1 max-w-2xl mx-auto w-full flex flex-col">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 py-4 sticky top-0 bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-md z-10">
          <h1 className="text-[28px] font-bold tracking-tight text-foreground">
            Mensajes
          </h1>
          <button
            aria-label="Nueva conversación"
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-muted-foreground"
          >
            <PenSquare className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* ── Search bar ── */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar conversaciones"
              className="w-full h-9 pl-9 pr-3 text-sm rounded-xl bg-gray-100 dark:bg-white/10 border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 transition-all"
            />
          </div>
        </div>

        {/* ── Conversation list ── */}
        {filteredConversations.length === 0 && !loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 px-4">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-white/10 mb-4">
              <MessageCircle className="w-9 h-9 text-muted-foreground" />
            </div>
            {searchQuery.trim() ? (
              <>
                <p className="text-lg font-semibold text-foreground mb-1">
                  Sin resultados
                </p>
                <p className="text-sm text-muted-foreground text-center">
                  No se encontraron conversaciones con &ldquo;{searchQuery}&rdquo;
                </p>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold text-foreground mb-1">
                  No hay conversaciones aún
                </p>
                <p className="text-sm text-muted-foreground text-center max-w-xs">
                  Explorá las materias y actividades para iniciar una conversación con un profesor.
                </p>
                <Link
                  href="/explorar"
                  className="mt-4 px-5 py-2.5 rounded-full bg-[#007AFF] text-white text-sm font-semibold hover:bg-[#0066D6] transition-colors"
                >
                  Explorar materias
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {filteredConversations.map((conv) => (
                <motion.div
                  key={conv.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <ConversationRow conv={conv} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
