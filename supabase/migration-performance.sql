-- Performance indexes — รันใน Supabase SQL Editor

-- Items
create index if not exists items_active_module_idx on items(module_type, active_flag) where active_flag = true;
create index if not exists items_updated_idx on items(updated_at desc);

-- Pharmacy
create index if not exists pharmacy_expiry_idx on pharmacy_items(expiry_date);
create index if not exists pharmacy_lot_idx on pharmacy_items(lot_no);

-- Maintenance
create index if not exists maintenance_next_idx on maintenance_items(next_maintenance_date);
create index if not exists maintenance_serial_idx on maintenance_items(serial_no);

-- NFC
create index if not exists nfc_active_idx on nfc_mappings(nfc_tag_uid) where mapping_status = 'active';

-- Logs (for fast recent queries)
create index if not exists scan_logs_recent_idx on scan_logs(scanned_at desc);
create index if not exists audit_logs_recent_idx on audit_logs(changed_at desc);

-- Profiles (for admin user mgmt)
create index if not exists profiles_status_idx on profiles(status);

-- Vacuum analyze เพื่อ refresh planner statistics
analyze items;
analyze pharmacy_items;
analyze maintenance_items;
analyze nfc_mappings;
