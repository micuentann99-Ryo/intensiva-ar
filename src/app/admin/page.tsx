'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, GraduationCap, FileText, Activity, Clock, AlertTriangle, BarChart3, Loader2 } from 'lucide-react';
import { useT } from '@/i18n/context';

const statCards = [
  { key: 'total_students', icon: Users, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { key: 'total_professors', icon: GraduationCap, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  { key: 'total_activities', icon: FileText, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-900/30' },
  { key: 'total_submissions', icon: Activity, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { key: 'pending_professors', icon: Clock, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  { key: 'open_bugs', icon: AlertTriangle, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-900/30' },
];

interface Stats {
  totalUsers: number;
  totalStudents: number;
  totalProfessors: number;
  pendingProfessors: number;
  totalActivities: number;
  totalSubmissions: number;
  pendingSubmissions: number;
  reviewedSubmissions: number;
  openBugReports: number;
  resolvedBugReports: number;
  totalLogs: number;
}

export default function AdminDashboardPage() {
  const t = useT();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setRecentLogs(data.recentLogs);
          setRecentSubmissions(data.recentSubmissions);
        }
      } catch {}
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((sc, idx) => {
          const Icon = sc.icon;
          const value = stats
            ? (sc.key === 'total_students'
                ? stats.totalStudents
                : sc.key === 'total_professors'
                ? stats.totalProfessors
                : sc.key === 'total_activities'
                ? stats.totalActivities
                : sc.key === 'total_submissions'
                ? stats.totalSubmissions
                : sc.key === 'pending_professors'
                ? stats.pendingProfessors
                : stats.openBugReports)
            : 0;
          return (
            <motion.div
              key={sc.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="border-border">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t(`admin.${sc.key}`)}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
                    </div>
                    <div className={`flex items-center justify-center size-11 rounded-xl ${sc.bg}`}>
                      <Icon className={`size-5 ${sc.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Two columns: recent activity + recent submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="size-4 text-emerald-600 dark:text-emerald-400" />
              {t('admin.recent_activity')}
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto">
            {recentLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('admin.no_recent_activity')}</p>
            ) : (
              <div className="space-y-3">
                {recentLogs.map((log: any) => (
                  <div key={log.id} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
                    <div className="flex items-center justify-center size-8 rounded-full bg-muted shrink-0 mt-0.5">
                      <Activity className="size-3.5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{log.user?.name || 'Unknown'}</span>
                        <span className="text-muted-foreground"> — {log.action}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(log.createdAt).toLocaleString('es-AR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Submissions */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <FileText className="size-4 text-emerald-600 dark:text-emerald-400" />
              {t('admin.recent_submissions')}
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto">
            {recentSubmissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('admin.no_recent_submissions')}</p>
            ) : (
              <div className="space-y-3">
                {recentSubmissions.map((sub: any) => (
                  <div key={sub.id} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
                    <div className="flex items-center justify-center size-8 rounded-full bg-muted shrink-0 mt-0.5">
                      <Activity className="size-3.5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{sub.user?.name || 'Unknown'}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {sub.activity?.title || 'Activity'} — {sub.activity?.periodName || ''}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-1.5 py-0 ${
                            sub.status === 'pending'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/50'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50'
                          }`}
                        >
                          {sub.status === 'pending' ? t('admin.pending_submissions') : t('admin.reviewed_submissions')}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(sub.createdAt).toLocaleDateString('es-AR')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
