// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
import { createServer } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_REDIRECT_PATH = "/dashboard";

function sanitizeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_REDIRECT_PATH;
  }

  return value;
}

function buildLoginErrorUrl(request: NextRequest): URL {
  const url = new URL("/login", request.url);
  url.searchParams.set("authError", "google_callback_failed");
  return url;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextPath = sanitizeNextPath(requestUrl.searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(buildLoginErrorUrl(request));
  }

  const supabase = await createServer();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(buildLoginErrorUrl(request));
  }

  return NextResponse.redirect(new URL(nextPath, request.url));
}
