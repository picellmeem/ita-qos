"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "./supabase-server";

function buildLocation(parts: (string | null | undefined)[]) {
  const code = parts.filter(Boolean).join("-").replace(/\s+/g, "-");
  return code || "UNSPECIFIED";
}

export async function createPharmacyItem(formData: FormData): Promise<void> {
  const f = (k: string) => (formData.get(k) as string | null) || null;
  const supabase = await createClient();

  const item_id = f("item_id");
  const item_name = f("item_name");
  if (!item_id || !item_name) throw new Error("ต้องระบุ Item ID และชื่อยา");

  const location_code = buildLocation([f("zone"), f("shelf")]);

  const { error: locErr } = await supabase
    .from("locations")
    .upsert({ location_code, zone: f("zone"), shelf_or_line: f("shelf") }, { onConflict: "location_code" });
  if (locErr) throw new Error(locErr.message);

  const { error: itemErr } = await supabase.from("items").insert({
    item_id,
    item_name,
    module_type: "pharmacy",
    category: f("category"),
    location_code,
  });
  if (itemErr) throw new Error(itemErr.message);

  const { error: pErr } = await supabase.from("pharmacy_items").insert({
    item_id,
    generic_name: f("generic_name"),
    trade_name: f("trade_name"),
    lot_no: f("lot_no"),
    manufacture_date: f("manufacture_date"),
    expiry_date: f("expiry_date"),
    quantity: f("quantity") ? Number(f("quantity")) : null,
    unit: f("unit"),
    received_date: f("received_date"),
    supplier: f("supplier"),
    storage_condition: f("storage_condition"),
    note: f("note"),
  });
  if (pErr) throw new Error(pErr.message);

  await supabase.from("audit_logs").insert({
    item_id,
    module_type: "pharmacy",
    action_type: "create",
    new_value: { item_name },
  });

  revalidatePath("/pharmacy");
  redirect(`/pharmacy/${item_id}`);
}

export async function createMaintenanceItem(formData: FormData): Promise<void> {
  const f = (k: string) => (formData.get(k) as string | null) || null;
  const supabase = await createClient();

  const item_id = f("item_id");
  const item_name = f("item_name");
  if (!item_id || !item_name) throw new Error("ต้องระบุ Item ID และชื่อเครื่อง");

  const location_code = buildLocation([f("area"), f("line"), f("position")]);

  await supabase
    .from("locations")
    .upsert(
      { location_code, department_or_area: f("area"), shelf_or_line: f("line"), position: f("position") },
      { onConflict: "location_code" },
    );

  const { error: itemErr } = await supabase.from("items").insert({
    item_id,
    item_name,
    module_type: "maintenance",
    category: f("machine_type"),
    location_code,
  });
  if (itemErr) throw new Error(itemErr.message);

  const { error: mErr } = await supabase.from("maintenance_items").insert({
    item_id,
    machine_type: f("machine_type"),
    serial_no: f("serial_no"),
    manufacturer: f("manufacturer"),
    model: f("model"),
    installation_date: f("installation_date"),
    last_maintenance_date: f("last_maintenance_date"),
    next_maintenance_date: f("next_maintenance_date"),
    maintenance_cycle_days: f("maintenance_cycle_days") ? Number(f("maintenance_cycle_days")) : null,
    responsible_team: f("responsible_team"),
    maintenance_note: f("maintenance_note"),
  });
  if (mErr) throw new Error(mErr.message);

  await supabase.from("audit_logs").insert({
    item_id,
    module_type: "maintenance",
    action_type: "create",
    new_value: { item_name },
  });

  revalidatePath("/maintenance");
  redirect(`/maintenance/${item_id}`);
}

export async function updatePharmacyItem(formData: FormData): Promise<void> {
  const f = (k: string) => (formData.get(k) as string | null) || null;
  const supabase = await createClient();

  const item_id = f("item_id");
  const item_name = f("item_name");
  if (!item_id || !item_name) throw new Error("ต้องระบุ Item ID และชื่อยา");

  const location_code = buildLocation([f("zone"), f("shelf")]);

  await supabase
    .from("locations")
    .upsert(
      { location_code, zone: f("zone"), shelf_or_line: f("shelf") },
      { onConflict: "location_code" },
    );

  const { error: itemErr } = await supabase
    .from("items")
    .update({
      item_name,
      category: f("category"),
      location_code,
      updated_at: new Date().toISOString(),
    })
    .eq("item_id", item_id);
  if (itemErr) throw new Error(itemErr.message);

  const { error: pErr } = await supabase
    .from("pharmacy_items")
    .update({
      generic_name: f("generic_name"),
      trade_name: f("trade_name"),
      lot_no: f("lot_no"),
      manufacture_date: f("manufacture_date"),
      expiry_date: f("expiry_date"),
      quantity: f("quantity") ? Number(f("quantity")) : null,
      unit: f("unit"),
      received_date: f("received_date"),
      supplier: f("supplier"),
      storage_condition: f("storage_condition"),
      note: f("note"),
    })
    .eq("item_id", item_id);
  if (pErr) throw new Error(pErr.message);

  await supabase.from("audit_logs").insert({
    item_id,
    module_type: "pharmacy",
    action_type: "update",
    new_value: { item_name },
  });

  revalidatePath(`/pharmacy/${item_id}`);
  revalidatePath("/pharmacy");
  redirect(`/pharmacy/${item_id}`);
}

