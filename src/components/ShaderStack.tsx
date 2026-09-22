import { Shader, Swirl, ChromaFlow, FlutedGlass, FilmGrain } from 'shaders/react';
import { BRAND } from '../theme';

/**
 * Lo stack di shader vero e proprio. Sta in un file separato perché viene
 * importato in differita: pesa quanto tutto il resto del sito messo insieme,
 * e serve solo dove c'è WebGPU.
 */
export default function ShaderStack() {
  return (
    <Shader style={{ width: '100%', height: '100%' }}>
      <Swirl colorA="#ffffff" colorB="#B7D0F6" detail={1.7} speed={0.6} blend={58} />
      <ChromaFlow
        baseColor="#ffffff"
        upColor={BRAND.blue}
        downColor={BRAND.navy}
        leftColor={BRAND.blue}
        rightColor={BRAND.blueDark}
        intensity={3.4}
        momentum={13}
        radius={3.5}
      />
      <FlutedGlass
        shape="rounded"
        angle={31}
        frequency={8}
        softness={1}
        speed={0.15}
        refraction={3.2}
        aberration={0.61}
        lightAngle={-90}
        highlight={0.1}
        highlightSoftness={0}
      />
      <FilmGrain strength={0.05} />
    </Shader>
  );
}
