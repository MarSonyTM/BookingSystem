import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get the token hash and type from URL
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');

        if (!token_hash || !type) {
          setVerificationStatus('error');
          setError('Invalid verification link');
          return;
        }

        // Exchange the token hash for a session
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: 'email',
          email: searchParams.get('email') || '',
        });

        if (error) throw error;

        // If verification successful, update the user's profile
        if (data?.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ email_verified: true })
            .eq('id', data.user.id);

          if (profileError) throw profileError;
        }

        setVerificationStatus('success');
        
        // Automatically redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', { 
            state: { message: 'Email verified successfully! You can now log in.' }
          });
        }, 3000);
      } catch (err) {
        console.error('Verification error:', err);
        setVerificationStatus('error');
        setError(err instanceof Error ? err.message : 'Failed to verify email');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  if (verificationStatus === 'loading') {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Verifying your email...</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      {verificationStatus === 'success' ? (
        <div className="space-y-4">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Email Verified!</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your email has been successfully verified. You will be redirected to the login page in a few seconds...
          </p>
          <Link
            to="/login"
            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Sign In Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <XCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Verification Failed</h2>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <Link
            to="/login"
            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      )}
    </div>
  );
}