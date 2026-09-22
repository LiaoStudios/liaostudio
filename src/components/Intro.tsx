import SectionHead from './SectionHead';
import RollButton from './TextRoll';
import { VISIBLE, CATS } from '../data/projects';

const STATS = [
  [String(VISIBLE.length) + '+', 'Siti realizzati e online'],
  [String(CATS.length), 'Settori seguiti, dalla ristorazione al beauty'],
  ['100%', 'Codice su misura, nessun template'],
  ['2–3 set', 'Dal primo incontro alla messa online'],
] as const;

export default function Intro() {
  return (
    <section id="studio" className="bg-white pt-16 sm:pt-20 lg:pt-32 pb-12 sm:pb-16 lg:pb-24 overflow-hidden">
      <div className="mx-auto max-w-[1440px]">
        <div className="px-5 sm:px-8 lg:px-12">
          <SectionHead n="1" label="Chi siamo">
            Sviluppo su misura, per attività
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            che vivono di clienti del quartiere.
          </SectionHead>
        </div>

        <div className="px-5 sm:px-8 lg:px-12 mt-12 sm:mt-16 lg:mt-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <p className="max-w-[46ch] text-[15px] sm:text-[17px] leading-[1.65] font-medium text-[#0B1220]">
              Liao Studio è uno studio di sviluppo web indipendente con base a Bologna.
              Niente reparti, niente passaggi di consegne: parli con chi scrive il codice
              del tuo sito, dal primo incontro all'assistenza dopo la pubblicazione.
            </p>
            <RollButton href="#metodo" tone="blue">Come lavoriamo</RollButton>
          </div>

          <div className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 rounded-2xl overflow-hidden border border-gray-200">
            {STATS.map(([big, small]) => (
              <div key={small} className="bg-white p-5 sm:p-7">
                <div className="text-[28px] sm:text-[38px] leading-none font-medium tracking-[-0.03em] text-[#0B1220]">
                  {big}
                </div>
                <p className="mt-2.5 text-[13px] leading-snug text-gray-600">{small}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
