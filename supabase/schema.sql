create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null default '',
  phone text not null default '',
  location text not null default '',
  description text not null default '',
  avatar text not null default '',
  role text not null check (role in ('homeowner', 'mason')),
  skills text[] not null default '{}',
  experience text not null default '',
  portfolio text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  budget text not null default '',
  images text[] not null default '{}',
  location_lat double precision not null default 0,
  location_lng double precision not null default 0,
  homeowner_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'open' check (status in ('open', 'assigned', 'completed')),
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  chat_id text not null,
  text text not null default '',
  sender_id uuid not null references auth.users(id) on delete cascade,
  sender_name text not null default '',
  image text not null default '',
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.jobs enable row level security;
alter table public.messages enable row level security;

drop policy if exists "users_select_own" on public.users;
create policy "users_select_own" on public.users for select using (auth.uid() = id);

drop policy if exists "users_upsert_own" on public.users;
create policy "users_upsert_own" on public.users for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "jobs_read_auth" on public.jobs;
create policy "jobs_read_auth" on public.jobs for select using (auth.role() = 'authenticated');

drop policy if exists "jobs_write_auth" on public.jobs;
create policy "jobs_write_auth" on public.jobs for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "messages_read_auth" on public.messages;
create policy "messages_read_auth" on public.messages for select using (auth.role() = 'authenticated');

drop policy if exists "messages_write_auth" on public.messages;
create policy "messages_write_auth" on public.messages for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('job-images', 'job-images', true)
on conflict (id) do nothing;

drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read" on storage.objects for select using (bucket_id = 'avatars');

drop policy if exists "avatars_auth_write" on storage.objects;
create policy "avatars_auth_write" on storage.objects for insert with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

drop policy if exists "avatars_auth_update" on storage.objects;
create policy "avatars_auth_update" on storage.objects for update using (bucket_id = 'avatars' and auth.role() = 'authenticated');

drop policy if exists "job_images_public_read" on storage.objects;
create policy "job_images_public_read" on storage.objects for select using (bucket_id = 'job-images');

drop policy if exists "job_images_auth_write" on storage.objects;
create policy "job_images_auth_write" on storage.objects for insert with check (bucket_id = 'job-images' and auth.role() = 'authenticated');

drop policy if exists "job_images_auth_update" on storage.objects;
create policy "job_images_auth_update" on storage.objects for update using (bucket_id = 'job-images' and auth.role() = 'authenticated');
