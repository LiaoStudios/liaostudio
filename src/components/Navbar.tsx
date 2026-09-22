import { useEffect, useState } from 'react';
import { ArrowRight, Clock, Menu, X } from 'lucide-react';
import { RollText } from './TextRoll';

const EASE = 'ease-[cubic-bezier(0.25,0.1,0.25,1)]';
const LINKS = [
  ['#lavori', 'Lavori'],
  ['#servizi', 'Servizi'],
  ['#prezzi', 'Prezzi'],
  ['#metodo', 'Metodo'],
  ['#contatti', 'Contatti'],
] as const;

/** Orologio di Roma, aggiornato ogni secondo. */
function useRomeTime() {
  const [t, setT] = useState('');
  useEffect(() => {
    const tick = () =>
      setT(
        new Intl.DateTimeFormat('it-IT', {
          hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Rome',
        }).format(new Date())
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const time = useRomeTime();

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <div className="relative z-20 w-full mx-auto max-w-[1440px] p-2 sm:p-3">
        <nav className="flex items-center gap-4 rounded-full bg-white p-[5px] shadow-[0_1px_2px_rgba(11,18,32,0.06)]">
          <a href="#top" className="flex items-center gap-2.5 shrink-0" aria-label="Liao Studio">
            <span className="grid place-items-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0B1220]">
              <img src="/brand/mark-light.png" alt="" className="w-[18px] h-[18px] object-contain" />
            </span>
            <span className="hidden sm:block text-[14px] font-medium tracking-tight text-gray-900 pr-1">
              Liao Studio
            </span>
          </a>

          <div className="hidden md:flex items-center gap-6 ml-2">
            {LINKS.map(([href, label]) => (
              <a key={href} href={href}
                className={`text-[14px] text-gray-900 hover:text-gray-500 transition-colors duration-300`}>
                {label}
              </a>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-4">
            <span className="hidden lg:block text-[13px] text-gray-600">
              Disponibile per nuovi progetti
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-[13px] text-gray-600">
              <Clock size={14} />
              {time} a Bologna
            </span>
            <a href="#contatti"
              className={`hidden md:inline-flex group items-center gap-3 rounded-full bg-[#0B1220] pl-5 pr-2 py-2 text-[13px] font-medium text-white transition-colors duration-500 ${EASE} hover:bg-[#002050]`}>
              <RollText>Richiedi un preventivo</RollText>
              <span className="grid place-items-center w-6 h-6 rounded-full bg-white text-[#0B1220]">
                <ArrowRight size={13} className={`transition-transform duration-500 ${EASE} group-hover:-rotate-45`} />
              </span>
            </a>
            <button type="button" onClick={() => setOpen(true)}
              className="md:hidden inline-flex items-center gap-2 rounded-full bg-[#0B1220] px-4 py-2 text-[13px] font-medium text-white">
              <Menu size={15} /> Menu
            </button>
          </div>
        </nav>
      </div>

      {/* pannello mobile: sale dal basso */}
      <div className={`fixed inset-0 z-50 md:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
        <div onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/60 transition-opacity duration-500 ${open ? 'opacity-100' : 'opacity-0'}`} />
        <div
          className={`absolute inset-x-0 bottom-0 mx-3 mb-3 rounded-2xl bg-white p-5 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            open ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-[12px] text-gray-600">
              <Clock size={13} /> {time} a Bologna
            </span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Chiudi"
              className="grid place-items-center w-9 h-9 rounded-full bg-[#0B1220] text-white">
              <X size={16} />
            </button>
          </div>
          <div className="flex flex-col gap-1 mb-6">
            {LINKS.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setOpen(false)}
                className="py-2 text-[28px] font-medium tracking-[-0.02em] text-gray-900">
                {label}
              </a>
            ))}
          </div>
          <a href="#contatti" onClick={() => setOpen(false)}
            className="group flex items-center justify-between rounded-full bg-[#0068F8] pl-6 pr-2 py-2.5 text-[14px] font-medium text-white">
            Richiedi un preventivo
            <span className="grid place-items-center w-8 h-8 rounded-full bg-white text-[#0068F8]">
              <ArrowRight size={15} />
            </span>
          </a>
        </div>
      </div>
    </>
  );
}
