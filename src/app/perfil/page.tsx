'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth, type AuthUser } from '@/lib/auth-context';
import { useT } from '@/i18n/context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  Shield,
  Award,
  Edit3,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function PerfilPage() {
  const t = useT();
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: '',
    bio: '',
    phone: '',
    university: '',
    yearOfStudy: '',
    specialization: '',
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72 mb-8" />
          <div className="flex items-center gap-6 mb-8">
            <Skeleton className="size-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <User className="size-16 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">{t('navbar.mi_perfil')}</h2>
          <p className="text-muted-foreground">Iniciá sesión para ver tu perfil</p>
          <Link href="/login">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {t('navbar.ingresa')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const startEditing = () => {
    setForm({
      name: user.name || '',
      bio: (user as AuthUser).bio || '',
      phone: (user as AuthUser).phone || '',
      university: user.university || '',
      yearOfStudy: (user as AuthUser).yearOfStudy || '',
      specialization: user.specialization || '',
    });
    setEditing(true);
    setMessage(null);
  };

  const cancelEditing = () => {
    setEditing(false);
    setMessage(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: t('profile.profile_updated') });
        await refreshUser();
        setEditing(false);
      } else {
        setMessage({ type: 'error', text: data.error || t('profile.update_error') });
      }
    } catch {
      setMessage({ type: 'error', text: t('profile.update_error') });
    } finally {
      setSaving(false);
    }
  };

  const roleLabel = user.role === 'ADMIN' ? t('profile.admin') : user.role === 'PROFESSOR' ? t('profile.professor') : t('profile.student');
  const roleColor = user.role === 'ADMIN'
    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
    : user.role === 'PROFESSOR'
    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';

  const professorStatus = (user as AuthUser).professorStatus;
  const professorStatusBadge = professorStatus === 'APPROVED'
    ? { label: t('profile.professor_status_approved'), color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' }
    : professorStatus === 'PENDING'
    ? { label: t('profile.professor_status_pending'), color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' }
    : professorStatus === 'REJECTED'
    ? { label: t('profile.professor_status_rejected'), color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' }
    : null;

  const createdAt = (user as AuthUser).createdAt ? new Date((user as AuthUser).createdAt!).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' }) : '-';
  const lastLogin = (user as AuthUser).lastLoginAt ? new Date((user as AuthUser).lastLoginAt!).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : t('profile.no_login_yet');

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-20 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            {t('profile.title')}
          </h1>
          <p className="text-muted-foreground mt-2">{t('profile.subtitle')}</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-border">
            {/* Avatar & Basic Info */}
            <CardContent className="pt-8 pb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Avatar */}
                <Avatar className="size-20 sm:size-24">
                  <AvatarFallback className="bg-emerald-600 text-white text-2xl sm:text-3xl font-bold">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground truncate">{user.name}</h2>
                    <Badge className={roleColor}>{roleLabel}</Badge>
                    {professorStatusBadge && (
                      <Badge className={professorStatusBadge.color}>
                        {professorStatusBadge.label}
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-1 flex items-center gap-1.5">
                    <Mail className="size-3.5" />
                    {user.email}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5" />
                      {t('profile.member_since')}: {createdAt}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                    <Clock className="size-3.5" />
                    {t('profile.last_login')}: {lastLogin}
                  </div>
                </div>

                {/* Edit Button */}
                {!editing && (
                  <Button
                    onClick={startEditing}
                    variant="outline"
                    className="gap-2 shrink-0"
                  >
                    <Edit3 className="size-4" />
                    {t('profile.edit_profile')}
                  </Button>
                )}
              </div>
            </CardContent>

            {/* Message */}
            {message && (
              <div className={`mx-6 mb-4 px-4 py-3 rounded-lg text-sm flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'
                  : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300'
              }`}>
                {message.type === 'success' ? <Check className="size-4" /> : <X className="size-4" />}
                {message.text}
              </div>
            )}

            {/* Profile Details / Edit Form */}
            <div className="px-6 pb-8">
              {editing ? (
                <div className="space-y-8">
                  {/* Personal Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <User className="size-5 text-emerald-600" />
                      {t('profile.personal_info')}
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <Label htmlFor="name">{t('profile.name')}</Label>
                        <Input
                          id="name"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder={t('profile.name_placeholder')}
                          className="mt-1.5"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="email">{t('profile.email')}</Label>
                        <Input
                          id="email"
                          value={user.email}
                          disabled
                          className="mt-1.5 bg-muted/50"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="bio">{t('profile.bio')}</Label>
                        <textarea
                          id="bio"
                          value={form.bio}
                          onChange={(e) => setForm({ ...form, bio: e.target.value })}
                          placeholder={t('profile.bio_placeholder')}
                          rows={3}
                          className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all resize-none"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">{t('profile.phone')}</Label>
                        <Input
                          id="phone"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder={t('profile.phone_placeholder')}
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Student-specific fields */}
                  {(user.role === 'STUDENT') && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <GraduationCap className="size-5 text-emerald-600" />
                        {t('profile.academic_info')}
                      </h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="university">{t('profile.university')}</Label>
                          <Input
                            id="university"
                            value={form.university}
                            onChange={(e) => setForm({ ...form, university: e.target.value })}
                            placeholder={t('profile.university_placeholder')}
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="yearOfStudy">{t('profile.year_of_study')}</Label>
                          <Input
                            id="yearOfStudy"
                            value={form.yearOfStudy}
                            onChange={(e) => setForm({ ...form, yearOfStudy: e.target.value })}
                            placeholder={t('profile.year_placeholder')}
                            className="mt-1.5"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Professor-specific fields */}
                  {(user.role === 'PROFESSOR') && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Award className="size-5 text-emerald-600" />
                        {t('profile.professor_info')}
                      </h3>
                      <div>
                        <Label htmlFor="specialization">{t('profile.specialization')}</Label>
                        <Input
                          id="specialization"
                          value={form.specialization}
                          onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                          placeholder={t('profile.specialization_placeholder')}
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                    >
                      {saving ? (
                        <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Check className="size-4" />
                      )}
                      {t('profile.save_changes')}
                    </Button>
                    <Button onClick={cancelEditing} variant="outline" disabled={saving} className="gap-2">
                      <X className="size-4" />
                      {t('profile.cancel')}
                    </Button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="space-y-8">
                  {/* Personal Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <User className="size-5 text-emerald-600" />
                      {t('profile.personal_info')}
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {(user as AuthUser).bio && (
                        <div className="sm:col-span-2">
                          <p className="text-sm text-muted-foreground mb-1">{t('profile.bio')}</p>
                          <p className="text-foreground">{(user as AuthUser).bio}</p>
                        </div>
                      )}
                      {(user as AuthUser).phone && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">{t('profile.phone')}</p>
                          <p className="text-foreground flex items-center gap-1.5">
                            <Phone className="size-4" />
                            {(user as AuthUser).phone}
                          </p>
                        </div>
                      )}
                      {!(user as AuthUser).bio && !(user as AuthUser).phone && (
                        <p className="text-muted-foreground text-sm italic sm:col-span-2">
                          No completaste tu información personal. Clickeá &quot;Editar perfil&quot; para agregarla.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Student Academic Info */}
                  {(user.role === 'STUDENT') && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <GraduationCap className="size-5 text-emerald-600" />
                        {t('profile.academic_info')}
                      </h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {user.university && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">{t('profile.university')}</p>
                            <p className="text-foreground flex items-center gap-1.5">
                              <BookOpen className="size-4" />
                              {user.university}
                            </p>
                          </div>
                        )}
                        {(user as AuthUser).yearOfStudy && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">{t('profile.year_of_study')}</p>
                            <p className="text-foreground">
                              {(user as AuthUser).yearOfStudy}
                            </p>
                          </div>
                        )}
                        {!user.university && !(user as AuthUser).yearOfStudy && (
                          <p className="text-muted-foreground text-sm italic sm:col-span-2">
                            No completaste tu información académica. Clickeá &quot;Editar perfil&quot; para agregarla.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Professor Info */}
                  {(user.role === 'PROFESSOR') && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Award className="size-5 text-emerald-600" />
                        {t('profile.professor_info')}
                      </h3>
                      <div>
                        {user.specialization ? (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">{t('profile.specialization')}</p>
                            <p className="text-foreground">{user.specialization}</p>
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-sm italic">
                            No completaste tu especialización. Clickeá &quot;Editar perfil&quot; para agregarla.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Admin Section */}
                  {(user.role === 'ADMIN') && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Shield className="size-5 text-emerald-600" />
                        Administración
                      </h3>
                      <Link href="/admin">
                        <Button variant="outline" className="gap-2">
                          <Sparkles className="size-4" />
                          {t('navbar.admin_panel')}
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
