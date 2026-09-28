import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import Navbar from './Navbar';
import RollButton from './TextRoll';
import { useProgetti, type UIProject } from '../hooks/useProgetti';
import { asset } from '../lib/asset';

/** Dominio pulito da un url, o null se il progetto non è pubblico. */
function hostOf(url?: string): string | null {
  if (!url) return null;
  try { return new URL(url).host.replace(/^www\./, ''); } catch { return null; }
}

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const m = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!m) return;
    const sync = () => setReduce(m.matches);
    sync();
    m.addEventListener('change', sync);
    return () => m.removeEventListener('change', sync);
  }, []);
  return reduce;
}

/**
 * Anteprima di un progetto. Se lo screenshot non c'è (o non carica), invece
 * dell'icona immagine rotta mostra un fondale coerente coi colori del marchio,
 * con le iniziali del nome.
 */
function Shot({ p, className = '', imgClass = '' }: { p: UIProject; className?: string; imgClass?: string }) {
  const [ok, setOk] = useState(true);
  const iniz = p.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return (
    <div className={`relative overflow-hidden bg-[#0e1424] ${className}`}>
      {ok ? (
        <img
          src={asset(`/work/${p.slug}.jpg`)}
          alt={`Anteprima del sito realizzato per ${p.name}`}
          loading="lazy"
          onError={() => setOk(false)}
          className={`h-full w-full object-cover object-top ${imgClass}`}
        />
      ) : (
        <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#002050] to-[#0068F8]">
          <span className="text-[26px] font-semibold tracking-tight text-white/90">{iniz}</span>
        </div>
      )}
    </div>
  );
}

