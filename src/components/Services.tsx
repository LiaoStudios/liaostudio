import SectionHead from './SectionHead';

const SERVICES = [
  ['01', 'Sito vetrina su misura', 'Struttura, design, testi e messa online, pensati per la tua attività e per i clienti della tua zona.',
    ['Design originale, non un tema', 'Ottimizzato prima per il telefono', 'Dominio e pubblicazione inclusi']],
  ['02', 'Menu digitale & ordini', "Il menù sempre aggiornato e gli ordini d'asporto direttamente dal sito, senza commissioni.",
    ['Menù per portate e allergeni', "Ordini d'asporto online", 'Prezzi modificabili in autonomia']],
  ['03', 'Prenotazioni & appuntamenti', 'Per saloni, centri estetici e palestre: i clienti prenotano quando vogliono, anche a salone chiuso.',
    ['Listino servizi e durate', 'Richiesta appuntamento online', 'Collegamento a WhatsApp']],
  ['04', 'Google & SEO locale', 'La parte che fa la differenza per un\'attività di quartiere: comparire quando qualcuno cerca vicino a te.',
    ['Scheda Google Business', 'Mappe, orari e recensioni', 'Parole chiave del tuo quartiere']],
  ['05', 'Restyling di siti esistenti', 'Se hai un sito vecchio, lento o che non si vede bene dal telefono, lo ricostruisco da zero.',
    ['Analisi del sito attuale', 'Migrazione contenuti e dominio', 'Nessuna perdita di posizionamento']],
  ['06', 'Assistenza continua', 'Il sito non è finito il giorno che va online. Resto io il tuo riferimento, senza call center.',
    ['Modifiche e aggiornamenti', 'Controllo tecnico periodico', 'Risposta diretta via WhatsApp']],
] as const;

export default function Services() {
  return (
    <section id="servizi" className="bg-white pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHead n="3" label="Cosa facciamo">
          Tutto quello che serve
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          per farsi trovare e far prenotare.
        </SectionHead>

        <div className="mt-12 sm:mt-16 grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(([n, title, desc, items]) => (
            <article
              key={n}
              className="group rounded-2xl border border-gray-200 bg-[#F9FAFB] p-6 sm:p-7 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_40px_-26px_rgba(11,18,32,0.5)]"
            >
              <span className="block text-[11px] tracking-[0.15em] text-[#0068F8] mb-7">{n}</span>
              <h3 className="text-[18px] font-medium tracking-[-0.01em] text-[#0B1220]">{title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-gray-600">{desc}</p>
              <ul className="mt-5 space-y-2">
                {items.map((it) => (
                  <li key={it} className="relative pl-4 text-[13px] text-gray-600">
                    <span className="absolute left-0 top-[0.6em] h-px w-2.5 bg-[#0068F8]" />
                    {it}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
