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

/** true sotto i 760px: stesso pannello curvo, solo più piccolo. */
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
function Shot({ p, className = '', mobile = false }: { p: UIProject; className?: string; mobile?: boolean }) {
  const [ok, setOk] = useState(true);
  const iniz = p.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return (
    <div className={`relative overflow-hidden bg-[#0e1424] ${className}`}>
      {ok ? (
        <img
          src={asset(`/work/${p.slug}${mobile ? '-m' : ''}.jpg`)}
          alt={`Anteprima ${mobile ? 'mobile ' : ''}del sito realizzato per ${p.name}`}
          onError={() => setOk(false)}
          className="block h-full w-full object-cover object-top"
        />
      ) : (
        <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#002050] to-[#0068F8]">
          <span className="text-[24px] font-semibold tracking-tight text-white/90">{iniz}</span>
        </div>
      )}
    </div>
  );
}

/*
 * ---- Il pannello curvo ----
 *
 * Le card stanno all'INTERNO di un cilindro e la "camera" è al suo centro:
 * per questo sono concave, come uno schermo che ti avvolge. Una card ad
 * angolo a viene messa in
 *     x = R·sin(a)      z = R·(1 − cos a)   (verso di te, quindi i lati si avvicinano)
 * e ruotata di −a attorno a Y, così guarda esattamente la camera.
 * La camera sta più lontana del centro del cilindro (PERSPECTIVE > R): così
 * le card laterali, ruotate verso il centro, si vedono di scorcio e il
 * pannello si legge come un arco che ti avvolge.
 */
/* Le card mostrano la versione MOBILE dei siti (screenshot 390×844, proporzione 0,462):
   rettangoli allungati come un telefono. La finestra sotto mostra la versione desktop. */
const DESK = { w: 176, h: 380, radius: 900, persp: 960, cull: 68, ringH: 430 };
const MOB  = { w: 112, h: 242, radius: 470, persp: 540, cull: 72, ringH: 300 };
const FADE = 10;                 // gradi finali in cui la card sfuma invece di sparire di colpo
const SPIN = 5.2;                // gradi al secondo, lenta

