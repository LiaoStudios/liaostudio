import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { PianoRow } from '../lib/types';

export interface UIPiano {
  nome: string;
  sottotitolo: string;
  prezzo: string;
  unita: string;
  nota: string | null;
  voci: string[];
  in_evidenza: boolean;
}

/**
 * I tre pacchetti di prezzo. Stesso principio di `useProgetti`: parte dai
 * valori scritti nel componente (`initial`, passati da `Pricing.tsx`) e li
 * sostituisce con quelli del database appena arrivano.
 */
export function usePiani(initial: UIPiano[]) {
  const [piani, setPiani] = useState<UIPiano[]>(initial);

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    (async () => {
      const { data, error } = await supabase.from('piani').select('*').order('ordine');
      if (!alive || error || !data || !data.length) return;
      setPiani((data as PianoRow[]).map((r) => ({
        nome: r.nome, sottotitolo: r.sottotitolo, prezzo: r.prezzo, unita: r.unita,
        nota: r.nota, voci: r.voci ?? [], in_evidenza: r.in_evidenza,
      })));
    })();
    return () => { alive = false; };
  }, []);

  return piani;
}
