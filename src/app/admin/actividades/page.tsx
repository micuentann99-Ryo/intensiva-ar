'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ChevronDown, Check, FileText, User } from 'lucide-react';
import { useT } from '@/i18n/context';

export default function AdminSubmissionsPage() {
  const t = useT();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const fetchSubmissions = useCallback(async () => {
    try {
      const res = await fetch('/api/activities');
      if (res.ok) {
        const data = await res.json();
        // Get all activities and their submissions - we need a different approach
        // We'll use admin stats to get recent submissions
      }
      // Fetch from admin stats for submissions
      const statsRes = await fetch('/api/admin/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setSubmissions(statsData.recentSubmissions || []);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

  const handleGrade = async (submissionId: string, grade: number, feedback: string) => {
    if (grade < 1 || grade > 10) return;
    try {
      // For now, we'll update via the activities endpoint
      // Note: there's no dedicated grading endpoint yet, so this is a placeholder
      setMessage('Funcionalidad de corrección en desarrollo');
      setTimeout(() => setMessage(''), 3000);
    } catch {}
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/50',
    reviewed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50',
    returned: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/50',
  };

  const difficultyColors: Record<string, string> = {
    'Fácil': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    'Easy': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    'Medio': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    'Medium': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    'Difícil': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    'Hard': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('admin.submissions_title')}</h1>
        <p className="text-muted-foreground">{t('admin.submissions_subtitle')}</p>
      </div>

      {message && (
        <Alert className="bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/50">
          <Check className="size-4 text-emerald-600" />
          <AlertDescription className="text-emerald-700 dark:text-emerald-300">{message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        {submissions.map((sub: any, idx: number) => {
          const isExpanded = expandedId === sub.id;
          return (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <Card className="border-border overflow-hidden">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                  className="w-full text-left"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center justify-center size-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 shrink-0">
                        <User className="size-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-foreground text-sm">{sub.user?.name || 'Unknown'}</span>
                          <span className="text-muted-foreground text-xs">—</span>
                          <span className="text-sm text-muted-foreground">{sub.activity?.title || 'Activity'}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {sub.activity?.periodName && (
                            <span className="text-xs text-muted-foreground">{sub.activity.periodName}</span>
                          )}
                          {sub.activity?.type && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">{sub.activity.type}</Badge>
                          )}
                          {sub.activity?.difficulty && (
                            <span className={`text-[10px] px-1.5 py-0 rounded-full ${difficultyColors[sub.activity.difficulty] || 'bg-muted text-muted-foreground'}`}>
                              {sub.activity.difficulty}
                            </span>
                          )}
                          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${statusColors[sub.status] || ''}`}>
                            {sub.status === 'pending' ? t('admin.pending_submissions') : t('admin.reviewed_submissions')}
                          </Badge>
                          {sub.grade && (
                            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                              Nota: {sub.grade}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground hidden sm:block">
                        {new Date(sub.createdAt).toLocaleDateString('es-AR')}
                      </div>
                      <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className="shrink-0">
                        <ChevronDown className="size-4 text-muted-foreground" />
                      </motion.div>
                    </div>
                  </CardContent>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0 border-t border-border/50 mt-0 space-y-4">
                        <div className="pt-3">
                          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                            {t('admin.submission_content')}
                          </h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/30 rounded-lg p-3 max-h-40 overflow-y-auto">
                            {sub.content || t('common.sin_datos')}
                          </p>
                        </div>

                        {sub.feedback && (
                          <div>
                            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                              {t('activities.feedback')}
                            </h4>
                            <p className="text-sm text-muted-foreground bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
                              {sub.feedback}
                            </p>
                          </div>
                        )}

                        {sub.status === 'pending' && (
                          <SubmisionGradeForm submissionId={sub.id} t={t} />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}

        {submissions.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">
            {t('admin.no_submissions')}
          </div>
        )}
      </div>
    </div>
  );
}

function SubmisionGradeForm({ submissionId, t }: { submissionId: string; t: (k: string) => string }) {
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    const g = parseFloat(grade);
    if (isNaN(g) || g < 1 || g > 10) return;
    setSaving(true);
    // Placeholder - grading endpoint would go here
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="space-y-3 bg-muted/20 rounded-lg p-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground">{t('admin.grade')}</label>
          <Input
            type="number"
            min={1}
            max={10}
            placeholder={t('admin.grade_placeholder')}
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="bg-background border-border mt-1"
          />
        </div>
        <div className="col-span-2 sm:col-span-3">
          <label className="text-xs font-medium text-muted-foreground">{t('admin.feedback')}</label>
          <Textarea
            placeholder={t('admin.feedback_placeholder')}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="bg-background border-border mt-1 resize-none"
            rows={2}
          />
        </div>
      </div>
      <Button
        size="sm"
        onClick={handleSubmit}
        disabled={saving || !grade}
        className="bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        {t('admin.grade_button')}
      </Button>
    </div>
  );
}
