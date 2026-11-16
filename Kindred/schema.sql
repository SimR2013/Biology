-- Kindred database schema. Run once in Supabase SQL Editor.
-- Never use a service_role key in the browser.
create extension if not exists pgcrypto;
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  city text,
  age integer check(age between 1 and 120),
  interests text[] not null default '{}',
  availability text[] not null default '{}',
  activities text[] not null default '{}',
  max_distance numeric check(max_distance between 0 and 500),
  commitment text,
  created_at timestamptz not null default now()
);
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check(length(name) between 2 and 120),
  description text,
  city text not null,
  contact_email text not null,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null,
  city text not null,
  min_age int not null default 16 check(min_age between 1 and 120),
  estimated_hours numeric not null default 2 check(estimated_hours > 0 and estimated_hours <= 24),
  schedule text not null default 'Flexible',
  commitment text not null default 'One-time',
  activity text not null default 'Hands-on',
  distance_miles numeric check(distance_miles between 0 and 500),
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  message text not null,
  status text not null default 'pending' check(status in ('pending','accepted','declined','completed','cancelled')),
  created_at timestamptz not null default now(),
  unique(opportunity_id,user_id)
);
create table if not exists public.saved_opportunities (
  user_id uuid not null references auth.users(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  primary key(user_id,opportunity_id)
);
create table if not exists public.volunteer_sessions (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  hours numeric not null check(hours > 0 and hours <= 24),
  notes text,
  status text not null default 'pending' check(status in ('pending','verified','rejected')),
  created_at timestamptz not null default now()
);
-- Admin membership is managed only via SQL/service role, never by the browser.
create table if not exists public.platform_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
create or replace function public.is_platform_admin() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.platform_admins where user_id=auth.uid());
$$;
-- Prevent client-side spoofing of verification, review status, and session status.
create or replace function public.guard_kindred_changes() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if tg_table_name = 'organizations' then
    if (tg_op='INSERT' and new.verified) or (tg_op='UPDATE' and new.verified is distinct from old.verified) then
      if not public.is_platform_admin() then raise exception 'Only admins can verify organizations'; end if;
    end if;
  elsif tg_table_name='applications' then
    if tg_op='INSERT' then
      new.status:='pending';
    else
      if new.opportunity_id<>old.opportunity_id or new.user_id<>old.user_id then
        raise exception 'Application ownership cannot change';
      end if;
      if new.status<>old.status and not exists(
        select 1 from public.opportunities p join public.organizations o on o.id=p.organization_id
        where p.id=old.opportunity_id and o.owner_id=auth.uid()
      ) and not public.is_platform_admin() then raise exception 'Only organization owners can review applications'; end if;
    end if;
  elsif tg_table_name='volunteer_sessions' then
    if tg_op='INSERT' then
      new.status:='pending';
    else
      if new.user_id<>old.user_id or new.organization_id<>old.organization_id or new.application_id<>old.application_id then
        raise exception 'Session ownership cannot change';
      end if;
      if new.status<>old.status and not exists(select 1 from public.organizations o where o.id=old.organization_id and o.owner_id=auth.uid()) and not public.is_platform_admin() then
        raise exception 'Only organization owners can verify hours';
      end if;
    end if;
  end if;
  return new;
end; $$;
drop trigger if exists guard_org on public.organizations;
create trigger guard_org before insert or update on public.organizations for each row execute function public.guard_kindred_changes();
drop trigger if exists guard_app on public.applications;
create trigger guard_app before insert or update on public.applications for each row execute function public.guard_kindred_changes();
drop trigger if exists guard_sessions on public.volunteer_sessions;
create trigger guard_sessions before insert or update on public.volunteer_sessions for each row execute function public.guard_kindred_changes();

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.opportunities enable row level security;
alter table public.applications enable row level security;
alter table public.saved_opportunities enable row level security;
alter table public.volunteer_sessions enable row level security;
alter table public.platform_admins enable row level security;

