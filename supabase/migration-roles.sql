-- เพิ่ม viewer_all + editor_all (ดู/แก้ทั้ง 2 module)
-- รันใน Supabase SQL Editor

insert into roles (role_code, role_name, description) values
  ('viewer_all', 'Viewer - All',  'ดูได้ทั้งยาและเครื่องมือ (ไม่แก้ไข)'),
  ('editor_all', 'Editor - All',  'แก้ไขได้ทั้งยาและเครื่องมือ')
on conflict (role_code) do nothing;

-- ===== Update RLS Policies =====

-- Items
drop policy if exists "items_write_pharmacy"    on items;
drop policy if exists "items_write_maintenance" on items;

create policy "items_write_pharmacy" on items for all to authenticated
  using (module_type = 'pharmacy'
         and current_role_code() in ('editor_pharmacy','editor_all','admin'))
  with check (module_type = 'pharmacy'
              and current_role_code() in ('editor_pharmacy','editor_all','admin'));

create policy "items_write_maintenance" on items for all to authenticated
  using (module_type = 'maintenance'
         and current_role_code() in ('editor_maintenance','editor_all','admin'))
  with check (module_type = 'maintenance'
              and current_role_code() in ('editor_maintenance','editor_all','admin'));

-- pharmacy_items
drop policy if exists "pharmacy_write" on pharmacy_items;
create policy "pharmacy_write" on pharmacy_items for all to authenticated
  using (current_role_code() in ('editor_pharmacy','editor_all','admin'))
  with check (current_role_code() in ('editor_pharmacy','editor_all','admin'));

-- maintenance_items
drop policy if exists "maintenance_write" on maintenance_items;
create policy "maintenance_write" on maintenance_items for all to authenticated
  using (current_role_code() in ('editor_maintenance','editor_all','admin'))
  with check (current_role_code() in ('editor_maintenance','editor_all','admin'));

-- locations
drop policy if exists "locations_write" on locations;
create policy "locations_write" on locations for all to authenticated
  using (current_role_code() in ('editor_pharmacy','editor_maintenance','editor_all','admin'))
  with check (current_role_code() in ('editor_pharmacy','editor_maintenance','editor_all','admin'));

-- nfc_mappings
drop policy if exists "nfc_write" on nfc_mappings;
create policy "nfc_write" on nfc_mappings for all to authenticated
  using (current_role_code() in ('editor_pharmacy','editor_maintenance','editor_all','admin'))
  with check (current_role_code() in ('editor_pharmacy','editor_maintenance','editor_all','admin'));
