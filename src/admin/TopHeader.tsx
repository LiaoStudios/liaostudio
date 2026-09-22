import { useEffect, useRef, useState } from 'react';
import { Bell, ChevronRight, ExternalLink, Menu, Search } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import type { TabKey } from './Sidebar';

const NOMI: Record<TabKey, string> = {
  panoramica: 'Panoramica',
  richieste: 'Richieste',
  progetti: 'Progetti',
  piani: 'Prezzi',
  testi: 'Testi',
};

export default function TopHeader({
  tab, theme, onToggleTheme, query, onQuery, nuove, onOpenMenu,
}: {
  tab: TabKey;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  query: string;
  onQuery: (q: string) => void;
  nuove: number;
  onOpenMenu: () => void;
}) {
  const search = useRef<HTMLInputElement>(null);

  // ⌘K / Ctrl+K porta il cursore nella ricerca, come in ogni gestionale
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        search.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const [apple, setApple] = useState(false);
  useEffect(() => { setApple(/Mac|iPhone|iPad/.test(navigator.platform)); }, []);

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-[#12151c]">
      <div className="flex h-[60px] items-center gap-3 border-b border-[#e5e7eb] px-4 dark:border-[#232833] sm:px-6">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Apri il menù"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[#475569] transition-colors hover:bg-[#f6f7f9] dark:text-[#9aa4b2] dark:hover:bg-[#0b0e14] lg:hidden"
        >
          <Menu size={18} />
        </button>

        <div className="relative w-full max-w-[576px]">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            ref={search}
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Cerca fra richieste e progetti…"
            className="h-9 w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] pl-9 pr-16 text-[13px] text-[#0f172a] outline-none transition-colors duration-120 placeholder:text-[#94a3b8] focus:border-[#0068F8] focus:bg-white focus:ring-2 focus:ring-[#0068F8]/15 dark:border-[#232833] dark:bg-[#0b0e14] dark:text-[#e5e9f0] dark:focus:bg-[#0b0e14]"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-[#e5e7eb] bg-white px-1.5 py-0.5 font-mono text-[10px] text-[#94a3b8] dark:border-[#232833] dark:bg-[#12151c] sm:block">
            {apple ? '⌘' : 'Ctrl'}K
          </kbd>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          <span className="relative grid h-9 w-9 place-items-center rounded-lg text-[#475569] dark:text-[#9aa4b2]">
            <Bell size={17} />
            {nuove > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#dc2626] ring-2 ring-white dark:ring-[#12151c]" />
            )}
          </span>

          <a
            href={import.meta.env.BASE_URL}
            className="hidden items-center gap-1.5 rounded-lg border border-[#e5e7eb] px-3 py-2 text-[12.5px] text-[#475569] transition-colors duration-120 hover:text-[#0f172a] dark:border-[#232833] dark:text-[#9aa4b2] dark:hover:text-[#e5e9f0] sm:inline-flex"
          >
            <ExternalLink size={13} /> Vedi il sito
          </a>
        </div>
      </div>

      {/* briciole di pane */}
      <div className="flex h-10 items-center gap-1.5 border-b border-[#e5e7eb] px-4 text-[12px] dark:border-[#232833] sm:px-6">
        <span className="text-[#94a3b8]">Liao Studio</span>
        <ChevronRight size={13} className="text-[#94a3b8]" />
        <span className="text-[#94a3b8]">Dashboard</span>
        <ChevronRight size={13} className="text-[#94a3b8]" />
        <span className="font-medium text-[#0f172a] dark:text-[#e5e9f0]">{NOMI[tab]}</span>
      </div>
    </header>
  );
}