create policy "Read own profile" on public.profiles for select to authenticated using(id=auth.uid());
create policy "Create own profile" on public.profiles for insert to authenticated with check(id=auth.uid());
create policy "Edit own profile" on public.profiles for update to authenticated using(id=auth.uid()) with check(id=auth.uid());

create policy "Public organizations" on public.organizations for select to anon,authenticated using(true);
create policy "Organization owner creates" on public.organizations for insert to authenticated with check(owner_id=auth.uid() and verified=false);
create policy "Organization owner updates" on public.organizations for update to authenticated using(owner_id=auth.uid()) with check(owner_id=auth.uid());
create policy "Organization owner deletes" on public.organizations for delete to authenticated using(owner_id=auth.uid());

create policy "Read active opportunities and owned listings" on public.opportunities for select to anon,authenticated using(active=true or exists(select 1 from public.organizations o where o.id=organization_id and o.owner_id=auth.uid()));
create policy "Owner posts opportunities" on public.opportunities for insert to authenticated with check(exists(select 1 from public.organizations o where o.id=organization_id and o.owner_id=auth.uid()));
create policy "Owner edits opportunities" on public.opportunities for update to authenticated using(exists(select 1 from public.organizations o where o.id=organization_id and o.owner_id=auth.uid())) with check(exists(select 1 from public.organizations o where o.id=organization_id and o.owner_id=auth.uid()));
create policy "Owner deletes opportunities" on public.opportunities for delete to authenticated using(exists(select 1 from public.organizations o where o.id=organization_id and o.owner_id=auth.uid()));

create policy "Read own or organization applications" on public.applications for select to authenticated using(user_id=auth.uid() or exists(select 1 from public.opportunities p join public.organizations o on o.id=p.organization_id where p.id=opportunity_id and o.owner_id=auth.uid()));
create policy "Volunteer applies if eligible" on public.applications for insert to authenticated with check(
 user_id=auth.uid() and status='pending' and exists(
 select 1 from public.opportunities p where p.id=opportunity_id and p.active=true
 and exists(select 1 from public.profiles pr where pr.id=auth.uid() and pr.age is not null and pr.age>=p.min_age)
 ));
create policy "Organization owner reviews" on public.applications for update to authenticated using(exists(select 1 from public.opportunities p join public.organizations o on o.id=p.organization_id where p.id=opportunity_id and o.owner_id=auth.uid())) with check(exists(select 1 from public.opportunities p join public.organizations o on o.id=p.organization_id where p.id=opportunity_id and o.owner_id=auth.uid()));

create policy "User sees saved" on public.saved_opportunities for select to authenticated using(user_id=auth.uid());
create policy "User saves" on public.saved_opportunities for insert to authenticated with check(user_id=auth.uid());
create policy "User unsaves" on public.saved_opportunities for delete to authenticated using(user_id=auth.uid());

create policy "Session owner and org read" on public.volunteer_sessions for select to authenticated using(user_id=auth.uid() or exists(select 1 from public.organizations o where o.id=organization_id and o.owner_id=auth.uid()));
create policy "Volunteer logs own accepted application" on public.volunteer_sessions for insert to authenticated with check(
 user_id=auth.uid() and status='pending' and date <= current_date
 and exists(select 1 from public.applications a join public.opportunities p on p.id=a.opportunity_id
 where a.id=application_id and a.user_id=auth.uid() and a.status in ('accepted','completed') and p.organization_id=organization_id));
create policy "Organization owner verifies sessions" on public.volunteer_sessions for update to authenticated
 using(exists(select 1 from public.organizations o where o.id=organization_id and o.owner_id=auth.uid()))
 with check(exists(select 1 from public.organizations o where o.id=organization_id and o.owner_id=auth.uid()));
-- No select/insert/update/delete policies for platform_admins; only privileged SQL can assign admins.
create index if not exists idx_kindred_ops_org on public.opportunities(organization_id);
create index if not exists idx_kindred_app_user on public.applications(user_id);
create index if not exists idx_kindred_sessions_user on public.volunteer_sessions(user_id);
