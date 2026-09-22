import type { ReactNode } from 'react';

/** Pastiglia numerata + etichetta, come nelle sezioni del reference. */
export default function SectionHead({
  n, label, children, dark = false,
}: { n: string; label: string; children: ReactNode; dark?: boolean }) {
  return (
    <>
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <span className={`grid place-items-center w-6 h-6 sm:w-7 sm:h-7 rounded-full text-[11px] sm:text-[12px] font-semibold ${
          dark ? 'bg-white text-[#0B1220]' : 'bg-[#0B1220] text-white'}`}>
          {n}
        </span>
        <span className={`rounded-full border px-3 sm:px-4 py-1 sm:py-1.5 text-[12px] sm:text-[13px] font-medium ${
          dark ? 'border-white/25 text-white/80' : 'border-gray-300 text-gray-700'}`}>
          {label}
        </span>
      </div>
      <h2
        className={`font-medium leading-[1.12] tracking-[-0.02em] ${dark ? 'text-white' : 'text-[#0B1220]'}`}
        style={{ fontSize: 'clamp(1.5rem,4vw,3.2rem)' }}
      >
        {children}
      </h2>
    </>
  );
}
