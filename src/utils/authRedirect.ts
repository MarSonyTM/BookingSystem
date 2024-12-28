import { supabase } from '../lib/supabase';

export const handleAuthRedirect = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    if (session) {
      // Get the intended URL from localStorage or default to dashboard
      const intendedUrl = localStorage.getItem('intendedUrl') || '/';
      localStorage.removeItem('intendedUrl'); // Clean up
      return intendedUrl;
    }
    
    return '/login';
  } catch (error) {
    console.error('Auth redirect error:', error);
    return '/login';
  }
};

export const setIntendedUrl = (url: string) => {
  localStorage.setItem('intendedUrl', url);
};