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
 * **Con un mouse** (desktop), i livelli 2 e 3 seguono il puntatore e si
 * accendono mentre lo muovi; poco dopo che il mouse si ferma svaniscono, così
 * non resta un alone blu fisso incollato dove hai lasciato il cursore.
 *
 * **Su touch** (telefono, tablet) l'effetto non c'è proprio: i livelli 2 e 3
 * non vengono nemmeno creati. Non c'è un puntatore da seguire, e simularne uno
 * lasciava un alone blu perennemente acceso in mezzo all'hero — quello che si
 * vedeva sul telefono. Lì resta solo la filigrana ferma, quasi invisibile.
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

    let x = 0, y = 0, inCoda = false, raf = 0, spegniDopo = 0;
    const disegna = () => {
      inCoda = false;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${((x - r.left) / r.width) * 100}%`);
      el.style.setProperty('--my', `${((y - r.top) / r.height) * 100}%`);
    };
    const muovi = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      setAcceso(true);
      // fermato il mouse ~1s, l'alone svanisce: niente blob blu piantato lì
      window.clearTimeout(spegniDopo);
      spegniDopo = window.setTimeout(() => setAcceso(false), 1000);
      if (!inCoda) { inCoda = true; raf = requestAnimationFrame(disegna); }
    };
    const spegni = () => { window.clearTimeout(spegniDopo); setAcceso(false); };

    window.addEventListener('pointermove', muovi, { passive: true });
    document.addEventListener('pointerleave', spegni);
    return () => {
      window.removeEventListener('pointermove', muovi);
      document.removeEventListener('pointerleave', spegni);
      window.clearTimeout(spegniDopo);
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

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[15] grid place-items-center overflow-hidden"
    >
      {/* 1 — filigrana ferma, sempre presente (anche su telefono) */}
      <img src={LOGO} alt="" draggable={false} className={`${size} select-none opacity-[0.045]`} />

      {/* 2 e 3 — l'alone che segue il mouse: SOLO col mouse. Su touch niente. */}
      {conMouse && (
        <>
          {/* 2 — alone blu: si fonde con lo sfondo, non lo copre */}
          <div
            className="absolute inset-0 transition-opacity duration-700 ease-out"
            style={{
              opacity: acceso ? 0.85 : 0,
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
            className="absolute inset-0 grid place-items-center transition-opacity duration-700 ease-out"
            style={{
              opacity: acceso ? 1 : 0,
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
        </>
      )}
    </div>
  );
}
