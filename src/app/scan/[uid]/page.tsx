import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { fmtDate, statusMessage } from "@/lib/status";
import type { PharmacyRow, MaintenanceRow, StatusColor } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ScanPage({ params }: { params: Promise<{ uid: string }> }) {
  const { uid } = await params;
  const supabase = await createClient();

  // 1) ลองหาผ่าน NFC mapping ก่อน
  const { data: mapping } = await supabase
    .from("nfc_mappings")
    .select("item_id")
    .eq("nfc_tag_uid", uid)
    .eq("mapping_status", "active")
    .maybeSingle();

  const itemId = mapping?.item_id ?? uid;

  // 2) หา item เพื่อดูว่าเป็นโมดูลอะไร
  const { data: item } = await supabase
    .from("items")
    .select("item_id, module_type")
    .eq("item_id", itemId)
    .maybeSingle();

  if (!item) return <NotFound uid={uid} />;

  // 3) บันทึก scan log (best-effort)
  await supabase.from("scan_logs").insert({ item_id: item.item_id, access_source: "scan" });

  // 4) ดึงข้อมูลรายละเอียดจาก view
  if (item.module_type === "pharmacy") {
    const { data } = await supabase.from("v_pharmacy").select("*").eq("item_id", item.item_id).maybeSingle();
    if (!data) return <NotFound uid={uid} />;
    return <PublicPharmacyView row={data as PharmacyRow} />;
  }

  const { data } = await supabase.from("v_maintenance").select("*").eq("item_id", item.item_id).maybeSingle();
  if (!data) return <NotFound uid={uid} />;
  return <PublicMaintenanceView row={data as MaintenanceRow} />;
}

