-- Persists Media Library folder names so a newly created folder shows up
-- (and stays visible) even before any file has been uploaded into it.
-- Previously "folders" only existed implicitly as a distinct value on
-- media.folder, so an empty folder had nowhere to be remembered.
create table if not exists public.media_folders (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

alter table public.media_folders enable row level security;

create policy "Admin/editor manage media folders"
  on public.media_folders for all
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'editor'))
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'editor'));

create policy "Authed users read media folders"
  on public.media_folders for select
  using (auth.uid() is not null);

insert into public.media_folders (name) values ('root'), ('page-content'), ('code-videos')
on conflict (name) do nothing;
