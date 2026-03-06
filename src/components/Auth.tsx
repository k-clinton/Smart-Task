import { useState } from 'react';
import { LogIn, UserPlus, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthProps {
  onClose?: () => void;
}

export function Auth({ onClose }: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (isResetPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setSuccessMessage('Password reset instructions have been sent to your email');
      } else if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setSuccessMessage('Please check your email for a verification link to complete sign up');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isResetPassword 
          ? 'Reset your password' 
          : isSignUp 
            ? 'Create an account' 
            : 'Sign in to your account'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {!isResetPassword && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => {
                    setIsResetPassword(true);
                    setError('');
                    setSuccessMessage('');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            'Processing...'
          ) : isResetPassword ? (
            'Send Reset Link'
          ) : isSignUp ? (
            <>
              <UserPlus className="w-5 h-5" />
              Sign Up
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              Sign In
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            if (isResetPassword) {
              setIsResetPassword(false);
            } else {
              setIsSignUp(!isSignUp);
            }
            setError('');
            setSuccessMessage('');
          }}
          className="w-full text-sm text-gray-600 hover:text-gray-900"
        >
          {isResetPassword 
            ? 'Back to sign in' 
            : isSignUp 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"}
        </button>
      </form>
    </div>
  );
}