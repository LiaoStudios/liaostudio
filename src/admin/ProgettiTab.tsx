import { useEffect, useState } from 'react';
import { Eye, EyeOff, Loader2, Plus, Save, Star, Trash2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { CategoriaRow, ProgettoRow } from '../lib/types';
import { BTN_GHOST, BTN_PRIMARY, CARD, INPUT, LABEL, MUTED } from './adminTheme';

const VUOTO = (ordine: number): ProgettoRow => ({
  slug: '', nome: '', categoria: '', luogo: '', descrizione: '',
  tags: [], url: null, in_evidenza: false, nascosto: false, ordine,
});

const slugifica = (s: string) =>
  s.toLowerCase().trim()
    .replace(/[àáâä]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i')
    .replace(/[òóôö]/g, 'o').replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function Campi({
  draft, setDraft, categorie, nuovo,
}: { draft: ProgettoRow; setDraft: (p: ProgettoRow) => void; categorie: CategoriaRow[]; nuovo?: boolean }) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={LABEL}>Nome dell'attività</label>
          <input className={INPUT} value={draft.nome}
            onChange={(e) => setDraft({ ...draft, nome: e.target.value,
              ...(nuovo ? { slug: slugifica(e.target.value) } : {}) })} placeholder="Es. Pizzeria da Mario" />
        </div>
        <div>
          <label className={LABEL}>Settore</label>
          <select className={INPUT} value={draft.categoria}
            onChange={(e) => setDraft({ ...draft, categoria: e.target.value })}>
            <option value="" disabled>Scegli un settore…</option>
            {categorie.map((c) => <option key={c.chiave} value={c.chiave}>{c.etichetta}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className={LABEL}>Luogo</label>
          <input className={INPUT} value={draft.luogo} placeholder="Es. Castel Maggiore"
            onChange={(e) => setDraft({ ...draft, luogo: e.target.value })} />
        </div>
        <div>
          <label className={LABEL}>Link al sito online (facoltativo)</label>
          <input className={INPUT} value={draft.url ?? ''} placeholder="https://…"
            onChange={(e) => setDraft({ ...draft, url: e.target.value })} />
        </div>
      </div>

      <div className="mt-3">
        <label className={LABEL}>Descrizione</label>
        <textarea className={INPUT} rows={2} value={draft.descrizione}
          placeholder="Una riga che spiega cosa risolve il sito"
          onChange={(e) => setDraft({ ...draft, descrizione: e.target.value })} />
      </div>

      <div className="mt-3">
        <label className={LABEL}>Etichette (separate da virgola)</label>
        <input className={INPUT} value={draft.tags.join(', ')} placeholder="Es. Menu digitale, Ordini online"
          onChange={(e) => setDraft({ ...draft, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} />
      </div>

      {nuovo && (
        <div className="mt-3">
          <label className={LABEL}>Slug (l'indirizzo del progetto — generato dal nome, modificabile)</label>
          <input className={`${INPUT} font-mono`} value={draft.slug}
            onChange={(e) => setDraft({ ...draft, slug: slugifica(e.target.value) })} />
        </div>
      )}
    </>
  );
}

function Row({
  p, categorie, onSaved, onDeleted,
}: { p: ProgettoRow; categorie: CategoriaRow[]; onSaved: (p: ProgettoRow) => void; onDeleted: (slug: string) => void }) {
  const [draft, setDraft] = useState(p);
  const [saving, setSaving] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(p);

  const salva = async () => {
    if (!supabase) return;
    setSaving(true);
    const { error } = await supabase.from('progetti').update({
      nome: draft.nome, categoria: draft.categoria, luogo: draft.luogo, descrizione: draft.descrizione,
      tags: draft.tags, url: draft.url || null, in_evidenza: draft.in_evidenza, nascosto: draft.nascosto,
    }).eq('slug', p.slug);
    setSaving(false);
    if (error) window.alert('Non sono riuscito a salvare: ' + error.message);
    else onSaved(draft);
  };

  const elimina = async () => {
    if (!supabase) return;
    if (!window.confirm(`Eliminare "${p.nome}" dal portfolio? Non si può annullare — le sue foto restano nel sito ma non saranno più collegate a nessun progetto.`)) return;
    setEliminando(true);
    const { error } = await supabase.from('progetti').delete().eq('slug', p.slug);
    setEliminando(false);
    if (error) window.alert('Non sono riuscito a eliminare: ' + error.message);
    else onDeleted(p.slug);
  };

  return (
    <div className={`${CARD} p-4 ${draft.nascosto ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <input className={`${INPUT} !py-1.5 text-[15px] font-medium`} value={draft.nome}
          onChange={(e) => setDraft({ ...draft, nome: e.target.value })} />
        <div className="flex shrink-0 gap-1.5">
          <button type="button" title={draft.in_evidenza ? 'Tolto dai lavori in evidenza' : 'Metti tra i lavori in evidenza'}
            onClick={() => setDraft({ ...draft, in_evidenza: !draft.in_evidenza })}
            className={`grid h-8 w-8 place-items-center rounded-lg border transition-colors ${
              draft.in_evidenza
                ? 'border-amber-300 bg-amber-50 text-amber-500 dark:border-amber-400/30 dark:bg-amber-400/10'
                : 'border-[#e5e7eb] text-[#94a3b8] hover:border-[#cbd5e1] dark:border-[#232833]'}`}>
            <Star size={14} fill={draft.in_evidenza ? 'currentColor' : 'none'} />
          </button>
          <button type="button" title={draft.nascosto ? 'Nascosto dal sito — clicca per mostrarlo' : 'Visibile — clicca per nasconderlo'}
            onClick={() => setDraft({ ...draft, nascosto: !draft.nascosto })}
            className={`grid h-8 w-8 place-items-center rounded-lg border transition-colors ${
              draft.nascosto
                ? 'border-[#e5e7eb] bg-[#f6f7f9] text-[#94a3b8] dark:border-[#232833] dark:bg-[#0b0e14]'
                : 'border-[#0068F8]/30 bg-[#eff4ff] text-[#0068F8] dark:bg-[#0068F8]/10'}`}>
            {draft.nascosto ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button type="button" title="Elimina definitivamente" onClick={elimina} disabled={eliminando}
            className="grid h-8 w-8 place-items-center rounded-lg border border-[#e5e7eb] text-[#dc2626] transition-colors hover:border-[#dc2626]/40 hover:bg-[#fef2f2] disabled:opacity-60 dark:border-[#232833]">
            {eliminando ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          </button>
        </div>
      </div>

      <div className="mt-3">
        <Campi draft={draft} setDraft={setDraft} categorie={categorie} />
      </div>

      {dirty && (
        <div className="mt-3 flex justify-end">
          <button type="button" onClick={salva} disabled={saving} className={BTN_PRIMARY}>
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            Salva
          </button>
        </div>
      )}
    </div>
  );
}

function NuovoProgetto({
  categorie, prossimoOrdine, onCreato, onAnnulla,
}: { categorie: CategoriaRow[]; prossimoOrdine: number; onCreato: (p: ProgettoRow) => void; onAnnulla: () => void }) {
  const [draft, setDraft] = useState<ProgettoRow>(VUOTO(prossimoOrdine));
  const [creando, setCreando] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);

  const crea = async () => {
    if (!supabase) return;
    if (!draft.nome.trim()) { setErrore('Il nome è obbligatorio.'); return; }
    if (!draft.categoria) { setErrore('Scegli un settore.'); return; }
    if (!draft.slug.trim()) { setErrore('Lo slug è obbligatorio.'); return; }
    setCreando(true); setErrore(null);
    const { error } = await supabase.from('progetti').insert({
      slug: draft.slug, nome: draft.nome, categoria: draft.categoria, luogo: draft.luogo,
      descrizione: draft.descrizione, tags: draft.tags, url: draft.url || null,
      in_evidenza: draft.in_evidenza, nascosto: draft.nascosto, ordine: draft.ordine,
    });
    setCreando(false);
    if (error) {
      setErrore(error.code === '23505' ? 'Esiste già un progetto con questo slug — cambialo.' : error.message);
      return;
    }
    onCreato(draft);
  };

  return (
    <div className={`${CARD} border-[#0068F8]/30 p-4 dark:border-[#0068F8]/30`}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-[#0f172a] dark:text-[#e5e9f0]">Nuovo progetto</h3>
        <button type="button" onClick={onAnnulla} aria-label="Annulla"
          className="grid h-7 w-7 place-items-center rounded-lg text-[#94a3b8] hover:bg-[#f6f7f9] dark:hover:bg-[#0b0e14]">
          <X size={15} />
        </button>
      </div>

      <Campi draft={draft} setDraft={setDraft} categorie={categorie} nuovo />

      {errore && <p className="mt-3 text-[12.5px] text-[#dc2626]">{errore}</p>}

      <div className="mt-4 flex justify-end gap-2">
        <button type="button" onClick={onAnnulla} className={BTN_GHOST}>Annulla</button>
        <button type="button" onClick={crea} disabled={creando} className={BTN_PRIMARY}>
          {creando ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
          Crea il progetto
        </button>
      </div>
    </div>
  );
}

export default function ProgettiTab({ query = '' }: { query?: string }) {
  const [rows, setRows] = useState<ProgettoRow[] | null>(null);
  const [categorie, setCategorie] = useState<CategoriaRow[]>([]);
  const [creando, setCreando] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    Promise.all([
      supabase.from('progetti').select('*').order('ordine'),
      supabase.from('categorie').select('*').order('ordine'),
    ]).then(([p, c]) => {
      setRows((p.data as ProgettoRow[]) ?? []);
      setCategorie((c.data as CategoriaRow[]) ?? []);
    });
  }, []);

  if (rows === null) {
    return <div className="flex justify-center py-16 text-[#94a3b8]"><Loader2 className="animate-spin" /></div>;
  }

  const q = query.trim().toLowerCase();
  const mostrati = q
    ? rows.filter((p) => [p.nome, p.slug, p.luogo, p.descrizione].some((c) => (c ?? '').toLowerCase().includes(q)))
    : rows;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className={`max-w-[60ch] ${MUTED}`}>
          L'occhio nasconde un progetto dal sito senza cancellarlo, la stella lo mette tra i lavori in
          evidenza della home, il cestino lo elimina per sempre. Le modifiche vanno online appena il
          visitatore ricarica la pagina.
        </p>
        {!creando && (
          <button type="button" onClick={() => setCreando(true)} className={`${BTN_PRIMARY} shrink-0`}>
            <Plus size={14} /> Nuovo progetto
          </button>
        )}
      </div>

      <div className="mt-5 grid gap-3">
        {creando && (
          <NuovoProgetto
            categorie={categorie}
            prossimoOrdine={rows.length ? Math.max(...rows.map((r) => r.ordine)) + 1 : 0}
            onAnnulla={() => setCreando(false)}
            onCreato={(np) => { setRows([...rows, np]); setCreando(false); }}
          />
        )}
        {mostrati.map((p) => (
          <Row key={p.slug} p={p} categorie={categorie}
            onSaved={(np) => setRows(rows.map((r) => (r.slug === np.slug ? np : r)))}
            onDeleted={(slug) => setRows(rows.filter((r) => r.slug !== slug))} />
        ))}
        {mostrati.length === 0 && !creando && (
          <div className={`${CARD} py-16 text-center`}>
            <p className="text-[13px] text-[#94a3b8]">Nessun progetto trovato.</p>
          </div>
        )}
      </div>
    </div>
  );
}
