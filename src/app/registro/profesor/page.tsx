'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, AlertTriangle, Loader2, Info } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useT } from '@/i18n/context';

export default function RegisterProfessorPage() {
  const t = useT();
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    setError('');
    if (!name.trim()) { setError(t('auth.name_required')); return false; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError(t('auth.email_invalid')); return false; }
    if (password.length < 8) { setError(t('auth.password_min')); return false; }
    if (password !== confirmPassword) { setError(t('auth.password_mismatch')); return false; }
    if (!specialization.trim()) { setError(t('auth.specialization_required')); return false; }
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
      role: 'PROFESSOR',
      specialization: specialization.trim(),
      bio: bio.trim() || undefined,
      phone: phone.trim() || undefined,
    });
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      router.push('/login?professor_registered=true');
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

      <main className="flex-1 flex items-center justify-center py-10 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg mx-auto px-4"
        >
          <Card className="border-border shadow-sm">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold text-foreground">
                {t('auth.register_professor_title')}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {t('auth.register_professor_subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Info message */}
              <Alert className="bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/50">
                <Info className="size-4 text-emerald-600 dark:text-emerald-400" />
                <AlertDescription className="text-emerald-700 dark:text-emerald-300 text-sm">
                  {t('auth.professor_info')}
                </AlertDescription>
              </Alert>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="size-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="p-name">{t('auth.name')}</Label>
                  <Input
                    id="p-name"
                    placeholder={t('auth.name_placeholder')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-background border-border"
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p-email">{t('auth.email')}</Label>
                  <Input
                    id="p-email"
                    type="email"
                    placeholder={t('auth.email_placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background border-border"
                    autoComplete="email"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="p-password">{t('auth.password')}</Label>
                    <Input
                      id="p-password"
                      type="password"
                      placeholder={t('auth.password_placeholder')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-background border-border"
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="p-confirm">{t('auth.confirm_password')}</Label>
                    <Input
                      id="p-confirm"
                      type="password"
                      placeholder={t('auth.confirm_password_placeholder')}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-background border-border"
                      autoComplete="new-password"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p-spec">{t('auth.specialization')} *</Label>
                  <Input
                    id="p-spec"
                    placeholder={t('auth.specialization_placeholder')}
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p-bio">{t('auth.bio')}</Label>
                  <Textarea
                    id="p-bio"
                    placeholder={t('auth.bio_placeholder')}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="bg-background border-border min-h-[100px] resize-none"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p-phone">{t('auth.phone')}</Label>
                  <Input
                    id="p-phone"
                    placeholder={t('auth.phone_placeholder')}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={loading}
                >
                  {loading && <Loader2 className="size-4 animate-spin mr-2" />}
                  {t('auth.send_request')}
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
