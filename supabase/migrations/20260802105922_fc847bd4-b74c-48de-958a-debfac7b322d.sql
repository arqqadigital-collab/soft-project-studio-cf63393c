update page_sections
set data = jsonb_build_object(
  'section_name', 'Integrations',
  'eyebrow', 'Integrations',
  'heading', 'Certified Across Every GCC National Health Platform',
  'body', data->>'body',
  'sliderLabel', 'National Platform Integrations',
  'items', jsonb_build_array(
    jsonb_build_object('name','Malaffi — Abu Dhabi HIE','logo','https://pahfisskacgnxiphyrrh.supabase.co/storage/v1/object/sign/media/migrated/ae52ecb3-54bc-4d8c-942c-0b51a97e4967.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNjQ4NDVhOC02MDhkLTQ2ZGItYTQ3Yi04ZTcxYTI2NGE3ZTgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9taWdyYXRlZC9hZTUyZWNiMy01NGJjLTRkOGMtOTQyYy0wYjUxYTk3ZTQ5NjcucG5nIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4NTY2NzUxNywiZXhwIjoyMTAxMDI3NTE3fQ.SmETRFj4Tf0vCQSJG5HG_clB9TU4k9xExxzmGhCgoxI'),
    jsonb_build_object('name','Riayati — UAE National HIE','logo','https://pahfisskacgnxiphyrrh.supabase.co/storage/v1/object/sign/media/migrated/b0cece26-5a50-4ce4-85c3-0bd8bb9ee4b5.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNjQ4NDVhOC02MDhkLTQ2ZGItYTQ3Yi04ZTcxYTI2NGE3ZTgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9taWdyYXRlZC9iMGNlY2UyNi01YTUwLTRjZTQtODVjMy0wYmQ4YmI5ZWU0YjUucG5nIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4NTY2NzUxOSwiZXhwIjoyMTAxMDI3NTE5fQ.X-fHNrywjBIR71NQNimxiXw_YVLvqmSDP-x42jbSchc'),
    jsonb_build_object('name','Department of Health — Abu Dhabi','logo','https://pahfisskacgnxiphyrrh.supabase.co/storage/v1/object/sign/media/migrated/6780bbfb-c8c1-4335-a8a5-1fcb8395486a.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNjQ4NDVhOC02MDhkLTQ2ZGItYTQ3Yi04ZTcxYTI2NGE3ZTgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9taWdyYXRlZC82NzgwYmJmYi1jOGMxLTQzMzUtYThhNS0xZmNiODM5NTQ4NmEucG5nIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4NTY2NzUxOCwiZXhwIjoyMTAxMDI3NTE4fQ.WvpiCxICV_lPfChrY9MBVcY0qDLxSE2dS7yk5I-IYe4'),
    jsonb_build_object('name','NHRA Bahrain','logo','https://pahfisskacgnxiphyrrh.supabase.co/storage/v1/object/sign/media/migrated/2f3469ca-d44e-4eeb-b043-3c9a5a10cea5.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNjQ4NDVhOC02MDhkLTQ2ZGItYTQ3Yi04ZTcxYTI2NGE3ZTgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9taWdyYXRlZC8yZjM0NjljYS1kNDRlLTRlZWItYjA0My0zYzlhNWExMGNlYTUucG5nIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4NTY2NzUxOSwiZXhwIjoyMTAxMDI3NTE5fQ.XIfjektVGKJ8cTuxxRnWdVWnBcrZNKcrXRBDsynJsGk')
  )
)
where id = '4760fd8f-3fd3-4d8f-aae9-ffcb887b7274';