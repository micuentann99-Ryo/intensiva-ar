'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useT } from '@/i18n/context';

export default function RegisterPage() {
  const t = useT();
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [university, setUniversity] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    setError('');
    if (!name.trim()) { setError(t('auth.name_required')); return false; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError(t('auth.email_invalid')); return false; }
    if (password.length < 8) { setError(t('auth.password_min')); return false; }
    if (password !== confirmPassword) { setError(t('auth.password_mismatch')); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = await register({
      name: name.trim(),
      email: email.trim(),
      password,
      role: 'STUDENT',
      university: university.trim() || undefined,
      yearOfStudy: yearOfStudy.trim() || undefined,
    });
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      router.push('/login?registered=true');
    }
  };

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
                {t('auth.register_title')}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {t('auth.register_subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="size-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('auth.name')}</Label>
                  <Input
                    id="name"
                    placeholder={t('auth.name_placeholder')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-background border-border"
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">{t('auth.email')}</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder={t('auth.email_placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background border-border"
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">{t('auth.password')}</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder={t('auth.password_placeholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background border-border"
                    autoComplete="new-password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{t('auth.confirm_password')}</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder={t('auth.confirm_password_placeholder')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-background border-border"
                    autoComplete="new-password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="university">{t('auth.university')} <span className="text-muted-foreground text-xs">({t('auth.phone')?.replace('Teléfono', '')?.trim() || 'opcional'})</span></Label>
                  <Input
                    id="university"
                    placeholder={t('auth.university_placeholder')}
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">{t('auth.year_of_study')} <span className="text-muted-foreground text-xs">(opcional)</span></Label>
                  <Input
                    id="year"
                    placeholder={t('auth.year_placeholder')}
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={loading}
                >
                  {loading && <Loader2 className="size-4 animate-spin mr-2" />}
                  {t('auth.create_account')}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                {t('auth.already_account')}{' '}
                <Link href="/login" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
                  {t('auth.login_link')}
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
