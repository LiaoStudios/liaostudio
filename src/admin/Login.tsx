import { useState, type FormEvent } from 'react';
import { Loader2, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { INPUT, LABEL } from './adminTheme';

/**
 * Accesso all'area riservata.
 *
 * "Crea il tuo account" chiama la stessa `signUp` di un sito qualsiasi, ma
 * in questo progetto solo l'indirizzo in `admin_ammessi` (impostato nel
 * database) può davvero registrarsi: un trigger sul database rifiuta ogni
 * altro indirizzo, prima ancora che l'account esista. Va usata una volta
 * sola, la prima volta che apri la dashboard; dopo si usa "Accedi".
 */
export default function Login({ onSignedIn }: { onSignedIn: () => void }) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justSignedUp, setJustSignedUp] = useState(false);

  if (!supabase) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <p className="text-[14px] text-gray-600">
          La dashboard non è configurata: mancano le variabili di connessione a Supabase.
        </p>
      </div>
    );
  }
  const sb = supabase; // narrowed una volta sola, così la closure sotto lo sa già "non nullo"

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    if (mode === 'signup') {
      const { error: err } = await sb.auth.signUp({ email, password });
      setBusy(false);
      if (err) { setError(err.message); return; }
      setJustSignedUp(true);
      return;
    }

    const { error: err } = await sb.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (err) { setError(err.message); return; }
    onSignedIn();
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-5 py-20">
      <div className="mb-8 text-center">
        <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#0B1220] text-white">
          <Lock size={17} />
        </span>
        <h1 className="mt-4 text-[22px] font-medium tracking-[-0.01em] text-[#0B1220]">
          Area riservata
        </h1>
        <p className="mt-1 text-[13px] text-gray-500">Liao Studio — dashboard</p>
      </div>

      {justSignedUp ? (
        <div className="rounded-xl border border-[#0068F8]/25 bg-[#E6F0FE] p-4 text-[13px] leading-relaxed text-[#0052C7]">
          Account creato. Controlla la posta di <b>{email}</b> per confermare
          l'indirizzo, poi torna qui e accedi.
        </div>
      ) : (
        <form onSubmit={submit} className="grid gap-4">
          <div>
            <label className={LABEL} htmlFor="email">Email</label>
            <input id="email" type="email" required autoComplete="username" className={INPUT}
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className={LABEL} htmlFor="password">Password</label>
            <input id="password" type="password" required minLength={6}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              className={INPUT} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-700">{error}</p>
          )}

          <button type="submit" disabled={busy}
            className="mt-1 flex items-center justify-center gap-2 rounded-full bg-[#0068F8] py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#0052C7] disabled:opacity-60">
            {busy && <Loader2 size={15} className="animate-spin" />}
            {mode === 'signin' ? 'Accedi' : 'Crea il tuo account'}
          </button>

          <button
            type="button"
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); }}
            className="text-center text-[12px] text-gray-500 underline underline-offset-2"
          >
            {mode === 'signin' ? "Prima volta? Crea il tuo account" : 'Hai già un account? Accedi'}
          </button>
        </form>
      )}
    </div>
  );
}
