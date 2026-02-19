// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
"use client";

import Link from "next/link";
import { useState } from "react";
import { login, signup } from "./actions";

interface AuthResult {
  error?: string;
  success?: string;
}

/**
 * LoginPage component
 *
 * This client component renders an authentication form that allows users
 * to either sign in or create a new account.
 */
export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function switchMode(nextIsSignUp: boolean) {
    setIsSignUp(nextIsSignUp);
    setEmail("");
    setPassword("");
    setError(null);
    setSuccess(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }

    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result: AuthResult | void = isSignUp
        ? await signup(formData)
        : await login(formData);

      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess(result.success);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unexpected error.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="mb-4 text-center text-2xl font-semibold">
          {isSignUp ? "Create an Account" : "Sign In"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              disabled={isSubmitting}
            />
          </div>

          {!isSignUp ? (
            <p className="text-right text-sm">
              <Link href="/forgot-password" className="font-medium text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </p>
          ) : null}

          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          {success ? <p className="text-sm text-green-700">{success}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="pt-4 text-center">
          {isSignUp ? (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode(false)}
                className="font-medium text-blue-600 hover:underline"
              >
                Sign in
              </button>
            </p>
          ) : (
            <p>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode(true)}
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
