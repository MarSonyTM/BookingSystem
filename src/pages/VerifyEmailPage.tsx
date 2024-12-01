import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function VerifyEmailPage() {
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [searchParams] = useSearchParams();
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setVerificationStatus('error');
        return;
      }

      const success = await verifyEmail(token);
      setVerificationStatus(success ? 'success' : 'error');
    };

    verifyToken();
  }, [searchParams, verifyEmail]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl w-full max-w-md p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
        {verificationStatus === 'verifying' ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Verifying your email...
            </h2>
          </div>
        ) : verificationStatus === 'success' ? (
          <div className="text-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Email Verified Successfully!
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Your email has been verified. You can now access your account.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium"
            >
              Continue to Dashboard
            </button>
          </div>
        ) : (
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Verification Failed
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              The verification link is invalid or has expired.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}