-- YEA database schema. Run once on a fresh project:
-- Supabase dashboard → SQL Editor → New query → paste this file → Run.
-- On a project that still has the old schema, run reset.sql first.

-- ---------------------------------------------------------------------------
-- Profiles (one per auth user, created automatically on sign-up)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Google sign-ins carry the person's name; email sign-ups fall back to the
  -- part of the address before the @. Display only, never used for access.
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Give users who signed up before this schema existed a profile too.
insert into public.profiles (id, display_name)
select id, split_part(email, '@', 1) from auth.users
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Public content (managed by staff in the Table Editor)
-- ---------------------------------------------------------------------------
create table public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  difficulty text,
  start_date date,
  created_at timestamptz not null default now()
);

create table public.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  module_number int not null,
  title text not null,
  content_url text,
  unique (course_id, module_number)
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date timestamptz,
  location text,
  created_at timestamptz not null default now()
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text,
  description text,
  deadline date,
  created_at timestamptz not null default now()
);

-- A mentor is a user: mentors.id is that user's profile id.
create table public.mentors (
  id uuid primary key references public.profiles (id) on delete cascade,
  bio text,
  expertise text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Member activity (each user sees only their own rows)
-- ---------------------------------------------------------------------------
create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create table public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  event_id uuid not null references public.events (id) on delete cascade,
  token uuid not null unique default gen_random_uuid(),
  checked_in boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, event_id)
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs (id) on delete cascade,
  applicant_id uuid not null references auth.users (id) on delete cascade,
  cv_url text not null,
  notes text,
  status text not null default 'submitted',
  created_at timestamptz not null default now(),
  unique (job_id, applicant_id)
);

create table public.mentor_requests (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references public.mentors (id) on delete cascade,
  mentee_id uuid not null references auth.users (id) on delete cascade,
  message text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  unique (mentee_id, mentor_id)
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.programs enable row level security;
alter table public.courses enable row level security;
alter table public.course_modules enable row level security;
alter table public.events enable row level security;
alter table public.jobs enable row level security;
alter table public.mentors enable row level security;
alter table public.enrollments enable row level security;
alter table public.event_registrations enable row level security;
alter table public.applications enable row level security;
alter table public.mentor_requests enable row level security;

grant usage on schema public to anon, authenticated;

-- Content: anyone can read. Writes happen in the dashboard, which bypasses RLS.
grant select on public.programs, public.courses, public.course_modules, public.events, public.jobs, public.mentors
  to anon, authenticated;

create policy "Content is public" on public.programs for select using (true);
create policy "Content is public" on public.courses for select using (true);
create policy "Content is public" on public.course_modules for select using (true);
create policy "Content is public" on public.events for select using (true);
create policy "Content is public" on public.jobs for select using (true);
create policy "Content is public" on public.mentors for select using (true);

-- Profiles: mentors' names are public; everyone else's are private to them.
grant select on public.profiles to anon, authenticated;
grant update (display_name) on public.profiles to authenticated;

create policy "Mentor profiles are public, others private" on public.profiles for select
  using (id = (select auth.uid()) or exists (select 1 from public.mentors m where m.id = profiles.id));
create policy "Users update their own profile" on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- Member activity: insert and read your own rows. Status fields can only start
-- at their initial value; staff change them in the dashboard.
grant select, insert on public.enrollments, public.event_registrations, public.applications, public.mentor_requests
  to authenticated;

create policy "Users read their enrollments" on public.enrollments for select to authenticated
  using (user_id = (select auth.uid()));
create policy "Users enroll themselves" on public.enrollments for insert to authenticated
  with check (user_id = (select auth.uid()) and status = 'active');

create policy "Users read their registrations" on public.event_registrations for select to authenticated
  using (user_id = (select auth.uid()));
create policy "Users register themselves" on public.event_registrations for insert to authenticated
  with check (user_id = (select auth.uid()) and checked_in = false);

create policy "Users read their applications" on public.applications for select to authenticated
  using (applicant_id = (select auth.uid()));
create policy "Users apply as themselves" on public.applications for insert to authenticated
  with check (applicant_id = (select auth.uid()) and status = 'submitted');

create policy "Mentees and mentors read their requests" on public.mentor_requests for select to authenticated
  using (mentee_id = (select auth.uid()) or mentor_id = (select auth.uid()));
create policy "Users request as themselves" on public.mentor_requests for insert to authenticated
  with check (mentee_id = (select auth.uid()) and status = 'pending');

-- ---------------------------------------------------------------------------
-- Event check-in. Whoever scans the QR code may not be signed in, and RLS
-- hides other people's registrations, so check-in goes through this function.
-- The token in the QR code is the secret that authorises it.
-- ---------------------------------------------------------------------------
create function public.check_in(p_event_id uuid, p_token uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.event_registrations
  set checked_in = true
  where event_id = p_event_id and token = p_token;
  return found;
end;
$$;

revoke execute on function public.check_in(uuid, uuid) from public;
grant execute on function public.check_in(uuid, uuid) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Storage: public bucket for check-in QR codes
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('qr-codes', 'qr-codes', true)
on conflict (id) do nothing;

-- The upload uses upsert, which needs insert, select and update.
create policy "Signed-in users upload QR codes" on storage.objects for insert to authenticated
  with check (bucket_id = 'qr-codes');
create policy "Signed-in users read QR codes" on storage.objects for select to authenticated
  using (bucket_id = 'qr-codes');
create policy "Users replace their own QR codes" on storage.objects for update to authenticated
  using (bucket_id = 'qr-codes' and owner_id = (select auth.uid())::text);
