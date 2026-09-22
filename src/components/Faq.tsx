import { useState } from 'react';
import { Plus } from 'lucide-react';
import SectionHead from './SectionHead';

const QA = [
  ['Quanto costa un sito?', "Dipende da quante pagine servono e da cosa deve fare: una vetrina è una cosa, un sito con ordini online un'altra. Dopo una chiamata di quindici minuti ti mando un preventivo scritto e dettagliato, senza impegno."],
  ['Quanto tempo ci vuole?', "In genere dalle due alle tre settimane da quando abbiamo foto e testi. Se hai fretta per un'apertura o una stagione, organizzo il lavoro di conseguenza."],
  ['Devo avere già foto e testi pronti?', 'No. Nella maggior parte dei progetti scrivo io i testi insieme a te e sistemo le foto che hai già. Se le immagini non bastano, ti dico esattamente cosa serve fotografare.'],
  ['Posso aggiornare il sito da solo?', 'Sì, dove ha senso. Menù, listini e orari li imposto in modo che tu possa modificarli senza toccare il codice. Per il resto basta che mi scrivi.'],
  ['Il sito funziona bene sul telefono?', "È la prima cosa che curo. Progetto partendo dallo schermo del telefono, perché è da lì che arriva quasi tutto il traffico di un'attività locale."],
  ['Cosa succede dopo la pubblicazione?', 'Il sito resta tuo, dominio compreso. Ti seguo per le modifiche, gli aggiornamenti e la parte Google. Nessun contratto che si rinnova da solo.'],
] as const;

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-[#F5F5F5] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28">
      <div className="mx-auto max-w-[1000px] px-5 sm:px-8 lg:px-12">
        <SectionHead n="6" label="Domande frequenti">Le cose che ci chiedono sempre</SectionHead>

        <div className="mt-10 sm:mt-14 border-t border-gray-300">
          {QA.map(([q, a], i) => {
            const on = open === i;
            return (
              <div key={q} className="border-b border-gray-300">
                <button
                  type="button"
                  aria-expanded={on}
                  onClick={() => setOpen(on ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <span className={`text-[16px] sm:text-[19px] font-medium tracking-[-0.01em] transition-colors duration-300 ${on ? 'text-[#0068F8]' : 'text-[#0B1220]'}`}>
                    {q}
                  </span>
                  <Plus size={18} className={`shrink-0 text-gray-500 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${on ? 'rotate-45' : ''}`} />
                </button>
                <div
                  className="grid transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                  style={{ gridTemplateRows: on ? '1fr' : '0fr', opacity: on ? 1 : 0 }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 pr-10 text-[14px] sm:text-[15px] leading-relaxed text-gray-600">{a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
