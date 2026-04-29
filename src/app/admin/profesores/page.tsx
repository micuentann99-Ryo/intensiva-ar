'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Check, X, GraduationCap, Mail, Phone, BookOpen, Clock } from 'lucide-react';
import { useT } from '@/i18n/context';

export default function AdminProfessorsPage() {
  const t = useT();
  const [professors, setProfessors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchProfessors = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/professors');
      if (res.ok) {
        const data = await res.json();
        setProfessors(data.professors);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchProfessors(); }, [fetchProfessors]);

  const handleAction = async (professorId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch('/api/admin/professors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ professorId, status }),
      });
      if (res.ok) {
        setMessage(status === 'APPROVED' ? 'Profesor aprobado correctamente' : 'Profesor rechazado');
        fetchProfessors();
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

  const statusColors: Record<string, string> = {
    APPROVED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50',
    REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800/50',
    PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/50',
  };

  const statusLabels: Record<string, string> = {
    APPROVED: t('admin.professor_approved'),
    REJECTED: t('admin.professor_rejected'),
    PENDING: t('admin.professor_pending'),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('admin.professors_title')}</h1>
        <p className="text-muted-foreground">{t('admin.professors_subtitle')}</p>
      </div>

      {message && (
        <Alert className="bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/50">
          <Check className="size-4 text-emerald-600" />
          <AlertDescription className="text-emerald-700 dark:text-emerald-300">{message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {professors.map((prof, idx) => (
          <motion.div
            key={prof.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
          >
            <Card className="border-border">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Avatar */}
                  <div className="flex items-center justify-center size-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-lg font-bold shrink-0">
                    {prof.name.charAt(0).toUpperCase()}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-foreground">{prof.name}</h3>
                      <Badge variant="outline" className={`text-xs ${statusColors[prof.professorStatus || 'PENDING'] || ''}`}>
                        {statusLabels[prof.professorStatus || 'PENDING'] || prof.professorStatus}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Mail className="size-3.5" />{prof.email}</span>
                      {prof.specialization && (
                        <span className="flex items-center gap-1.5"><BookOpen className="size-3.5" />{prof.specialization}</span>
                      )}
                      {prof.phone && (
                        <span className="flex items-center gap-1.5"><Phone className="size-3.5" />{prof.phone}</span>
                      )}
                      <span className="flex items-center gap-1.5"><Clock className="size-3.5" />{new Date(prof.createdAt).toLocaleDateString('es-AR')}</span>
                    </div>
                    {prof.bio && (
                      <p className="text-sm text-muted-foreground mt-1">{prof.bio}</p>
                    )}
                  </div>
                  {/* Actions */}
                  {prof.professorStatus === 'PENDING' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        onClick={() => handleAction(prof.id, 'APPROVED')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Check className="size-3.5 mr-1" />
                        {t('admin.approve')}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAction(prof.id, 'REJECTED')}
                        className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
                      >
                        <X className="size-3.5 mr-1" />
                        {t('admin.reject')}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {professors.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">
            {t('common.sin_datos')}
          </div>
        )}
      </div>
    </div>
  );
}
