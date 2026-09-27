import { Suspense, lazy, useEffect, useState } from 'react';
import { BRAND } from '../theme';
import GlassShaderGL from './GlassShaderGL';

const ShaderStack = lazy(() => import('./ShaderStack'));

type Modo = 'css' | 'webgl' | 'webgpu';

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
 * Sfondo animato dell'hero, scelto in tre livelli a seconda di cosa il
 * dispositivo può fare:
 *
 *   webgpu — lo shader "premium" (pacchetto `shaders`, ShaderStack): vetro
 *            rigato con scie che seguono il mouse. Solo dove c'è WebGPU,
 *            cioè desktop moderni (e iPhone recenti in https). Pesa ~720KB.
 *   webgl  — GlassShaderGL: lo STESSO vetro argentato animato, ma in WebGL.
 *            Gira su ogni telefono e anche su http, dove WebGPU è spento.
 *            È questo che ora il telefono vede al posto delle righe piatte.
 *   css    — il fondale a gradienti qui sotto: ultima rete di sicurezza per
 *            i rari browser senza WebGL, o con "meno animazioni".
 *
 * WebGPU esiste solo in contesto sicuro: se `navigator.gpu` non c'è (telefono
 * su http, browser datati) saltiamo dritti a WebGL, senza nemmeno provarci.
 */
export default function ShaderBackground() {
  // partiamo già da WebGL, così sul telefono non compare nemmeno per un attimo
  // lo sfondo CSS a righe prima che l'effetto scelga il livello giusto
  const [modo, setModo] = useState<Modo>(() => {
    if (typeof window === 'undefined') return 'css';
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return 'css';
    return 'webgl';
  });

  useEffect(() => {
    let alive = true;

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setModo('css'); return; }

    const gpu = (navigator as Navigator & { gpu?: { requestAdapter(): Promise<unknown> } }).gpu;
    if (!gpu) { setModo('webgl'); return; } // niente WebGPU qui → subito WebGL

    // c'è l'oggetto gpu: mostriamo WebGL intanto, e passiamo a WebGPU solo se
    // un adapter reale risponde (così non resta mai lo sfondo piatto)
    setModo('webgl');
    const probe = async () => {
      try {
        const adapter = await gpu.requestAdapter();
        if (alive && adapter) setModo('webgpu');
      } catch { /* resta WebGL */ }
    };
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number })
      .requestIdleCallback;
    const id = idle ? idle(() => void probe()) : window.setTimeout(() => void probe(), 300);

    return () => {
      alive = false;
      if (!idle) clearTimeout(id);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden" aria-hidden="true">
      <Fallback />
      {modo === 'webgl' && <GlassShaderGL />}
      {modo === 'webgpu' && (
        <Suspense fallback={null}>
          <div className="absolute inset-0">
            <ShaderStack />
          </div>
        </Suspense>
      )}
    </div>
  );
}
