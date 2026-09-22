import { useEffect, useState } from 'react';
import { Eye, EyeOff, Loader2, Save, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { ProgettoRow } from '../lib/types';
import { INPUT, LABEL } from './adminTheme';

/** Una riga alla volta, con un bottone Salva che compare solo se hai toccato qualcosa. */
function Row({ p, onSaved }: { p: ProgettoRow; onSaved: (p: ProgettoRow) => void }) {
  const [draft, setDraft] = useState(p);
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(p);

  const save = async () => {
    if (!supabase) return;
    setSaving(true);
    const { error } = await supabase.from('progetti').update({
      nome: draft.nome, luogo: draft.luogo, descrizione: draft.descrizione,
      url: draft.url || null, in_evidenza: draft.in_evidenza, nascosto: draft.nascosto,
    }).eq('slug', p.slug);
    setSaving(false);
    if (!error) onSaved(draft);
  };

  return (
    <div className={`rounded-xl border p-4 ${draft.nascosto ? 'border-gray-200 bg-gray-50 opacity-70' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-start justify-between gap-3">
        <input className={`${INPUT} !py-1.5 text-[15px] font-medium`} value={draft.nome}
          onChange={(e) => setDraft({ ...draft, nome: e.target.value })} />
        <div className="flex shrink-0 gap-1.5">
          <button type="button" title={draft.in_evidenza ? 'Tolto dai lavori in evidenza' : 'Metti tra i lavori in evidenza'}
            onClick={() => setDraft({ ...draft, in_evidenza: !draft.in_evidenza })}
            className={`grid h-8 w-8 place-items-center rounded-lg border transition-colors ${
              draft.in_evidenza ? 'border-amber-300 bg-amber-50 text-amber-500' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}>
            <Star size={14} fill={draft.in_evidenza ? 'currentColor' : 'none'} />
          </button>
          <button type="button" title={draft.nascosto ? 'Nascosto dal sito — clicca per mostrarlo' : 'Visibile — clicca per nasconderlo'}
            onClick={() => setDraft({ ...draft, nascosto: !draft.nascosto })}
            className={`grid h-8 w-8 place-items-center rounded-lg border transition-colors ${
              draft.nascosto ? 'border-gray-300 bg-gray-100 text-gray-400' : 'border-[#0068F8]/30 bg-[#E6F0FE] text-[#0068F8]'}`}>
            {draft.nascosto ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className={LABEL}>Luogo</label>
          <input className={INPUT} value={draft.luogo} onChange={(e) => setDraft({ ...draft, luogo: e.target.value })} />
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
          onChange={(e) => setDraft({ ...draft, descrizione: e.target.value })} />
      </div>

      {dirty && (
        <div className="mt-3 flex justify-end">
          <button type="button" onClick={save} disabled={saving}
            className="flex items-center gap-1.5 rounded-full bg-[#0068F8] px-4 py-1.5 text-[12.5px] font-medium text-white hover:bg-[#0052C7] disabled:opacity-60">
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            Salva
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProgettiTab() {
  const [rows, setRows] = useState<ProgettoRow[] | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.from('progetti').select('*').order('ordine').then(({ data }) => {
      setRows((data as ProgettoRow[]) ?? []);
    });
  }, []);

  if (rows === null) {
    return <div className="flex justify-center py-16 text-gray-400"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div>
      <p className="mb-5 text-[13px] text-gray-500">
        L'occhio nasconde un progetto dal sito senza cancellarlo. La stella lo mette tra i lavori in evidenza della home.
        Le modifiche vanno online appena il visitatore ricarica la pagina.
      </p>
      <div className="grid gap-3">
        {rows.map((p) => (
          <Row key={p.slug} p={p} onSaved={(np) => setRows(rows.map((r) => (r.slug === np.slug ? np : r)))} />
        ))}
      </div>
    </div>
  );
}
