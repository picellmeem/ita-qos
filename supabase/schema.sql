-- ITA-QOS Database Schema (Supabase / PostgreSQL)
-- Run this in Supabase SQL Editor
-- Safe to run multiple times.

-- ===== Drop existing policies (idempotent) =====
do $$
declare r record;
begin
  for r in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('profiles','items','pharmacy_items','maintenance_items',
                        'locations','nfc_mappings','scan_logs','audit_logs','import_logs')
  loop
    execute format('drop policy if exists %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;
end $$;

-- ===== Roles =====
create table if not exists roles (
  role_code text primary key,
  role_name text not null,
  description text
);

insert into roles (role_code, role_name, description) values
  ('viewer_pharmacy',   'Viewer - Pharmacy',     'View pharmacy records'),
  ('editor_pharmacy',   'Editor - Pharmacy',     'Edit pharmacy records'),
  ('viewer_maintenance','Viewer - Maintenance',  'View maintenance records'),
  ('editor_maintenance','Editor - Maintenance',  'Edit maintenance records'),
  ('admin',             'System Admin',          'Full system access')
on conflict (role_code) do nothing;

-- ===== User profiles (linked to Supabase Auth) =====
create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  username text unique,
  role_code text references roles(role_code),
  department text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ===== Locations =====
create table if not exists locations (
  location_code text primary key,
  site text,
  building text,
  department_or_area text,
  zone text,
  shelf_or_line text,
  position text,
  note text
);

-- ===== Items (core) =====
create table if not exists items (
  item_id text primary key,
  item_name text not null,
  module_type text not null check (module_type in ('pharmacy','maintenance')),
  category text,
  location_code text references locations(location_code),
  active_flag boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists items_module_idx on items(module_type) where active_flag = true;

-- ===== Pharmacy items =====
create table if not exists pharmacy_items (
  item_id text primary key references items(item_id) on delete cascade,
  generic_name text,
  trade_name text,
  lot_no text,
  manufacture_date date,
  expiry_date date,
  quantity numeric(10,2),
  unit text,
  received_date date,
  supplier text,
  storage_condition text,
  note text
);

create index if not exists pharmacy_expiry_idx on pharmacy_items(expiry_date);

-- ===== Maintenance items =====
create table if not exists maintenance_items (
  item_id text primary key references items(item_id) on delete cascade,
  machine_type text,
  serial_no text,
  manufacturer text,
  model text,
  installation_date date,
  last_maintenance_date date,
  next_maintenance_date date,
  maintenance_cycle_days integer,
  responsible_team text,
  maintenance_note text
);

create index if not exists maintenance_next_idx on maintenance_items(next_maintenance_date);

-- ===== NFC mappings =====
create table if not exists nfc_mappings (
  mapping_id uuid primary key default gen_random_uuid(),
  nfc_tag_uid text not null,
  item_id text references items(item_id) on delete cascade,
  mapping_status text default 'active' check (mapping_status in ('active','inactive')),
  assigned_at timestamptz default now(),
  assigned_by uuid references auth.users(id),
  unassigned_at timestamptz,
  unassigned_by uuid references auth.users(id)
);

create unique index if not exists nfc_active_unique on nfc_mappings(nfc_tag_uid) where mapping_status = 'active';

-- ===== Scan logs =====
create table if not exists scan_logs (
  log_id uuid primary key default gen_random_uuid(),
  item_id text references items(item_id) on delete cascade,
  user_id uuid references auth.users(id),
  access_source text,
  scanned_at timestamptz default now(),
  device_info text
);

-- ===== Audit logs =====
create table if not exists audit_logs (
  audit_id uuid primary key default gen_random_uuid(),
  item_id text,
  user_id uuid references auth.users(id),
  module_type text,
  action_type text,
  old_value jsonb,
  new_value jsonb,
  changed_at timestamptz default now()
);

-- ===== Import logs =====
create table if not exists import_logs (
  import_id uuid primary key default gen_random_uuid(),
  module_type text,
  file_name text,
  imported_by uuid references auth.users(id),
  imported_at timestamptz default now(),
  row_total integer,
  row_success integer,
  row_failed integer,
  summary_note text
);

-- ===== Helper: status color (computed) =====
create or replace function calc_status(critical_date date) returns text
language sql immutable as $$
  select case
    when critical_date is null then 'red'
    when critical_date < current_date then 'red'
    when critical_date <= current_date + interval '60 days' then 'yellow'
    else 'green'
  end;
$$;

-- ===== Views with computed status =====
create or replace view v_pharmacy as
  select i.item_id, i.item_name, i.category, i.location_code, i.active_flag,
         p.generic_name, p.trade_name, p.lot_no, p.manufacture_date, p.expiry_date,
         p.quantity, p.unit, p.received_date, p.supplier, p.storage_condition, p.note,
         calc_status(p.expiry_date) as status_color,
         (p.expiry_date - current_date) as days_remaining
  from items i
  left join pharmacy_items p on i.item_id = p.item_id
  where i.module_type = 'pharmacy';

create or replace view v_maintenance as
  select i.item_id, i.item_name, i.category, i.location_code, i.active_flag,
         m.machine_type, m.serial_no, m.manufacturer, m.model, m.installation_date,
         m.last_maintenance_date, m.next_maintenance_date, m.maintenance_cycle_days,
         m.responsible_team, m.maintenance_note,
         calc_status(m.next_maintenance_date) as status_color,
         (m.next_maintenance_date - current_date) as days_remaining
  from items i
  left join maintenance_items m on i.item_id = m.item_id
  where i.module_type = 'maintenance';

-- ===== Row Level Security =====
alter table profiles          enable row level security;
alter table items             enable row level security;
alter table pharmacy_items    enable row level security;
alter table maintenance_items enable row level security;
alter table nfc_mappings      enable row level security;
alter table scan_logs         enable row level security;
alter table audit_logs        enable row level security;
alter table import_logs       enable row level security;
alter table locations         enable row level security;

-- Helper function to get current user's role
create or replace function current_role_code() returns text
language sql stable security definer as $$
  select role_code from profiles where user_id = auth.uid();
$$;

-- Profiles: user can read own; admin can read all
create policy "profiles_self_read" on profiles for select
  using (user_id = auth.uid() or current_role_code() = 'admin');

-- Items: anyone (incl. anon for /scan public view) can read active items; writes are role-restricted
create policy "items_public_read" on items for select using (active_flag = true);
create policy "items_write_pharmacy" on items for all to authenticated
  using (module_type = 'pharmacy' and current_role_code() in ('editor_pharmacy','admin'))
  with check (module_type = 'pharmacy' and current_role_code() in ('editor_pharmacy','admin'));
create policy "items_write_maintenance" on items for all to authenticated
  using (module_type = 'maintenance' and current_role_code() in ('editor_maintenance','admin'))
  with check (module_type = 'maintenance' and current_role_code() in ('editor_maintenance','admin'));

create policy "pharmacy_public_read" on pharmacy_items for select using (true);
create policy "pharmacy_write" on pharmacy_items for all to authenticated
  using (current_role_code() in ('editor_pharmacy','admin'))
  with check (current_role_code() in ('editor_pharmacy','admin'));

create policy "maintenance_public_read" on maintenance_items for select using (true);
create policy "maintenance_write" on maintenance_items for all to authenticated
  using (current_role_code() in ('editor_maintenance','admin'))
  with check (current_role_code() in ('editor_maintenance','admin'));

create policy "locations_public_read" on locations for select using (true);
create policy "locations_write" on locations for all to authenticated
  using (current_role_code() in ('editor_pharmacy','editor_maintenance','admin'))
  with check (current_role_code() in ('editor_pharmacy','editor_maintenance','admin'));

create policy "nfc_public_read" on nfc_mappings for select using (mapping_status = 'active');
create policy "nfc_write" on nfc_mappings for all to authenticated
  using (current_role_code() in ('editor_pharmacy','editor_maintenance','admin'))
  with check (current_role_code() in ('editor_pharmacy','editor_maintenance','admin'));

create policy "scans_read"   on scan_logs for select to authenticated using (true);
create policy "scans_insert" on scan_logs for insert to authenticated with check (true);
create policy "scans_delete" on scan_logs for delete to authenticated using (true);

create policy "audit_read"   on audit_logs for select to authenticated using (true);
create policy "audit_insert" on audit_logs for insert to authenticated with check (true);
create policy "audit_delete" on audit_logs for delete to authenticated using (true);

create policy "import_read"   on import_logs for select to authenticated using (true);
create policy "import_insert" on import_logs for insert to authenticated with check (true);
