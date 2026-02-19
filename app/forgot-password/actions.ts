// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
"use server";

import { createServer } from "@/utils/supabase/server";

interface ForgotPasswordResult {
  error?: string;
  success?: string;
}

const NETWORK_ERROR_MESSAGE =
  "Unable to reach authentication service. Check your internet/VPN/proxy settings and try again.";

function normalizeEmail(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

export async function requestPasswordReset(
  formData: FormData
): Promise<ForgotPasswordResult> {
  const email = normalizeEmail(formData.get("email"));

  if (!email || !isValidEmail(email)) {
    return { error: "Please enter a valid email address." };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.SITE_URL ||
    "http://localhost:3000";

  const supabase = await createServer();

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${baseUrl}/reset-password`,
    });

    if (error) {
      return { error: error.message };
    }
  } catch (error) {
    if (isNetworkError(error)) {
      return { error: NETWORK_ERROR_MESSAGE };
    }

    return { error: "Unable to send password reset email right now. Please try again." };
  }

  return {
    success:
      "If an account exists for this email, a password reset link has been sent.",
  };
}
