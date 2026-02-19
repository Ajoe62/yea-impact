// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const [supabase] = useState(() => createClient());
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [postResetNote, setPostResetNote] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function prepareRecoverySession() {
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      if (tokenHash && type === "recovery") {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "recovery",
        });

        if (!isMounted) {
          return;
        }

        if (verifyError) {
          setError("This reset link is invalid or expired. Request a new one.");
          setIsReady(false);
          setIsVerifying(false);
          return;
        }

        setIsReady(true);
        setIsVerifying(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (session) {
        setIsReady(true);
      } else {
        setError("Reset link session not found. Open the latest reset email link again.");
      }

      setIsVerifying(false);
    }

    void prepareRecoverySession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) {
        return;
      }
      if (session) {
        setIsReady(true);
        setError(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [searchParams, supabase]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting || !isReady || isComplete) {
      return;
    }

    setError(null);
    setPostResetNote(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setIsSubmitting(false);
      return;
    }

    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setPostResetNote(
        "Password updated. We could not end your current session automatically, but you can continue to sign in now."
      );
    }

    setPassword("");
    setConfirmPassword("");
    setIsComplete(true);
    setIsSubmitting(false);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="mb-2 text-center text-2xl font-semibold">Reset Password</h1>

        {isComplete ? (
          <div className="space-y-4">
            <p className="text-center text-sm text-green-700">
              Your password has been updated successfully.
            </p>
            {postResetNote ? <p className="text-center text-sm text-amber-700">{postResetNote}</p> : null}
            <Link
              href="/login"
              className="block w-full rounded-md bg-blue-600 py-2 text-center text-white hover:bg-blue-700"
            >
              Continue to sign in
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-4 text-center text-sm text-gray-600">
              Enter your new password to complete account recovery.
            </p>

            {isVerifying ? (
              <p className="text-center text-sm text-gray-600">Verifying reset link...</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="password" className="mb-1 block text-sm font-medium">
                    New password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting || !isReady}
                    autoComplete="new-password"
                    className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium">
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isSubmitting || !isReady}
                    autoComplete="new-password"
                    className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {error ? <p className="text-sm text-red-500">{error}</p> : null}

                <button
                  type="submit"
                  disabled={isSubmitting || !isReady}
                  className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Updating..." : "Update password"}
                </button>
              </form>
            )}

            <p className="pt-4 text-center text-sm">
              <Link href="/forgot-password" className="font-medium text-blue-600 hover:underline">
                Request a new reset link
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
