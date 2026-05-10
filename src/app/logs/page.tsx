import AppShell from "@/components/AppShell";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function LogsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("audit_logs")
    .select("*")
    .order("changed_at", { ascending: false })
    .limit(200);

  const rows = data ?? [];

  return (
    <AppShell title="📋 Audit Log">
      <div className="overflow-x-auto rounded-2xl border border-brand-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left">เวลา</th>
              <th className="px-4 py-3 text-left">Item ID</th>
              <th className="px-4 py-3 text-left">โมดูล</th>
              <th className="px-4 py-3 text-left">Action</th>
              <th className="px-4 py-3 text-left">รายละเอียด</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                  ยังไม่มีรายการ
                </td>
              </tr>
            ) : (
              rows.map((r) => {
                const cls =
                  r.action_type === "create" ? "badge-green" :
                  r.action_type === "deactivate" ? "badge-red" : "badge-gray";
                return (
                  <tr key={r.audit_id} className="border-t border-brand-100">
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {new Date(r.changed_at).toLocaleString("th-TH")}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-brand-50 px-2 py-0.5 font-mono text-xs font-semibold text-brand-500">
                        {r.item_id || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge badge-gray">{r.module_type || "-"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${cls}`}>{r.action_type || "-"}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {r.new_value ? JSON.stringify(r.new_value) : "-"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
