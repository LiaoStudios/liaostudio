import { ChevronLeft, Inbox, LayoutDashboard, LogOut, Package, Tag, Type } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { UI } from './adminTheme';
import { asset } from '../lib/asset';

export type TabKey = 'panoramica' | 'richieste' | 'progetti' | 'piani' | 'testi';

type Voce = { key: TabKey; label: string; icon: LucideIcon; badge?: number };

export const SEZIONI: { titolo: string; voci: Omit<Voce, 'badge'>[] }[] = [
  {
    titolo: 'Gestione',
    voci: [
      { key: 'panoramica', label: 'Panoramica', icon: LayoutDashboard },
      { key: 'richieste', label: 'Richieste', icon: Inbox },
    ],
  },
  {
    titolo: 'Contenuti del sito',
    voci: [
      { key: 'progetti', label: 'Progetti', icon: Package },
      { key: 'piani', label: 'Prezzi', icon: Tag },
      { key: 'testi', label: 'Testi', icon: Type },
    ],
  },
];

export default function Sidebar({
  tab, onPick, aperta, onToggle, email, nuove, onLogout,
}: {
  tab: TabKey;
  onPick: (k: TabKey) => void;
  aperta: boolean;
  onToggle: () => void;
  email: string;
  nuove: number;
  onLogout: () => void;
}) {
  const iniziali = email.slice(0, 2).toUpperCase();

  return (
    <aside
      className="fixed inset-y-0 left-0 z-40 hidden flex-col text-white transition-[width] duration-200 ease-out lg:flex"
      style={{ width: aperta ? 260 : 76, backgroundColor: UI.sidebar }}
    >
      {/* marchio */}
      <div className="flex h-[60px] shrink-0 items-center gap-2.5 px-5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10">
          <img src={asset('/brand/mark-light.png')} alt="" className="h-4 w-4 object-contain" />
        </span>
        {aperta && (
          <span className="truncate text-[14px] font-semibold tracking-tight">Liao Studio</span>
        )}
      </div>

      {/* navigazione */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {SEZIONI.map((sez) => (
          <div key={sez.titolo} className="mb-5">
            {aperta && (
              <p className="mb-2 px-2 text-[10.5px] font-bold uppercase tracking-wider text-white/35">
                {sez.titolo}
              </p>
            )}
            <ul className="space-y-0.5">
              {sez.voci.map(({ key, label, icon: Icon }) => {
                const attivo = tab === key;
                const badge = key === 'richieste' && nuove > 0 ? nuove : undefined;
                return (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() => onPick(key)}
                      title={aperta ? undefined : label}
                      aria-current={attivo ? 'page' : undefined}
                      className={`flex w-full items-center gap-2.5 rounded-lg py-2 text-[13.5px] transition-colors duration-120 ${
                        aperta ? 'px-2.5' : 'justify-center px-0'
                      } ${attivo ? 'text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                      style={attivo ? { backgroundColor: UI.sidebarActive } : undefined}
                    >
                      <Icon size={18} className="shrink-0" />
                      {aperta && <span className="flex-1 truncate text-left">{label}</span>}
                      {aperta && badge !== undefined && (
                        <span className="rounded bg-[#fef2f2] px-1.5 py-px text-[10px] font-bold text-[#dc2626]">
                          {badge}
                        </span>
                      )}
                      {!aperta && badge !== undefined && (
                        <span className="absolute ml-7 -mt-4 h-1.5 w-1.5 rounded-full bg-[#dc2626]" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* profilo + collassa */}
      <div className="shrink-0 border-t border-white/10 p-3">
        <div className={`flex items-center gap-2.5 rounded-lg p-2 ${aperta ? '' : 'justify-center'}`}>
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#0068F8] to-[#002050] text-[11px] font-bold">
            {iniziali}
          </span>
          {aperta && (
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12.5px] font-medium">{email}</span>
              <button
                type="button"
                onClick={onLogout}
                className="mt-0.5 flex items-center gap-1 text-[11.5px] text-white/45 transition-colors hover:text-white"
              >
                <LogOut size={11} /> Esci
              </button>
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onToggle}
          className={`mt-1 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] text-white/45 transition-colors duration-120 hover:bg-white/5 hover:text-white ${
            aperta ? '' : 'justify-center px-0'
          }`}
        >
          <ChevronLeft size={16} className={`shrink-0 transition-transform duration-200 ${aperta ? '' : 'rotate-180'}`} />
          {aperta && 'Riduci il menù'}
        </button>
      </div>
    </aside>
  );
}
