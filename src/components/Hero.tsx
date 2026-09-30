import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Lock, Sparkles } from 'lucide-react';
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

/** true sotto i 760px: lì l'anello 3D lascia il posto a una striscia touch. */
function useNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(max-width: 759px)');
    const sync = () => setNarrow(m.matches);
    sync();
    m.addEventListener('change', sync);
    return () => m.removeEventListener('change', sync);
  }, []);
  return narrow;
}

/** Anteprima con fondale di scorta coi colori del marchio se lo screenshot non carica. */
function Shot({ p, className = '' }: { p: UIProject; className?: string }) {
  const [ok, setOk] = useState(true);
  const iniz = p.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return (
    <div className={`relative overflow-hidden bg-[#0e1424] ${className}`}>
      {ok ? (
        <img
          src={asset(`/work/${p.slug}.jpg`)}
          alt={`Anteprima del sito realizzato per ${p.name}`}
          onError={() => setOk(false)}
          className="h-full w-full object-cover object-top"
        />
      ) : (
        <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#002050] to-[#0068F8]">
          <span className="text-[24px] font-semibold tracking-tight text-white/90">{iniz}</span>
        </div>
      )}
    </div>
  );
}

/* ---- geometria dell'anello 3D ---- */
const CARD_W = 158;
const CARD_H = 210;
const RADIUS = 460;          // raggio del cilindro
const PERSPECTIVE = 1050;
const CULL = 54;             // oltre questo angolo la card è nascosta (mezzo dietro)
const SPIN = 5.2;            // gradi al secondo, lenta

