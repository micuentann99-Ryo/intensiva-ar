'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useT } from '@/i18n/context';

export default function AdminLogsPage() {
  const t = useT();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const limit = 20;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (actionFilter !== 'ALL') params.set('action', actionFilter);
      const res = await fetch(`/api/admin/logs?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
        setTotalPages(data.pages || 1);
      }
    } catch {}
    setLoading(false);
  }, [page, actionFilter]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('admin.logs_title')}</h1>
        <p className="text-muted-foreground">{t('admin.logs_subtitle')}</p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted-foreground">{t('admin.filter_action')}:</span>
        <Select value={actionFilter} onValueChange={(v) => { setActionFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[220px] bg-background border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t('admin.all_actions')}</SelectItem>
            <SelectItem value="login">login</SelectItem>
            <SelectItem value="logout">logout</SelectItem>
            <SelectItem value="register">register</SelectItem>
            <SelectItem value="submit_activity">submit_activity</SelectItem>
            <SelectItem value="professor_approved">professor_approved</SelectItem>
            <SelectItem value="professor_rejected">professor_rejected</SelectItem>
            <SelectItem value="create_bug_report">create_bug_report</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        <>
          {/* Table */}
          <Card className="border-border overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('admin.log_date')}</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('admin.log_user')}</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('admin.log_action')}</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">{t('admin.log_details')}</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">{t('admin.log_page')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log: any, idx: number) => (
                      <motion.tr
                        key={log.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.02 }}
                        className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString('es-AR')}
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <span className="font-medium text-foreground text-xs">{log.user?.name || 'Unknown'}</span>
                            <br />
                            <span className="text-xs text-muted-foreground">{log.user?.email || ''}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell max-w-[200px] truncate">
                          {log.details || '-'}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">
                          {log.page || '-'}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {logs.length === 0 && (
                <div className="py-12 text-center text-muted-foreground text-sm">
                  {t('common.sin_datos')}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-border"
              >
                <ChevronLeft className="size-4" />
                {t('admin.prev_page')}
              </Button>
              <span className="text-sm text-muted-foreground">
                {t('admin.page')} {page} {t('admin.of')} {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="border-border"
              >
                {t('admin.next_page')}
                <ChevronRight className="size-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
