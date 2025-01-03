// Supabase configuration
export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  headers: {
    'X-Client-Info': 'physio-booking@1.0.0'
  }
};