export default function Hero() {
  const { projects, cats } = useProgetti();
  const catLabel = (k: string) => cats.find((c) => c.key === k)?.label ?? k;
  const reduce = usePrefersReducedMotion();
  const narrow = useNarrow();
  const G = narrow ? MOB : DESK;

  const n = projects.length;
  const step = n ? 360 / n : 0;

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const activeRef = useRef(0);
  activeRef.current = active;

  const setActiveSafe = (i: number) => { if (n) setActive(((i % n) + n) % n); };

  /* ---------- PANNELLO CURVO ---------- */
  const cardEls = useRef<(HTMLButtonElement | null)[]>([]);
  const phaseRef = useRef(0);                    // rotazione corrente (gradi)
  const targetRef = useRef<number | null>(null); // meta quando clicchi/freccia
  const pausedRef = useRef(false);
  pausedRef.current = paused;
  const reduceRef = useRef(false);
  reduceRef.current = reduce;

  // porta la card i davanti, per il percorso più corto
  const focusCard = (i: number) => {
    if (!n) return;
    const cur = phaseRef.current;
    let tgt = -i * step;
    tgt = cur + ((((tgt - cur) % 360) + 540) % 360) - 180;
    targetRef.current = tgt;
  };

  useEffect(() => {
    if (!n) return;
    let raf = 0;
    let last = performance.now();

    const loop = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.1);
      last = t;

      const tgt = targetRef.current;
      if (tgt !== null) {
        const next = phaseRef.current + (tgt - phaseRef.current) * Math.min(1, dt * 7);
        if (Math.abs(tgt - next) < 0.05) { phaseRef.current = tgt; targetRef.current = null; }
        else phaseRef.current = next;
      } else if (!pausedRef.current && !reduceRef.current) {
        phaseRef.current -= SPIN * dt; // rotazione lenta e continua, mai azzerata
      }

      const phase = phaseRef.current;
      for (let i = 0; i < n; i++) {
        const el = cardEls.current[i];
        if (!el) continue;
        let a = i * step + phase;
        a = ((a % 360) + 540) % 360 - 180; // angolo con segno, -180..180
        const abs = Math.abs(a);
        if (abs > G.cull) { el.style.visibility = 'hidden'; continue; }
        el.style.visibility = 'visible';
        const r = (a * Math.PI) / 180;
        const c = Math.cos(r);
        el.style.transform =
          `translate3d(${(G.radius * Math.sin(r)).toFixed(2)}px,0,${(G.radius * (1 - c)).toFixed(2)}px) rotateY(${(-a).toFixed(2)}deg)`;
        // ai lati leggermente più scure, e in dissolvenza verso il bordo del taglio
        el.style.filter = `brightness(${(0.45 + 0.55 * c).toFixed(3)})`;
        el.style.opacity = String(Math.min(1, (G.cull - abs) / FADE).toFixed(3));

      }

      // la card più vicina al fronte guida la finestra
      const front = ((Math.round(-phase / step) % n) + n) % n;
      if (front !== activeRef.current) setActive(front);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onVis = () => { last = performance.now(); };
    document.addEventListener('visibilitychange', onVis);
    return () => { cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', onVis); };
  }, [G, n, step]);

  /* trascinamento orizzontale (dito o mouse): ruota il pannello */
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const onDown = (e: React.PointerEvent) => { drag.current = { x: e.clientX, moved: false }; };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || (e.pointerType === 'mouse' && e.buttons === 0)) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) < 6) return;
    d.moved = true; d.x = e.clientX;
    targetRef.current = null;
    phaseRef.current += (dx / G.radius) * (180 / Math.PI);
  };
  const onUp = () => { window.setTimeout(() => { drag.current = null; }, 0); };

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

  const prev = () => { const i = (active - 1 + n) % n; setActiveSafe(i); focusCard(i); };
  const next = () => { const i = (active + 1) % n; setActiveSafe(i); focusCard(i); };

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#0B1220] text-white">
      {/* sfondo: profondità navy + stelle */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0" style={{
          background:
            'radial-gradient(60% 55% at 22% 16%, rgba(0,104,248,0.18), transparent 60%),' +
            'radial-gradient(55% 50% at 85% 26%, rgba(0,32,80,0.55), transparent 65%),' +
            'radial-gradient(90% 65% at 50% 118%, rgba(0,104,248,0.22), transparent 60%)',
        }} />
        {stars.map((st, i) => (
          <span key={i} className="hero-star absolute rounded-full bg-white" style={{
            top: `${st.top}%`, left: `${st.left}%`, width: st.s, height: st.s,
            ['--o' as string]: st.o, ['--tw' as string]: `${st.tw}s`, ['--dl' as string]: `${st.dl}s`, opacity: st.o,
          }} />
        ))}
      </div>

      <Navbar />

      {/* copy centrata, come nel riferimento */}
      <div className="relative z-20 mx-auto flex w-full max-w-[920px] flex-col items-center px-5 pb-6 pt-8 text-center sm:px-8 sm:pt-12">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-1.5 text-[12.5px] text-white/75 backdrop-blur-sm">
          <Sparkles size={14} className="text-[#4D9BFF]" />
          {n} siti realizzati, tutti online
        </div>
        <h1 className="font-semibold leading-[1.02] tracking-[-0.035em] text-white" style={{ fontSize: 'clamp(2.1rem,5.4vw,4.3rem)' }}>
          Costruiamo siti <span className="text-[#4D9BFF]">che portano clienti.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-[52ch] text-[14px] leading-[1.55] text-white/60 sm:text-[16px]">
          Scegli un lavoro dal pannello: la versione mobile è nelle card, quella desktop si apre qui sotto, intera.
        </p>
        <div className="mt-6">
          <RollButton href="#contatti" tone="blue">Iniziamo il tuo progetto</RollButton>
        </div>
      </div>

      {/* il pannello curvo (desktop) o la striscia touch (mobile) */}
      <div
        className="relative z-10 shrink-0 select-none"
        style={{ height: G.ringH, perspective: G.persp, perspectiveOrigin: '50% 30%', touchAction: 'pan-y' }}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onClickCapture={(e) => { if (drag.current?.moved) { e.stopPropagation(); e.preventDefault(); } }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
        }}
      >
        <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
          <div className="absolute left-1/2" style={{ top: '50%', transformStyle: 'preserve-3d', width: 0, height: 0 }}>
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
                  width: G.w, height: G.h, left: -G.w / 2, top: -G.h / 2,
                  backfaceVisibility: 'hidden', willChange: 'transform',
                  boxShadow: '0 30px 60px rgba(0,0,0,.6), 0 4px 12px rgba(0,0,0,.45)',
                }}
              >
                <Shot p={p} mobile className="h-full w-full rounded-2xl" />
                {i === active && (
                  <span className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-[#4D9BFF]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* la finestra browser: grande, centrata, sovrapposta al pannello; mostra lo screenshot INTERO */}
      <div className="relative z-30 mx-auto w-full px-4 pb-10 -mt-[70px] md:-mt-[150px] md:px-8" style={{ maxWidth: 1180 }}>
        <div className="overflow-hidden rounded-2xl bg-[#0e1424]/85 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/12 backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-3.5 py-2.5">
            <span className="flex w-16 gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            </span>
            <div className="mx-auto flex min-w-0 max-w-[460px] flex-1 items-center justify-center gap-1.5 rounded-md bg-black/25 px-3 py-1 text-[12px] text-white/65">
              <Lock size={11} className="shrink-0 text-white/40" />
              <span className="truncate">{host ?? cur?.name ?? 'anteprima del progetto'}</span>
            </div>
            <span className="flex w-16 justify-end">
              {cur?.url && (
                <a href={cur.url} target="_blank" rel="noopener"
                  className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-[11.5px] font-medium text-[#0B1220] transition-transform duration-200 hover:-translate-y-px">
                  Visita <ArrowUpRight size={12} />
                </a>
              )}
            </span>
          </div>
          {/* 16:10 = proporzione esatta degli screenshot: nessuna parte tagliata */}
          <div className="relative aspect-[16/10] w-full">
            {cur && <Shot key={cur.slug} p={cur} className="hero-shot-in absolute inset-0 h-full w-full" />}
          </div>
        </div>

        <div className="mx-auto mt-4 flex max-w-[520px] items-center justify-between gap-3">
          <button type="button" aria-label="Progetto precedente" onClick={prev}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white/70 ring-1 ring-white/15 transition-colors hover:bg-white/10 hover:text-white">
            <ChevronLeft size={16} />
          </button>
          <div className="min-w-0 text-center">
            <p className="truncate text-[15px] font-semibold text-white" aria-live="polite">{cur?.name}</p>
            <p className="truncate font-mono text-[11.5px] tabular-nums text-white/50">
              {n ? String(active + 1).padStart(2, '0') : '00'} / {String(n).padStart(2, '0')}
              {cur ? ` · ${catLabel(cur.cat)} · ${cur.loc}` : ''}
            </p>
          </div>
          <button type="button" aria-label="Progetto successivo" onClick={next}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white/70 ring-1 ring-white/15 transition-colors hover:bg-white/10 hover:text-white">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
