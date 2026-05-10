import Link from "next/link";
import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import { createClient } from "@/lib/supabase-server";
import { updateMaintenanceItem } from "@/lib/actions";
import type { MaintenanceRow } from "@/lib/types";

export const dynamic = "force-dynamic";

function locationParts(code: string | null) {
  if (!code) return { area: "", line: "", position: "" };
  const parts = code.split("-");
  return { area: parts[0] ?? "", line: parts[1] ?? "", position: parts.slice(2).join("-") };
}

export default async function EditMaintenancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase.from("v_maintenance").select("*").eq("item_id", id).maybeSingle();
  if (!data) notFound();
  const r = data as MaintenanceRow;
  const { area, line, position } = locationParts(r.location_code);

  return (
    <AppShell
      title={`✏️ แก้ไข: ${r.item_name}`}
      actions={
        <Link href={`/maintenance/${id}`} className="btn-secondary">
          ← ยกเลิก
        </Link>
      }
    >
      <form action={updateMaintenanceItem} className="card max-w-3xl space-y-4">
        <input type="hidden" name="item_id" value={r.item_id} />
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Item ID</label>
            <input value={r.item_id} disabled className="input opacity-60" />
          </div>
          <div>
            <label className="label">ชื่อเครื่อง *</label>
            <input name="item_name" required defaultValue={r.item_name} className="input" />
          </div>
          <div><label className="label">ประเภท</label><input name="machine_type" defaultValue={r.machine_type ?? ""} className="input" /></div>
          <div><label className="label">Serial No.</label><input name="serial_no" defaultValue={r.serial_no ?? ""} className="input" /></div>
          <div><label className="label">ผู้ผลิต</label><input name="manufacturer" defaultValue={r.manufacturer ?? ""} className="input" /></div>
          <div><label className="label">รุ่น</label><input name="model" defaultValue={r.model ?? ""} className="input" /></div>
          <div><label className="label">วันที่ติดตั้ง</label><input name="installation_date" type="date" defaultValue={r.installation_date ?? ""} className="input" /></div>
          <div><label className="label">ซ่อมล่าสุด</label><input name="last_maintenance_date" type="date" defaultValue={r.last_maintenance_date ?? ""} className="input" /></div>
          <div><label className="label">ซ่อมครั้งถัดไป *</label><input name="next_maintenance_date" type="date" required defaultValue={r.next_maintenance_date ?? ""} className="input" /></div>
          <div><label className="label">รอบ (วัน)</label><input name="maintenance_cycle_days" type="number" defaultValue={r.maintenance_cycle_days ?? ""} className="input" /></div>
          <div><label className="label">ทีมรับผิดชอบ</label><input name="responsible_team" defaultValue={r.responsible_team ?? ""} className="input" /></div>
          <div></div>
          <div><label className="label">Area</label><input name="area" defaultValue={area} className="input" /></div>
          <div><label className="label">Line</label><input name="line" defaultValue={line} className="input" /></div>
          <div><label className="label">Position</label><input name="position" defaultValue={position} className="input" /></div>
          <div></div>
          <div className="md:col-span-2"><label className="label">หมายเหตุ</label><textarea name="maintenance_note" rows={3} defaultValue={r.maintenance_note ?? ""} className="input" /></div>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <Link href={`/maintenance/${id}`} className="btn-secondary">
            ยกเลิก
          </Link>
          <button type="submit" className="btn-primary">
            💾 บันทึกการแก้ไข
          </button>
        </div>
      </form>
    </AppShell>
  );
}
