import { Check, Info } from 'lucide-react';
import SectionHead from './SectionHead';
import RollButton from './TextRoll';
import { usePiani } from '../hooks/usePiani';

type Option = {
  label: string;
  big: string;
  small: string;
  note: string;
  /** la via che conviene di più sul lungo periodo */
  best?: boolean;
};

type Plan = {
  name: string;
  tagline: string;
  price: string;
  unit: string;
  alt?: string;
  /** due modi di pagare la stessa cosa, messi a confronto */
  options?: Option[];
  save?: string;
  items: string[];
  highlight?: boolean;
};

const PLANS: Plan[] = [
  {
    name: 'Landing page',
    tagline: "Una pagina sola, fatta per far chiamare o prenotare. Per chi parte adesso o ha un sito da rifare.",
    price: '70 €',
    unit: '/ mese · minimo 12 mesi',
    options: [
      { label: 'Tutto a rate', big: '70 €', small: 'al mese × 12 mesi',
        note: '840 € l\'anno, ogni anno' },
      { label: 'Una tantum', big: '700 €', small: "+ 20 €/mese di manutenzione",
        note: 'dal 2º anno paghi solo 240 € l\'anno', best: true },
    ],
    save: 'Con la una tantum dal secondo anno risparmi 500 €, dal terzo 1.100 €.',
    items: [
      'Design su misura, niente template',
      'Testi scritti insieme a te',
      'Ottimizzata prima per il telefono',
      'Scheda Google e SEO locale',
      'Modulo contatti e click-to-call',
      'Manutenzione e modifiche incluse',
    ],
    highlight: true,
  },
  {
    name: 'Sito con gestionale',
    tagline: 'Quando servono prenotazioni, ordini d\'asporto o un menù che aggiorni da solo.',
    price: '1.350 €',
    unit: 'una tantum',
    alt: 'la landing a 700 € più 650 € di area gestionale',
    items: [
      'Tutto quello della landing page',
      'Prenotazione tavolo o appuntamento',
      "Ordini d'asporto senza commissioni",
      'Menù e listini aggiornabili da te',
      'Area riservata per lo staff',
      'Manutenzione 240 € l\'anno',
    ],
  },
  {
    name: 'E-commerce',
    tagline: 'Vendita online vera: catalogo, carrello, pagamenti e spedizioni. Costruito sul tuo prodotto.',
    price: 'da 1.500 €',
    unit: 'preventivo su misura',
    items: [
      'Catalogo prodotti e varianti',
      'Carrello e pagamenti online',
      'Gestione ordini e spedizioni',
      'Codici sconto e promozioni',
      'Formazione all\'uso del pannello',
      'Preventivo in base al lavoro',
    ],
  },
];

const LANDING_OPTIONS = [
  { label: 'Tutto a rate', big: '70 €', small: 'al mese × 12 mesi', note: '840 € l\'anno, ogni anno' },
  { label: 'Una tantum', big: '700 €', small: '+ 20 €/mese di manutenzione', note: 'dal 2º anno paghi solo 240 € l\'anno', best: true },
];
const LANDING_SAVE = 'Con la una tantum dal secondo anno risparmi 500 \u20ac, dal terzo 1.100 \u20ac.';

