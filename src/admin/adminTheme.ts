/**
 * Token dell'area riservata.
 *
 * La struttura è quella di un gestionale (sidebar scura, superfici chiare,
 * bordi sottili), ma i colori sono quelli del sito pubblico: il blu del
 * marchio al posto del blu generico, e l'inchiostro freddo del sito per le
 * superfici scure. Così la dashboard sembra la stanza sul retro dello stesso
 * edificio, non un altro prodotto.
 */
export const UI = {
  /* superfici — chiaro */
  appBg: '#f6f7f9',
  surface: '#ffffff',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  border: '#e5e7eb',

  /* superfici — scuro */
  appBgDark: '#0b0e14',
  surfaceDark: '#12151c',
  textPrimaryDark: '#e5e9f0',
  textSecondaryDark: '#9aa4b2',
  borderDark: '#232833',

  /* sidebar: sempre scura, nei toni del marchio */
  sidebar: '#0B1220',
  sidebarActive: '#13233f',

  /* accenti */
  blue: '#0068F8',
  blueSoft: '#eff4ff',
  green: '#16a34a',
  greenSoft: '#ecfdf3',
  red: '#dc2626',
  redSoft: '#fef2f2',
  amber: '#f59e0b',
} as const;

/* ---- classi ricorrenti, così i componenti restano leggibili ---- */

export const CARD =
  'rounded-xl border border-[#e5e7eb] bg-white shadow-[0_1px_2px_0_rgb(0_0_0/0.04)] ' +
  'transition-shadow duration-200 dark:border-[#232833] dark:bg-[#12151c]';

export const CARD_HOVER =
  'hover:shadow-[0_2px_8px_-2px_rgb(0_0_0/0.08)]';

export const INPUT =
  'w-full rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-[13.5px] text-[#0f172a] ' +
  'outline-none transition-colors duration-120 placeholder:text-[#94a3b8] ' +
  'focus:border-[#0068F8] focus:ring-2 focus:ring-[#0068F8]/15 ' +
  'dark:border-[#232833] dark:bg-[#0b0e14] dark:text-[#e5e9f0]';

export const LABEL =
  'mb-1.5 block text-[10.5px] font-bold uppercase tracking-wider text-[#64748b] dark:text-[#9aa4b2]';

export const BTN_PRIMARY =
  'inline-flex items-center gap-2 rounded-lg bg-[#0068F8] px-4 py-2 text-[13px] font-medium text-white ' +
  'transition-colors duration-120 hover:bg-[#0052C7] disabled:opacity-60';

export const BTN_GHOST =
  'inline-flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-[13px] ' +
  'text-[#475569] transition-colors duration-120 hover:border-[#cbd5e1] hover:text-[#0f172a] ' +
  'dark:border-[#232833] dark:bg-[#12151c] dark:text-[#9aa4b2] dark:hover:text-[#e5e9f0]';

export const H_SECTION =
  'text-[24px] font-semibold tracking-[-0.01em] text-[#0f172a] dark:text-[#e5e9f0]';

export const MUTED = 'text-[13px] text-[#475569] dark:text-[#9aa4b2]';
