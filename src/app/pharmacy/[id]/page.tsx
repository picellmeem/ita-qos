import Link from "next/link";
import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import DeleteItemButton from "@/components/DeleteItemButton";
import QrCodeCard from "@/components/QrCodeCard";
import { createClient } from "@/lib/supabase-server";
import { fmtDate, statusMessage } from "@/lib/status";
import type { PharmacyRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PharmacyItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase.from("v_pharmacy").select("*").eq("item_id", id).maybeSingle();
  if (!data) notFound();
  const r = data as PharmacyRow;

  // log scan (best-effort)
  await supabase.from("scan_logs").insert({
    item_id: r.item_id,
    access_source: "web",
  });

  const banner =
    r.status_color === "green" ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
    r.status_color === "yellow" ? "bg-amber-50 border-amber-200 text-amber-700" :
    "bg-red-50 border-red-200 text-red-700";

  return (
    <AppShell
      title={`💊 ${r.item_name}`}
      actions={
        <div className="flex items-center gap-2">
          <Link href="/pharmacy" className="btn-secondary">
            ← กลับ
          </Link>
          <Link href={`/pharmacy/${r.item_id}/edit`} className="btn-primary">
            ✏️ แก้ไข
          </Link>
          <DeleteItemButton itemId={r.item_id} module="pharmacy" itemName={r.item_name} variant="full" />
        </div>
      }
    >
      <div className={`mb-5 flex items-center gap-3 rounded-2xl border px-5 py-4 ${banner}`}>
        <span className="text-lg">●</span>
        <div className="flex-1 font-semibold">
          {statusMessage(r.status_color, r.days_remaining, "expiry")}
        </div>
        <StatusBadge status={r.status_color} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <div className="card-title">ข้อมูลยา</div>
          <Row k="Item ID" v={<span className="font-mono text-xs font-bold text-brand-500">{r.item_id}</span>} />
          <Row k="ชื่อ" v={r.item_name} />
          <Row k="Generic Name" v={r.generic_name} />
          <Row k="Trade Name" v={r.trade_name} />
          <Row k="หมวดหมู่" v={r.category} />
          <Row k="เลขล็อต" v={r.lot_no} />
          <Row k="ผู้ผลิต / Supplier" v={r.supplier} />
        </div>

        <div className="space-y-4">
          <div className="card">
            <div className="card-title">วันที่ &amp; จำนวน</div>
            <Row k="วันที่ผลิต" v={fmtDate(r.manufacture_date)} />
            <Row k="วันหมดอายุ" v={<span className="font-bold">{fmtDate(r.expiry_date)}</span>} />
            <Row k="วันที่รับเข้า" v={fmtDate(r.received_date)} />
            <Row k="จำนวน" v={r.quantity ? `${r.quantity} ${r.unit ?? ""}` : "-"} />
            <Row k="เงื่อนไขการเก็บ" v={r.storage_condition} />
          </div>

          <div className="card">
            <div className="card-title">📍 ตำแหน่งจัดเก็บ</div>
            <Row k="Location" v={<span className="font-mono text-xs font-bold text-brand-500">{r.location_code || "-"}</span>} />
          </div>

          <QrCodeCard itemId={r.item_id} itemName={r.item_name} module="pharmacy" />
        </div>
      </div>

      {r.note && (
        <div className="card mt-4">
          <div className="card-title">หมายเหตุ</div>
          <p className="text-sm text-slate-600 whitespace-pre-line">{r.note}</p>
        </div>
      )}
    </AppShell>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex border-b border-slate-50 py-2 last:border-0">
      <div className="w-44 text-xs font-medium text-slate-400">{k}</div>
      <div className="flex-1 text-sm text-slate-800">{v ?? "-"}</div>
    </div>
  );
}
