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
 * Il fragment shader ricostruisce il vero look del desktop (FlutedGlass):
 * lamelle diagonali NETTE — non un noise fluido — ciascuna con un profilo a
 * lente (chiara al centro, in ombra ai bordi) e, esattamente sul bordo tra
 * una lamella e l'altra, una sottile aberrazione cromatica a prisma (rosso,
 * verde, blu che si separano). Base chiara, quasi crema. Tutto scorre
 * lentissimo in autonomia.
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

const float PI = 3.14159265;

// una lamella: 0 al centro (rilievo), 1 ai due bordi (valle)
float laneProfile(float d){
  float lane = fract(d) - 0.5;   // -0.5..0.5 dentro la lamella
  return abs(lane) * 2.0;        // 0 al centro, 1 ai bordi
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p = uv - 0.5;
  p.x *= uRes.x / uRes.y;

  // se l'utente ha chiesto "meno animazioni", quasi ferma
  float t = uTime * (0.06 * (1.0 - 0.92 * uReduce));

  float ang = radians(31.0);
  vec2 dir = vec2(cos(ang), sin(ang));
  float freq = 3.6;

  float d = dot(p, dir) * freq + t * 0.8;

  float edgeDist = laneProfile(d);                    // 0 centro → 1 bordo
  float lens = 1.0 - smoothstep(0.0, 1.0, edgeDist);   // 1 centro (chiaro) → 0 bordo

  // luce che scivola lentamente lungo le lamelle
  float sweep = 0.5 + 0.5 * sin(d * 0.35 + t * 0.6);

  // base: più contrasto fra centro chiaro e bordo in ombra, come il vetro vero
  vec3 base = mix(vec3(0.78, 0.82, 0.91), vec3(0.995, 0.995, 1.0), lens);
  base += 0.06 * sweep * lens;

  // riflesso a prisma: una linea sottile e netta proprio sul bordo, non
  // un'area colorata diffusa
  float band = smoothstep(0.86, 0.965, edgeDist) * (1.0 - smoothstep(0.965, 1.0, edgeDist));
  float phase = d * 0.9 + t * 1.6;
  vec3 rainbow = 0.5 + 0.5 * cos(6.2831 * (vec3(0.0, 0.15, 0.5) + phase * 0.18));

  vec3 col = base;
  col += band * rainbow * 0.55;

  // filo di blu del marchio proprio sul bordo più profondo della valle
  vec3 blue = vec3(0.0, 0.408, 0.973);
  float valley = smoothstep(0.85, 1.0, edgeDist);
  col = mix(col, blue, valley * 0.16);

  // i due bagliori ampi nei blu del marchio, come sul desktop
  vec3 navy = vec3(0.0, 0.125, 0.314);
  float g1 = smoothstep(0.62, 0.0, distance(uv, vec2(0.22, 0.74)));
  float g2 = smoothstep(0.58, 0.0, distance(uv, vec2(0.82, 0.28)));
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
