
create table public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  kind text not null,
  position int not null default 0,
  is_visible boolean not null default true,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.page_sections to anon;
grant select, insert, update, delete on public.page_sections to authenticated;
grant all on public.page_sections to service_role;
alter table public.page_sections enable row level security;
create policy "page_sections public read" on public.page_sections for select using (true);
create policy "page_sections admin write" on public.page_sections for all to authenticated
  using (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'editor'))
  with check (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'editor'));
create trigger page_sections_set_updated_at before update on public.page_sections
  for each row execute function public.set_updated_at();
create index page_sections_page_id_idx on public.page_sections(page_id, position);

-- Seed the HIS page + its sections
do $$
declare
  admin_id uuid;
  section_uuid uuid;
  his_id uuid;
begin
  select ur.user_id into admin_id from public.user_roles ur where ur.role='admin' limit 1;
  if admin_id is null then
    select id into admin_id from public.profiles limit 1;
  end if;
  if admin_id is null then return; end if;

  select id into section_uuid from public.nav_sections where label='Hospital & Clinical Systems' limit 1;

  insert into public.pages (title, slug, status, template, author_id, section_id, nav_label, position)
  values ('Hospital Information System (HIS)', 'his', 'published', 'landing', admin_id, section_uuid, 'HIS', 0)
  on conflict (slug) do update set section_id = excluded.section_id, nav_label = excluded.nav_label
  returning id into his_id;

  if his_id is null then
    select id into his_id from public.pages where slug='his';
  end if;

  delete from public.page_sections where page_id = his_id;

  insert into public.page_sections (page_id, kind, position, data) values
    (his_id, 'hero', 0, jsonb_build_object(
      'eyebrow','Hospital Information System',
      'headline','The Complete Hospital Information System',
      'subheadline','A single unified platform for every clinical, operational and financial workflow in your hospital — from patient registration to discharge, from lab result to billing settlement.',
      'ctaLabel','Talk to our team',
      'ctaHref','/contact',
      'mediaUrl','',
      'mediaKind','video'
    )),
    (his_id, 'stats', 1, jsonb_build_object(
      'heading','Measured outcomes from real HIS deployments',
      'items', jsonb_build_array(
        jsonb_build_object('value','1.2 days','label','Average reduction in length of stay within 12 months of full HIS go-live'),
        jsonb_build_object('value','11%','label','Average increase in net revenue per admission through automated charge capture'),
        jsonb_build_object('value','35%','label','Reduction in IT operational cost by replacing point solutions with unified HIS'),
        jsonb_build_object('value','94%','label','First-pass insurance claim acceptance with integrated revenue cycle management'),
        jsonb_build_object('value','Zero','label','Medication reconciliation failures reported across closed-loop medication clients'),
        jsonb_build_object('value','100%','label','Of HIS clients pursuing EMRAM Stage 6 achieved it within their target timeline')
      )
    )),
    (his_id, 'features', 2, jsonb_build_object(
      'heading','Every clinical, operational and financial function in one system',
      'subheading','One platform. One patient record. One workflow — from first registration to final settlement.',
      'items', jsonb_build_array(
        jsonb_build_object('icon','UserPlus','title','Patient Registration & Master Patient Index','description','Capture complete demographics, identity verification, insurance and consent at first registration.'),
        jsonb_build_object('icon','CalendarCheck','title','Outpatient & Appointment Management','description','Full outpatient cycle — booking, scheduling, waiting lists, check-in, consultation documentation.'),
        jsonb_build_object('icon','BedDouble','title','Inpatient Admission, Transfer & Discharge','description','Real-time bed visibility across every ward. Discharge summaries generated from structured data.'),
        jsonb_build_object('icon','FileText','title','Electronic Medical Records','description','A complete longitudinal EMR — one source of truth accessible to every authorized clinician.'),
        jsonb_build_object('icon','ClipboardList','title','Physician Order Management & CPOE','description','Clinical decision support at the point of every order — interactions, allergies, dose validation.'),
        jsonb_build_object('icon','HeartPulse','title','Nursing Clinical Documentation','description','Structured assessments, care plans, vitals, fluid balance, pain scoring — all electronic.'),
        jsonb_build_object('icon','Pill','title','Pharmacy & Medication Management','description','Closed-loop medication system with barcode-verified bedside administration.'),
        jsonb_build_object('icon','FlaskConical','title','Laboratory Information System','description','Integrated lab workflows fully connected to the clinical record with critical value alerts.'),
        jsonb_build_object('icon','Scan','title','Radiology Information System','description','Integrated order management, DICOM image linking and structured reporting with PACS.'),
        jsonb_build_object('icon','Receipt','title','Revenue Cycle & Billing','description','Charges captured automatically from clinical activity — no manual entry.'),
        jsonb_build_object('icon','BarChart3','title','Clinical Analytics & Executive Reporting','description','Real-time dashboards for census, occupancy, LOS, outcomes and revenue cycle.'),
        jsonb_build_object('icon','ShieldCheck','title','Compliance & Interoperability','description','HL7 FHIR, DICOM native. HIPAA, GDPR and GCC compliant.')
      )
    )),
    (his_id, 'faq', 3, jsonb_build_object(
      'heading','Frequently asked questions',
      'items', jsonb_build_array(
        jsonb_build_object('q','How long does a full HIS implementation take?','a','A community hospital typically completes in 4 to 6 months. A large general hospital with full module deployment typically takes 9 to 18 months.'),
        jsonb_build_object('q','Can HIS replace our existing systems module by module?','a','Both approaches are supported. Some clients implement HIS as a full replacement in a phased go-live; others adopt specific modules alongside existing systems.'),
        jsonb_build_object('q','How is clinical data migrated from our existing systems?','a','Clinical data is extracted, transformed, validated and loaded into the new system before go-live. A detailed migration plan is produced upfront.'),
        jsonb_build_object('q','Does the system support both cloud and on-premise deployment?','a','Yes. HIS is available as a cloud-hosted solution on regionally compliant infrastructure and as on-premise. Hybrid is also supported.')
      )
    )),
    (his_id, 'cta', 4, jsonb_build_object(
      'headline','Ready to unify your hospital?',
      'body','Talk to our team about a phased HIS deployment tailored to your facility.',
      'primaryLabel','Book a consultation',
      'primaryHref','/contact',
      'secondaryLabel','Download brochure',
      'secondaryHref','#'
    ));
end $$;
