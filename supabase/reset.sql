-- Removes the old (pre-Astro) schema so schema.sql can run on a clean slate.
-- Run this once, before schema.sql, in the Supabase SQL Editor.
--
-- Safety: it refuses to run if any table in the public schema has rows, so it
-- can only ever remove empty tables. Auth users and stored files are not touched.

do $$
declare
  t text;
  n bigint;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('select count(*) from public.%I', t) into n;
    if n > 0 then
      raise exception 'Table public.% has % rows. Nothing was removed.', t, n;
    end if;
  end loop;

  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('drop table public.%I cascade', t);
  end loop;

  -- The old schema used enum types for status and age columns.
  for t in select typname from pg_type where typnamespace = 'public'::regnamespace and typtype = 'e' loop
    execute format('drop type public.%I cascade', t);
  end loop;
end;
$$;

drop function if exists public.gen_id();
drop function if exists public.check_in(uuid, uuid);
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Storage policies from schema.sql, so reset + schema can be run again.
drop policy if exists "Signed-in users upload QR codes" on storage.objects;
drop policy if exists "Signed-in users read QR codes" on storage.objects;
drop policy if exists "Users replace their own QR codes" on storage.objects;
