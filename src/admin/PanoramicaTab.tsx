import { useEffect, useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Eye, Inbox, Loader2, Star } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { ProgettoRow, RichiestaRow } from '../lib/types';
import { CARD, CARD_HOVER, H_SECTION, MUTED, UI } from './adminTheme';

const GIORNI = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

function Stat({
  icon: Icon, tinta, tintaBg, etichetta, valore, trend,
}: {
  icon: LucideIcon; tinta: string; tintaBg: string; etichetta: string; valore: number | string;
  trend?: { verso: 'su' | 'giu'; testo: string };
}) {
  return (
    <div className={`${CARD} ${CARD_HOVER} p-4 sm:p-5`}>
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: tintaBg }}>
          <Icon size={17} style={{ color: tinta }} />
        </span>
        {trend && (
          <span
            className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{
              backgroundColor: trend.verso === 'su' ? UI.greenSoft : UI.redSoft,
              color: trend.verso === 'su' ? UI.green : UI.red,
            }}
          >
            {trend.verso === 'su' ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
            {trend.testo}
          </span>
        )}
      </div>
      <p className="mt-3.5 text-[24px] font-semibold leading-none tracking-[-0.02em] text-[#0f172a] dark:text-[#e5e9f0]">
        {valore}
      </p>
      <p className="mt-1.5 text-[12.5px] text-[#475569] dark:text-[#9aa4b2]">{etichetta}</p>
    </div>
  );
}

