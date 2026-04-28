'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Check, MessageCircleWarning } from 'lucide-react';
import { useT } from '@/i18n/context';

const statusColors: Record<string, string> = {
  open: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800/50',
  in_progress: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/50',
  resolved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50',
  closed: 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400 border-gray-200 dark:border-gray-700/50',
};

const priorityColors: Record<string, string> = {
  low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  high: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
};

export default function AdminBugReportsPage() {
  const t = useT();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchReports = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/bug-reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const handleUpdate = async (reportId: string, status: string, resolution: string) => {
    try {
      const res = await fetch('/api/admin/bug-reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, status, resolution: resolution || undefined }),
      });
      if (res.ok) {
        setMessage(t('admin.save_changes'));
        fetchReports();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch {}
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('admin.bug_reports_title')}</h1>
        <p className="text-muted-foreground">{t('admin.bug_reports_subtitle')}</p>
      </div>

      {message && (
        <Alert className="bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/50">
          <Check className="size-4 text-emerald-600" />
          <AlertDescription className="text-emerald-700 dark:text-emerald-300">{message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        {reports.map((report: any, idx: number) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
          >
            <Card className="border-border">
              <CardContent className="p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="flex items-center justify-center size-10 rounded-lg bg-rose-100 dark:bg-rose-900/30 shrink-0">
                    <MessageCircleWarning className="size-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-foreground text-sm">{report.subject}</h3>
                      <Badge variant="outline" className={`text-[10px] ${statusColors[report.status] || ''}`}>
                        {t(`admin.status_${report.status}`) || report.status}
                      </Badge>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${priorityColors[report.priority] || ''}`}>
                        {t(`admin.priority_${report.priority}`) || report.priority}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{report.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>{t('admin.bug_user')}: {report.user?.name || 'Anónimo'}</span>
                      {report.page && <span>{t('admin.bug_page')}: {report.page}</span>}
                      <span>{new Date(report.createdAt).toLocaleDateString('es-AR')}</span>
                    </div>
                  </div>
                </div>

                {/* Edit section */}
                <div className="flex flex-col sm:flex-row gap-3 pl-0 sm:pl-13 border-t border-border/50 pt-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <Select
                        value={report.status}
                        onValueChange={(val) => handleUpdate(report.id, val, report.resolution || '')}
                      >
                        <SelectTrigger className="w-[180px] bg-background border-border text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">{t('admin.status_open')}</SelectItem>
                          <SelectItem value="in_progress">{t('admin.status_in_progress')}</SelectItem>
                          <SelectItem value="resolved">{t('admin.status_resolved')}</SelectItem>
                          <SelectItem value="closed">{t('admin.status_closed')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Textarea
                      placeholder={t('admin.bug_resolution_placeholder')}
                      value={report.resolution || ''}
                      onChange={(e) => {
                        // Update locally
                        setReports((prev) =>
                          prev.map((r) => (r.id === report.id ? { ...r, resolution: e.target.value } : r))
                        );
                      }}
                      className="bg-background border-border text-xs resize-none"
                      rows={2}
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleUpdate(report.id, report.status, report.resolution || '')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white self-end shrink-0"
                  >
                    {t('admin.save_changes')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {reports.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">
            {t('admin.no_bugs')}
          </div>
        )}
      </div>
    </div>
  );
}
