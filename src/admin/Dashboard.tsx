import { useState } from 'react';
import { Inbox, LogOut, Package, Tag, Type } from 'lucide-react';
import { supabase } from '../lib/supabase';
import RichiesteTab from './RichiesteTab';
import ProgettiTab from './ProgettiTab';
import PianiTab from './PianiTab';
import TestiTab from './TestiTab';

const TABS = [
  { key: 'richieste', label: 'Richieste', icon: Inbox },
  { key: 'progetti', label: 'Progetti', icon: Package },
  { key: 'piani', label: 'Prezzi', icon: Tag },
  { key: 'testi', label: 'Testi', icon: Type },
] as const;
type TabKey = (typeof TABS)[number]['key'];

export default function Dashboard({ email }: { email: string }) {
  const [tab, setTab] = useState<TabKey>('richieste');

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div>
            <span className="text-[15px] font-medium text-[#0B1220]">Liao Studio</span>
            <span className="ml-2 text-[12px] text-gray-400">dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-[12.5px] text-gray-500 sm:inline">{email}</span>
            <button
              type="button"
              onClick={() => supabase?.auth.signOut()}
              className="flex items-center gap-1.5 rounded-full border border-gray-300 px-3 py-1.5 text-[12.5px] text-gray-600 hover:border-gray-400"
            >
              <LogOut size={13} /> Esci
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8">
        <nav className="mb-6 flex gap-1.5 overflow-x-auto">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                tab === key ? 'bg-[#0B1220] text-white' : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-gray-300'
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </nav>

        {tab === 'richieste' && <RichiesteTab />}
        {tab === 'progetti' && <ProgettiTab />}
        {tab === 'piani' && <PianiTab />}
        {tab === 'testi' && <TestiTab />}
      </div>
    </div>
  );
}
