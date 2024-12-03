import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface SupabaseContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const SupabaseContext = createContext<SupabaseContextType | null>(null);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check active sessions
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        setUser(session?.user ?? null);
      } catch (err) {
        console.error('Session check error:', err);
        setError(err instanceof Error ? err.message : 'Failed to check session');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      setError(null); // Clear any previous errors
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      console.log('Starting signup process...');

      // Sign up the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { 
            name,
            role: 'user'
          },
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      });

      console.log('Signup response:', { data, error: signUpError });

      if (signUpError) {
        throw signUpError;
      }

      if (!data.user) {
        throw new Error('No user data returned from signup');
      }

      // Add debug logging
      console.log('Creating profile for user:', {
        id: data.user.id,
        email: email.trim(),
        name,
        role: 'user'
      });

      // Create profile with service role client
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: email.trim(),
          name,
          role: 'user'
        })
        .single();

      if (profileError) {
        console.error('Full profile error:', profileError);
        throw new Error(`Failed to create user profile: ${profileError.message}`);
      }

      // Redirect to verification page
      window.location.href = '/verify-pending';

      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      setError(error instanceof Error ? error.message : 'Failed to sign out');
    }
  };

  return (
    <SupabaseContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signOut,
        isLoading,
        error,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}