export default function Hero() {
  const { projects, cats } = useProgetti();
  const catLabel = (k: string) => cats.find((c) => c.key === k)?.label ?? k;
  const reduce = usePrefersReducedMotion();
  const narrow = useNarrow();

  const n = projects.length;
  const step = n ? 360 / n : 0;

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const activeRef = useRef(0);
  activeRef.current = active;

  const setActiveSafe = (i: number) => { if (n) setActive(((i % n) + n) % n); };

  /* ---------- ANELLO 3D (desktop/tablet) ---------- */
  const cardEls = useRef<(HTMLButtonElement | null)[]>([]);
  const phaseRef = useRef(0);        // rotazione corrente (gradi)
  const targetRef = useRef<number | null>(null); // meta quando clicchi/freccia
  const pausedRef = useRef(false);
  pausedRef.current = paused;
  const reduceRef = useRef(false);
  reduceRef.current = reduce;

  // porta la card i davanti (percorso più corto rispetto alla rotazione attuale)
  const focusCard = (i: number) => {
    if (!n) return;
    const cur = phaseRef.current;
    let tgt = -i * step;
    tgt = cur + ((((tgt - cur) % 360) + 540) % 360) - 180;
    targetRef.current = tgt;
  };

  useEffect(() => {
    if (narrow || !n) return;
    let raf = 0;
    let last = performance.now();

    const loop = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.1);
      last = t;

      const tgt = targetRef.current;
      if (tgt !== null) {
        // easing verso la card scelta
        const next = phaseRef.current + (tgt - phaseRef.current) * Math.min(1, dt * 7);
        phaseRef.current = Math.abs(tgt - next) < 0.05 ? (targetRef.current = null, tgt) : next;
      } else if (!pausedRef.current && !reduceRef.current) {
        // rotazione lenta e continua
        phaseRef.current -= SPIN * dt;
      }

      const phase = phaseRef.current;
      for (let i = 0; i < n; i++) {
        const el = cardEls.current[i];
        if (!el) continue;
        let a = i * step + phase;
        a = ((a % 360) + 540) % 360 - 180; // angolo con segno, -180..180
        if (Math.abs(a) > CULL) { el.style.visibility = 'hidden'; continue; }
        el.style.visibility = 'visible';
        const r = (a * Math.PI) / 180;
        const c = Math.cos(r);
        el.style.transform =
          `translate3d(${(RADIUS * Math.sin(r)).toFixed(2)}px,0,${(-RADIUS * (1 - c)).toFixed(2)}px) rotateY(${(-a).toFixed(2)}deg)`;
        el.style.filter = `brightness(${(0.55 + 0.45 * c).toFixed(3)})`;
        el.style.opacity = String(Math.max(0, 0.28 + 0.72 * c).toFixed(3));
        el.style.zIndex = String(Math.round(1000 + c * 1000));
      }

      // la card più vicina al fronte guida il browser
      const front = ((Math.round(-phase / step) % n) + n) % n;
      if (front !== activeRef.current) setActive(front);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onVis = () => { last = performance.now(); };
    document.addEventListener('visibilitychange', onVis);
    return () => { cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', onVis); };
  }, [narrow, n, step]);

  /* ---------- STRISCIA (mobile) ---------- */
  const stripRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    if (!narrow) return;
    thumbRefs.current[active]?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
  }, [active, narrow, reduce, n]);
  useEffect(() => {
    if (!narrow || reduce || paused || n < 2) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % n), 3800);
    return () => window.clearInterval(id);
  }, [narrow, reduce, paused, n]);

  const stars = useMemo(
    () => Array.from({ length: 66 }, () => ({
      top: Math.random() * 100, left: Math.random() * 100,
      s: Math.random() * 1.6 + 0.5, o: Math.random() * 0.5 + 0.18,
      tw: Math.random() * 4 + 3.5, dl: Math.random() * 5,
    })),
    []
  );

  const cur: UIProject | undefined = projects[active];
  const host = hostOf(cur?.url);

  const prev = () => { const i = (active - 1 + n) % n; setActiveSafe(i); if (!narrow) focusCard(i); };
  const next = () => { const i = (active + 1) % n; setActiveSafe(i); if (!narrow) focusCard(i); };

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#0B1220] text-white">
      {/* sfondo: profondità navy + stelle */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0" style={{
          background:
            'radial-gradient(60% 55% at 22% 16%, rgba(0,104,248,0.18), transparent 60%),' +
            'radial-gradient(55% 50% at 85% 26%, rgba(0,32,80,0.55), transparent 65%),' +
            'radial-gradient(90% 65% at 50% 118%, rgba(0,104,248,0.20), transparent 60%)',
        }} />
        {stars.map((st, i) => (
          <span key={i} className="hero-star absolute rounded-full bg-white" style={{
            top: `${st.top}%`, left: `${st.left}%`, width: st.s, height: st.s,
            ['--o' as string]: st.o, ['--tw' as string]: `${st.tw}s`, ['--dl' as string]: `${st.dl}s`, opacity: st.o,
          }} />
        ))}
      </div>

      <Navbar />

      {/* copy */}
      <div className="relative z-20 mx-auto w-full max-w-[1100px] shrink-0 px-5 pt-4 text-center sm:px-8 sm:pt-5 lg:px-12">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/70 backdrop-blur-sm">
          <Sparkles size={13} className="text-[#4D9BFF]" />
          {n} siti realizzati, tutti online
        </div>
        <h1 className="font-medium leading-[1.05] tracking-[-0.03em] text-white" style={{ fontSize: 'clamp(1.8rem,4.4vw,3.2rem)' }}>
          Costruiamo siti <span className="text-[#4D9BFF]">che portano clienti.</span>
        </h1>
        <p className="mx-auto mt-3 max-w-[52ch] text-[13.5px] leading-[1.5] text-white/60 sm:text-[15px]">
          Scegli un lavoro dalla giostra: si apre nella finestra qui sotto, com'è online davvero.
        </p>
        <div className="mt-4 flex items-center justify-center">
          <RollButton href="#contatti" tone="blue">Iniziamo il tuo progetto</RollButton>
        </div>
      </div>

      {/* palco: anello 3D (desktop) o striscia (mobile) + browser sovrapposto */}
      <div className="relative z-10 flex flex-1 flex-col justify-end max-[759px]:justify-center">
        {!narrow ? (
          /* ---- ANELLO 3D ---- */
          <div
            className="relative"
            style={{ height: 'clamp(208px, 29vh, 290px)', perspective: PERSPECTIVE, perspectiveOrigin: '50% 50%' }}
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
              if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
            }}
          >
            <div className="absolute inset-0">
              {/* origine dell'anello: al centro-basso del palco, così le card
                  stanno sotto il testo e il browser ne copre il terzo inferiore */}
              <div className="absolute left-1/2" style={{ top: '48%', transformStyle: 'preserve-3d', width: 0, height: 0 }}>
                {projects.map((p, i) => (
                  <button
                    key={p.slug}
                    ref={(el) => { cardEls.current[i] = el; }}
                    type="button"
                    aria-label={`${p.name} — ${catLabel(p.cat)}`}
                    aria-current={i === active}
                    onClick={() => { setActiveSafe(i); focusCard(i); }}
                    className="absolute rounded-2xl outline-none ring-1 ring-white/10 focus-visible:ring-2 focus-visible:ring-[#4D9BFF]"
                    style={{
                      width: CARD_W, height: CARD_H, left: -CARD_W / 2, top: -CARD_H / 2,
                      backfaceVisibility: 'hidden', willChange: 'transform',
                      boxShadow: '0 24px 46px rgba(0,0,0,.55)',
                    }}
                  >
                    <Shot p={p} className="h-full w-full rounded-2xl" />
                    {i === active && (
                      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-[#4D9BFF]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ---- STRISCIA (mobile) ---- */
          <div
            className="relative z-10 mb-2"
            onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}
          >
            <div ref={stripRef} role="listbox" aria-label="I nostri lavori"
              className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-[calc(50%-80px)]">
              {projects.map((p, i) => {
                const on = i === active;
                return (
                  <button key={p.slug} ref={(el) => { thumbRefs.current[i] = el; }}
                    type="button" role="option" aria-selected={on}
                    aria-label={`${p.name} — ${catLabel(p.cat)}`} onClick={() => setActiveSafe(i)}
                    className="group shrink-0 snap-center rounded-xl outline-none"
                    style={{ width: 160, transform: on ? 'translateY(-6px)' : 'none', transition: 'transform .3s' }}>
                    <Shot p={p} className={`aspect-[160/104] w-full rounded-xl ring-1 transition-all duration-300 ${
                      on ? 'ring-2 ring-[#4D9BFF] shadow-[0_16px_40px_-16px_rgba(0,104,248,0.7)]'
                         : 'ring-white/10 opacity-55 group-hover:opacity-90'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* la grande finestra browser, sovrapposta al terzo inferiore dell'anello */}
        <div className="relative z-30 mx-auto -mt-[56px] w-full max-w-[860px] px-4 sm:-mt-[84px] sm:px-6">
          <div className="overflow-hidden rounded-2xl bg-[#0e1424] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.85)] ring-1 ring-white/10">
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

            <div className="relative aspect-[16/10] max-h-[28vh] w-full">
              {cur && <Shot key={cur.slug} p={cur} className="hero-shot-in absolute inset-0 h-full w-full" />}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/55 to-transparent p-3 sm:p-4">
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold text-white sm:text-[17px]" aria-live="polite">{cur?.name}</p>
                  <p className="truncate text-[12px] text-white/70">{cur?.loc}</p>
                </div>
                {cur?.url && (
                  <a href={cur.url} target="_blank" rel="noopener"
                    className="pointer-events-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[12.5px] font-medium text-[#0B1220] transition-transform duration-200 hover:-translate-y-0.5">
                    Visita il sito <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* frecce + contatore */}
          <div className="mx-auto mt-2 flex items-center justify-center gap-4 pb-3 sm:pb-4">
            <button type="button" aria-label="Progetto precedente" onClick={prev}
              className="grid h-8 w-8 place-items-center rounded-full text-white/70 ring-1 ring-white/15 transition-colors hover:bg-white/10 hover:text-white">
              <ChevronLeft size={16} />
            </button>
            <span className="font-mono text-[12px] tabular-nums text-white/55">
              {n ? String(active + 1).padStart(2, '0') : '00'} / {String(n).padStart(2, '0')}
            </span>
            <button type="button" aria-label="Progetto successivo" onClick={next}
              className="grid h-8 w-8 place-items-center rounded-full text-white/70 ring-1 ring-white/15 transition-colors hover:bg-white/10 hover:text-white">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
