import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { BRAND } from '../theme';

export type Level = 'Heading 1' | 'Heading 2' | 'Heading 3';

export interface HeadlineStyle {
  level: Level;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  color: string;
}

export const INITIAL_STYLE: HeadlineStyle = {
  level: 'Heading 1',
  bold: false,
  italic: false,
  underline: false,
  color: BRAND.ink,
};

const SWATCHES = [BRAND.ink, BRAND.blue, BRAND.navy, '#7A5CF0'];
const EASE = 'ease-[cubic-bezier(0.25,0.1,0.25,1)]';

/** Etichette che si accendono sotto la selezione, come in un editor. */
export function styleBadges(s: HeadlineStyle): string[] {
  const out: string[] = [];
  if (s.bold) out.push('Grassetto');
  if (s.italic) out.push('Corsivo');
  if (s.underline) out.push('Sottolineato');
  if (s.color !== BRAND.ink) out.push('Colore');
  return out;
}

/**
 * Barra di formattazione dell'hero: il titolo è presentato come testo
 * selezionato e questi controlli lo ristilano davvero, dal vivo.
 */
export default function HeadlineToolbar({
  value,
  onChange,
}: {
  value: HeadlineStyle;
  onChange: (s: HeadlineStyle) => void;
}) {
  const [openLevel, setOpenLevel] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  // un clic fuori chiude i menù aperti
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) {
        setOpenLevel(false);
        setOpenColor(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const set = (patch: Partial<HeadlineStyle>) => onChange({ ...value, ...patch });

  const toggleCls = (on: boolean) =>
    `grid place-items-center w-7 h-7 rounded-[6px] text-[13px] transition-colors duration-200 ` +
    (on ? 'bg-[#0B1220] text-white' : 'text-gray-500 hover:bg-black/[0.06] hover:text-gray-900');

  return (
    <div
      ref={wrap}
      className="relative inline-flex items-center gap-1 rounded-[10px] bg-white/85 backdrop-blur-md px-1.5 py-1.5 shadow-[0_2px_14px_rgba(11,18,32,0.10)] ring-1 ring-black/[0.06]"
    >
      {/* livello del titolo */}
      <div className="relative">
        <button
          type="button"
          onClick={() => { setOpenLevel((v) => !v); setOpenColor(false); }}
          aria-expanded={openLevel}
          className="flex items-center gap-1 rounded-[6px] pl-2 pr-1.5 h-7 text-[12px] text-gray-700 hover:bg-black/[0.06] transition-colors duration-200"
        >
          {value.level}
          <ChevronDown size={12} className={`transition-transform duration-300 ${openLevel ? 'rotate-180' : ''}`} />
        </button>
        {openLevel && (
          <div className="absolute left-0 top-full mt-1.5 z-30 w-[132px] rounded-[10px] bg-white p-1 shadow-[0_8px_28px_rgba(11,18,32,0.16)] ring-1 ring-black/[0.06]">
            {(['Heading 1', 'Heading 2', 'Heading 3'] as Level[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => { set({ level: l }); setOpenLevel(false); }}
                className={`block w-full rounded-[6px] px-2.5 py-1.5 text-left text-[12px] transition-colors duration-150 ${
                  value.level === l ? 'bg-[#0B1220] text-white' : 'text-gray-700 hover:bg-black/[0.05]'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        )}
      </div>

      <span className="mx-0.5 h-4 w-px bg-black/10" />

      <button type="button" aria-pressed={value.bold} aria-label="Grassetto"
        onClick={() => set({ bold: !value.bold })} className={toggleCls(value.bold)}>
        <span className="font-bold">B</span>
      </button>
      <button type="button" aria-pressed={value.italic} aria-label="Corsivo"
        onClick={() => set({ italic: !value.italic })} className={toggleCls(value.italic)}>
        <span className="italic font-serif">I</span>
      </button>
      <button type="button" aria-pressed={value.underline} aria-label="Sottolineato"
        onClick={() => set({ underline: !value.underline })} className={toggleCls(value.underline)}>
        <span className="underline underline-offset-2">U</span>
      </button>

      <span className="mx-0.5 h-4 w-px bg-black/10" />

      {/* colore */}
      <div className="relative">
        <button
          type="button"
          onClick={() => { setOpenColor((v) => !v); setOpenLevel(false); }}
          aria-expanded={openColor}
          aria-label="Colore del testo"
          className="flex items-center gap-1 rounded-[6px] px-1.5 h-7 hover:bg-black/[0.06] transition-colors duration-200"
        >
          <span className="text-[15px] font-semibold leading-none" style={{ color: value.color }}>A</span>
          <ChevronDown size={12} className={`text-gray-500 transition-transform duration-300 ${openColor ? 'rotate-180' : ''}`} />
        </button>
        {openColor && (
          <div className="absolute right-0 top-full mt-1.5 z-30 rounded-[10px] bg-white p-2 shadow-[0_8px_28px_rgba(11,18,32,0.16)] ring-1 ring-black/[0.06]">
            <div className="mb-1.5 px-0.5 text-[10px] uppercase tracking-wider text-gray-400">Colore</div>
            <div className="flex items-center gap-1">
              {SWATCHES.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Colore ${c}`}
                  onClick={() => { set({ color: c }); setOpenColor(false); }}
                  className={`grid place-items-center w-7 h-7 rounded-[6px] transition-transform duration-200 hover:scale-110 ${
                    value.color === c ? 'ring-2 ring-offset-1 ring-[#0B1220]/70' : ''
                  }`}
                >
                  <span className="text-[15px] font-semibold leading-none" style={{ color: c }}>A</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <span className={`pointer-events-none absolute inset-0 rounded-[10px] transition-opacity duration-500 ${EASE}`} />
    </div>
  );
}
