'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageCircleWarning, X, Loader2, Check } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useT } from '@/i18n/context';

export default function BugReportButton() {
  const t = useT();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [pageUrl, setPageUrl] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async () => {
    setMessage(null);
    if (!subject.trim()) {
      setMessage({ type: 'error', text: t('bug_report.error_subject') });
      return;
    }
    if (description.trim().length < 10) {
      setMessage({ type: 'error', text: t('bug_report.error_description') });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/bug-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject.trim(),
          description: description.trim(),
          page: pageUrl || (typeof window !== 'undefined' ? window.location.pathname : ''),
        }),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: t('bug_report.success') });
        setSubject('');
        setDescription('');
        setTimeout(() => {
          setOpen(false);
          setMessage(null);
        }, 2000);
      } else {
        setMessage({ type: 'error', text: t('bug_report.error_generic') });
      }
    } catch {
      setMessage({ type: 'error', text: t('bug_report.error_generic') });
    }
    setLoading(false);
  };

  return (
    <>
      {/* FAB Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 20 }}
      >
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="size-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg hover:shadow-xl transition-all"
              title={t('bug_report.fab_tooltip')}
            >
              <MessageCircleWarning className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader className="mb-4">
              <SheetTitle className="flex items-center gap-2">
                <MessageCircleWarning className="size-5 text-rose-600" />
                {t('bug_report.title')}
              </SheetTitle>
              <SheetDescription>{t('bug_report.subtitle')}</SheetDescription>
            </SheetHeader>

            <div className="space-y-4">
              {message && (
                <Alert
                  className={
                    message.type === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/50'
                      : ''
                  }
                  variant={message.type === 'error' ? 'destructive' : 'default'}
                >
                  {message.type === 'success' ? (
                    <Check className="size-4 text-emerald-600" />
                  ) : (
                    <X className="size-4" />
                  )}
                  <AlertDescription
                    className={
                      message.type === 'success'
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : ''
                    }
                  >
                    {message.text}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="bug-subject">{t('bug_report.subject')}</Label>
                <Input
                  id="bug-subject"
                  placeholder={t('bug_report.subject_placeholder')}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bug-desc">{t('bug_report.description')}</Label>
                <Textarea
                  id="bug-desc"
                  placeholder={t('bug_report.description_placeholder')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-background border-border resize-none"
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bug-page">{t('bug_report.page')}</Label>
                <Input
                  id="bug-page"
                  value={mounted ? (pageUrl || window.location.pathname) : ''}
                  onChange={(e) => setPageUrl(e.target.value)}
                  onFocus={() => setPageUrl(typeof window !== 'undefined' ? window.location.pathname : '')}
                  className="bg-background border-border"
                  readOnly
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white"
              >
                {loading && <Loader2 className="size-4 animate-spin mr-2" />}
                {t('bug_report.submit')}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </motion.div>
    </>
  );
}
