
DO $$
DECLARE g_id uuid; c_id uuid;
BEGIN
  INSERT INTO public.menu_groups(label, position, is_visible)
  VALUES ('Contact', 4, true) RETURNING id INTO g_id;

  INSERT INTO public.menu_columns(group_id, label, position, is_visible)
  VALUES (g_id, 'Contact', 0, true) RETURNING id INTO c_id;

  INSERT INTO public.menu_links(column_id, label, url, target, position, is_visible)
  VALUES (c_id, 'Contact', '/contact', '_self', 0, true);
END $$;
