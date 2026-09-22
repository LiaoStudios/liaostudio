import { useState, type FormEvent } from 'react';
import SectionHead from './SectionHead';
import RollButton from './TextRoll';
import { supabase } from '../lib/supabase';

export const EMAIL = 'liaostudio07@gmail.com';

const FIELD =
  'w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[14px] text-[#0B1220] ' +
  'outline-none transition-all duration-300 focus:border-[#0068F8] focus:ring-4 focus:ring-[#0068F8]/12 placeholder:text-gray-400';
const LABEL = 'mb-2 block text-[11px] uppercase tracking-[0.14em] text-gray-500';

export default function Contact() {
  const [sent, setSent] = useState(false);

  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);

  const openMailFallback = (v: (k: string) => string) => {
    const body = [
      `Nome: ${v('nome')}`,
      `Attività: ${v('attivita')}`,
      `Email: ${v('email')}`,
      `Telefono: ${v('telefono')}`,
      `Tipo di progetto: ${v('progetto')}`,
      `Budget indicativo: ${v('budget')}`,
      '',
      'Messaggio:',
      v('messaggio'),
    ].join('\n');
    window.location.href =
      `mailto:${EMAIL}?subject=${encodeURIComponent('Nuova richiesta dal sito — ' + (v('attivita') || v('nome')))}` +
      `&body=${encodeURIComponent(body)}`;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const v = (k: string) => (d.get(k) || '').toString().trim();

    // la richiesta va salvata nel database, così compare nella dashboard.
    // Se Supabase non è configurato o la rete non risponde, non perdiamo il
    // contatto: apriamo comunque l'email, come faceva il sito prima.
    if (!supabase) { openMailFallback(v); setSent(true); return; }

    setSending(true);
    // IMPORTANTE: niente .select() dopo insert(). L'utente del sito non ha
    // (e non deve avere) il permesso di RILEGGERE le richieste — solo di
    // scriverle. Postgres valuta le policy di SELECT anche quando un INSERT
    // ha un RETURNING (per decidere se può "restituire" la riga appena
    // scritta): con .select() la scrittura fallirebbe con un errore di RLS
    // pur essendo la policy di INSERT corretta. Senza .select(), il client
    // Supabase manda "Prefer: return=minimal" e la scrittura passa.
    const { error } = await supabase.from('richieste').insert({
      nome: v('nome'), attivita: v('attivita') || null, email: v('email'),
      telefono: v('telefono') || null, progetto: v('progetto') || null,
      budget: v('budget') || null, messaggio: v('messaggio') || null,
    });
    setSending(false);

    if (error) { setFailed(true); openMailFallback(v); }
    setSent(true);
  };

  return (
    <section id="contatti" className="bg-white pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHead n="7" label="Contatti">
          Raccontaci la tua attività.
        </SectionHead>

        <div className="mt-12 sm:mt-16 grid gap-10 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div>
            <p className="max-w-[40ch] text-[15px] leading-[1.65] text-gray-600">
              Scrivici due righe su cosa fai e cosa ti serve. Rispondiamo entro 24 ore
              con una prima idea e un preventivo chiaro, senza impegno.
            </p>
            <dl className="mt-8 space-y-5">
              <div className="border-b border-gray-200 pb-4">
                <dt className="text-[11px] uppercase tracking-[0.14em] text-gray-500">Email</dt>
                <dd className="mt-1">
                  <a href={`mailto:${EMAIL}`} className="text-[18px] font-medium text-[#0B1220] transition-colors duration-300 hover:text-[#0068F8]">
                    {EMAIL}
                  </a>
                </dd>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <dt className="text-[11px] uppercase tracking-[0.14em] text-gray-500">Zona</dt>
                <dd className="mt-1 text-[18px] font-medium text-[#0B1220]">Bologna e provincia</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.14em] text-gray-500">Tempi di risposta</dt>
                <dd className="mt-1 text-[18px] font-medium text-[#0B1220]">Entro 24 ore, tutti i giorni</dd>
              </div>
            </dl>
          </div>

          <form onSubmit={onSubmit} noValidate className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className={LABEL} htmlFor="nome">Il tuo nome</label>
                <input id="nome" name="nome" className={FIELD} placeholder="Mario Rossi" autoComplete="name" required /></div>
              <div><label className={LABEL} htmlFor="attivita">Nome dell'attività</label>
                <input id="attivita" name="attivita" className={FIELD} placeholder="Pizzeria da Mario" autoComplete="organization" /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className={LABEL} htmlFor="email">Email</label>
                <input id="email" name="email" type="email" className={FIELD} placeholder="mario@esempio.it" autoComplete="email" required /></div>
              <div><label className={LABEL} htmlFor="telefono">Telefono</label>
                <input id="telefono" name="telefono" type="tel" className={FIELD} placeholder="333 1234567" autoComplete="tel" /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className={LABEL} htmlFor="progetto">Di cosa hai bisogno</label>
                <select id="progetto" name="progetto" className={FIELD}>
                  <option>Un sito nuovo da zero</option>
                  <option>Rifare un sito esistente</option>
                  <option>Menu digitale / ordini online</option>
                  <option>Prenotazioni e appuntamenti</option>
                  <option>Google e SEO locale</option>
                  <option>Non lo so ancora, parliamone</option>
                </select></div>
              <div><label className={LABEL} htmlFor="budget">Budget indicativo</label>
                <select id="budget" name="budget" className={FIELD}>
                  <option>Preferisco parlarne</option>
                  <option>Fino a 800 €</option>
                  <option>800 – 1.500 €</option>
                  <option>1.500 – 3.000 €</option>
                  <option>Oltre 3.000 €</option>
                </select></div>
            </div>
            <div><label className={LABEL} htmlFor="messaggio">Raccontaci il progetto</label>
              <textarea id="messaggio" name="messaggio" rows={5} className={FIELD}
                placeholder="Che attività hai, da quanto, cosa vorresti ottenere dal sito..." /></div>

            {sent && !failed && (
              <p className="rounded-xl border border-[#0068F8]/30 bg-[#E6F0FE] px-4 py-3 text-[13px] text-[#0052C7]">
                Richiesta inviata. Ti rispondiamo entro 24 ore.
              </p>
            )}
            {sent && failed && (
              <p className="rounded-xl border border-[#0068F8]/30 bg-[#E6F0FE] px-4 py-3 text-[13px] text-[#0052C7]">
                Si sta aprendo il tuo programma di posta con il messaggio già compilato: premi invia e ti rispondiamo entro 24 ore.
              </p>
            )}

            <div className="mt-1">
              <RollButton tone="blue" disabled={sending}>{sending ? 'Invio in corso…' : 'Invia la richiesta'}</RollButton>
            </div>
            <p className="text-[12px] leading-relaxed text-gray-500">
              Il modulo apre il tuo programma di posta con i dati già inseriti. Se preferisci,
              scrivici direttamente a <a href={`mailto:${EMAIL}`} className="underline">{EMAIL}</a>.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
