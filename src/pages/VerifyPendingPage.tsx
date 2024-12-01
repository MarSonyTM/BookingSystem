import React, { useState } from 'react';
import { Mail, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function VerifyPendingPage() {
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { user, resendVerification } = useAuth();

  const handleResend = async () => {
    setIsResending(true);
    setResendStatus('idle');
    
    try {
      const success = await resendVerification();
      setResendStatus(success ? 'success' : 'error');
    } catch (error) {
      setResendStatus('error');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl w-full max-w-md p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
        <div className="text-center">
          <div className="inline-flex p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
            <Mail className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          
          <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            Verify your email
          </h2>
          
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            We've sent a verification link to{' '}
            <span className="font-medium text-gray-900 dark:text-white">
              {user?.email}
            </span>
          </p>
          
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Please check your email and click the verification link to complete your registration.
          </p>

          {resendStatus === 'success' && (
            <div className="mt-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm">
              Verification email sent successfully!
            </div>
          )}

          {resendStatus === 'error' && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
              Failed to resend verification email. Please try again.
            </div>
          )}

          <button
            onClick={handleResend}
            disabled={isResending}
            className="mt-6 inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <RefreshCw className="w-5 h-5" />
            )}
            <span>Resend verification email</span>
          </button>
        </div>
      </div>
    </div>
  );
}