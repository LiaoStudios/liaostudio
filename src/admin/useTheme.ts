import { useEffect, useState } from 'react';

const KEY = 'liaostudio-admin-theme';
type Theme = 'light' | 'dark';

/**
 * Tema chiaro/scuro della sola area riservata.
 *
 * La classe `dark` va su <html> perché è lì che Tailwind la cerca, ma viene
 * tolta quando esci dalla dashboard: il sito pubblico non ha un tema scuro e
 * non deve ereditarlo. La scelta resta nel browser, quindi al rientro trovi
 * com'eri messo; se non hai mai scelto, seguiamo l'impostazione di sistema.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch { /* modalità privata o storage bloccato: pazienza */ }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem(KEY, theme); } catch { /* idem */ }
    return () => root.classList.remove('dark');
  }, [theme]);

  return { theme, toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) };
}
