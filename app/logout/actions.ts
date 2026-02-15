"use server";

import { createServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

/**
 * Server Action to log out a user.
 */
export async function logout() {
  const supabase = await createServer();
  await supabase.auth.signOut();
  redirect("/");
}
