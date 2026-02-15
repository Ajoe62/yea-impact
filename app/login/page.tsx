"use client";

import { useState } from 'react';
import { login, signup } from './actions';

/**
 * LoginPage component
 *
 * This client component renders a simple authentication form that allows
 * users to either sign in or create a new account. It calls the server
 * actions defined in `actions.ts` to interact with Supabase Auth.
 */
export default function LoginPage() {
  // Track whether we are on the sign‑up form or sign‑in form
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);
    try {
      if (isSignUp) {
        const result = await signup(formData);
        if (result?.error) setError(result.error);
      } else {
        const result = await login(formData);
        if (result?.error) setError(result.error);
      }
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
        <h1 className="mb-4 text-2xl font-semibold text-center">
          {isSignUp ? 'Create an Account' : 'Sign In'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <div className="pt-4 text-center">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setIsSignUp(false)}
                className="font-medium text-blue-600 hover:underline"
              >
                Sign in
              </button>
            </p>
          ) : (
            <p>
              Don&apos;t have an account?{' '}
              <button
                onClick={() => setIsSignUp(true)}
                className="font-medium text-blue-600 hover:underline"
              >
                Sign up
              </button>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}