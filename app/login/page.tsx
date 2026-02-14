// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
"use client";

import { useState } from "react";
import { login, signup } from "./actions";
import PageWrapper from "@/components/PageWrapper";

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
    <PageWrapper>
      <main className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-green-700">YEA Impact</h1>
            <p className="text-gray-600 mt-2">
              {isSignUp
                ? "Join our community today"
                : "Welcome back to your journey"}
            </p>
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-md">
            <div className="bg-gradient-to-r from-green-700 to-purple-700 h-2"></div>

            <div className="p-8">
              <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
                {isSignUp ? "Create an Account" : "Sign In"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-4 text-white font-medium bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 rounded-lg transition-colors shadow-md"
                >
                  {isSignUp ? "Create Account" : "Sign In"}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-gray-200 text-center">
                {isSignUp ? (
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <button
                      onClick={() => setIsSignUp(false)}
                      className="font-medium text-purple-600 hover:text-purple-800 transition-colors"
                    >
                      Sign in
                    </button>
                  </p>
                ) : (
                  <p className="text-gray-600">
                    Don&apos;t have an account yet?{" "}
                    <button
                      onClick={() => setIsSignUp(true)}
                      className="font-medium text-purple-600 hover:text-purple-800 transition-colors"
                    >
                      Create account
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="text-center mt-6 text-sm text-gray-500">
            <p>
              By signing in, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}
