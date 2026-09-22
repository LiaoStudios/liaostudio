import { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BTN_PRIMARY, CARD, INPUT, LABEL, MUTED } from './adminTheme';

interface TestoRow { chiave: string; valore: string; nota: string | null }

function Row({ t, onSaved }: { t: TestoRow; onSaved: (t: TestoRow) => void }) {
  const [valore, setValore] = useState(t.valore);
  const [saving, setSaving] = useState(false);
  const dirty = valore !== t.valore;
  const long = t.valore.length > 60 || t.chiave.includes('sottotitolo');

  const save = async () => {
    if (!supabase) return;
    setSaving(true);
    const { error } = await supabase.from('testi').update({ valore }).eq('chiave', t.chiave);
    setSaving(false);
    if (!error) onSaved({ ...t, valore });
  };

  return (
    <div className={`${CARD} p-4`}>
      <label className={LABEL}>{t.chiave.replace(/_/g, ' ')}</label>
      {t.nota && <p className="mb-2 text-[12px] text-[#94a3b8]">{t.nota}</p>}
      {long ? (
        <textarea className={INPUT} rows={3} value={valore} onChange={(e) => setValore(e.target.value)} />
      ) : (
        <input className={INPUT} value={valore} onChange={(e) => setValore(e.target.value)} />
      )}
      {dirty && (
        <div className="mt-3 flex justify-end">
          <button type="button" onClick={save} disabled={saving} className={BTN_PRIMARY}>
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            Salva
          </button>
        </div>
      )}
    </div>
  );
}

export default function TestiTab() {
  const [rows, setRows] = useState<TestoRow[] | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.from('testi').select('*').order('chiave').then(({ data }) => {
      setRows((data as TestoRow[]) ?? []);
    });
  }, []);

  if (rows === null) {
    return <div className="flex justify-center py-16 text-[#94a3b8]"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div>
      <p className={`mb-5 ${MUTED}`}>
        Email, telefono e le righe principali dell'hero. Per ora il sito pubblico usa ancora i
        valori scritti nel codice — collegarli a questi testi è un prossimo passo (vedi il README).
      </p>
      <div className="grid gap-3">
        {rows.map((t) => (
          <Row key={t.chiave} t={t} onSaved={(nt) => setRows(rows.map((r) => (r.chiave === nt.chiave ? nt : r)))} />
        ))}
      </div>
    </div>
  );
}