export default function Pricing() {
  const piani = usePiani(PLANS.map((p) => ({
    nome: p.name, sottotitolo: p.tagline, prezzo: p.price, unita: p.unit,
    nota: p.alt ?? null, voci: p.items, in_evidenza: !!p.highlight,
  })));

  return (
    <section id="prezzi" className="bg-white pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHead n="4" label="Quanto costa">
          Prezzi chiari,
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          scritti prima di iniziare.
        </SectionHead>

        <div className="mt-12 sm:mt-16 grid gap-5 sm:gap-6 lg:grid-cols-3">
          {piani.map((p) => (
            <article
              key={p.nome}
              className={`flex flex-col rounded-2xl p-6 sm:p-8 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:-translate-y-1 ${
                p.in_evidenza
                  ? 'bg-[#0B1220] text-white shadow-[0_24px_50px_-30px_rgba(11,18,32,0.8)]'
                  : 'border border-gray-200 bg-[#F9FAFB] hover:bg-white hover:shadow-[0_18px_40px_-26px_rgba(11,18,32,0.5)]'
              }`}
            >
              {p.in_evidenza && (
                <span className="mb-4 self-start rounded-full bg-[#0068F8] px-2.5 py-1 text-[10px] uppercase tracking-wider">
                  Il più scelto
                </span>
              )}
              <h3 className={`text-[20px] font-medium tracking-[-0.01em] ${p.in_evidenza ? 'text-white' : 'text-[#0B1220]'}`}>
                {p.nome}
              </h3>
              <p className={`mt-2 text-[14px] leading-relaxed ${p.in_evidenza ? 'text-white/60' : 'text-gray-600'}`}>
                {p.sottotitolo}
              </p>

              {p.in_evidenza ? (
                <div className="mt-6">
                  <div className="grid grid-cols-2 gap-2">
                    {LANDING_OPTIONS.map((o) => (
                      <div
                        key={o.label}
                        className={`relative rounded-xl p-3 ${
                          o.best
                            ? 'bg-[#0068F8]/15 ring-1 ring-[#4D9BFF]/50'
                            : 'bg-white/[0.06] ring-1 ring-white/10'
                        }`}
                      >
                        <span className={`block text-[10px] uppercase tracking-wider ${o.best ? 'text-[#7FB4FF]' : 'text-white/45'}`}>
                          {o.label}
                        </span>
                        <span className="mt-1.5 block text-[26px] font-medium leading-none tracking-[-0.03em] text-white">
                          {o.big}
                        </span>
                        <span className="mt-1 block text-[11px] leading-snug text-white/60">{o.small}</span>
                        <span className={`mt-2 block text-[11px] leading-snug ${o.best ? 'text-[#7FB4FF]' : 'text-white/40'}`}>
                          {o.note}
                        </span>
                      </div>
                    ))}
                  </div>
                  {LANDING_SAVE && (
                    <p className="mt-3 rounded-lg bg-[#0068F8]/12 px-3 py-2 text-[12px] leading-relaxed text-[#9CC6FF]">
                      {LANDING_SAVE}
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-6">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-[34px] sm:text-[40px] font-medium leading-none tracking-[-0.03em] ${p.in_evidenza ? 'text-white' : 'text-[#0B1220]'}`}>
                      {p.prezzo}
                    </span>
                    <span className={`text-[13px] ${p.in_evidenza ? 'text-white/55' : 'text-gray-500'}`}>{p.unita}</span>
                  </div>
                  {p.nota && (
                    <p className={`mt-2 text-[12px] leading-relaxed ${p.in_evidenza ? 'text-[#7FB4FF]' : 'text-[#0068F8]'}`}>
                      {p.nota}
                    </p>
                  )}
                </div>
              )}

              <ul className="mt-7 space-y-2.5">
                {p.voci.map((it) => (
                  <li key={it} className={`flex gap-2.5 text-[13px] ${p.in_evidenza ? 'text-white/80' : 'text-gray-700'}`}>
                    <Check size={15} className={`mt-[2px] shrink-0 ${p.in_evidenza ? 'text-[#4D9BFF]' : 'text-[#0068F8]'}`} />
                    {it}
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-2">
                <RollButton href="#contatti" tone={p.in_evidenza ? 'light' : 'dark'}>
                  Chiedi un preventivo
                </RollButton>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-gray-200 bg-[#F9FAFB] p-5 sm:p-6">
          <Info size={17} className="mt-[3px] shrink-0 text-[#0068F8]" />
          <p className="text-[13px] sm:text-[14px] leading-relaxed text-gray-600">
            <b className="font-medium text-[#0B1220]">Il dominio resta tuo.</b>{' '}
            È l'unica cosa che ti faccio comprare e intestare direttamente
            (circa 10–15 € l'anno): così il tuo indirizzo internet è di tua
            proprietà e nessuno può tenertelo in ostaggio, nemmeno io. Tutto il
            resto — hosting, certificato, aggiornamenti — è compreso nei prezzi
            qui sopra.
          </p>
        </div>
      </div>
    </section>
  );
}
