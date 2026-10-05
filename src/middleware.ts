import { defineMiddleware } from 'astro:middleware';
import { createSupabase } from './lib/supabase';

/**
 * Creates the per-request Supabase client and looks up the signed-in user.
 * Skipped for prerendered pages (the home page), which have no request.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  if (context.isPrerendered) return next();

  const supabase = createSupabase(context);
  context.locals.supabase = supabase;
  context.locals.user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return next();
});
