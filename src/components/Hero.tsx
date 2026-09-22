import { useState } from 'react';
import ShaderBackground from './ShaderBackground';
import LogoWatermark from './LogoWatermark';
import Navbar from './Navbar';
import RollButton from './TextRoll';
import HeadlineToolbar, { INITIAL_STYLE, styleBadges, type HeadlineStyle } from './HeadlineToolbar';
import { VISIBLE } from '../data/projects';
import { BRAND } from '../theme';

const SIZES: Record<HeadlineStyle['level'], string> = {
  'Heading 1': 'clamp(2.4rem,8.4vw,5.6rem)',
  'Heading 2': 'clamp(2rem,6.4vw,4.2rem)',
  'Heading 3': 'clamp(1.6rem,4.8vw,3rem)',
};

export default function Hero() {
  const [style, setStyle] = useState<HeadlineStyle>(INITIAL_STYLE);
  const badges = styleBadges(style);

  return (
    <section id="top" className="group relative min-h-screen flex flex-col bg-[#EFEFEF] overflow-hidden">
      <ShaderBackground />
      <LogoWatermark />

      <Navbar />

      <div className="relative z-20 flex flex-1 items-center justify-center">
        <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-8 lg:px-12 py-10 text-center">
          <p className="mb-6 sm:mb-8 text-[13px] sm:text-[14px] tracking-wide text-gray-700">
            Liao Studio — sviluppo web, Bologna
          </p>

          <h1
            className="font-medium leading-[1.05] tracking-[-0.03em] text-[#0B1220]"
            style={{ fontSize: SIZES[style.level] }}
          >
            Costruiamo siti
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            {/* seconda riga: presentata come testo selezionato, la toolbar la ristila */}
            <span className="relative inline-block">
              <span
                className="relative z-10 box-decoration-clone"
                style={{
                  color: style.color,
                  fontWeight: style.bold ? 700 : 500,
                  fontStyle: style.italic ? 'italic' : 'normal',
                  textDecoration: style.underline ? 'underline' : 'none',
                  textUnderlineOffset: '0.12em',
                  transition: 'color .35s cubic-bezier(.25,.1,.25,1)',
                }}
              >
                che portano clienti.
              </span>

              {/* etichette di stile, come in un editor */}
              <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 flex flex-wrap justify-center gap-1">
                {badges.map((b) => (
                  <span key={b}
                    className="rounded-[3px] bg-[#0B1220] px-1.5 py-[2px] text-[9px] sm:text-[10px] font-medium leading-none tracking-wide text-white">
                    {b}
                  </span>
                ))}
              </span>
            </span>
          </h1>

          <p className="mx-auto mt-7 sm:mt-9 max-w-[52ch] text-[15px] sm:text-[17px] leading-[1.6] text-gray-600">
            Siti su misura per ristoranti, pizzerie, saloni, palestre e imprese
            di Bologna e provincia. Nessun template, nessun abbonamento nascosto.
          </p>

          <div className={`mt-7 sm:mt-8 flex justify-center ${badges.length ? 'pt-2' : ''}`}>
            <div className="flex flex-col items-center gap-2">
              <HeadlineToolbar value={style} onChange={setStyle} />
              <p className="text-[11px] text-gray-500">Provala: cambia il titolo come preferisci.</p>
            </div>
          </div>

          <div className="mt-9 sm:mt-11 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
            <RollButton href="#contatti" tone="blue">Iniziamo il tuo progetto</RollButton>

            <a href="#lavori"
              className="group flex items-center gap-2.5 rounded-[4px] bg-white px-3 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"
                className="w-5 h-5 sm:w-6 sm:h-6 fill-current" style={{ color: BRAND.blue }} aria-hidden="true">
                <path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z" />
              </svg>
              <span className="text-[13px] sm:text-[14px] font-medium text-gray-900">
                {VISIBLE.length} siti online
              </span>
              <span className="rounded bg-[#0B1220] px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] text-white">
                Portfolio
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
