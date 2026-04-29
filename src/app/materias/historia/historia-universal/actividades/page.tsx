'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ChevronRight,
  ChevronDown,
  Clock,
  BookOpen,
  FileText,
  Check,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import SiteNavbar from '@/components/site-navbar';
import SiteFooter from '@/components/site-footer';
import { useAuth } from '@/lib/auth-context';
import { useT } from '@/i18n/context';

const difficultyColors: Record<string, string> = {
  'Fácil': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50',
  'Easy': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50',
  'Medio': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/50',
  'Medium': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/50',
  'Difícil': 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800/50',
  'Hard': 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800/50',
};

interface Activity {
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

interface Submission {
  id: string;
  userId: string;
  activityId: string;
  content: string;
  grade: number | null;
  feedback: string | null;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
}

export default function ActividadesPage() {
  const t = useT();
  const { user } = useAuth();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/activities?subject=historia&course=historia-universal');
        if (res.ok) {
          const data = await res.json();
          setActivities(data.activities || []);
        }
      } catch {}
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!user) return;
    async function fetchSubmissions() {
      try {
        // Fetch all submissions for this user for these activities
        const res = await fetch('/api/activities?subject=historia&course=historia-universal');
        // We'll get submissions from admin stats or a dedicated endpoint
        // For now, submissions are embedded in the activity data from the API
      } catch {}
    }
    fetchSubmissions();
  }, [user]);

  const groupedActivities = useMemo(() => {
    const groups: Record<string, Activity[]> = {};
    activities.forEach((a) => {
      if (!groups[a.periodName]) groups[a.periodName] = [];
      groups[a.periodName].push(a);
    });
    return groups;
  }, [activities]);

  const getSubmissionForActivity = (activityId: string) => {
    return submissions.find((s) => s.activityId === activityId);
  };

  const handleSubmitAnswer = async (activityId: string) => {
    const content = answers[activityId];
    if (!content?.trim()) return;

    setSubmitting(activityId);
    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityId, content: content.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setSubmissions((prev) => [
          ...prev.filter((s) => s.activityId !== activityId),
          {
            id: data.submission.id,
            userId: user!.id,
            activityId,
            content: content.trim(),
            grade: null,
            feedback: null,
            status: 'pending',
            createdAt: new Date().toISOString(),
            user: { name: user!.name, email: user!.email },
          },
        ]);
        setMessage({ type: 'success', text: t('activities.submit_success') });
      } else {
        setMessage({ type: 'error', text: t('activities.submit_error') });
      }
    } catch {
      setMessage({ type: 'error', text: t('activities.submit_error') });
    }
    setSubmitting(null);
    setTimeout(() => setMessage(null), 4000);
  };

  if (loading) {
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
              <Link href="/materias" className="text-muted-foreground hover:text-foreground transition-colors">{t('common.materias')}</Link>
              <ChevronRight className="size-3.5 text-muted-foreground" />
              <Link href="/materias/historia" className="text-muted-foreground hover:text-foreground transition-colors">{t('common.historia')}</Link>
              <ChevronRight className="size-3.5 text-muted-foreground" />
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">{t('activities.title')}</span>
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
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  {t('activities.title')}
                </h1>
              </div>
              <p className="text-muted-foreground">{t('activities.subtitle')}</p>
            </motion.div>
          </div>
        </section>

        {/* Activities */}
        <section className="pb-16 md:pb-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">
              {message && (
                <Alert className={message.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/50' : ''}>
                  {message.type === 'success' ? (
                    <Check className="size-4 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="size-4" />
                  )}
                  <AlertDescription className={message.type === 'success' ? 'text-emerald-700 dark:text-emerald-300' : ''}>
                    {message.text}
                  </AlertDescription>
                </Alert>
              )}

              {activities.length === 0 ? (
                <p className="text-muted-foreground text-center py-12">{t('activities.no_activities')}</p>
              ) : (
                Object.entries(groupedActivities).map(([periodName, acts]) => (
                  <div key={periodName}>
                    <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                      <BookOpen className="size-4 text-emerald-600 dark:text-emerald-400" />
                      {periodName}
                    </h2>
                    <div className="space-y-2">
                      {acts.map((activity, idx) => {
                        const isExpanded = expandedId === activity.id;
                        const submission = getSubmissionForActivity(activity.id);

                        return (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <div className="rounded-xl border border-border transition-all duration-300 overflow-hidden">
                              <button
                                onClick={() => setExpandedId(isExpanded ? null : activity.id)}
                                className="w-full flex items-center gap-3 px-4 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                              >
                                <div className="flex items-center justify-center size-10 rounded-xl bg-muted shrink-0">
                                  <FileText className="size-4 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-semibold text-foreground">{activity.title}</span>
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">{activity.type}</Badge>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${difficultyColors[activity.difficulty] || 'bg-muted text-muted-foreground'}`}>
                                      {activity.difficulty}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Clock className="size-3" />{activity.estimatedTime}
                                    </span>
                                    {submission && (
                                      <Badge
                                        variant="outline"
                                        className={`text-[10px] px-1.5 py-0 ${
                                          submission.status === 'pending'
                                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/50'
                                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50'
                                        }`}
                                      >
                                        {submission.status === 'pending' ? t('activities.pending_review') : t('activities.reviewed')}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className="shrink-0">
                                  <ChevronDown className="size-5 text-muted-foreground" />
                                </motion.div>
                              </button>

                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="px-4 pb-5 space-y-4 border-t border-border/50 pt-4">
                                      <div>
                                        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                                          {t('historia_page.description')}
                                        </h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{activity.description}</p>
                                      </div>

                                      {/* Student answer area */}
                                      {user && user.role === 'STUDENT' && (
                                        <div className="space-y-3 bg-muted/20 rounded-lg p-4">
                                          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                                            {t('activities.your_answer')}
                                          </h4>
                                          <Textarea
                                            placeholder={t('activities.your_answer_placeholder')}
                                            value={answers[activity.id] || (submission?.content || '')}
                                            onChange={(e) => setAnswers((prev) => ({ ...prev, [activity.id]: e.target.value }))}
                                            className="bg-background border-border resize-none"
                                            rows={5}
                                          />
                                          <div className="flex items-center justify-between">
                                            <Button
                                              size="sm"
                                              onClick={() => handleSubmitAnswer(activity.id)}
                                              disabled={submitting === activity.id || !answers[activity.id]?.trim()}
                                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                            >
                                              {submitting === activity.id ? (
                                                <Loader2 className="size-4 animate-spin mr-1" />
                                              ) : null}
                                              {t('activities.submit_answer')}
                                            </Button>
                                            {submission && (
                                              <span className="text-xs text-muted-foreground">
                                                {t('activities.submitted_on')}: {new Date(submission.createdAt).toLocaleDateString('es-AR')}
                                              </span>
                                            )}
                                          </div>

                                          {/* Show grade and feedback if reviewed */}
                                          {submission && submission.status === 'reviewed' && (
                                            <div className="space-y-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
                                              {submission.grade && (
                                                <p className="text-sm">
                                                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                                                    {t('activities.your_grade')}: {submission.grade}/10
                                                  </span>
                                                </p>
                                              )}
                                              {submission.feedback && (
                                                <p className="text-sm text-muted-foreground">
                                                  <span className="font-medium">{t('activities.feedback')}:</span>{' '}
                                                  {submission.feedback}
                                                </p>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      {/* Not logged in */}
                                      {!user && (
                                        <div className="bg-muted/30 rounded-lg p-4 text-center">
                                          <p className="text-sm text-muted-foreground">
                                            <Link href="/login" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
                                              {t('navbar.ingresa')}
                                            </Link>{' '}
                                            para enviar tu respuesta
                                          </p>
                                        </div>
                                      )}

                                      {/* Professor/Admin: see all submissions */}
                                      {user && (user.role === 'PROFESSOR' || user.role === 'ADMIN') && (
                                        <div className="bg-muted/20 rounded-lg p-4">
                                          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                                            {t('activities.all_submissions')}
                                          </h4>
                                          <p className="text-sm text-muted-foreground">{t('common.sin_datos')}</p>
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
