-- AbbyTraining · Supabase SQL Editor · einmal ausführen
create table if not exists public.abby_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  start_date date not null,
  updated_at timestamptz not null default now()
);
create table if not exists public.abby_training_days (
  user_id uuid not null references auth.users(id) on delete cascade,
  training_date date not null,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, training_date)
);
alter table public.abby_settings enable row level security;
alter table public.abby_training_days enable row level security;
revoke all on public.abby_settings from anon, authenticated;
revoke all on public.abby_training_days from anon, authenticated;
grant select,insert,update on public.abby_settings to authenticated;
grant select,insert,update on public.abby_training_days to authenticated;
create policy "abby_settings_select_own" on public.abby_settings
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "abby_settings_insert_own" on public.abby_settings
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "abby_settings_update_own" on public.abby_settings
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "abby_days_select_own" on public.abby_training_days
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "abby_days_insert_own" on public.abby_training_days
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "abby_days_update_own" on public.abby_training_days
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
-- Only signed-in users can access their own rows, never anyone else's.
-- Realtime publication not required; app polls when foregrounded.