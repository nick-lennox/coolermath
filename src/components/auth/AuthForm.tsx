import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthError, ProfileError } from '../../lib/errors';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onSuccess: () => void;
  disabled?: boolean;
}

export function AuthForm({ mode, onSuccess, disabled }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError('');

      if (mode === 'signup') {
        if (username.length < 3) {
          setError('Username must be at least 3 characters long');
          return;
        }
        await signUp(email, password, username);
      } else {
        await signIn(email, password);
      }
      onSuccess();
    } catch (err) {
      let message = 'An unexpected error occurred';
      
      if (err instanceof AuthError) {
        message = err.message;
      } else if (err instanceof ProfileError) {
        message = 'Failed to create user profile. Please try again.';
      } else if (err instanceof Error) {
        message = err.message;
      }
      
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      {mode === 'signup' && (
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
            disabled={isSubmitting || disabled}
            minLength={3}
            pattern="[a-zA-Z0-9_-]+"
            title="Username can only contain letters, numbers, underscores, and hyphens"
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
          disabled={isSubmitting || disabled}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
          disabled={isSubmitting || disabled}
          minLength={6}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || disabled}
        className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Please wait...' : mode === 'signup' ? 'Sign Up' : 'Sign In'}
      </button>
    </form>
  );
}