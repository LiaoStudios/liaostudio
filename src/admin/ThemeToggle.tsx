import { Moon, Sun } from 'lucide-react';

/** Pillola scorrevole chiaro/scuro: 44×24, pallino da 18 che scorre di 20px. */
export default function ThemeToggle({ theme, onToggle }: { theme: 'light' | 'dark'; onToggle: () => void }) {
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={onToggle}
      role="switch"
      aria-checked={dark}
      aria-label={dark ? 'Passa al tema chiaro' : 'Passa al tema scuro'}
      className="relative h-6 w-11 shrink-0 rounded-full border border-[#d1d5db] bg-[#f9fafb] transition-colors duration-200 dark:border-[#232833] dark:bg-[#0b0e14]"
    >
      <span
        className="absolute top-1/2 grid h-[18px] w-[18px] -translate-y-1/2 place-items-center rounded-full bg-[#0068F8] text-white transition-[left] duration-200 ease-in-out"
        style={{ left: dark ? 22 : 2 }}
      >
        {dark ? <Moon size={11} /> : <Sun size={11} />}
      </span>
    </button>
  );
}
