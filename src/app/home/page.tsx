import Link from "next/link";
import AppShell from "@/components/AppShell";
import { createClient } from "@/lib/supabase-server";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ count: pharmacyTotal }, { count: maintenanceTotal }] = await Promise.all([
    supabase.from("items").select("*", { count: "exact", head: true })
      .eq("module_type", "pharmacy").eq("active_flag", true),
    supabase.from("items").select("*", { count: "exact", head: true })
      .eq("module_type", "maintenance").eq("active_flag", true),
  ]);

  return (
    <AppShell title="🏠 Dashboard">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-brand-900">ยินดีต้อนรับสู่ ITA-QOS</h2>
        <p className="mt-1 text-sm text-slate-500">
          เลือกโมดูลที่ต้องการเพื่อดูข้อมูลและจัดการรายการ
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Link
          href="/pharmacy"
          className="group block rounded-2xl border border-brand-100 bg-white p-7 shadow-sm transition hover:border-brand-500 hover:shadow-md"
        >
          <div className="text-4xl">💊</div>
          <h3 className="mt-3 text-lg font-bold text-brand-900">Pharmacy Module</h3>
          <p className="mt-1.5 text-sm text-slate-500">
            ติดตามวันหมดอายุของยา ตำแหน่งจัดเก็บ และข้อมูล lot/batch
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-2xl font-bold text-brand-500">{pharmacyTotal ?? 0}</span>
            <span className="text-xs text-slate-400 group-hover:text-brand-500">เปิด →</span>
          </div>
        </Link>

        <Link
          href="/maintenance"
          className="group block rounded-2xl border border-brand-100 bg-white p-7 shadow-sm transition hover:border-brand-500 hover:shadow-md"
        >
          <div className="text-4xl">⚙️</div>
          <h3 className="mt-3 text-lg font-bold text-brand-900">Maintenance Module</h3>
          <p className="mt-1.5 text-sm text-slate-500">
            ติดตามรอบการซ่อมบำรุง วันที่ครบกำหนด และสถานะของเครื่องจักร
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-2xl font-bold text-brand-500">{maintenanceTotal ?? 0}</span>
            <span className="text-xs text-slate-400 group-hover:text-brand-500">เปิด →</span>
          </div>
        </Link>
      </div>
    </AppShell>
  );
}
