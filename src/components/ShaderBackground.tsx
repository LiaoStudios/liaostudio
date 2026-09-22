import { Suspense, lazy, useEffect, useState } from 'react';
import { BRAND } from '../theme';

const ShaderStack = lazy(() => import('./ShaderStack'));

/**
 * Fondale di scorta: stesse tinte dello shader vero, ma mosse con CSS
 * puro invece che con un canvas — gira ovunque, incluso sulla maggior
 * parte dei telefoni, dove WebGPU non è ancora disponibile.
 */
function Fallback() {
  return (
    <>
      <div className="absolute inset-0 bg-[#EFEFEF]" />
      {/* lamelle di vetro satinato */}
      <div className="hero-lamelle absolute inset-0" />
      {/* riflessi iridescenti sui bordi delle lamelle */}
      <div className="hero-iride absolute inset-0" />
      {/* i due bagliori nei blu del marchio */}
      <div
        className="hero-bagliore absolute inset-0"
        style={{
          background:
            `radial-gradient(62% 52% at 24% 28%, ${BRAND.blue}1f, transparent 72%),` +
            `radial-gradient(52% 46% at 78% 66%, ${BRAND.navy}18, transparent 72%)`,
        }}
      />
    </>
  );
}

/**
 * Sfondo animato dell'hero.
 *
 * ChromaFlow è la parte che reagisce al puntatore: dipinge scie di luce che
 * seguono il mouse con inerzia, e i quattro colori direzionali usano i due blu
 * del logo, così il verso del movimento cambia la tinta. FlutedGlass le spezza
 * in lamelle di vetro rigato, Swirl fa da base, FilmGrain toglie il banding.
 *
 * Gira su WebGPU e pesa parecchio, quindi lo carichiamo solo dopo che la
 * pagina è pronta e solo dove può girare davvero. Nel frattempo — e su
 * Firefox, Safari datati o quando l'utente chiede meno animazioni — resta il
 * fondale CSS qui sopra, che ha le stesse tinte.
 */
export default function ShaderBackground() {
  const [useShader, setUseShader] = useState(false);

  useEffect(() => {
    let alive = true;

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const probe = async () => {
      try {
        const gpu = (navigator as Navigator & { gpu?: { requestAdapter(): Promise<unknown> } }).gpu;
        if (!gpu) return;
        const adapter = await gpu.requestAdapter();
        if (alive && adapter) setUseShader(true);
      } catch {
        /* niente shader: resta il fondale di scorta */
      }
    };

    // aspettiamo che il thread principale sia libero: prima il contenuto
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number })
      .requestIdleCallback;
    const id = idle ? idle(() => void probe()) : window.setTimeout(() => void probe(), 600);

    return () => {
      alive = false;
      if (!idle) clearTimeout(id);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden" aria-hidden="true">
      <Fallback />
      {useShader && (
        <Suspense fallback={null}>
          <div className="absolute inset-0">
            <ShaderStack />
          </div>
        </Suspense>
      )}
    </div>
  );
}
