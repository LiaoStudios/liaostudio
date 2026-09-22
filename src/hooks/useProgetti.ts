import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { ProgettoRow, CategoriaRow } from '../lib/types';
import { VISIBLE, CATS as STATIC_CATS, type CatKey } from '../data/projects';

export interface UIProject {
  slug: string;
  name: string;
  cat: string;
  loc: string;
  blurb: string;
  tags: string[];
  url?: string;
  featured?: boolean;
}

/** I dati portati dal file statico, nella stessa forma della riga del database. */
const FALLBACK_PROJECTS: UIProject[] = VISIBLE.map((p) => ({
  slug: p.slug, name: p.name, cat: p.cat, loc: p.loc, blurb: p.blurb,
  tags: p.tags, url: p.url, featured: p.featured,
}));
const FALLBACK_CATS = STATIC_CATS.map((c) => ({ key: c.key as string, label: c.label }));

/**
 * Progetti del portfolio e settori.
 *
 * Il sito mostra subito i dati statici (nessuna attesa, nessuno spazio vuoto),
 * poi — se Supabase è configurato e risponde — li sostituisce con quelli del
 * database. Se manca la connessione, il database non è configurato, o la
 * richiesta fallisce, il sito resta comunque quello che ho scritto io: mai
 * una pagina vuota per un problema di rete.
 */
export function useProgetti() {
  const [projects, setProjects] = useState<UIProject[]>(FALLBACK_PROJECTS);
  const [cats, setCats] = useState(FALLBACK_CATS);

  useEffect(() => {
    if (!supabase) return;
    let alive = true;

    (async () => {
      const [{ data: p, error: pe }, { data: c, error: ce }] = await Promise.all([
        supabase.from('progetti').select('*').eq('nascosto', false).order('ordine'),
        supabase.from('categorie').select('*').order('ordine'),
      ]);
      if (!alive) return;
      if (!pe && p && p.length) {
        setProjects((p as ProgettoRow[]).map((r) => ({
          slug: r.slug, name: r.nome, cat: r.categoria, loc: r.luogo, blurb: r.descrizione,
          tags: r.tags ?? [], url: r.url ?? undefined, featured: r.in_evidenza,
        })));
      }
      if (!ce && c && c.length) {
        setCats((c as CategoriaRow[]).map((r) => ({ key: r.chiave, label: r.etichetta })));
      }
    })();

    return () => { alive = false; };
  }, []);

  return { projects, cats: cats as { key: CatKey; label: string }[] };
}
