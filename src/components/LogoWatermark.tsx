import { useEffect, useRef, useState } from 'react';
import { BRAND } from '../theme';
import { asset } from '../lib/asset';

const LOGO = asset('/brand/mark.png');

/** Un mouse vero, non un dito: solo qui ha senso inseguire il puntatore. */
const POINTER_QUERY = '(hover: hover) and (pointer: fine)';

/**
 * Il marchio in filigrana dietro l'hero.
 *
 * Non è un pannello sopra lo sfondo: sono due luci, alla stessa "quota"
 * dello sfondo, che si fondono con `mix-blend-mode` invece di coprirlo.
 *
 *  1. la filigrana ferma, quasi invisibile — il logo è sempre lì;
 *  2. un alone blu ampio e sfumato, in `multiply`: intona lo sfondo;
 *  3. la sagoma del logo in bianco, in `screen`: dove l'alone la sfiora, il
 *     bianco sul blu crea il contrasto che rivela la forma.
 *
 * **Con un mouse**, i livelli 2 e 3 seguono il puntatore (`pointermove`) e si
 * spengono quando esce dalla finestra — così com'è sempre stato.
 *
 * **Su touch** non c'è un mouse da inseguire, e agganciare `pointerdown` /
 * `pointermove` all'intera finestra per simularne uno disturbava lo scroll e
 * i gesti normali della pagina (il browser iniziava a "trascinare" invece di
 * scorrere). Lì l'effetto resta comunque identico — stesso alone, stessa
 * sagoma bianca a contrasto — ma il movimento è un'animazione CSS automatica
 * e continua: nessun listener, nessuna interferenza col tocco.
 */
export default function LogoWatermark() {
  const root = useRef<HTMLDivElement>(null);
  const [conMouse, setConMouse] = useState(false);
  const [acceso, setAcceso] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.(POINTER_QUERY);
    if (!mq) return;
    const sync = () => setConMouse(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el || !conMouse) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    let x = 0, y = 0, inCoda = false, raf = 0;
    const disegna = () => {
      inCoda = false;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${((x - r.left) / r.width) * 100}%`);
      el.style.setProperty('--my', `${((y - r.top) / r.height) * 100}%`);
    };
    const muovi = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      setAcceso(true);
      if (!inCoda) { inCoda = true; raf = requestAnimationFrame(disegna); }
    };
    const spegni = () => setAcceso(false);

    window.addEventListener('pointermove', muovi, { passive: true });
    document.addEventListener('pointerleave', spegni);
    return () => {
      window.removeEventListener('pointermove', muovi);
      document.removeEventListener('pointerleave', spegni);
      cancelAnimationFrame(raf);
    };
  }, [conMouse]);

  const size = 'w-[min(56vw,660px)]';
  const aloneSpot =
    'radial-gradient(circle 320px at var(--mx,50%) var(--my,42%),' +
    ' #000 0%, rgba(0,0,0,.72) 44%, transparent 80%)';
  const logoSpot =
    'radial-gradient(circle 210px at var(--mx,50%) var(--my,42%),' +
    ' #000 0%, rgba(0,0,0,.78) 48%, transparent 82%)';

  // col mouse: acceso solo quando si muove. Su touch: sempre acceso, e a
  // muoversi è l'animazione automatica invece del dito.
  const visibile = conMouse ? acceso : true;
  const classeAuto = conMouse ? '' : ' hero-watermark-auto';

  return (
    <div
      ref={root}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-[15] grid place-items-center overflow-hidden${classeAuto}`}
    >
      {/* 1 — filigrana ferma, sempre presente */}
      <img src={LOGO} alt="" draggable={false} className={`${size} select-none opacity-[0.045]`} />

      {/* 2 — alone blu: si fonde con lo sfondo, non lo copre */}
      <div
        className="absolute inset-0 transition-opacity duration-500 ease-out"
        style={{
          opacity: visibile ? 0.85 : 0,
          backgroundColor: BRAND.blue,
          mixBlendMode: 'multiply',
          filter: 'blur(38px)',
          WebkitMaskImage: aloneSpot,
          maskImage: aloneSpot,
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        }}
      />

      {/* 3 — la sagoma del logo, bianca: risalta per contrasto sull'alone */}
      <div
        className="absolute inset-0 grid place-items-center transition-opacity duration-500 ease-out"
        style={{
          opacity: visibile ? 1 : 0,
          WebkitMaskImage: logoSpot,
          maskImage: logoSpot,
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        }}
      >
        <div
          className={`${size} aspect-square`}
          style={{
            backgroundColor: '#FFFFFF',
            mixBlendMode: 'screen',
            WebkitMaskImage: `url(${LOGO})`,
            maskImage: `url(${LOGO})`,
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
          }}
        />
      </div>
    </div>
  );
}
