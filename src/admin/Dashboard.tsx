import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTheme } from './useTheme';
import Sidebar, { SEZIONI, type TabKey } from './Sidebar';
import TopHeader from './TopHeader';
import PanoramicaTab from './PanoramicaTab';
import RichiesteTab from './RichiesteTab';
import ProgettiTab from './ProgettiTab';
import PianiTab from './PianiTab';
import TestiTab from './TestiTab';
import { UI } from './adminTheme';
import { asset } from '../lib/asset';

const APERTA_KEY = 'liaostudio-admin-sidebar';

export default function Dashboard({ email }: { email: string }) {
  const { theme, toggle } = useTheme();
  const [tab, setTab] = useState<TabKey>('panoramica');
  const [query, setQuery] = useState('');
  const [nuove, setNuove] = useState(0);
  const [menuMobile, setMenuMobile] = useState(false);

  const [aperta, setAperta] = useState(() => {
    try { return localStorage.getItem(APERTA_KEY) !== 'chiusa'; } catch { return true; }
  });
  useEffect(() => {
    try { localStorage.setItem(APERTA_KEY, aperta ? 'aperta' : 'chiusa'); } catch { /* storage bloccato */ }
  }, [aperta]);

  /* il contatore delle nuove richieste serve a sidebar e campanella */
  useEffect(() => {
    if (!supabase) return;
    let vivo = true;
    const conta = async () => {
      const { count } = await supabase!
        .from('richieste').select('*', { count: 'exact', head: true }).eq('stato', 'nuova');
      if (vivo) setNuove(count ?? 0);
    };
    void conta();
    const id = setInterval(conta, 60_000);
    return () => { vivo = false; clearInterval(id); };
  }, [tab]);

  const vaiA = (k: TabKey) => { setTab(k); setMenuMobile(false); };

  return (
    <div className="min-h-screen bg-[#f6f7f9] dark:bg-[#0b0e14]">
      <Sidebar
        tab={tab} onPick={vaiA} aperta={aperta} onToggle={() => setAperta((v) => !v)}
        email={email} nuove={nuove} onLogout={() => supabase?.auth.signOut()}
      />

      {/* menù a scomparsa, sotto i 1024px */}
      {menuMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuMobile(false)} />
          <div className="absolute inset-y-0 left-0 w-[260px] p-3" style={{ backgroundColor: UI.sidebar }}>
            <div className="mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2.5 text-white">
                <img src={asset('/brand/mark-light.png')} alt="" className="h-5 w-5 object-contain" />
                <span className="text-[14px] font-semibold">Liao Studio</span>
              </span>
              <button type="button" onClick={() => setMenuMobile(false)} aria-label="Chiudi"
                className="grid h-8 w-8 place-items-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white">
                <X size={16} />
              </button>
            </div>
            {SEZIONI.map((sez) => (
              <div key={sez.titolo} className="mb-5">
                <p className="mb-2 px-2 text-[10.5px] font-bold uppercase tracking-wider text-white/35">{sez.titolo}</p>
                {sez.voci.map(({ key, label, icon: Icon }) => (
                  <button key={key} type="button" onClick={() => vaiA(key)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] transition-colors ${
                      tab === key ? 'text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                    style={tab === key ? { backgroundColor: UI.sidebarActive } : undefined}>
                    <Icon size={18} /> <span className="flex-1 text-left">{label}</span>
                    {key === 'richieste' && nuove > 0 && (
                      <span className="rounded bg-[#fef2f2] px-1.5 py-px text-[10px] font-bold text-[#dc2626]">{nuove}</span>
                    )}
                  </button>
                ))}
              </div>
            ))}
            <button type="button" onClick={() => supabase?.auth.signOut()}
              className="mt-2 w-full rounded-lg px-2.5 py-2 text-left text-[13px] text-white/45 hover:bg-white/5 hover:text-white">
              Esci
            </button>
          </div>
        </div>
      )}

      {/* contenuto: lascia spazio alla sidebar solo da 1024px in su */}
      <div className="transition-[padding] duration-200 ease-out" style={{ paddingLeft: 0 }}>
        <div className="lg:pl-[var(--sb)]" style={{ ['--sb' as string]: `${aperta ? 260 : 76}px` }}>
          <TopHeader
            tab={tab} theme={theme} onToggleTheme={toggle}
            query={query} onQuery={setQuery} nuove={nuove}
            onOpenMenu={() => setMenuMobile(true)}
          />
          <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
            {tab === 'panoramica' && <PanoramicaTab onVaiARichieste={() => setTab('richieste')} />}
            {tab === 'richieste' && <RichiesteTab query={query} />}
            {tab === 'progetti' && <ProgettiTab query={query} />}
            {tab === 'piani' && <PianiTab />}
            {tab === 'testi' && <TestiTab />}
          </main>
        </div>
      </div>
    </div>
  );
}
