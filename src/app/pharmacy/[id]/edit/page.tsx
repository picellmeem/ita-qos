import Link from "next/link";
import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import { createClient } from "@/lib/supabase-server";
import { updatePharmacyItem } from "@/lib/actions";
import type { PharmacyRow } from "@/lib/types";

export const dynamic = "force-dynamic";

function locationParts(code: string | null) {
  if (!code) return { zone: "", shelf: "" };
  const parts = code.split("-");
  return { zone: parts[0] ?? "", shelf: parts.slice(1).join("-") };
}

export default async function EditPharmacyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase.from("v_pharmacy").select("*").eq("item_id", id).maybeSingle();
  if (!data) notFound();
  const r = data as PharmacyRow;
  const { zone, shelf } = locationParts(r.location_code);

  return (
    <AppShell
      title={`✏️ แก้ไข: ${r.item_name}`}
      actions={
        <Link href={`/pharmacy/${id}`} className="btn-secondary">
          ← ยกเลิก
        </Link>
      }
    >
      <form action={updatePharmacyItem} className="card max-w-3xl space-y-4">
        <input type="hidden" name="item_id" value={r.item_id} />
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Item ID</label>
            <input value={r.item_id} disabled className="input opacity-60" />
          </div>
          <div>
            <label className="label">ชื่อยา *</label>
            <input name="item_name" required defaultValue={r.item_name} className="input" />
          </div>
          <div><label className="label">Generic Name</label><input name="generic_name" defaultValue={r.generic_name ?? ""} className="input" /></div>
          <div><label className="label">Trade Name</label><input name="trade_name" defaultValue={r.trade_name ?? ""} className="input" /></div>
          <div><label className="label">หมวดหมู่</label><input name="category" defaultValue={r.category ?? ""} className="input" /></div>
          <div><label className="label">เลขล็อต</label><input name="lot_no" defaultValue={r.lot_no ?? ""} className="input" /></div>
          <div><label className="label">วันที่ผลิต</label><input name="manufacture_date" type="date" defaultValue={r.manufacture_date ?? ""} className="input" /></div>
          <div><label className="label">วันหมดอายุ *</label><input name="expiry_date" type="date" required defaultValue={r.expiry_date ?? ""} className="input" /></div>
          <div><label className="label">จำนวน</label><input name="quantity" type="number" step="0.01" defaultValue={r.quantity ?? ""} className="input" /></div>
          <div><label className="label">หน่วย</label><input name="unit" defaultValue={r.unit ?? ""} className="input" /></div>
          <div><label className="label">วันที่รับเข้า</label><input name="received_date" type="date" defaultValue={r.received_date ?? ""} className="input" /></div>
          <div><label className="label">Supplier</label><input name="supplier" defaultValue={r.supplier ?? ""} className="input" /></div>
          <div><label className="label">Zone</label><input name="zone" defaultValue={zone} className="input" /></div>
          <div><label className="label">Shelf</label><input name="shelf" defaultValue={shelf} className="input" /></div>
          <div className="md:col-span-2"><label className="label">เงื่อนไขการเก็บ</label><input name="storage_condition" defaultValue={r.storage_condition ?? ""} className="input" /></div>
          <div className="md:col-span-2"><label className="label">หมายเหตุ</label><textarea name="note" rows={3} defaultValue={r.note ?? ""} className="input" /></div>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <Link href={`/pharmacy/${id}`} className="btn-secondary">
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
