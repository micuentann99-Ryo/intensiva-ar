'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import {
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2,
  BookOpen,
  PenLine,
  Trophy,
  BarChart3,
  MessageCircle,
  ChevronDown,
} from 'lucide-react';
import SiteNavbar from '@/components/site-navbar';
import SiteFooter from '@/components/site-footer';
import { useAuth } from '@/lib/auth-context';
import { useT } from '@/i18n/context';

/* ─── Types ─────────────────────────────────────────────────────── */

interface ActivityWithSubmission {
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
  submission: {
    id: string;
    content: string;
    grade: number | null;
    feedback: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
  } | null;
}

interface StudentStats {
  total: number;
  submitted: number;
  pending: number;
  reviewed: number;
  avgGrade: number | null;
  notSubmitted: number;
}

const difficultyColors: Record<string, string> = {
  'Fácil': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50',
  'Easy': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50',
  'Medio': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/50',
  'Medium': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/50',
  'Difícil': 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800/50',
  'Hard': 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800/50',
};

const subjectConfig: Record<string, { label: string; color: string; icon: typeof BookOpen; href: string }> = {
  historia: {
    label: 'Historia',
    color: 'emerald',
    icon: BookOpen,
    href: '/materias/historia/historia-universal/actividades',
  },
  matematicas: {
    label: 'Matemáticas',
    color: 'purple',
    icon: BarChart3,
    href: '/materias/matematicas/curso-intensivo/actividades',
  },
};

/* ─── Component ─────────────────────────────────────────────────── */

