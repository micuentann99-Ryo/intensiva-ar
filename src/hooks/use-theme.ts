'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'intensiva-theme';

export function useTheme() {
  const [isDark, setIsDark] = useState(false);

  // Read stored preference on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else if (stored === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      // Default: light
      localStorage.setItem(STORAGE_KEY, 'light');
    }
  }, []);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem(STORAGE_KEY, 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem(STORAGE_KEY, 'light');
      }
      return next;
    });
  }, []);

  return { isDark, toggle };
}
