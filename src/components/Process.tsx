import SectionHead from './SectionHead';

const STEPS = [
  ['01', 'Ci parliamo', 'Vengo nel tuo locale o ci sentiamo in videochiamata. Guardo come lavori, chi sono i tuoi clienti, cosa ti chiedono al telefono.'],
  ['02', 'Ti mostro il design', 'Ricevi una proposta grafica reale del tuo sito, non un mockup generico. La cambiamo finché non ti rispecchia.'],
  ['03', 'Sviluppo', 'Costruisco il sito a mano, lo provo su telefono, tablet e computer, sistemo velocità e dettagli.'],
  ['04', 'Online e seguito', 'Pubblico, collego il dominio, configuro Google e ti spiego come gestirlo. Poi resto a disposizione.'],
] as const;

export default function Process() {
  return (
    <section id="metodo" className="bg-[#0B1220] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHead n="5" label="Come lavoriamo" dark>
          Quattro passaggi,
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          nessuna sorpresa.
        </SectionHead>

        <div className="mt-12 sm:mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/15 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([n, title, desc]) => (
            <div key={n} className="bg-[#0B1220] p-6 sm:p-8 transition-colors duration-500 hover:bg-[#111A2C]">
              <span className="block text-[11px] tracking-[0.16em] text-[#4D9BFF] mb-7">{n}</span>
              <h3 className="text-[18px] font-medium text-white">{title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-white/60">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
