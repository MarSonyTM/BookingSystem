import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

console.log('Initializing Supabase with:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
  siteUrl: import.meta.env.VITE_SITE_URL,
  senderEmail: import.meta.env.VITE_SENDER_EMAIL
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: true
  },
  headers: {
    'X-Client-Info': 'physio-booking@1.0.0'
  }
}); 