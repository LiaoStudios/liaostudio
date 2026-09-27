import { useEffect, useRef } from 'react';

/**
 * Sfondo dell'hero in WebGL — la versione che gira DAPPERTUTTO.
 *
 * Lo shader "premium" (pacchetto `shaders`, ShaderStack) è WebGPU, e WebGPU
 * esiste solo in contesto sicuro (https o localhost): su un telefono aperto
 * via `http://192.168.x.x` il browser lo spegne, così restava lo sfondo CSS
 * piatto. WebGL invece:
 *   - è disponibile su ogni iPhone e Android, anche datati;
 *   - non chiede un contesto sicuro, quindi funziona pure sul server di rete;
 *   - è leggero (nessun pacchetto da scaricare).
 *
 * Il fragment shader ricostruisce lo stesso vetro argentato del desktop:
 * metallo liquido (noise con domain-warp), lamelle diagonali morbide di
 * vetro rigato, un velo iridescente e i due bagliori nei blu del marchio.
 * Tutto in lento movimento autonomo.
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uReduce;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p = uv;
  p.x *= uRes.x / uRes.y;

  // se l'utente ha chiesto "meno animazioni", quasi ferma
  float t = uTime * (0.05 * (1.0 - 0.9 * uReduce));

  // metallo liquido: noise deformato da altro noise
  vec2 q = vec2(fbm(p * 2.0 + vec2(0.0, t)), fbm(p * 2.0 + vec2(5.2, 1.3) - t));
  float base = fbm(p * 2.6 + q * 1.4 + vec2(t * 0.4, -t * 0.3));

  // lamelle diagonali di vetro (~31°), rifratte dal metallo
  float ang = 0.54;
  vec2 dir = vec2(cos(ang), sin(ang));
  float ridge = sin(dot(p, dir) * 24.0 + base * 6.0 + t * 2.0) * 0.5 + 0.5;
  float flute = smoothstep(0.14, 0.86, ridge);

  // base argentata, chiara e ariosa
  float lum = 0.87 + 0.11 * base + 0.07 * flute;
  vec3 col = vec3(lum);

  vec3 blue = vec3(0.0, 0.408, 0.973);   // #0068F8
  vec3 navy = vec3(0.0, 0.125, 0.314);   // #002050

  // un filo di blu del marchio nelle valli delle lamelle
  col = mix(col, mix(col, blue, 0.40), (1.0 - flute) * 0.16);

  // velo iridescente sui bordi delle lamelle
  float iri = base * 10.0 + ridge * 7.0 + t * 2.5;
  vec3 irid = 0.5 + 0.5 * cos(6.2831 * (vec3(0.0, 0.33, 0.66) + iri));
  col += flute * 0.05 * irid;

  // i due bagliori ampi, come sul desktop
  float g1 = smoothstep(0.66, 0.0, distance(uv, vec2(0.24, 0.72)));
  float g2 = smoothstep(0.62, 0.0, distance(uv, vec2(0.80, 0.32)));
  col = mix(col, blue, g1 * 0.05);
  col = mix(col, navy, g2 * 0.04);

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

export default function GlassShaderGL() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const gl = (canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' })
      || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return; // niente WebGL: resta il CSS sotto

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    // un unico triangolo che copre tutto lo schermo
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uReduce = gl.getUniformLocation(prog, 'uReduce');
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 1 : 0;
    gl.uniform1f(uReduce, reduce);

    const resize = () => {
      const d = Math.min(window.devicePixelRatio || 1, 1.5); // basta 1.5x sul telefono
      const w = Math.max(1, Math.round(canvas.clientWidth * d));
      const h = Math.max(1, Math.round(canvas.clientHeight * d));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let raf = 0;
    let attivo = true;
    const start = performance.now();
    const frame = () => {
      if (!attivo) return;
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    };
    frame();

    // a scheda nascosta si ferma, per non scaldare il telefono
    const onVis = () => {
      if (document.hidden) { attivo = false; cancelAnimationFrame(raf); }
      else if (!attivo) { attivo = true; frame(); }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      attivo = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}