export default function Hero() {
  const { projects, cats } = useProgetti();
  const catLabel = (k: string) => cats.find((c) => c.key === k)?.label ?? k;
  const reduce = usePrefersReducedMotion();

  const n = projects.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const stripRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const go = (i: number) => { if (n) setActive(((i % n) + n) % n); };

  // porta la card attiva al centro della striscia
  useEffect(() => {
    const el = cardRefs.current[active];
    el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
  }, [active, reduce, n]);

  // avanzamento automatico, lento e in loop — in pausa su hover/focus
  useEffect(() => {
    if (reduce || paused || n < 2) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % n), 3800);
    return () => window.clearInterval(id);
  }, [reduce, paused, n]);

  const stars = useMemo(
    () => Array.from({ length: 64 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      s: Math.random() * 1.6 + 0.5,
      o: Math.random() * 0.5 + 0.18,
      tw: Math.random() * 4 + 3.5,
      dl: Math.random() * 5,
    })),
    []
  );

  const cur: UIProject | undefined = projects[active];
  const host = hostOf(cur?.url);

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#0B1220] text-white"
    >
      {/* sfondo: profondità navy + stelle */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 55% at 22% 18%, rgba(0,104,248,0.18), transparent 60%),' +
              'radial-gradient(55% 50% at 85% 30%, rgba(0,32,80,0.55), transparent 65%),' +
              'radial-gradient(80% 60% at 50% 115%, rgba(0,104,248,0.16), transparent 60%)',
          }}
        />
        {stars.map((st, i) => (
          <span
            key={i}
            className="hero-star absolute rounded-full bg-white"
            style={{
              top: `${st.top}%`, left: `${st.left}%`,
              width: st.s, height: st.s,
              ['--o' as string]: st.o, ['--tw' as string]: `${st.tw}s`, ['--dl' as string]: `${st.dl}s`,
              opacity: st.o,
            }}
          />
        ))}
      </div>

      <Navbar />

      {/* testo + CTA */}
      <div className="relative z-10 mx-auto w-full max-w-[1100px] shrink-0 px-5 pt-5 text-center sm:px-8 sm:pt-6 lg:px-12">
        <p className="mb-2.5 text-[12.5px] tracking-wide text-white/55 sm:text-[13.5px]">
          Liao Studio — sviluppo web, Bologna
        </p>
        <h1 className="font-medium leading-[1.06] tracking-[-0.03em] text-white"
          style={{ fontSize: 'clamp(1.8rem,4.4vw,3.2rem)' }}>
          Costruiamo siti <span className="text-[#4D9BFF]">che portano clienti.</span>
        </h1>
        <p className="mx-auto mt-3 max-w-[54ch] text-[13.5px] leading-[1.5] text-white/60 sm:text-[15px]">
          Ogni sito qui sotto l'abbiamo fatto noi, ed è online davvero. Scegline uno
          e guardalo aprirsi — poi immagina il tuo.
        </p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <RollButton href="#contatti" tone="blue">Iniziamo il tuo progetto</RollButton>
        </div>
      </div>

      {/* palco: browser + carosello */}
      <div className="relative z-10 flex flex-1 flex-col justify-end">
        {/* la grande finestra browser */}
        <div className="mx-auto w-full max-w-[880px] px-4 pt-4 sm:px-6">
          <div className="overflow-hidden rounded-2xl bg-[#0e1424] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
            {/* barra del browser */}
            <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-3.5 py-2.5">
              <span className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </span>
              <div className="ml-2 flex min-w-0 flex-1 items-center gap-1.5 rounded-md bg-black/25 px-2.5 py-1 text-[11.5px] text-white/60">
                <Lock size={11} className="shrink-0 text-white/40" />
                <span className="truncate">{host ?? 'anteprima del progetto'}</span>
              </div>
              <span className="hidden shrink-0 rounded-md bg-white/[0.06] px-2 py-1 text-[11px] text-white/55 sm:block">
                {cur ? catLabel(cur.cat) : ''}
              </span>
            </div>

            {/* corpo: lo screenshot reale del sito */}
            <div className="relative aspect-[16/10] max-h-[38vh] w-full">
              {cur && (
                <Shot
                  key={cur.slug}
                  p={cur}
                  className="hero-shot-in absolute inset-0 h-full w-full"
                />
              )}
              {/* titolo + azione */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/55 to-transparent p-3 sm:p-4">
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold text-white sm:text-[17px]" aria-live="polite">
                    {cur?.name}
                  </p>
                  <p className="truncate text-[12px] text-white/70">{cur?.loc}</p>
                </div>
                {cur?.url && (
                  <a
                    href={cur.url} target="_blank" rel="noopener"
                    className="pointer-events-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[12.5px] font-medium text-[#0B1220] transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    Visita il sito <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* carosello */}
        <div
          className="relative z-10 mt-3 pb-4 sm:mt-4 sm:pb-5"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div
            ref={stripRef}
            role="listbox"
            aria-label="I nostri lavori — scegline uno da guardare"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1); cardRefs.current[(active + 1) % n]?.focus(); }
              if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1); cardRefs.current[(active - 1 + n) % n]?.focus(); }
            }}
            className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-[calc(50%-84px)] outline-none"
          >
            {projects.map((p, i) => {
              const on = i === active;
              return (
                <button
                  key={p.slug}
                  ref={(el) => { cardRefs.current[i] = el; }}
                  type="button"
                  role="option"
                  aria-selected={on}
                  aria-label={`${p.name} — ${catLabel(p.cat)}`}
                  onClick={() => go(i)}
                  className="group relative shrink-0 snap-center rounded-xl outline-none transition-transform duration-300"
                  style={{ width: 168, transform: on ? 'translateY(-6px)' : 'none' }}
                >
                  <Shot
                    p={p}
                    className={`aspect-[168/108] w-full rounded-xl ring-1 transition-all duration-300 ${
                      on
                        ? 'ring-2 ring-[#4D9BFF] shadow-[0_16px_40px_-16px_rgba(0,104,248,0.7)]'
                        : 'ring-white/10 opacity-55 group-hover:opacity-90 group-focus-visible:opacity-100 group-focus-visible:ring-white/40'
                    }`}
                  />
                  <span className={`mt-2 block truncate text-center text-[11.5px] transition-colors duration-300 ${on ? 'text-white' : 'text-white/45 group-hover:text-white/75'}`}>
                    {p.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* frecce + contatore */}
          <div className="mx-auto mt-2.5 flex max-w-[900px] items-center justify-center gap-4 px-4">
            <button type="button" aria-label="Progetto precedente" onClick={() => go(active - 1)}
              className="grid h-8 w-8 place-items-center rounded-full ring-1 ring-white/15 text-white/70 transition-colors hover:bg-white/10 hover:text-white">
              <ChevronLeft size={16} />
            </button>
            <span className="font-mono text-[12px] tabular-nums text-white/55">
              {n ? String(active + 1).padStart(2, '0') : '00'} / {String(n).padStart(2, '0')} · {n} siti online
            </span>
            <button type="button" aria-label="Progetto successivo" onClick={() => go(active + 1)}
              className="grid h-8 w-8 place-items-center rounded-full ring-1 ring-white/15 text-white/70 transition-colors hover:bg-white/10 hover:text-white">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
