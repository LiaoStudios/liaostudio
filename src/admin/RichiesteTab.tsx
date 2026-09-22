import { useEffect, useState } from 'react';
import { ChevronDown, Loader2, Mail, Phone, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { RichiestaRow } from '../lib/types';

const STATI: RichiestaRow['stato'][] = ['nuova', 'letta', 'in_corso', 'chiusa'];
const STATO_LABEL: Record<RichiestaRow['stato'], string> = {
  nuova: 'Nuova', letta: 'Letta', in_corso: 'In corso', chiusa: 'Chiusa',
};
const STATO_DOT: Record<RichiestaRow['stato'], string> = {
  nuova: 'bg-[#0068F8]', letta: 'bg-amber-400', in_corso: 'bg-purple-500', chiusa: 'bg-gray-300',
};

function fmt(iso: string) {
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso));
}

export default function RichiesteTab() {
  const [rows, setRows] = useState<RichiestaRow[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState<'tutte' | RichiestaRow['stato']>('tutte');
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!supabase) return;
    const { data, error: err } = await supabase
      .from('richieste').select('*').order('creata_il', { ascending: false });
    if (err) { setError(err.message); return; }
    setRows((data as RichiestaRow[]) ?? []);
  };

  useEffect(() => { void load(); }, []);

  const setStato = async (id: string, stato: RichiestaRow['stato']) => {
    if (!supabase || !rows) return;
    setRows(rows.map((r) => (r.id === id ? { ...r, stato } : r)));
    const { error: err } = await supabase.from('richieste').update({ stato }).eq('id', id);
    if (err) setError(err.message);
  };

  const remove = async (id: string) => {
    if (!supabase || !rows) return;
    if (!window.confirm('Eliminare questa richiesta? Non si può annullare.')) return;
    setRows(rows.filter((r) => r.id !== id));
    const { error: err } = await supabase.from('richieste').delete().eq('id', id);
    if (err) setError(err.message);
  };

  if (rows === null) {
    return <div className="flex justify-center py-16 text-gray-400"><Loader2 className="animate-spin" /></div>;
  }

  const shown = filter === 'tutte' ? rows : rows.filter((r) => r.stato === filter);
  const nuove = rows.filter((r) => r.stato === 'nuova').length;

  return (
    <div>
      {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-700">{error}</p>}

      <div className="mb-5 flex flex-wrap items-center gap-2">
        {(['tutte', ...STATI] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full border px-3 py-1.5 text-[12.5px] transition-colors ${
              filter === s ? 'border-[#0B1220] bg-[#0B1220] text-white' : 'border-gray-300 text-gray-600 hover:border-gray-400'
            }`}
          >
            {s === 'tutte' ? 'Tutte' : STATO_LABEL[s]}
            {s === 'nuova' && nuove > 0 && <span className="ml-1.5 opacity-70">{nuove}</span>}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="py-12 text-center text-[13px] text-gray-400">Nessuna richiesta qui.</p>
      ) : (
        <div className="grid gap-2.5">
          {shown.map((r) => {
            const isOpen = open === r.id;
            return (
              <div key={r.id} className="rounded-xl border border-gray-200 bg-white">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : r.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                >
                  <span className={`h-2 w-2 shrink-0 rounded-full ${STATO_DOT[r.stato]}`} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-medium text-[#0B1220]">
                      {r.attivita || r.nome}
                      {r.attivita && <span className="ml-2 font-normal text-gray-400">{r.nome}</span>}
                    </span>
                    <span className="block truncate text-[12px] text-gray-500">
                      {r.progetto || 'Nessun tipo indicato'} · {fmt(r.creata_il)}
                    </span>
                  </span>
                  <ChevronDown size={16} className={`shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100 px-4 py-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <a href={`mailto:${r.email}`} className="flex items-center gap-2 text-[13px] text-[#0068F8] hover:underline">
                        <Mail size={14} /> {r.email}
                      </a>
                      {r.telefono && (
                        <a href={`tel:${r.telefono}`} className="flex items-center gap-2 text-[13px] text-[#0068F8] hover:underline">
                          <Phone size={14} /> {r.telefono}
                        </a>
                      )}
                    </div>
                    {r.budget && (
                      <p className="mt-2 text-[12px] text-gray-500">Budget indicativo: {r.budget}</p>
                    )}
                    {r.messaggio && (
                      <p className="mt-3 whitespace-pre-line rounded-lg bg-gray-50 p-3 text-[13px] leading-relaxed text-gray-700">
                        {r.messaggio}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-1.5">
                        {STATI.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setStato(r.id, s)}
                            className={`rounded-full border px-2.5 py-1 text-[11.5px] transition-colors ${
                              r.stato === s ? 'border-[#0B1220] bg-[#0B1220] text-white' : 'border-gray-300 text-gray-600 hover:border-gray-400'
                            }`}
                          >
                            {STATO_LABEL[s]}
                          </button>
                        ))}
                      </div>
                      <button type="button" onClick={() => remove(r.id)}
                        className="flex items-center gap-1.5 text-[12px] text-red-500 hover:text-red-600">
                        <Trash2 size={13} /> Elimina
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
