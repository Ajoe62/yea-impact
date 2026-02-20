// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
import { createServer } from "@/utils/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const CONFIRMATION_RESULT_PATH = "/auth/confirmed";

function buildResultUrl(request: NextRequest, status: "success" | "error"): URL {
  const url = new URL(CONFIRMATION_RESULT_PATH, request.url);
  url.searchParams.set("status", status);
  return url;
}

function toSupportedOtpType(value: string | null): EmailOtpType | null {
  if (!value) {
    return null;
  }

  if (value === "email" || value === "signup" || value === "email_change") {
    return value;
  }

  return null;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const code = requestUrl.searchParams.get("code");
  const otpType = toSupportedOtpType(requestUrl.searchParams.get("type"));

  const supabase = await createServer();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(buildResultUrl(request, "error"));
    }

    await supabase.auth.signOut();
    return NextResponse.redirect(buildResultUrl(request, "success"));
  }

  if (tokenHash && otpType) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: otpType,
    });

    if (error) {
      return NextResponse.redirect(buildResultUrl(request, "error"));
    }

    await supabase.auth.signOut();
    return NextResponse.redirect(buildResultUrl(request, "success"));
  }

  return NextResponse.redirect(buildResultUrl(request, "error"));
}
