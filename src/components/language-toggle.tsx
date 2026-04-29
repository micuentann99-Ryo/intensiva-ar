'use client';

import { useState, useEffect } from 'react';
import { useLocale, useSetLocale } from '@/i18n/context';

export default function LanguageToggle({ className = '' }: { className?: string }) {
  const locale = useLocale();
  const setLocale = useSetLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <button
        className={`flex items-center justify-center size-9 rounded-lg text-xs font-bold border border-border bg-background text-muted-foreground ${className}`}
        aria-label="Language toggle"
      >
        ES
      </button>
    );
  }

  return (
    <button
      onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
      className={`flex items-center justify-center size-9 rounded-lg text-xs font-bold transition-all hover:scale-105 active:scale-95 ${
        locale === 'en'
          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
          : 'border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted/80'
      } ${className}`}
      aria-label={locale === 'es' ? 'Switch to English' : 'Cambiar a español'}
      title={locale === 'es' ? 'English' : 'Español'}
    >
      {locale === 'es' ? 'EN' : 'ES'}
    </button>
  );
}
