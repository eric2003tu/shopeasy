"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';

type Locale = 'en' | 'fr' | 'es' | 'rw';

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (path: string, vars?: Record<string, unknown>) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const loadLocale = async (locale: Locale): Promise<Record<string, unknown>> => {
  switch (locale) {
    case 'fr': return (await import('./locales/fr.json')).default as Record<string, unknown>;
    case 'es': return (await import('./locales/es.json')).default as Record<string, unknown>;
    case 'rw': return (await import('./locales/rw.json')).default as Record<string, unknown>;
    case 'en':
    default:
      return (await import('./locales/en.json')).default as Record<string, unknown>;
  }
};

export const I18nProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('en');
  // messages is null while loading — prevents rendering keys like 'footer.xxx' before translations load
  const [messages, setMessages] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem('locale') as Locale | null;
    const initial = stored || (navigator.language.startsWith('fr') ? 'fr' : navigator.language.startsWith('es') ? 'es' : 'en');
    setLocaleState(initial || 'en');
  }, []);

  useEffect(() => {
    // load locale messages and ensure we always have at least English fallbacks
    loadLocale(locale)
      .then((m) => setMessages(m as Record<string, unknown>))
      .catch(() => loadLocale('en').then((m) => setMessages(m as Record<string, unknown>)));
    window.localStorage.setItem('locale', locale);
    // Ensure the html lang attribute is updated on the client when locale changes
    try {
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.lang = locale;
      }
    } catch {
      // ignore in non-browser environments
    }
  }, [locale]);

  const setLocale = (l: Locale) => setLocaleState(l);

  const t = (path: string, vars?: Record<string, unknown>): string => {
    // If messages haven't loaded yet, return empty string to avoid flashing keys in UI
    if (!messages) return '';

    const parts = path.split('.');
    let cur: unknown = messages;
    for (const p of parts) {
      if (!cur || typeof cur !== 'object') { cur = undefined; break; }
      cur = (cur as Record<string, unknown>)[p];
    }
    let str = typeof cur === 'string' ? cur : '';
    if (vars && str) {
      Object.keys(vars).forEach(k => {
        const v = String((vars as Record<string, unknown>)[k] ?? '');
        str = str.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), v);
        str = str.replace(new RegExp(`{${k}}`, 'g'), v);
      });
    }
    return str || path;
  };

  // Don't render children until messages are loaded to avoid showing raw keys (e.g., "footer.shop")
  if (!messages) return null;

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
};

export default I18nContext;
