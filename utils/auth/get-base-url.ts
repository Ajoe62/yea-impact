// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
/**
 * Returns a canonical application base URL for auth/email redirects.
 */
export function getBaseUrl(): string {
  const configuredBaseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_URL;

  if (!configuredBaseUrl) {
    return "http://localhost:3000";
  }

  const withProtocol = configuredBaseUrl.startsWith("http")
    ? configuredBaseUrl
    : `https://${configuredBaseUrl}`;

  return withProtocol.replace(/\/+$/, "");
}
