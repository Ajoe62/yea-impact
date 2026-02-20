// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
export interface AuthErrorDetails {
  code?: string;
  message: string;
  status?: number;
}

export interface ForgotPasswordOutcome {
  asSuccess: boolean;
  message: string;
  retryAfterSeconds?: number;
}

export const AUTH_NETWORK_ERROR_MESSAGE =
  "We could not reach the authentication service. Check your internet connection and try again.";

function normalize(value: string | undefined): string {
  return (value ?? "").toLowerCase();
}

function hasAny(text: string, values: string[]): boolean {
  return values.some((value) => text.includes(value));
}

export function toAuthErrorDetails(error: unknown): AuthErrorDetails {
  if (error && typeof error === "object" && "message" in error) {
    const candidate = error as { code?: string; message?: string; status?: number };
    return {
      code: candidate.code,
      message: candidate.message ?? "Authentication request failed.",
      status: candidate.status,
    };
  }

  if (error instanceof Error) {
    const cause = error as Error & { cause?: { code?: string } };
    return {
      code: cause.cause?.code,
      message: error.message,
    };
  }

  return { message: "Authentication request failed." };
}

export function isNetworkAuthError(error: AuthErrorDetails): boolean {
  const message = normalize(error.message);
  const code = normalize(error.code);

  return (
    error.status === 503 ||
    error.status === 504 ||
    hasAny(code, [
      "und_err_socket",
      "econnreset",
      "etimedout",
      "err_ssl_sslv3_alert_illegal_parameter",
    ]) ||
    hasAny(message, [
      "fetch failed",
      "network request failed",
      "socket",
      "timed out",
      "other side closed",
      "sslv3 alert illegal parameter",
    ])
  );
}

export function isAuthRateLimitError(error: AuthErrorDetails): boolean {
  const message = normalize(error.message);
  const code = normalize(error.code);

  return (
    error.status === 429 ||
    hasAny(code, ["rate_limit", "over_email_send_rate_limit"]) ||
    hasAny(message, ["rate limit", "too many requests", "security purposes"])
  );
}

export function extractRetryAfterSeconds(error: AuthErrorDetails): number | null {
  const secondsMatch = error.message.match(/(\d+)\s*seconds?/i);
  if (secondsMatch) {
    return Number.parseInt(secondsMatch[1], 10);
  }

  const minutesMatch = error.message.match(/(\d+)\s*minutes?/i);
  if (minutesMatch) {
    return Number.parseInt(minutesMatch[1], 10) * 60;
  }

  return null;
}

export function mapLoginErrorMessage(error: AuthErrorDetails): string {
  const message = normalize(error.message);

  if (isNetworkAuthError(error)) {
    return AUTH_NETWORK_ERROR_MESSAGE;
  }

  if (isAuthRateLimitError(error)) {
    return "Too many sign-in attempts. Please wait a minute and try again.";
  }

  if (message.includes("email not confirmed")) {
    return "Please confirm your email before signing in.";
  }

  if (hasAny(message, ["invalid login credentials", "invalid credentials"])) {
    return "Invalid email or password.";
  }

  return "Unable to sign in right now. Please try again.";
}

export function mapSignupErrorMessage(error: AuthErrorDetails): string {
  const message = normalize(error.message);

  if (isNetworkAuthError(error)) {
    return AUTH_NETWORK_ERROR_MESSAGE;
  }

  if (isAuthRateLimitError(error)) {
    return "Too many sign-up attempts. Please wait a minute and try again.";
  }

  if (hasAny(message, ["user already registered", "already been registered"])) {
    return "An account with this email already exists. Try signing in instead.";
  }

  return "Unable to create your account right now. Please try again.";
}

export function mapForgotPasswordOutcome(error: AuthErrorDetails): ForgotPasswordOutcome {
  if (isAuthRateLimitError(error)) {
    return {
      asSuccess: true,
      message:
        "If an account exists for this email, a password reset link has been sent. If you requested recently, wait a moment before trying again.",
      retryAfterSeconds: extractRetryAfterSeconds(error) ?? 60,
    };
  }

  if (isNetworkAuthError(error)) {
    return {
      asSuccess: false,
      message: AUTH_NETWORK_ERROR_MESSAGE,
    };
  }

  return {
    asSuccess: false,
    message: "Unable to send password reset email right now. Please try again.",
  };
}

export function mapResetLinkVerificationErrorMessage(error: AuthErrorDetails): string {
  if (isNetworkAuthError(error)) {
    return "We could not verify this reset link right now. Check your internet connection and try again.";
  }

  return "This reset link is invalid or expired. Request a new one.";
}

export function mapResetPasswordUpdateErrorMessage(error: AuthErrorDetails): string {
  const message = normalize(error.message);

  if (isNetworkAuthError(error)) {
    return AUTH_NETWORK_ERROR_MESSAGE;
  }

  if (message.includes("same password")) {
    return "Please choose a new password that is different from your current one.";
  }

  if (message.includes("password")) {
    return "Password update failed. Use a stronger password and try again.";
  }

  return "Unable to update your password right now. Please try again.";
}

export function mapOAuthStartErrorMessage(error: AuthErrorDetails): string {
  const message = normalize(error.message);

  if (isNetworkAuthError(error)) {
    return AUTH_NETWORK_ERROR_MESSAGE;
  }

  if (isAuthRateLimitError(error)) {
    return "Too many sign-in attempts. Please wait a minute and try again.";
  }

  if (message.includes("provider is not enabled")) {
    return "Google sign-in is not available right now. Please use email and password.";
  }

  return "Unable to start Google sign-in right now. Please try again.";
}
