import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Loader2, Mail, Phone, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { RichiestaRow } from '../lib/types';
import { CARD, H_SECTION, MUTED, UI } from './adminTheme';

const STATI: RichiestaRow['stato'][] = ['nuova', 'letta', 'in_corso', 'chiusa'];
const ETICHETTA: Record<RichiestaRow['stato'], string> = {
  nuova: 'Nuova', letta: 'Letta', in_corso: 'In corso', chiusa: 'Chiusa',
};
const COLORE: Record<RichiestaRow['stato'], string> = {
  nuova: UI.blue, letta: UI.amber, in_corso: '#7c3aed', chiusa: '#94a3b8',
};

const data = (iso: string) =>
  new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    .format(new Date(iso));

export default function RichiesteTab({ query = '' }: { query?: string }) {
  const [righe, setRighe] = useState<RichiestaRow[] | null>(null);
  const [aperta, setAperta] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<'tutte' | RichiestaRow['stato']>('tutte');
  const [errore, setErrore] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) { setRighe([]); return; }
    supabase.from('richieste').select('*').order('creata_il', { ascending: false })
      .then(({ data: d, error }) => {
        if (error) setErrore(error.message);
        setRighe((d as RichiestaRow[]) ?? []);
      });
  }, []);

  const cambiaStato = async (id: string, stato: RichiestaRow['stato']) => {
    if (!supabase || !righe) return;
    setRighe(righe.map((r) => (r.id === id ? { ...r, stato } : r)));
    const { error } = await supabase.from('richieste').update({ stato }).eq('id', id);
    if (error) setErrore(error.message);
  };

  const elimina = async (id: string) => {
    if (!supabase || !righe) return;
    if (!window.confirm('Eliminare questa richiesta? Non si può annullare.')) return;
    setRighe(righe.filter((r) => r.id !== id));
    const { error } = await supabase.from('richieste').delete().eq('id', id);
    if (error) setErrore(error.message);
  };

  const mostrate = useMemo(() => {
    if (!righe) return [];
    const q = query.trim().toLowerCase();
    return righe
      .filter((r) => filtro === 'tutte' || r.stato === filtro)
      .filter((r) => !q || [r.nome, r.attivita, r.email, r.messaggio, r.progetto]
        .some((c) => (c ?? '').toLowerCase().includes(q)));
  }, [righe, filtro, query]);

  if (!righe) {
    return <div className="flex justify-center py-20 text-[#94a3b8]"><Loader2 className="animate-spin" /></div>;
  }

  const nuove = righe.filter((r) => r.stato === 'nuova').length;

  return (
    <div>
      <h1 className={H_SECTION}>Richieste</h1>
      <p className={`mt-1 ${MUTED}`}>
        Tutto quello che arriva dal modulo contatti del sito.
        {query && <> Filtrate per “{query}”.</>}
      </p>

      {errore && (
        <p className="mt-4 rounded-lg bg-[#fef2f2] px-3 py-2 text-[12.5px] text-[#dc2626]">{errore}</p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {(['tutte', ...STATI] as const).map((s) => {
          const attivo = filtro === s;
          return (
            <button key={s} type="button" onClick={() => setFiltro(s)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12.5px] transition-colors duration-120 ${
                attivo
                  ? 'border-[#0068F8] bg-[#0068F8] text-white'
                  : 'border-[#e5e7eb] bg-white text-[#475569] hover:text-[#0f172a] dark:border-[#232833] dark:bg-[#12151c] dark:text-[#9aa4b2] dark:hover:text-[#e5e9f0]'
              }`}>
              {s === 'tutte' ? 'Tutte' : ETICHETTA[s]}
              {s === 'nuova' && nuove > 0 && (
                <span className={`rounded px-1 text-[10px] font-bold ${attivo ? 'bg-white/20' : 'bg-[#fef2f2] text-[#dc2626]'}`}>
                  {nuove}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {mostrate.length === 0 ? (
        <div className={`${CARD} mt-5 py-16 text-center`}>
          <p className="text-[13px] text-[#94a3b8]">Nessuna richiesta qui.</p>
        </div>
      ) : (
        <div className="mt-5 space-y-2.5">
          {mostrate.map((r) => {
            const apertaQui = aperta === r.id;
            return (
              <div key={r.id} className={CARD}>
                <button type="button" onClick={() => setAperta(apertaQui ? null : r.id)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{
                    backgroundColor: COLORE[r.stato],
                    animation: r.stato === 'nuova' ? 'pulse-dot 1.8s ease-in-out infinite' : undefined,
                  }} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-medium text-[#0f172a] dark:text-[#e5e9f0]">
                      {r.attivita || r.nome}
                      {r.attivita && <span className="ml-2 font-normal text-[#94a3b8]">{r.nome}</span>}
                    </span>
                    <span className="block truncate font-mono text-[11.5px] text-[#94a3b8]">
                      {r.progetto || 'nessun tipo indicato'} · {data(r.creata_il)}
                    </span>
                  </span>
                  <span className="hidden shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium sm:inline"
                    style={{ backgroundColor: `${COLORE[r.stato]}14`, color: COLORE[r.stato] }}>
                    {ETICHETTA[r.stato]}
                  </span>
                  <ChevronDown size={16} className={`shrink-0 text-[#94a3b8] transition-transform duration-200 ${apertaQui ? 'rotate-180' : ''}`} />
                </button>

                {apertaQui && (
                  <div className="border-t border-[#e5e7eb] px-4 py-4 dark:border-[#232833]">
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      <a href={`mailto:${r.email}`} className="inline-flex items-center gap-2 text-[13px] text-[#0068F8] hover:underline">
                        <Mail size={14} /> {r.email}
                      </a>
                      {r.telefono && (
                        <a href={`tel:${r.telefono}`} className="inline-flex items-center gap-2 text-[13px] text-[#0068F8] hover:underline">
                          <Phone size={14} /> {r.telefono}
                        </a>
                      )}
                    </div>
                    {r.budget && <p className="mt-2 text-[12px] text-[#94a3b8]">Budget indicativo: {r.budget}</p>}
                    {r.messaggio && (
                      <p className="mt-3 whitespace-pre-line rounded-lg bg-[#f9fafb] p-3 text-[13px] leading-relaxed text-[#475569] dark:bg-[#0b0e14] dark:text-[#9aa4b2]">
                        {r.messaggio}
                      </p>
                    )}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-1.5">
                        {STATI.map((s) => (
                          <button key={s} type="button" onClick={() => cambiaStato(r.id, s)}
                            className={`rounded-lg border px-2.5 py-1 text-[11.5px] transition-colors duration-120 ${
                              r.stato === s
                                ? 'border-[#0068F8] bg-[#0068F8] text-white'
                                : 'border-[#e5e7eb] text-[#475569] hover:text-[#0f172a] dark:border-[#232833] dark:text-[#9aa4b2] dark:hover:text-[#e5e9f0]'
                            }`}>
                            {ETICHETTA[s]}
                          </button>
                        ))}
                      </div>
                      <button type="button" onClick={() => elimina(r.id)}
                        className="inline-flex items-center gap-1.5 text-[12px] text-[#dc2626] transition-opacity hover:opacity-70">
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
