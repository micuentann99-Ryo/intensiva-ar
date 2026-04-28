'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useT } from '@/i18n/context';

function LoginForm() {
  const t = useT();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(searchParams.get('registered') === 'true');

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'ADMIN') {
        router.push('/admin');
      } else if (user.role === 'PROFESSOR' && user.professorStatus === 'PENDING') {
        router.push(`/login?pending=true`);
      } else {
        router.push('/');
      }
    }
  }, [user, authLoading, router]);

  const pending = searchParams.get('pending') === 'true';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Completá todos los campos');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.error) {
      setError(t('auth.login_error'));
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 bg-white dark:bg-black border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="flex items-center justify-center size-9 rounded-lg bg-emerald-600 text-white">
                <Sparkles className="size-5" />
              </div>
              <span className="text-lg font-bold text-foreground">IntensivaAR</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-10 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto px-4"
        >
          <Card className="border-border shadow-sm">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold text-foreground">
                {t('auth.login_title')}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {t('auth.login_subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {success && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                  <Alert className="bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/50">
                    <AlertDescription className="text-emerald-700 dark:text-emerald-300">
                      {t('auth.register_success')}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {pending && (
                <Alert className="bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800/50">
                  <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
                  <AlertDescription className="text-amber-700 dark:text-amber-300">
                    <span className="font-medium">{t('auth.professor_pending_title')}</span>
                    <br />
                    {t('auth.professor_pending_message')}
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="size-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.email_placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background border-border"
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t('auth.password_placeholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background border-border"
                    autoComplete="current-password"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={loading}
                >
                  {loading && <Loader2 className="size-4 animate-spin mr-2" />}
                  {t('auth.login_button')}
                </Button>
              </form>

              <div className="text-center space-y-2 pt-2">
                <p className="text-sm text-muted-foreground">
                  {t('auth.no_account')}{' '}
                  <Link href="/registro" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
                    {t('auth.register_link')}
                  </Link>
                </p>
                <p className="text-sm">
                  <Link href="/registro/profesor" className="text-muted-foreground hover:text-foreground transition-colors">
                    {t('auth.professor_register_link')}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="size-8 animate-spin text-emerald-600" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