export default function PanoramicaTab({ onVaiARichieste }: { onVaiARichieste: () => void }) {
  const [richieste, setRichieste] = useState<RichiestaRow[] | null>(null);
  const [progetti, setProgetti] = useState<ProgettoRow[] | null>(null);

  useEffect(() => {
    if (!supabase) { setRichieste([]); setProgetti([]); return; }
    let vivo = true;
    (async () => {
      const [r, p] = await Promise.all([
        supabase.from('richieste').select('*').order('creata_il', { ascending: false }),
        supabase.from('progetti').select('*').order('ordine'),
      ]);
      if (!vivo) return;
      setRichieste((r.data as RichiestaRow[]) ?? []);
      setProgetti((p.data as ProgettoRow[]) ?? []);
    })();
    return () => { vivo = false; };
  }, []);

  /* ultimi 7 giorni: quante richieste sono arrivate, e quante chiuse */
  const settimana = useMemo(() => {
    if (!richieste) return [];
    const oggi = new Date(); oggi.setHours(23, 59, 59, 999);
    return Array.from({ length: 7 }, (_, i) => {
      const g = new Date(oggi);
      g.setDate(oggi.getDate() - (6 - i));
      const inizio = new Date(g); inizio.setHours(0, 0, 0, 0);
      const delGiorno = richieste.filter((x) => {
        const d = new Date(x.creata_il);
        return d >= inizio && d <= g;
      });
      return {
        etichetta: GIORNI[g.getDay()],
        arrivate: delGiorno.length,
        chiuse: delGiorno.filter((x) => x.stato === 'chiusa').length,
      };
    });
  }, [richieste]);

  if (!richieste || !progetti) {
    return <div className="flex justify-center py-20 text-[#94a3b8]"><Loader2 className="animate-spin" /></div>;
  }

  const nuove = richieste.filter((r) => r.stato === 'nuova').length;
  const inCorso = richieste.filter((r) => r.stato === 'in_corso').length;
  const visibili = progetti.filter((p) => !p.nascosto).length;
  const inEvidenza = progetti.filter((p) => p.in_evidenza && !p.nascosto).length;

  const ultimi7 = settimana.reduce((s, g) => s + g.arrivate, 0);
  const picco = Math.max(1, ...settimana.map((g) => g.arrivate));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className={H_SECTION}>Panoramica</h1>
          <p className={`mt-1 ${MUTED}`}>
            Come sta andando il sito e cosa è arrivato negli ultimi giorni.
          </p>
        </div>
        {nuove > 0 && (
          <button type="button" onClick={onVaiARichieste}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0068F8] px-4 py-2 text-[13px] font-medium text-white transition-colors duration-120 hover:bg-[#0052C7]">
            <span className="h-2 w-2 rounded-full bg-white/70" style={{ animation: 'pulse-dot 1.8s ease-in-out infinite' }} />
            {nuove} {nuove === 1 ? 'richiesta da leggere' : 'richieste da leggere'}
          </button>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Inbox} tinta={UI.blue} tintaBg={UI.blueSoft} etichetta="Richieste da leggere" valore={nuove}
          trend={nuove > 0 ? { verso: 'su', testo: 'da gestire' } : undefined} />
        <Stat icon={Loader2} tinta={UI.amber} tintaBg="#fffbeb" etichetta="Trattative in corso" valore={inCorso} />
        <Stat icon={Eye} tinta={UI.green} tintaBg={UI.greenSoft} etichetta="Progetti online" valore={visibili} />
        <Stat icon={Star} tinta="#7c3aed" tintaBg="#f5f3ff" etichetta="In evidenza in home" valore={inEvidenza} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* grafico */}
        <div className={`${CARD} p-5 lg:col-span-2`}>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-[15px] font-semibold text-[#0f172a] dark:text-[#e5e9f0]">Richieste, ultimi 7 giorni</h2>
            <span className="font-mono text-[12px] text-[#94a3b8]">{ultimi7} in totale</span>
          </div>

          <div className="mt-6 flex h-[180px] items-end gap-3">
            {settimana.map((g, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-full w-full items-end justify-center gap-1">
                  <div
                    className="w-1/2 max-w-[18px] rounded-t-[4px] transition-[height] duration-500"
                    style={{ height: `${(g.arrivate / picco) * 100}%`, minHeight: g.arrivate ? 4 : 2,
                             backgroundColor: g.arrivate ? UI.blue : '#e5e7eb' }}
                    title={`${g.arrivate} arrivate`}
                  />
                  <div
                    className="w-1/2 max-w-[18px] rounded-t-[4px] transition-[height] duration-500"
                    style={{ height: `${(g.chiuse / picco) * 100}%`, minHeight: g.chiuse ? 4 : 2,
                             backgroundColor: g.chiuse ? UI.green : '#eef1f5' }}
                    title={`${g.chiuse} chiuse`}
                  />
                </div>
                <span className="font-mono text-[10.5px] text-[#94a3b8]">{g.etichetta}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-4 border-t border-[#e5e7eb] pt-3 text-[11.5px] text-[#475569] dark:border-[#232833] dark:text-[#9aa4b2]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-[2px]" style={{ backgroundColor: UI.blue }} /> Arrivate
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-[2px]" style={{ backgroundColor: UI.green }} /> Chiuse
            </span>
          </div>
        </div>

        {/* attività */}
        <div className={`${CARD} p-5`}>
          <h2 className="text-[15px] font-semibold text-[#0f172a] dark:text-[#e5e9f0]">Ultime richieste</h2>
          {richieste.length === 0 ? (
            <p className="mt-6 text-center text-[13px] text-[#94a3b8]">
              Nessuna richiesta, per ora.<br />Arriveranno qui dal modulo contatti.
            </p>
          ) : (
            <ul className="mt-4 space-y-3.5">
              {richieste.slice(0, 6).map((r) => {
                const colore = { nuova: UI.blue, letta: UI.amber, in_corso: '#7c3aed', chiusa: UI.green }[r.stato];
                return (
                  <li key={r.id} className="flex gap-2.5">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: colore }} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] text-[#0f172a] dark:text-[#e5e9f0]">
                        {r.attivita || r.nome}
                      </span>
                      <span className="block font-mono text-[11px] text-[#94a3b8]">
                        {new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                          .format(new Date(r.creata_il))}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
          {richieste.length > 6 && (
            <button type="button" onClick={onVaiARichieste}
              className="mt-4 w-full rounded-lg border border-[#e5e7eb] py-2 text-[12.5px] text-[#475569] transition-colors duration-120 hover:text-[#0f172a] dark:border-[#232833] dark:text-[#9aa4b2] dark:hover:text-[#e5e9f0]">
              Vedile tutte
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
