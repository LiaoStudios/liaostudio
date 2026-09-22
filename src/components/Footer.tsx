import { EMAIL } from './Contact';
import { asset } from '../lib/asset';
import { VISIBLE } from '../data/projects';

const LINKS = [
  ['#lavori', 'Lavori'],
  ['#servizi', 'Servizi'],
  ['#prezzi', 'Prezzi'],
  ['#metodo', 'Metodo'],
  ['#studio', 'Studio'],
  ['#contatti', 'Contatti'],
] as const;

export default function Footer() {
  return (
    <footer className="bg-[#0B1220] pt-14 sm:pt-20 pb-8 text-white">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-10 border-b border-white/15 pb-12 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <a href="#top" className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10">
                <img src={asset('/brand/mark-light.png')} alt="" className="h-5 w-5 object-contain" />
              </span>
              <span className="text-[15px] font-medium tracking-tight">Liao Studio</span>
            </a>
            <p className="mt-4 max-w-[38ch] text-[14px] leading-relaxed text-white/55">
              Studio di sviluppo web a Bologna. Progettiamo e costruiamo siti su misura
              per le attività che vivono di clienti del territorio.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] uppercase tracking-[0.16em] text-white/45">Naviga</h4>
            <ul className="space-y-2.5">
              {LINKS.map(([h, l]) => (
                <li key={h}>
                  <a href={h} className="text-[14px] text-white/80 transition-colors duration-300 hover:text-[#4D9BFF]">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] uppercase tracking-[0.16em] text-white/45">Contatti</h4>
            <ul className="space-y-2.5">
              <li><a href={`mailto:${EMAIL}`} className="text-[14px] text-white/80 transition-colors duration-300 hover:text-[#4D9BFF]">{EMAIL}</a></li>
              <li className="text-[14px] text-white/80">Bologna e provincia</li>
              <li className="text-[14px] text-white/80">{VISIBLE.length} siti online</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 text-[12px] text-white/45">
          <span>© {new Date().getFullYear()} Liao Studio — P.IVA da inserire</span>
          <span>Progettato e sviluppato a Bologna</span>
        </div>
      </div>
    </footer>
  );
}
