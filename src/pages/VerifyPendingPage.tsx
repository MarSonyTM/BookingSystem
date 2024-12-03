import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { useSupabase } from '../contexts/SupabaseContext';

export default function VerifyPendingPage() {
  const { user } = useSupabase();
  const email = user?.email || 'your email address';

  return (
    <div className="text-center space-y-6">
      <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-full w-fit mx-auto">
        <Mail className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Check your email
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          We've sent a verification link to:
        </p>
        <p className="mt-1 font-medium text-gray-900 dark:text-white">
          {email}
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-sm">
        <p className="text-gray-600 dark:text-gray-400">
          Click the link in the email to verify your account. If you don't see the email, check your spam folder.
        </p>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Didn't receive the email?
        </p>
        <div className="flex flex-col space-y-3">
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-4 py-2 border border-indigo-600 dark:border-indigo-400 text-sm font-medium rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Try signing up again
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <ArrowLeft size={16} />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}