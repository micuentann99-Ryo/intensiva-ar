'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import es from './es.json';
import en from './en.json';

type Locale = 'es' | 'en';

type Translations = typeof es;

const translations: Record<Locale, Translations> = { es, en };

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return path;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' ? current : path;
}

function readInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'es';
  try {
    const saved = localStorage.getItem('intensiva-locale');
    if (saved === 'es' || saved === 'en') return saved;
  } catch {
    // localStorage unavailable
  }
  return 'es';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es');

  // On mount, read the saved locale from localStorage
  // This avoids hydration mismatch since SSR always renders 'es'
  useEffect(() => {
    const saved = readInitialLocale();
    if (saved !== 'es') setLocaleState(saved);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('intensiva-locale', newLocale);
    } catch {
      // localStorage unavailable
    }
    document.documentElement.lang = newLocale;
  }, []);

  const t = useCallback(
    (key: string): string => {
      return getNestedValue(
        translations[locale] as unknown as Record<string, unknown>,
        key
      );
    },
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useT must be used within I18nProvider');
  return ctx.t;
}

export function useLocale() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useLocale must be used within I18nProvider');
  return ctx.locale;
}

export function useSetLocale() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useSetLocale must be used within I18nProvider');
  return ctx.setLocale;
}
