export type ModuleType = "pharmacy" | "maintenance";
export type StatusColor = "green" | "yellow" | "red";

export type RoleCode =
  | "viewer_pharmacy"
  | "editor_pharmacy"
  | "viewer_maintenance"
  | "editor_maintenance"
  | "viewer_all"
  | "editor_all"
  | "admin";

export type UserStatus = "pending" | "approved" | "rejected";

export interface Profile {
  user_id: string;
  full_name: string | null;
  username: string | null;
  role_code: RoleCode | null;
  department: string | null;
  is_active: boolean;
  status: UserStatus;
  approved_at: string | null;
  approved_by: string | null;
}

export interface PharmacyRow {
  item_id: string;
  item_name: string;
  category: string | null;
  location_code: string | null;
  active_flag: boolean;
  generic_name: string | null;
  trade_name: string | null;
  lot_no: string | null;
  manufacture_date: string | null;
  expiry_date: string | null;
  quantity: number | null;
  unit: string | null;
  received_date: string | null;
  supplier: string | null;
  storage_condition: string | null;
  note: string | null;
  status_color: StatusColor;
  days_remaining: number | null;
}

export interface MaintenanceRow {
  item_id: string;
  item_name: string;
  category: string | null;
  location_code: string | null;
  active_flag: boolean;
  machine_type: string | null;
  serial_no: string | null;
  manufacturer: string | null;
  model: string | null;
  installation_date: string | null;
  last_maintenance_date: string | null;
  next_maintenance_date: string | null;
  maintenance_cycle_days: number | null;
  responsible_team: string | null;
  maintenance_note: string | null;
  status_color: StatusColor;
  days_remaining: number | null;
}

export interface NfcMapping {
  mapping_id: string;
  nfc_tag_uid: string;
  item_id: string;
  mapping_status: "active" | "inactive";
  assigned_at: string;
}
