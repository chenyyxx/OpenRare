import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AuthError() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (router.isReady) {
      const { error: errorCode, message: errorMessage } = router.query;
      setError(errorCode as string || 'Unknown');
      setMessage(errorMessage as string || '');
    }
  }, [router.isReady, router.query]);

  const getErrorTitle = (errorCode: string) => {
    switch (errorCode) {
      case 'AccountLinking':
        return 'Account Linking Issue';
      case 'Configuration':
        return 'Configuration Error';
      case 'AccessDenied':
        return 'Access Denied';
      case 'Verification':
        return 'Verification Error';
      default:
        return 'Authentication Error';
    }
  };

  const getErrorDescription = (errorCode: string, customMessage: string) => {
    if (customMessage) {
      return customMessage;
    }

    switch (errorCode) {
      case 'AccountLinking':
        return 'There was an issue linking your account. This email address may already be associated with a different authentication method.';
      case 'Configuration':
        return 'There is a problem with the server configuration. Please contact support.';
      case 'AccessDenied':
        return 'You do not have permission to sign in with this account.';
      case 'Verification':
        return 'The verification link is invalid or has expired.';
      default:
        return 'An unexpected error occurred during authentication. Please try again.';
    }
  };

  const getSuggestions = (errorCode: string) => {
    switch (errorCode) {
      case 'AccountLinking':
        return [
          'Try signing in with your existing authentication method',
          'Contact support if you need help linking accounts',
          'Use the account management page to link accounts after signing in'
        ];
      case 'AccessDenied':
        return [
          'Check if your account has been activated',
          'Contact support if you believe this is an error'
        ];
      case 'Verification':
        return [
          'Request a new verification email',
          'Check if the link has expired'
        ];
      default:
        return [
          'Try signing in again',
          'Clear your browser cache and cookies',
          'Contact support if the problem persists'
        ];
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-red-600">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {getErrorTitle(error)}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {getErrorDescription(error, message)}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">What you can do:</h3>
          <ul className="space-y-2">
            {getSuggestions(error).map((suggestion, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="ml-2 text-sm text-gray-700">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col space-y-3">
          <Link href="/signin" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Back to Sign In
          </Link>
          <Link href="/" className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}