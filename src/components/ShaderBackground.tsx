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
      <div
        className="hero-fallback-stripes absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            `repeating-linear-gradient(121deg, #ffffff 0 34px, ${BRAND.blueSoft} 34px 52px, #ffffff 52px 86px)`,
          backgroundSize: '300% 300%',
        }}
      />
      <div
        className="hero-fallback-glow absolute inset-0"
        style={{
          background:
            `radial-gradient(60% 50% at 25% 30%, ${BRAND.blue}22, transparent 70%),` +
            `radial-gradient(50% 45% at 78% 65%, ${BRAND.navy}1c, transparent 70%)`,
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
