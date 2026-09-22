import { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { PianoRow } from '../lib/types';
import { INPUT, LABEL } from './adminTheme';

function Row({ p, onSaved }: { p: PianoRow; onSaved: (p: PianoRow) => void }) {
  const [draft, setDraft] = useState(p);
  const [vociText, setVociText] = useState(p.voci.join('\n'));
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify({ ...draft, voci: vociText }) !== JSON.stringify({ ...p, voci: p.voci.join('\n') });

  const save = async () => {
    if (!supabase) return;
    setSaving(true);
    const voci = vociText.split('\n').map((s) => s.trim()).filter(Boolean);
    const { error } = await supabase.from('piani').update({
      nome: draft.nome, sottotitolo: draft.sottotitolo, prezzo: draft.prezzo,
      unita: draft.unita, nota: draft.nota || null, voci,
    }).eq('id', p.id);
    setSaving(false);
    if (!error) onSaved({ ...draft, voci });
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <input className={`${INPUT} !py-1.5 text-[15px] font-medium`} value={draft.nome}
          onChange={(e) => setDraft({ ...draft, nome: e.target.value })} />
        {draft.in_evidenza && (
          <span className="shrink-0 rounded-full bg-[#0068F8]/10 px-2.5 py-1 text-[11px] font-medium text-[#0068F8]">
            Il più scelto
          </span>
        )}
      </div>

      <div className="mt-3">
        <label className={LABEL}>Sottotitolo</label>
        <textarea className={INPUT} rows={2} value={draft.sottotitolo}
          onChange={(e) => setDraft({ ...draft, sottotitolo: e.target.value })} />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className={LABEL}>Prezzo</label>
          <input className={INPUT} value={draft.prezzo} onChange={(e) => setDraft({ ...draft, prezzo: e.target.value })} />
        </div>
        <div>
          <label className={LABEL}>Unità (es. "/ mese", "una tantum")</label>
          <input className={INPUT} value={draft.unita} onChange={(e) => setDraft({ ...draft, unita: e.target.value })} />
        </div>
      </div>

      <div className="mt-3">
        <label className={LABEL}>Nota sotto il prezzo (facoltativa)</label>
        <input className={INPUT} value={draft.nota ?? ''} onChange={(e) => setDraft({ ...draft, nota: e.target.value })} />
      </div>

      <div className="mt-3">
        <label className={LABEL}>Voci elenco (una per riga)</label>
        <textarea className={INPUT} rows={5} value={vociText} onChange={(e) => setVociText(e.target.value)} />
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

export default function PianiTab() {
  const [rows, setRows] = useState<PianoRow[] | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.from('piani').select('*').order('ordine').then(({ data }) => {
      setRows((data as PianoRow[]) ?? []);
    });
  }, []);

  if (rows === null) {
    return <div className="flex justify-center py-16 text-gray-400"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div>
      <p className="mb-5 text-[13px] text-gray-500">
        Il layout della pagina "Prezzi" resta quello che ho disegnato — qui cambi i numeri e i testi.
      </p>
      <div className="grid gap-3">
        {rows.map((p) => (
          <Row key={p.id} p={p} onSaved={(np) => setRows(rows.map((r) => (r.id === np.id ? np : r)))} />
        ))}
      </div>
    </div>
  );
}
