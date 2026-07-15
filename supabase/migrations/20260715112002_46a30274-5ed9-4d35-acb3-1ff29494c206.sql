
create table public.nav_groups (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  slug text not null unique,
  position int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.nav_groups to anon;
grant select, insert, update, delete on public.nav_groups to authenticated;
grant all on public.nav_groups to service_role;
alter table public.nav_groups enable row level security;
create policy "nav_groups public read" on public.nav_groups for select using (true);
create policy "nav_groups admin write" on public.nav_groups for all to authenticated
  using (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'editor'))
  with check (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'editor'));
create trigger nav_groups_set_updated_at before update on public.nav_groups
  for each row execute function public.set_updated_at();

create table public.nav_sections (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.nav_groups(id) on delete cascade,
  label text not null,
  description text,
  href text,
  position int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.nav_sections to anon;
grant select, insert, update, delete on public.nav_sections to authenticated;
grant all on public.nav_sections to service_role;
alter table public.nav_sections enable row level security;
create policy "nav_sections public read" on public.nav_sections for select using (true);
create policy "nav_sections admin write" on public.nav_sections for all to authenticated
  using (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'editor'))
  with check (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'editor'));
create trigger nav_sections_set_updated_at before update on public.nav_sections
  for each row execute function public.set_updated_at();
create index nav_sections_group_id_idx on public.nav_sections(group_id, position);

alter table public.pages
  add column if not exists section_id uuid references public.nav_sections(id) on delete set null,
  add column if not exists nav_label text,
  add column if not exists position int not null default 0;
create index if not exists pages_section_id_idx on public.pages(section_id, position);

insert into public.nav_groups (label, slug, position) values
  ('HealthCare','healthcare',0),
  ('ERP & Business','erp-business',1),
  ('Services','services',2),
  ('Company','company',3);

do $$
declare g uuid;
begin
  select id into g from public.nav_groups where slug='healthcare';
  insert into public.nav_sections (group_id,label,description,position) values
    (g,'Hospital & Clinical Systems','Core hospital and clinic platforms',0),
    (g,'Specialized Clinical Modules','Targeted modules for specialized care',1),
    (g,'Medical Imaging','PACS, archiving and AI imaging',2),
    (g,'Compliance & Interoperability','Regional compliance and standards',3),
    (g,'Healthcare AI','Clinical AI and readiness',4),
    (g,'Patient Engagement & Identity','Patient portals and identity management',5),
    (g,'Revenue Cycle & Financial Performance','Billing and financial operations',6);

  select id into g from public.nav_groups where slug='erp-business';
  insert into public.nav_sections (group_id,label,description,position) values
    (g,'ERP Platforms','Enterprise resource planning suites',0),
    (g,'Business Verticals (ERP)','Industry-tailored ERP solutions',1);

  select id into g from public.nav_groups where slug='services';
  insert into public.nav_sections (group_id,label,description,href,position) values
    (g,'Cybersecurity','Protect your digital estate','/services/cybersecurity',0),
    (g,'Consulting','Strategy and advisory','/services/consulting',1),
    (g,'Implementation & Integration','Deploy and integrate','/services/implementation',2),
    (g,'Staff Aug & Managed Services','Talent and managed ops','/services/staff-aug',3),
    (g,'Learning & Knowledge','Enablement and training','/services/learning',4);

  select id into g from public.nav_groups where slug='company';
  insert into public.nav_sections (group_id,label,description,position) values
    (g,'Company','Our story and mission',0),
    (g,'Resources','Insights and updates',1);
end $$;
