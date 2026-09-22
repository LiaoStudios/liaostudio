import { useEffect, useRef } from 'react';
import { BRAND } from '../theme';
import { asset } from '../lib/asset';

const LOGO = asset('/brand/mark.png');

/**
 * Il marchio in filigrana dietro l'hero.
 *
 * Non è un pannello che compare sopra lo sfondo: sono due luci, alla stessa
 * "quota" dello sfondo, che si fondono con `mix-blend-mode` invece di
 * coprirlo con un colore piatto.
 *
 *  1. la filigrana ferma, quasi invisibile — il logo è sempre lì;
 *  2. un alone blu ampio e sfumato che segue il cursore ovunque tu vada,
 *     in `multiply`: scurisce e intona lo sfondo, non lo nasconde;
 *  3. la sagoma del logo, in bianco, in `screen`: si accende solo dove il
 *     cursore la sfiora. Bianco su un alone blu crea il contrasto che fa
 *     risaltare la forma — è quello, non un riempimento pieno, a "rivelarla".
 *
 * La visibilità (mostra/nascondi) è pura CSS (`group-hover`, sul contenitore
 * dell'hero): affidabile in ogni browser, senza dover inseguire eventi di
 * enter/leave via JavaScript. Solo la posizione — che deve seguire il
 * puntatore pixel per pixel — viaggia su variabili CSS aggiornate in un
 * `requestAnimationFrame`, così il movimento del mouse non passa mai da React.
 */
export default function LogoWatermark() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    // su touch non c'è un cursore da inseguire: la filigrana resta ferma
    if (!window.matchMedia?.('(hover: hover)').matches) return;

    let x = 0, y = 0, queued = false, raf = 0;
    const paint = () => {
      queued = false;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${x - r.left}px`);
      el.style.setProperty('--my', `${y - r.top}px`);
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      if (!queued) { queued = true; raf = requestAnimationFrame(paint); }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const size = 'w-[min(56vw,660px)]';
  const ambientSpot =
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
      {/* 1 — filigrana ferma, quasi invisibile */}
      <img src={LOGO} alt="" draggable={false} className={`${size} select-none opacity-[0.045]`} />

      {/* 2 — alone blu ambientale: si fonde con lo sfondo, non lo copre */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-[0.85]"
        style={{
          backgroundColor: BRAND.blue,
          mixBlendMode: 'multiply',
          filter: 'blur(38px)',
          WebkitMaskImage: ambientSpot,
          maskImage: ambientSpot,
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        }}
      />

      {/* 3 — la sagoma del logo, bianca: risalta per contrasto sull'alone blu */}
      <div
        className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
        style={{
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