export async function updateMaintenanceItem(formData: FormData): Promise<void> {
  const f = (k: string) => (formData.get(k) as string | null) || null;
  const supabase = await createClient();

  const item_id = f("item_id");
  const item_name = f("item_name");
  if (!item_id || !item_name) throw new Error("ต้องระบุ Item ID และชื่อเครื่อง");

  const location_code = buildLocation([f("area"), f("line"), f("position")]);

  await supabase
    .from("locations")
    .upsert(
      { location_code, department_or_area: f("area"), shelf_or_line: f("line"), position: f("position") },
      { onConflict: "location_code" },
    );

  const { error: itemErr } = await supabase
    .from("items")
    .update({
      item_name,
      category: f("machine_type"),
      location_code,
      updated_at: new Date().toISOString(),
    })
    .eq("item_id", item_id);
  if (itemErr) throw new Error(itemErr.message);

  const { error: mErr } = await supabase
    .from("maintenance_items")
    .update({
      machine_type: f("machine_type"),
      serial_no: f("serial_no"),
      manufacturer: f("manufacturer"),
      model: f("model"),
      installation_date: f("installation_date"),
      last_maintenance_date: f("last_maintenance_date"),
      next_maintenance_date: f("next_maintenance_date"),
      maintenance_cycle_days: f("maintenance_cycle_days") ? Number(f("maintenance_cycle_days")) : null,
      responsible_team: f("responsible_team"),
      maintenance_note: f("maintenance_note"),
    })
    .eq("item_id", item_id);
  if (mErr) throw new Error(mErr.message);

  await supabase.from("audit_logs").insert({
    item_id,
    module_type: "maintenance",
    action_type: "update",
    new_value: { item_name },
  });

  revalidatePath(`/maintenance/${item_id}`);
  revalidatePath("/maintenance");
  redirect(`/maintenance/${item_id}`);
}

export async function deactivateItem(item_id: string, module: "pharmacy" | "maintenance") {
  const supabase = await createClient();
  await supabase.from("items").update({ active_flag: false }).eq("item_id", item_id);
  await supabase.from("audit_logs").insert({
    item_id,
    module_type: module,
    action_type: "deactivate",
  });
  revalidatePath(`/${module}`);
  redirect(`/${module}`);
}

export async function deleteItem(item_id: string, module: "pharmacy" | "maintenance") {
  const supabase = await createClient();

  // capture name for audit before deletion
  const { data: itemRow } = await supabase
    .from("items")
    .select("item_name")
    .eq("item_id", item_id)
    .maybeSingle();

  await supabase.from("scan_logs").delete().eq("item_id", item_id);
  await supabase.from("nfc_mappings").delete().eq("item_id", item_id);

  const { error } = await supabase.from("items").delete().eq("item_id", item_id);
  if (error) return { error: error.message };

  await supabase.from("audit_logs").insert({
    item_id,
    module_type: module,
    action_type: "delete",
    old_value: itemRow ? { item_name: itemRow.item_name } : null,
  });

  revalidatePath(`/${module}`);
  return { ok: true };
}

export async function deleteAllInModule(module: "pharmacy" | "maintenance", confirmation: string) {
  const normalized = confirmation.trim().toUpperCase().replace(/\s+/g, " ");
  if (normalized !== "DELETE ALL" && normalized !== "DELETEALL") {
    return { error: "ต้องพิมพ์ DELETE ALL เพื่อยืนยัน" };
  }

  const supabase = await createClient();

  const { data: itemsToDelete } = await supabase
    .from("items")
    .select("item_id")
    .eq("module_type", module);

  const ids = itemsToDelete?.map((i) => i.item_id) ?? [];
  if (ids.length === 0) return { ok: true, deleted: 0 };

  await supabase.from("scan_logs").delete().in("item_id", ids);
  await supabase.from("nfc_mappings").delete().in("item_id", ids);

  const { error } = await supabase.from("items").delete().in("item_id", ids);
  if (error) return { error: error.message };

  await supabase.from("audit_logs").insert({
    module_type: module,
    action_type: "delete_all",
    old_value: { count: ids.length },
  });

  revalidatePath(`/${module}`);
  return { ok: true, deleted: ids.length };
}

export async function assignNfcTag(formData: FormData) {
  const supabase = await createClient();
  const nfc_tag_uid = (formData.get("nfc_tag_uid") as string)?.trim();
  const item_id = formData.get("item_id") as string;
  if (!nfc_tag_uid || !item_id) return { error: "ต้องระบุ Tag UID และ Item" };

  await supabase
    .from("nfc_mappings")
    .update({ mapping_status: "inactive", unassigned_at: new Date().toISOString() })
    .eq("nfc_tag_uid", nfc_tag_uid)
    .eq("mapping_status", "active");

  const { error } = await supabase.from("nfc_mappings").insert({ nfc_tag_uid, item_id });
  if (error) return { error: error.message };

  revalidatePath("/nfc");
  return { ok: true };
}

export async function unassignNfcTag(mapping_id: string) {
  const supabase = await createClient();
  await supabase
    .from("nfc_mappings")
    .update({ mapping_status: "inactive", unassigned_at: new Date().toISOString() })
    .eq("mapping_id", mapping_id);
  revalidatePath("/nfc");
}
