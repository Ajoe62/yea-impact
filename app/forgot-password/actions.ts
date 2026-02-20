// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
"use server";

import { createServer } from "@/utils/supabase/server";
import { getBaseUrl } from "@/utils/auth/get-base-url";
import { mapForgotPasswordOutcome, toAuthErrorDetails } from "@/utils/auth/error-mapping";

interface ForgotPasswordResult {
  error?: string;
  success?: string;
  retryAfterSeconds?: number;
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

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function requestPasswordReset(
  formData: FormData
): Promise<ForgotPasswordResult> {
  const email = normalizeEmail(formData.get("email"));

  if (!email || !isValidEmail(email)) {
    return { error: "Please enter a valid email address." };
  }

  const baseUrl = getBaseUrl();

  const supabase = await createServer();

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${baseUrl}/reset-password`,
    });

    if (error) {
      const mapped = mapForgotPasswordOutcome(toAuthErrorDetails(error));
      if (mapped.asSuccess) {
        return {
          success: mapped.message,
          retryAfterSeconds: mapped.retryAfterSeconds,
        };
      }

      return { error: mapped.message };
    }
  } catch (error) {
    if (isNextRedirectError(error)) {
      throw error;
    }

    const mapped = mapForgotPasswordOutcome(toAuthErrorDetails(error));
    if (mapped.asSuccess) {
      return {
        success: mapped.message,
        retryAfterSeconds: mapped.retryAfterSeconds,
      };
    }
    return { error: mapped.message };
  }

  return {
    success:
      "If an account exists for this email, a password reset link has been sent.",
  };
}