function NotFound({ uid }: { uid: string }) {
  return (
    <PageWrapper>
      <div className="card max-w-md text-center">
        <div className="text-4xl">⚠️</div>
        <h1 className="mt-3 text-lg font-bold text-brand-900">ไม่พบ Tag / Item นี้</h1>
        <p className="mt-2 text-sm text-slate-500">
          ตัวอ้างอิง <span className="font-mono text-brand-500">{uid}</span> ยังไม่ได้ผูกกับรายการในระบบ
        </p>
        <Link href="/login" className="btn-secondary mt-4 inline-block">
          เข้าสู่ระบบ
        </Link>
      </div>
    </PageWrapper>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-sky-50 px-4 py-6">
      <div className="mx-auto max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/home" className="text-sm font-bold text-brand-900">
            ITA-QOS
          </Link>
          <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-500">
            Scanned
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

function StatusBanner({ status, message }: { status: StatusColor; message: string }) {
  const cls =
    status === "green" ? "bg-emerald-50 border-emerald-200 text-emerald-800" :
    status === "yellow" ? "bg-amber-50 border-amber-200 text-amber-800" :
    "bg-red-50 border-red-200 text-red-800";
  const dot =
    status === "green" ? "bg-emerald-500" :
    status === "yellow" ? "bg-amber-500" : "bg-red-500";
  return (
    <div className={`mb-4 rounded-2xl border px-5 py-4 ${cls}`}>
      <div className="flex items-center gap-3">
        <span className={`h-3 w-3 rounded-full ${dot} animate-pulse`} />
        <div className="flex-1 font-semibold">{message}</div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex border-b border-slate-50 py-2.5 last:border-0">
      <div className="w-32 shrink-0 text-xs font-medium text-slate-400">{k}</div>
      <div className="flex-1 text-sm text-slate-800">{v ?? "—"}</div>
    </div>
  );
}

function PublicPharmacyView({ row }: { row: PharmacyRow }) {
  return (
    <PageWrapper>
      <StatusBanner
        status={row.status_color}
        message={statusMessage(row.status_color, row.days_remaining, "expiry")}
      />

      <div className="card">
        <div className="mb-3 flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-400 to-orange-400 text-2xl">
            💊
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">PHARMACY</div>
            <h1 className="text-lg font-bold text-brand-900 leading-tight">{row.item_name}</h1>
            <span className="mt-1 inline-block rounded-md bg-brand-50 px-2 py-0.5 font-mono text-[11px] font-bold text-brand-500">
              {row.item_id}
            </span>
          </div>
        </div>

        <div className="mt-4 border-t border-slate-100 pt-3">
          <Row k="Generic" v={row.generic_name} />
          <Row k="Trade Name" v={row.trade_name} />
          <Row k="หมวดหมู่" v={row.category} />
          <Row k="เลขล็อต" v={<span className="font-mono">{row.lot_no}</span>} />
          <Row
            k="วันหมดอายุ"
            v={
              <span className="font-bold">
                {fmtDate(row.expiry_date)}
                {row.days_remaining !== null && (
                  <span className="ml-2 text-xs font-normal text-slate-500">
                    ({row.days_remaining < 0
                      ? `เกิน ${Math.abs(row.days_remaining)} วัน`
                      : `เหลือ ${row.days_remaining} วัน`})
                  </span>
                )}
              </span>
            }
          />
          <Row k="จำนวน" v={row.quantity ? `${row.quantity} ${row.unit ?? ""}` : null} />
          <Row k="ตำแหน่ง" v={<span className="font-mono text-brand-500">{row.location_code}</span>} />
          <Row k="เงื่อนไขการเก็บ" v={row.storage_condition} />
          <Row k="ผู้ผลิต" v={row.supplier} />
        </div>
      </div>

      <div className="mt-4 text-center">
        <Link href={`/pharmacy/${row.item_id}`} className="btn-primary">
          จัดการรายการ →
        </Link>
        <p className="mt-3 text-[11px] text-slate-400">
          ต้องเข้าสู่ระบบเพื่อแก้ไขข้อมูล
        </p>
      </div>
    </PageWrapper>
  );
}

function PublicMaintenanceView({ row }: { row: MaintenanceRow }) {
  return (
    <PageWrapper>
      <StatusBanner
        status={row.status_color}
        message={statusMessage(row.status_color, row.days_remaining, "maintenance")}
      />

      <div className="card">
        <div className="mb-3 flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-blue-500 text-2xl">
            ⚙️
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">MAINTENANCE</div>
            <h1 className="text-lg font-bold text-brand-900 leading-tight">{row.item_name}</h1>
            <span className="mt-1 inline-block rounded-md bg-brand-50 px-2 py-0.5 font-mono text-[11px] font-bold text-brand-500">
              {row.item_id}
            </span>
          </div>
        </div>

        <div className="mt-4 border-t border-slate-100 pt-3">
          <Row k="ประเภท" v={row.machine_type} />
          <Row k="Serial No." v={<span className="font-mono">{row.serial_no}</span>} />
          <Row k="ผู้ผลิต" v={row.manufacturer} />
          <Row k="รุ่น" v={row.model} />
          <Row k="ติดตั้งเมื่อ" v={fmtDate(row.installation_date)} />
          <Row k="ซ่อมล่าสุด" v={fmtDate(row.last_maintenance_date)} />
          <Row
            k="ซ่อมครั้งถัดไป"
            v={
              <span className="font-bold">
                {fmtDate(row.next_maintenance_date)}
                {row.days_remaining !== null && (
                  <span className="ml-2 text-xs font-normal text-slate-500">
                    ({row.days_remaining < 0
                      ? `เกิน ${Math.abs(row.days_remaining)} วัน`
                      : `เหลือ ${row.days_remaining} วัน`})
                  </span>
                )}
              </span>
            }
          />
          <Row k="รอบ (วัน)" v={row.maintenance_cycle_days} />
          <Row k="ทีมที่รับผิดชอบ" v={row.responsible_team} />
          <Row k="ตำแหน่ง" v={<span className="font-mono text-brand-500">{row.location_code}</span>} />
        </div>
      </div>

      <div className="mt-4 text-center">
        <Link href={`/maintenance/${row.item_id}`} className="btn-primary">
          จัดการรายการ →
        </Link>
        <p className="mt-3 text-[11px] text-slate-400">
          ต้องเข้าสู่ระบบเพื่อแก้ไขข้อมูล
        </p>
      </div>
    </PageWrapper>
  );
}
