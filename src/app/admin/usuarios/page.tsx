'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useT } from '@/i18n/context';

const roleBadgeClass: Record<string, string> = {
  STUDENT: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/50',
  PROFESSOR: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/50',
  ADMIN: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50',
};

export default function AdminUsersPage() {
  const t = useT();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filteredUsers = roleFilter === 'ALL' ? users : users.filter((u) => u.role === roleFilter);

  const toggleActive = async (userId: string, currentActive: boolean) => {
    try {
      // Use the professors PATCH as a proxy since there's no dedicated user toggle endpoint
      // We'll just show the status for now
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
        <h1 className="text-2xl font-bold text-foreground">{t('admin.users_title')}</h1>
        <p className="text-muted-foreground">{t('admin.users_subtitle')}</p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">{t('admin.filter_role')}:</span>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px] bg-background border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t('admin.all_roles')}</SelectItem>
            <SelectItem value="STUDENT">{t('admin.role_student')}</SelectItem>
            <SelectItem value="PROFESSOR">{t('admin.role_professor')}</SelectItem>
            <SelectItem value="ADMIN">{t('admin.role_admin')}</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{filteredUsers.length} usuarios</span>
      </div>

      {/* Table */}
      <Card className="border-border overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('admin.user_name')}</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">{t('admin.user_email')}</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('admin.user_role')}</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">{t('admin.user_status')}</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">{t('admin.user_last_login')}</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">{t('admin.user_created')}</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden xl:table-cell">{t('admin.user_submissions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center size-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-foreground truncate max-w-[120px]">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell truncate max-w-[180px]">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-xs ${roleBadgeClass[user.role] || ''}`}>
                        {user.role === 'STUDENT' ? t('admin.role_student') : user.role === 'PROFESSOR' ? t('admin.role_professor') : t('admin.role_admin')}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge variant="outline" className={`text-xs ${user.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800/50'}`}>
                        {user.isActive ? t('admin.user_active') : t('admin.user_inactive')}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell text-xs">
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('es-AR') : '-'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell text-xs">
                      {new Date(user.createdAt).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden xl:table-cell text-xs">
                      {user._count?.activitySubmissions || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm">
              {t('common.sin_datos')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
