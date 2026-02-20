// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
"use server";

import { createServer } from "@/utils/supabase/server";
import { getBaseUrl } from "@/utils/auth/get-base-url";
import {
  mapLoginErrorMessage,
  mapOAuthStartErrorMessage,
  mapSignupErrorMessage,
  toAuthErrorDetails,
} from "@/utils/auth/error-mapping";
import { redirect } from "next/navigation";

interface AuthActionResult {
  error?: string;
  success?: string;
}

function isNextRedirectError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeDigest = (error as { digest?: string }).digest;
  return typeof maybeDigest === "string" && maybeDigest.startsWith("NEXT_REDIRECT");
}

function normalizeEmail(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function normalizePassword(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value : "";
}

function validateAuthInput(email: string, password: string): string | null {
  if (!email || !password) {
    return "Email and password are required.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Please enter a valid email address.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  return null;
}


async function signInAfterSignup(email: string, password: string): Promise<AuthActionResult> {
  try {
    const supabase = await createServer();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        return {
          success:
            "Account created. Please confirm your email address before signing in.",
        };
      }

      return { error: mapLoginErrorMessage(toAuthErrorDetails(error)) };
    }

    if (!data.session) {
      return {
        success: "Account created. Please sign in after verifying your email.",
      };
    }
  } catch (error) {
    const message = mapLoginErrorMessage(toAuthErrorDetails(error));
    if (message !== "Unable to sign in right now. Please try again.") {
      return { success: "Account created. Please sign in once network access is stable." };
    }

    return {
      success:
        "Account created. Please confirm your email and sign in from the login page.",
    };
  }

  redirect("/dashboard");
}

/**
 * Server Action to log in a user. Accepts form data with email/password
 * and calls Supabase Auth.
 */
export async function login(formData: FormData): Promise<AuthActionResult | void> {
  const email = normalizeEmail(formData.get("email"));
  const password = normalizePassword(formData.get("password"));

  const validationError = validateAuthInput(email, password);
  if (validationError) {
    return { error: validationError };
  }

  try {
    const supabase = await createServer();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: mapLoginErrorMessage(toAuthErrorDetails(error)) };
    }
  } catch (error) {
    if (isNextRedirectError(error)) {
      throw error;
    }

    return { error: mapLoginErrorMessage(toAuthErrorDetails(error)) };
  }

  redirect("/dashboard");
}

/**
 * Server Action to sign up a user. Accepts form data with email/password
 * and creates a Supabase user.
 */
export async function signup(formData: FormData): Promise<AuthActionResult | void> {
  const email = normalizeEmail(formData.get("email"));
  const password = normalizePassword(formData.get("password"));

  const validationError = validateAuthInput(email, password);
  if (validationError) {
    return { error: validationError };
  }

  try {
    const supabase = await createServer();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getBaseUrl()}/auth/confirm`,
      },
    });
    if (error) {
      return { error: mapSignupErrorMessage(toAuthErrorDetails(error)) };
    }

    if (!data.session) {
      return {
        success:
          "Account created. Check your email for a confirmation link before signing in.",
      };
    }
  } catch (error) {
    if (isNextRedirectError(error)) {
      throw error;
    }

    return { error: mapSignupErrorMessage(toAuthErrorDetails(error)) };
  }

  return signInAfterSignup(email, password);
}

export async function signInWithGoogle(): Promise<AuthActionResult | void> {
  try {
    const supabase = await createServer();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${getBaseUrl()}/auth/callback?next=/dashboard`,
        queryParams: {
          access_type: "offline",
          prompt: "select_account",
        },
      },
    });

    if (error) {
      return { error: mapOAuthStartErrorMessage(toAuthErrorDetails(error)) };
    }

    if (!data.url) {
      return { error: "Unable to start Google sign-in right now. Please try again." };
    }

    redirect(data.url);
  } catch (error) {
    if (isNextRedirectError(error)) {
      throw error;
    }

    return { error: mapOAuthStartErrorMessage(toAuthErrorDetails(error)) };
  }
}