export default function MisActividadesPage() {
  const t = useT();
  const { user, loading: authLoading } = useAuth();

  const [activities, setActivities] = useState<ActivityWithSubmission[]>([]);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed' | 'not-submitted'>('all');
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (authLoading || !user) return;

    async function fetchData() {
      try {
        const res = await fetch('/api/student/activities');
        if (res.ok) {
          const data = await res.json();
          setActivities(data.activities || []);
          setStats(data.stats || null);
          // Expand all subjects by default
          const subjects = new Set((data.activities || []).map((a: ActivityWithSubmission) => a.subject));
          setExpandedSubjects(subjects);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, authLoading]);

  // Group by subject
  const groupedBySubject = useMemo(() => {
    const groups: Record<string, ActivityWithSubmission[]> = {};
    for (const a of activities) {
      if (!groups[a.subject]) groups[a.subject] = [];
      groups[a.subject].push(a);
    }
    return groups;
  }, [activities]);

  // Filter activities
  const filteredActivities = useMemo(() => {
    if (filter === 'all') return activities;
    if (filter === 'pending') return activities.filter((a) => a.submission?.status === 'pending');
    if (filter === 'reviewed') return activities.filter((a) => a.submission?.status === 'reviewed');
    if (filter === 'not-submitted') return activities.filter((a) => !a.submission);
    return activities;
  }, [activities, filter]);

  const filteredGrouped = useMemo(() => {
    const groups: Record<string, ActivityWithSubmission[]> = {};
    for (const a of filteredActivities) {
      if (!groups[a.subject]) groups[a.subject] = [];
      groups[a.subject].push(a);
    }
    return groups;
  }, [filteredActivities]);

  const toggleSubject = (subject: string) => {
    setExpandedSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(subject)) next.delete(subject);
      else next.add(subject);
      return next;
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteNavbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-emerald-600" />
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteNavbar />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted/40 dark:bg-black border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-1.5 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">{t('common.inicio')}</Link>
              <ChevronRight className="size-3.5 text-muted-foreground" />
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">{t('my_activities.title')}</span>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <section className="py-10 md:py-14 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center size-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40">
                  <FileText className="size-6 text-emerald-700 dark:text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                    {t('my_activities.title')}
                  </h1>
                  <p className="text-sm text-muted-foreground">{t('my_activities.subtitle')}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Cards */}
        {stats && (
          <section className="pb-8 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-xl border border-border bg-muted/20 p-4"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="size-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-medium">{t('my_activities.total')}</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="rounded-xl border border-border bg-muted/20 p-4"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs text-muted-foreground font-medium">{t('my_activities.delivered')}</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{stats.submitted}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-xl border border-border bg-muted/20 p-4"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="size-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs text-muted-foreground font-medium">{t('my_activities.pending_review')}</span>
                  </div>
                  <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{stats.pending}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="rounded-xl border border-border bg-muted/20 p-4"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="size-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs text-muted-foreground font-medium">{t('my_activities.average')}</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                    {stats.avgGrade != null ? stats.avgGrade : '—'}
                  </p>
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* Filter Tabs */}
        <section className="pb-6 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 flex-wrap max-w-3xl">
              {[
                { key: 'all' as const, label: t('my_activities.filter_all') },
                { key: 'not-submitted' as const, label: t('my_activities.filter_not_submitted') },
                { key: 'pending' as const, label: t('my_activities.filter_pending') },
                { key: 'reviewed' as const, label: t('my_activities.filter_reviewed') },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === tab.key
                      ? 'bg-emerald-600 dark:bg-emerald-700 text-white'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {tab.label}
                  {tab.key === 'all' && stats && (
                    <span className="ml-1.5 text-xs opacity-70">{stats.total}</span>
                  )}
                  {tab.key === 'not-submitted' && stats && (
                    <span className="ml-1.5 text-xs opacity-70">{stats.notSubmitted}</span>
                  )}
                  {tab.key === 'pending' && stats && (
                    <span className="ml-1.5 text-xs opacity-70">{stats.pending}</span>
                  )}
                  {tab.key === 'reviewed' && stats && (
                    <span className="ml-1.5 text-xs opacity-70">{stats.reviewed}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Activities List */}
        <section className="pb-16 md:pb-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">
              {filteredActivities.length === 0 ? (
                <div className="text-center py-16">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/40 mx-auto mb-4">
                    <FileText className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-semibold text-foreground mb-1">
                    {t('my_activities.no_activities_filter')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {filter === 'reviewed'
                      ? t('my_activities.no_reviewed_yet')
                      : filter === 'pending'
                        ? t('my_activities.no_pending_yet')
                        : filter === 'not-submitted'
                          ? t('my_activities.all_submitted')
                          : t('my_activities.no_activities')}
                  </p>
                </div>
              ) : (
                Object.entries(filteredGrouped).map(([subject, acts]) => {
                  const config = subjectConfig[subject] || { label: subject, color: 'blue', href: '#' };
                  const isExpanded = expandedSubjects.has(subject);

                  return (
                    <div key={subject}>
                      {/* Subject header */}
                      <button
                        onClick={() => toggleSubject(subject)}
                        className="w-full flex items-center justify-between mb-3 group"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`flex items-center justify-center size-8 rounded-lg bg-${config.color}-100 dark:bg-${config.color}-900/40`}>
                            <config.icon className={`size-4 text-${config.color}-600 dark:text-${config.color}-400`} />
                          </div>
                          <h2 className="text-lg font-semibold text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                            {config.label}
                          </h2>
                          <Badge variant="outline" className="text-xs">
                            {acts.length} {acts.length === 1 ? 'actividad' : 'actividades'}
                          </Badge>
                        </div>
                        <ChevronDown
                          className={`size-5 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {/* Activity cards */}
                      <div className="space-y-2">
                        {acts.map((activity, idx) => {
                          const sub = activity.submission;
                          const hasGrade = sub?.status === 'reviewed' && sub.grade != null;
                          const isApproved = hasGrade && sub.grade! >= 6;

                          return (
                            <motion.div
                              key={activity.id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.03 }}
                              className="rounded-xl border border-border overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-colors"
                            >
                              <div className="flex items-center gap-3 px-4 py-3">
                                {/* Status indicator */}
                                <div className={`flex items-center justify-center size-10 rounded-xl shrink-0 ${
                                  !sub
                                    ? 'bg-gray-100 dark:bg-white/10'
                                    : sub.status === 'pending'
                                      ? 'bg-amber-100 dark:bg-amber-900/30'
                                      : isApproved
                                        ? 'bg-emerald-100 dark:bg-emerald-900/30'
                                        : 'bg-rose-100 dark:bg-rose-900/30'
                                }`}>
                                  {!sub ? (
                                    <FileText className="size-4 text-muted-foreground" />
                                  ) : sub.status === 'pending' ? (
                                    <Clock className="size-4 text-amber-600 dark:text-amber-400" />
                                  ) : isApproved ? (
                                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                                  ) : (
                                    <AlertCircle className="size-4 text-rose-600 dark:text-rose-400" />
                                  )}
                                </div>

                                {/* Activity info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-semibold text-foreground truncate max-w-[300px]">
                                      {activity.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                    <span className="text-xs text-muted-foreground">
                                      {activity.periodName}
                                    </span>
                                    <span className="text-muted-foreground/40">·</span>
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                      {activity.type}
                                    </Badge>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${difficultyColors[activity.difficulty] || 'bg-muted text-muted-foreground'}`}>
                                      {activity.difficulty}
                                    </span>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Clock className="size-3" />{activity.estimatedTime}
                                    </span>
                                  </div>
                                </div>

                                {/* Status + Action */}
                                <div className="flex items-center gap-2 shrink-0">
                                  {!sub ? (
                                    <Link
                                      href={`/actividades/${activity.id}/resolver`}
                                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                                    >
                                      <PenLine className="size-3.5" />
                                      Resolver
                                    </Link>
                                  ) : sub.status === 'pending' ? (
                                    <div className="flex items-center gap-2">
                                      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 text-[10px] px-2">
                                        <Clock className="size-3 mr-0.5" /> Pendiente
                                      </Badge>
                                      <Link
                                        href={`/actividades/${activity.id}/resolver`}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border hover:bg-muted/60 text-xs font-medium text-muted-foreground transition-colors"
                                      >
                                        <MessageCircle className="size-3.5" />
                                        Ver
                                      </Link>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <Badge className={`text-[10px] px-2 ${
                                        isApproved
                                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                          : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
                                      }`}>
                                        {sub.grade}/10
                                      </Badge>
                                      <Link
                                        href={`/actividades/${activity.id}/resolver`}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border hover:bg-muted/60 text-xs font-medium text-muted-foreground transition-colors"
                                      >
                                        <MessageCircle className="size-3.5" />
                                        Ver
                                      </Link>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Submission details (if reviewed) */}
                              {sub && sub.status === 'reviewed' && (
                                <div className={`px-4 pb-3 pt-0 border-t border-border/50 mt-0`}>
                                  <div className={`rounded-lg p-3 mt-2 ${
                                    isApproved
                                      ? 'bg-emerald-50 dark:bg-emerald-900/20'
                                      : 'bg-rose-50 dark:bg-rose-900/20'
                                  }`}>
                                    {sub.grade != null && (
                                      <p className={`text-sm font-semibold mb-1 ${
                                        isApproved
                                          ? 'text-emerald-700 dark:text-emerald-400'
                                          : 'text-rose-700 dark:text-rose-400'
                                      }`}>
                                        Nota: {sub.grade}/10
                                      </p>
                                    )}
                                    {sub.feedback && (
                                      <p className="text-xs text-muted-foreground leading-relaxed">
                                        <span className="font-medium">{t('activities.feedback')}:</span> {sub.feedback}
                                      </p>
                                    )}
                                    <p className="text-[10px] text-muted-foreground mt-1.5">
                                      {t('my_activities.submitted_on')}: {new Date(sub.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
