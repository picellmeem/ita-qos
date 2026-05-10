import Link from "next/link";
import AppShell from "@/components/AppShell";
import { createPharmacyItem } from "@/lib/actions";

export default function NewPharmacy() {
  return (
    <AppShell title="💊 เพิ่มรายการยา" actions={<Link href="/pharmacy" className="btn-secondary">← กลับ</Link>}>
      <form action={createPharmacyItem} className="card max-w-3xl space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className="label">Item ID *</label><input name="item_id" required className="input" placeholder="เช่น MED-000001" /></div>
          <div><label className="label">ชื่อยา *</label><input name="item_name" required className="input" /></div>
          <div><label className="label">Generic Name</label><input name="generic_name" className="input" /></div>
          <div><label className="label">Trade Name</label><input name="trade_name" className="input" /></div>
          <div><label className="label">หมวดหมู่</label><input name="category" className="input" /></div>
          <div><label className="label">เลขล็อต</label><input name="lot_no" className="input" /></div>
          <div><label className="label">วันที่ผลิต</label><input name="manufacture_date" type="date" className="input" /></div>
          <div><label className="label">วันหมดอายุ *</label><input name="expiry_date" type="date" required className="input" /></div>
          <div><label className="label">จำนวน</label><input name="quantity" type="number" step="0.01" className="input" /></div>
          <div><label className="label">หน่วย</label><input name="unit" className="input" placeholder="เม็ด, ขวด, กล่อง..." /></div>
          <div><label className="label">วันที่รับเข้า</label><input name="received_date" type="date" className="input" /></div>
          <div><label className="label">Supplier</label><input name="supplier" className="input" /></div>
          <div><label className="label">Zone</label><input name="zone" className="input" placeholder="Zone A" /></div>
          <div><label className="label">Shelf</label><input name="shelf" className="input" placeholder="Shelf A01" /></div>
          <div className="md:col-span-2"><label className="label">เงื่อนไขการเก็บ</label><input name="storage_condition" className="input" placeholder="เก็บที่อุณหภูมิห้อง..." /></div>
          <div className="md:col-span-2"><label className="label">หมายเหตุ</label><textarea name="note" rows={3} className="input" /></div>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <Link href="/pharmacy" className="btn-secondary">ยกเลิก</Link>
          <button type="submit" className="btn-primary">บันทึก</button>
        </div>
      </form>
    </AppShell>
  );
}
