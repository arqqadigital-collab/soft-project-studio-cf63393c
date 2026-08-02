update page_sections s
set data = jsonb_set(
  jsonb_set(s.data, '{items}', (
    select h.data->'items' from page_sections h join pages hp on hp.id=h.page_id
    where hp.slug='his' and h.data->>'section_name'='Integrations' limit 1
  )),
  '{sliderLabel}', '"National Platforms"'
)
from pages p
where p.id = s.page_id and p.slug='rcm' and s.data->>'section_name'='Integrations';