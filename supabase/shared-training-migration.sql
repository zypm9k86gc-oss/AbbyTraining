-- AbbyTraining: two individual accounts sharing one training plan.
-- This migration preserves all existing personal settings and training-day rows.
create schema if not exists private;
create table if not exists public.abby_group_members (
 group_owner_id uuid not null references auth.users(id) on delete cascade,
 member_id uuid not null unique references auth.users(id) on delete cascade,
 display_name text not null check (char_length(display_name) between 1 and 50),
 role text not null check (role in ('owner','member')),
 joined_at timestamptz not null default now(),
 primary key (group_owner_id,member_id),
 constraint abby_owner_role_consistency check (
  (role = 'owner' and group_owner_id = member_id) or
  (role = 'member' and group_owner_id <> member_id)
 )
);
create index if not exists abby_group_members_owner_idx on public.abby_group_members(group_owner_id);
create table if not exists private.abby_group_invites (
 group_owner_id uuid primary key references auth.users(id) on delete cascade,
 secret_hash text not null unique,
 expires_at timestamptz not null
);
create table if not exists public.abby_exercise_events (
 id uuid primary key default gen_random_uuid(),
 group_owner_id uuid not null references auth.users(id) on delete cascade,
 actor_id uuid not null references auth.users(id) on delete cascade,
 training_date date not null,
 exercise_id integer not null check(exercise_id between 1 and 11),
 performed_at timestamptz not null default now(),
 recorded_at timestamptz not null default now(),
 constraint abby_exercise_events_date_ok check(training_date between date '2020-01-01' and date '2100-12-31')
);
create index if not exists abby_exercise_events_owner_idx
 on public.abby_exercise_events(group_owner_id,performed_at desc);
create index if not exists abby_exercise_events_actor_idx
 on public.abby_exercise_events(actor_id);

