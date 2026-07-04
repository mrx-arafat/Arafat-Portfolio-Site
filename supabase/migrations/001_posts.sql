-- Native blog schema — run in Supabase SQL Editor (Dashboard -> SQL Editor -> New query)

create table if not exists posts (
  id          uuid primary key default gen_random_uuid(),
  type        text not null check (type in ('essay', 'note')),
  category    text check (
    type = 'note' and category is null
    or type = 'essay' and category in ('security', 'engineering', 'business', 'psychology', 'life')
  ),
  slug        text not null,
  title       text not null,
  description text not null default '',
  content_md  text not null,
  tags        text[] not null default '{}',
  date        date not null default current_date,
  draft       boolean not null default true,
  cover_url   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (type, slug)
);

create index if not exists posts_published_idx on posts (draft, date desc);
create index if not exists posts_category_idx on posts (category) where type = 'essay';
create index if not exists posts_tags_idx on posts using gin (tags);

-- updated_at maintenance
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists posts_updated_at on posts;
create trigger posts_updated_at before update on posts
  for each row execute function set_updated_at();

-- RLS: anyone may read published posts; all writes require the secret (service role) key,
-- which bypasses RLS — so no write policies are defined at all.
alter table posts enable row level security;

drop policy if exists "public read published" on posts;
create policy "public read published" on posts
  for select using (draft = false);

-- Public image bucket for post covers + inline images
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

drop policy if exists "public read blog images" on storage.objects;
create policy "public read blog images" on storage.objects
  for select using (bucket_id = 'blog-images');
