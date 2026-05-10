import Link from "next/link";
import AppShell from "@/components/AppShell";
import { createMaintenanceItem } from "@/lib/actions";

export default function NewMaintenance() {
  return (
    <AppShell title="⚙️ เพิ่มรายการเครื่องจักร" actions={<Link href="/maintenance" className="btn-secondary">← กลับ</Link>}>
      <form action={createMaintenanceItem} className="card max-w-3xl space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className="label">Item ID *</label><input name="item_id" required className="input" placeholder="เช่น MAC-00001" /></div>
          <div><label className="label">ชื่อเครื่อง *</label><input name="item_name" required className="input" /></div>
          <div><label className="label">ประเภท / Machine Type</label><input name="machine_type" className="input" /></div>
          <div><label className="label">Serial No.</label><input name="serial_no" className="input" /></div>
          <div><label className="label">ผู้ผลิต</label><input name="manufacturer" className="input" /></div>
          <div><label className="label">รุ่น (Model)</label><input name="model" className="input" /></div>
          <div><label className="label">วันที่ติดตั้ง</label><input name="installation_date" type="date" className="input" /></div>
          <div><label className="label">ซ่อมล่าสุด</label><input name="last_maintenance_date" type="date" className="input" /></div>
          <div><label className="label">ซ่อมครั้งถัดไป *</label><input name="next_maintenance_date" type="date" required className="input" /></div>
          <div><label className="label">รอบ (วัน)</label><input name="maintenance_cycle_days" type="number" className="input" /></div>
          <div><label className="label">ทีมที่รับผิดชอบ</label><input name="responsible_team" className="input" /></div>
          <div></div>
          <div><label className="label">Area</label><input name="area" className="input" placeholder="Area B" /></div>
          <div><label className="label">Line</label><input name="line" className="input" placeholder="Line 01" /></div>
          <div><label className="label">Position</label><input name="position" className="input" placeholder="M-01" /></div>
          <div></div>
          <div className="md:col-span-2"><label className="label">หมายเหตุ</label><textarea name="maintenance_note" rows={3} className="input" /></div>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <Link href="/maintenance" className="btn-secondary">ยกเลิก</Link>
          <button type="submit" className="btn-primary">บันทึก</button>
        </div>
      </form>
    </AppShell>
  );
}
