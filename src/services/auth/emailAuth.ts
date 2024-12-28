import { supabase } from '../../lib/supabase';
import { AuthError } from '@supabase/supabase-js';

export class EmailAuthService {
  // Sign up with email confirmation
  static async signUp(email: string, password: string, metadata = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error: error as AuthError };
    }
  }

  // Sign in with magic link
  static async sendMagicLink(email: string) {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Magic link error:', error);
      return { data: null, error: error as AuthError };
    }
  }

  // Change email with verification
  static async changeEmail(newEmail: string) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        email: newEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Change email error:', error);
      return { data: null, error: error as AuthError };
    }
  }

  // Reset password
  static async resetPassword(email: string) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { data: null, error: error as AuthError };
    }
  }

  // Update password (after reset)
  static async updatePassword(newPassword: string) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Update password error:', error);
      return { data: null, error: error as AuthError };
    }
  }

  // Reauthentication
  static async reauthenticate(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Reauthentication error:', error);
      return { data: null, error: error as AuthError };
    }
  }

  // Invite user (admin only)
  static async inviteUser(email: string, role: string = 'user') {
    try {
      const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
        data: { role },
        redirectTo: `${window.location.origin}/auth/callback`,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Invite user error:', error);
      return { data: null, error: error as AuthError };
    }
  }
}