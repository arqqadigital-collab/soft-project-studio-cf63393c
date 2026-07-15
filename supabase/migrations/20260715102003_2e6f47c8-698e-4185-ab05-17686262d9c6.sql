
ALTER TABLE public.homepage_hero
  ADD COLUMN IF NOT EXISTS heading_line1_color text NOT NULL DEFAULT '#ffffff',
  ADD COLUMN IF NOT EXISTS heading_line2_from text NOT NULL DEFAULT '#3b82f6',
  ADD COLUMN IF NOT EXISTS heading_line2_to text NOT NULL DEFAULT '#22d3ee',
  ADD COLUMN IF NOT EXISTS subheadline_color text NOT NULL DEFAULT '#e5e7ebcc',
  ADD COLUMN IF NOT EXISTS cta_bg_from text NOT NULL DEFAULT '#3b82f6',
  ADD COLUMN IF NOT EXISTS cta_bg_to text NOT NULL DEFAULT '#22d3ee',
  ADD COLUMN IF NOT EXISTS cta_text_color text NOT NULL DEFAULT '#ffffff',
  ADD COLUMN IF NOT EXISTS heading_size text NOT NULL DEFAULT 'lg' CHECK (heading_size IN ('sm','md','lg','xl')),
  ADD COLUMN IF NOT EXISTS text_align text NOT NULL DEFAULT 'center' CHECK (text_align IN ('left','center','right')),
  ADD COLUMN IF NOT EXISTS vertical_position text NOT NULL DEFAULT 'center' CHECK (vertical_position IN ('top','center','bottom'));
