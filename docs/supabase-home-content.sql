create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create table if not exists public.home_page_content (
  page_key text primary key default 'home',
  hero_title text not null default 'Arte que te encontra_',
  hero_image_url text,
  presentation_video_url text,
  updated_at timestamptz not null default now()
);

alter table public.collections enable row level security;
alter table public.artworks enable row level security;
alter table public.home_page_content enable row level security;
alter table storage.objects enable row level security;

drop policy if exists "Public read collections" on public.collections;
create policy "Public read collections"
on public.collections
for select
using (true);

drop policy if exists "Admin insert collections" on public.collections;
create policy "Admin insert collections"
on public.collections
for insert
with check (
  exists (select 1 from public.admin_users where user_id = auth.uid())
);

drop policy if exists "Admin update collections" on public.collections;
create policy "Admin update collections"
on public.collections
for update
using (
  exists (select 1 from public.admin_users where user_id = auth.uid())
)
with check (
  exists (select 1 from public.admin_users where user_id = auth.uid())
);

drop policy if exists "Admin delete collections" on public.collections;
create policy "Admin delete collections"
on public.collections
for delete
using (
  exists (select 1 from public.admin_users where user_id = auth.uid())
);

drop policy if exists "Public read artworks" on public.artworks;
create policy "Public read artworks"
on public.artworks
for select
using (true);

drop policy if exists "Admin insert artworks" on public.artworks;
create policy "Admin insert artworks"
on public.artworks
for insert
with check (
  exists (select 1 from public.admin_users where user_id = auth.uid())
);

drop policy if exists "Admin update artworks" on public.artworks;
create policy "Admin update artworks"
on public.artworks
for update
using (
  exists (select 1 from public.admin_users where user_id = auth.uid())
)
with check (
  exists (select 1 from public.admin_users where user_id = auth.uid())
);

drop policy if exists "Admin delete artworks" on public.artworks;
create policy "Admin delete artworks"
on public.artworks
for delete
using (
  exists (select 1 from public.admin_users where user_id = auth.uid())
);

drop policy if exists "Public read home page content" on public.home_page_content;
create policy "Public read home page content"
on public.home_page_content
for select
using (true);

drop policy if exists "Admin insert home page content" on public.home_page_content;
create policy "Admin insert home page content"
on public.home_page_content
for insert
with check (
  exists (select 1 from public.admin_users where user_id = auth.uid())
);

drop policy if exists "Admin update home page content" on public.home_page_content;
create policy "Admin update home page content"
on public.home_page_content
for update
using (
  exists (select 1 from public.admin_users where user_id = auth.uid())
)
with check (
  exists (select 1 from public.admin_users where user_id = auth.uid())
);

drop policy if exists "Admin delete home page content" on public.home_page_content;
create policy "Admin delete home page content"
on public.home_page_content
for delete
using (
  exists (select 1 from public.admin_users where user_id = auth.uid())
);

drop policy if exists "Public read daniela" on storage.objects;
create policy "Public read daniela"
on storage.objects
for select
using (bucket_id = 'daniela');

drop policy if exists "Admin insert daniela" on storage.objects;
create policy "Admin insert daniela"
on storage.objects
for insert
with check (
  bucket_id = 'daniela'
  and exists (select 1 from public.admin_users where user_id = auth.uid())
);

drop policy if exists "Admin update daniela" on storage.objects;
create policy "Admin update daniela"
on storage.objects
for update
using (
  bucket_id = 'daniela'
  and exists (select 1 from public.admin_users where user_id = auth.uid())
)
with check (
  bucket_id = 'daniela'
  and exists (select 1 from public.admin_users where user_id = auth.uid())
);

drop policy if exists "Admin delete daniela" on storage.objects;
create policy "Admin delete daniela"
on storage.objects
for delete
using (
  bucket_id = 'daniela'
  and exists (select 1 from public.admin_users where user_id = auth.uid())
);