import Link from "next/link";
import AppShell from "@/components/AppShell";
import ItemFilters from "@/components/ItemFilters";
import { SummaryCards } from "@/components/SummaryCards";
import DeleteAllButton from "@/components/DeleteAllButton";
import { StatusPieChart, CategoryBarChart, TimelineAreaChart } from "@/components/DashboardCharts";
import { createClient } from "@/lib/supabase-server";
import type { MaintenanceRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function MaintenanceDashboard() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("v_maintenance")
    .select("*")
    .eq("active_flag", true)
    .order("next_maintenance_date", { ascending: true });

  const rows = (data as MaintenanceRow[] | null) ?? [];
  const total = rows.length;
  const green  = rows.filter((r) => r.status_color === "green").length;
  const yellow = rows.filter((r) => r.status_color === "yellow").length;
  const red    = rows.filter((r) => r.status_color === "red").length;

  // Machine type aggregation
  const typeMap = new Map<string, number>();
  rows.forEach((r) => {
    const k = r.machine_type || "ไม่ระบุ";
    typeMap.set(k, (typeMap.get(k) ?? 0) + 1);
  });
  const categoryData = Array.from(typeMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  // Maintenance timeline (next 6 months)
  const monthLabels = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
  const now = new Date();
  const buckets = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    return { month: monthLabels[d.getMonth()], count: 0, year: d.getFullYear(), m: d.getMonth() };
  });
  rows.forEach((r) => {
    if (!r.next_maintenance_date) return;
    const d = new Date(r.next_maintenance_date);
    const b = buckets.find((x) => x.year === d.getFullYear() && x.m === d.getMonth());
    if (b) b.count++;
  });
  const timelineData = buckets.map(({ month, count }) => ({ month, count }));

  return (
    <AppShell
      title="⚙️ Maintenance Dashboard"
      actions={
        <div className="flex items-center gap-2">
          <DeleteAllButton module="maintenance" totalCount={total} />
          <Link href="/maintenance/new" className="btn-primary">
            + เพิ่มรายการ
          </Link>
        </div>
      }
    >
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          โหลดข้อมูลไม่สำเร็จ: {error.message}
        </div>
      )}

      <SummaryCards total={total} green={green} yellow={yellow} red={red} />

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <StatusPieChart green={green} yellow={yellow} red={red} />
        <CategoryBarChart data={categoryData} title="จำนวนเครื่องตามประเภท" />
        <TimelineAreaChart data={timelineData} title="ตารางซ่อมบำรุง (6 เดือนข้างหน้า)" />
      </div>

      <ItemFilters
        module="maintenance"
        dateLabel="ซ่อมครั้งถัดไป"
        rows={rows.map((r) => ({
          item_id: r.item_id,
          item_name: r.item_name,
          category: r.machine_type,
          location_code: r.location_code,
          status_color: r.status_color,
          days_remaining: r.days_remaining,
          date: r.next_maintenance_date,
          extra: r.serial_no,
        }))}
      />
    </AppShell>
  );
}
