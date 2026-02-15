// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
"use server";

import { createServer } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Server Action to log in a user.  Accepts form data with email and password
 * fields and calls Supabase Auth.  On success, redirects to the dashboard.
 */
export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = createServer();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: error.message };
  }
  // Redirect the user to the homepage after successful login.
  redirect('/');
}

/**
 * Server Action to sign up a user.  Accepts form data with email and password
 * and creates a new Supabase user.  After sign up, logs the user in.
 */
export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = createServer();
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    return { error: error.message };
  }
  // After sign up, log the user in automatically
  await supabase.auth.signInWithPassword({ email, password });
  redirect('/');
}