-- Membership check runs internally with limited, fixed SQL and verifies the authenticated user.
-- Security-definer code resides in the non-exposed private schema.
create or replace function private.abby_can_access_owner(p_owner uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
 select (select auth.uid()) = p_owner
    or exists (select 1 from public.abby_group_members gm
               where gm.group_owner_id = p_owner and gm.member_id = (select auth.uid()))
$$;
revoke all on function private.abby_can_access_owner(uuid) from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.abby_can_access_owner(uuid) to authenticated;

-- Only the owner may generate/rotate a high-entropy 48-hour invitation.
create or replace function private.abby_issue_invite_impl(p_display_name text)
returns text language plpgsql security definer set search_path = ''
as $$
declare u uuid := auth.uid(); current_owner uuid; token text; name_clean text;
begin
 if u is null or coalesce(auth.jwt()->>'is_anonymous','false')='true' then
   raise exception 'Anmeldung erforderlich';
 end if;
 name_clean := btrim(coalesce(p_display_name,''));
 if char_length(name_clean) not between 1 and 50 then
   raise exception 'Bitte einen Namen mit 1 bis 50 Zeichen eingeben';
 end if;
 select m.group_owner_id into current_owner
   from public.abby_group_members m where m.member_id=u for update;
 if current_owner is not null and current_owner <> u then
   raise exception 'Nur die erste Person kann Einladungen erstellen';
 end if;
 if current_owner is null then
   insert into public.abby_group_members(group_owner_id,member_id,role,display_name)
     values(u,u,'owner',name_clean);
 else
   update public.abby_group_members set display_name=name_clean where member_id=u;
 end if;
 if (select count(*) from public.abby_group_members where group_owner_id=u) >= 2 then
   raise exception 'Es sind bereits zwei Personen in der Trainingsgruppe';
 end if;
 token := replace(pg_catalog.gen_random_uuid()::text,'-','') ||
          replace(pg_catalog.gen_random_uuid()::text,'-','');
 insert into private.abby_group_invites(group_owner_id,secret_hash,expires_at)
 values (u,encode(pg_catalog.sha256(pg_catalog.convert_to(token,'UTF8')),'hex'),now()+interval '48 hours')
 on conflict(group_owner_id) do update
 set secret_hash=excluded.secret_hash, expires_at=excluded.expires_at;
 return token;
end $$;
revoke all on function private.abby_issue_invite_impl(text) from public, anon;
grant execute on function private.abby_issue_invite_impl(text) to authenticated;

-- Redeeming code never exposes other groups; invitation is consumed once.
create or replace function private.abby_accept_invite_impl(p_token text,p_display_name text)
returns uuid language plpgsql security definer set search_path = ''
as $$
declare u uuid := auth.uid(); existing_owner uuid; group_owner uuid; clean_name text;
begin
 if u is null or coalesce(auth.jwt()->>'is_anonymous','false')='true' then
   raise exception 'Anmeldung erforderlich';
 end if;
 clean_name := btrim(coalesce(p_display_name,''));
 if char_length(clean_name) not between 1 and 50 then
   raise exception 'Bitte einen Namen mit 1 bis 50 Zeichen eingeben';
 end if;
 if char_length(btrim(coalesce(p_token,''))) <> 64
    or btrim(p_token) !~ '^[0-9a-fA-F]{64}$' then
   raise exception 'Ungültiger Einladungscode';
 end if;
 select i.group_owner_id into group_owner
   from private.abby_group_invites i
   where i.secret_hash = encode(pg_catalog.sha256(pg_catalog.convert_to(lower(btrim(p_token)),'UTF8')),'hex')
     and i.expires_at > now()
   for update;
 if group_owner is null then raise exception 'Code ungültig, abgelaufen oder bereits benutzt'; end if;
 if group_owner=u then raise exception 'Du gehörst bereits zur Trainingsgruppe'; end if;
 select m.group_owner_id into existing_owner
   from public.abby_group_members m where m.member_id=u for update;
 if existing_owner is not null then
   raise exception 'Dein Konto gehört bereits zu einer Trainingsgruppe';
 end if;
 if (select count(*) from public.abby_group_members where group_owner_id=group_owner)>=2 then
   raise exception 'Die Trainingsgruppe ist bereits voll';
 end if;
 insert into public.abby_group_members(group_owner_id,member_id,role,display_name)
 values(group_owner,u,'member',clean_name);
 delete from private.abby_group_invites where group_owner_id=group_owner;
 return group_owner;
end $$;
revoke all on function private.abby_accept_invite_impl(text,text) from public, anon;
grant execute on function private.abby_accept_invite_impl(text,text) to authenticated;

-- Invoker wrappers are exposed as PostgREST RPC endpoints, without definer rights.
create or replace function public.abby_issue_invite(p_display_name text)
returns text language sql security invoker set search_path = ''
as $$ select private.abby_issue_invite_impl(p_display_name) $$;
create or replace function public.abby_accept_invite(p_token text,p_display_name text)
returns uuid language sql security invoker set search_path = ''
as $$ select private.abby_accept_invite_impl(p_token,p_display_name) $$;
revoke all on function public.abby_issue_invite(text) from public, anon;
revoke all on function public.abby_accept_invite(text,text) from public, anon;
grant execute on function public.abby_issue_invite(text) to authenticated;
grant execute on function public.abby_accept_invite(text,text) to authenticated;

-- Keep existing personal rows intact; extend their access to invited second user.
alter table public.abby_settings enable row level security;
alter table public.abby_training_days enable row level security;
drop policy if exists "abby_settings_select_own" on public.abby_settings;
drop policy if exists "abby_settings_insert_own" on public.abby_settings;
drop policy if exists "abby_settings_update_own" on public.abby_settings;
drop policy if exists "abby_days_select_own" on public.abby_training_days;
drop policy if exists "abby_days_insert_own" on public.abby_training_days;
drop policy if exists "abby_days_update_own" on public.abby_training_days;
create policy "abby_settings_read_group" on public.abby_settings for select to authenticated
 using(private.abby_can_access_owner(user_id));
create policy "abby_settings_create_group" on public.abby_settings for insert to authenticated
 with check(private.abby_can_access_owner(user_id));
create policy "abby_settings_edit_group" on public.abby_settings for update to authenticated
 using(private.abby_can_access_owner(user_id))
 with check(private.abby_can_access_owner(user_id));
create policy "abby_days_read_group" on public.abby_training_days for select to authenticated
 using(private.abby_can_access_owner(user_id));
create policy "abby_days_create_group" on public.abby_training_days for insert to authenticated
 with check(private.abby_can_access_owner(user_id));
create policy "abby_days_edit_group" on public.abby_training_days for update to authenticated
 using(private.abby_can_access_owner(user_id))
 with check(private.abby_can_access_owner(user_id));

alter table public.abby_group_members enable row level security;
revoke all on public.abby_group_members from public,anon,authenticated;
grant select on public.abby_group_members to authenticated;
grant update(display_name) on public.abby_group_members to authenticated;
create policy "abby_members_read_group" on public.abby_group_members for select to authenticated
 using(private.abby_can_access_owner(group_owner_id));
create policy "abby_members_edit_own_name" on public.abby_group_members for update to authenticated
 using(member_id=(select auth.uid()))
 with check(member_id=(select auth.uid()));

alter table public.abby_exercise_events enable row level security;
revoke all on public.abby_exercise_events from public,anon,authenticated;
grant select on public.abby_exercise_events to authenticated;
grant insert(id,group_owner_id,actor_id,training_date,exercise_id,performed_at)
 on public.abby_exercise_events to authenticated;
create policy "abby_events_read_group" on public.abby_exercise_events for select to authenticated
 using(private.abby_can_access_owner(group_owner_id));
create policy "abby_events_log_as_self" on public.abby_exercise_events for insert to authenticated
 with check(actor_id=(select auth.uid()) and private.abby_can_access_owner(group_owner_id));
-- Existing owner-only tables retain the same column grants and no anonymous access.
notify pgrst, 'reload schema';