import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Client Supabase condiviso da tutto il sito.
 *
 * Se le variabili d'ambiente mancano (build senza `.env.local`), il sito
 * pubblico deve continuare a funzionare lo stesso — con i dati statici come
 * riserva — invece di rompersi. Per questo `supabase` può essere `null`, e
 * ogni chiamata che lo usa lo controlla prima.
 */
export const supabase = url && key ? createClient(url, key) : null;

export const supabaseReady = !!supabase;
