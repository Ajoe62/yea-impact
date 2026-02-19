// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
"use server";

import { createServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const NETWORK_ERROR_MESSAGE =
  "Unable to reach authentication service. Check your internet/VPN/proxy settings and try again.";

interface AuthActionResult {
  error?: string;
  success?: string;
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

function isNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  if (message.includes("fetch failed")) {
    return true;
  }

  const cause = (error as Error & { cause?: { code?: string; reason?: string } }).cause;
  const causeCode = cause?.code ?? "";
  const causeReason = (cause?.reason ?? "").toLowerCase();

  return (
    causeCode === "ERR_SSL_SSLV3_ALERT_ILLEGAL_PARAMETER" ||
    causeReason.includes("sslv3 alert illegal parameter")
  );
}

async function signInAfterSignup(email: string, password: string): Promise<AuthActionResult> {
  const supabase = await createServer();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        return {
          success:
            "Account created. Please confirm your email address before signing in.",
        };
      }

      return { error: error.message };
    }

    if (!data.session) {
      return {
        success: "Account created. Please sign in after verifying your email.",
      };
    }
  } catch (error) {
    if (isNetworkError(error)) {
      return { success: "Account created. Please sign in once network access is stable." };
    }

    throw error;
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

  const supabase = await createServer();

  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: error.message };
    }
  } catch (error) {
    if (isNetworkError(error)) {
      return { error: NETWORK_ERROR_MESSAGE };
    }

    return { error: "Unexpected authentication error. Please try again." };
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

  const supabase = await createServer();

  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      return { error: error.message };
    }

    if (!data.session) {
      return {
        success:
          "Account created. Check your email for a confirmation link before signing in.",
      };
    }
  } catch (error) {
    if (isNetworkError(error)) {
      return { error: NETWORK_ERROR_MESSAGE };
    }

    return { error: "Unable to create account right now. Please try again." };
  }

  return signInAfterSignup(email, password);
}
