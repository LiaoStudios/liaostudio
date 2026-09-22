import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Login from './Login';
import Dashboard from './Dashboard';

/**
 * Il punto d'ingresso di /admin. È l'unico componente che sa cosa fare in
 * assenza di sessione (mostra Login) o con una sessione attiva (mostra
 * Dashboard), e resta in ascolto: se fai logout da un'altra scheda, questa
 * lo scopre da sola tramite `onAuthStateChange`.
 */
export default function Admin() {
  const [email, setEmail] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    if (!supabase) { setEmail(null); return; }
    supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setEmail(session?.user.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (email === undefined) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#F5F6F8]">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );
  }

  return email ? <Dashboard email={email} /> : <Login onSignedIn={() => { /* onAuthStateChange aggiorna da sé */ }} />;
}
