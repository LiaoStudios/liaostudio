import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

const EASE = 'ease-[cubic-bezier(0.25,0.1,0.25,1)]';

/**
 * Testo che "rulla": la scritta è duplicata in colonna dentro un box con
 * overflow nascosto; al passaggio del mouse la colonna scorre di metà
 * altezza, così la copia di sotto prende il posto di quella sopra.
 */
export function RollText({ children, h = 20 }: { children: ReactNode; h?: number }) {
  return (
    <span className="overflow-hidden inline-flex flex-col" style={{ height: h }}>
      <span
        className={`flex flex-col transition-transform duration-500 ${EASE} group-hover:-translate-y-1/2`}
      >
        <span className="flex items-center" style={{ height: h }}>{children}</span>
        <span className="flex items-center" style={{ height: h }} aria-hidden="true">{children}</span>
      </span>
    </span>
  );
}

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  /** 'dark' = pillola scura, 'blue' = pillola blu marchio, 'light' = bianca */
  tone?: 'dark' | 'blue' | 'light';
  className?: string;
  disabled?: boolean;
};

/** Pillola con freccia in un cerchio che ruota di -45° al passaggio. */
export default function RollButton({ children, href, onClick, tone = 'dark', className = '', disabled }: Props) {
  const tones = {
    dark: 'bg-[#0B1220] text-white hover:bg-[#002050]',
    blue: 'bg-[#0068F8] text-white hover:bg-[#0052C7]',
    light: 'bg-white text-[#0B1220] hover:bg-[#E6F0FE]',
  } as const;
  const circles = {
    dark: 'bg-white text-[#0B1220]',
    blue: 'bg-white text-[#0068F8]',
    light: 'bg-[#0068F8] text-white',
  } as const;

  const inner = (
    <>
      <RollText>{children}</RollText>
      <span className={`grid place-items-center rounded-full w-7 h-7 sm:w-8 sm:h-8 shrink-0 ${circles[tone]}`}>
        <ArrowRight
          size={14}
          className={`transition-transform duration-500 ${EASE} group-hover:-rotate-45`}
        />
      </span>
    </>
  );

  const cls =
    `group inline-flex items-center gap-3 rounded-full pl-5 sm:pl-6 pr-2 py-2 ` +
    `text-[13px] sm:text-[14px] font-medium transition-colors duration-500 ${EASE} ${tones[tone]} ${className} ` +
    (disabled ? 'opacity-60 pointer-events-none' : '');

  return href ? (
    <a href={href} className={cls}>{inner}</a>
  ) : (
    <button type="submit" onClick={onClick} disabled={disabled} className={cls}>{inner}</button>
  );
}
