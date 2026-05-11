"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import type { Profile, RoleCode } from "@/lib/types";

const ROLE_OPTIONS: { value: RoleCode; label: string; color: string }[] = [
  { value: "viewer_pharmacy",    label: "Viewer - Pharmacy",     color: "bg-slate-100 text-slate-600" },
  { value: "editor_pharmacy",    label: "Editor - Pharmacy",     color: "bg-pink-100 text-pink-700" },
  { value: "viewer_maintenance", label: "Viewer - Maintenance",  color: "bg-slate-100 text-slate-600" },
  { value: "editor_maintenance", label: "Editor - Maintenance",  color: "bg-violet-100 text-violet-700" },
  { value: "admin",              label: "Admin",                 color: "bg-amber-100 text-amber-700" },
];

function roleLabel(code: string | null) {
  return ROLE_OPTIONS.find((r) => r.value === code)?.label ?? code ?? "—";
}
function roleClass(code: string | null) {
  return ROLE_OPTIONS.find((r) => r.value === code)?.color ?? "bg-slate-100 text-slate-600";
}

export default function UsersClient({ users }: { users: Profile[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [pending, start] = useTransition();
  const [editingRole, setEditingRole] = useState<string | null>(null);

  const filtered = filter === "all" ? users : users.filter((u) => u.status === filter);
  const pendingCount = users.filter((u) => u.status === "pending").length;

  async function approve(userId: string, role?: string) {
    start(async () => {
      const { error } = await supabase.rpc("approve_user", {
        target_user_id: userId,
        new_role: role ?? null,
      });
      if (error) alert("Error: " + error.message);
      else router.refresh();
    });
  }

  async function reject(userId: string) {
    if (!confirm("ปฏิเสธบัญชีนี้?")) return;
    start(async () => {
      const { error } = await supabase.rpc("reject_user", { target_user_id: userId });
      if (error) alert("Error: " + error.message);
      else router.refresh();
    });
  }

  async function changeRole(userId: string, newRole: string) {
    start(async () => {
      const { error } = await supabase.rpc("update_user_role", {
        target_user_id: userId,
        new_role: newRole,
      });
      if (error) alert("Error: " + error.message);
      else {
        setEditingRole(null);
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filter === f
                ? "bg-brand-500 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {f === "all"
              ? `ทั้งหมด (${users.length})`
              : f === "pending"
              ? `⏳ รออนุมัติ (${pendingCount})`
              : f === "approved"
              ? "✅ อนุมัติแล้ว"
              : "🚫 ปฏิเสธ"}
          </button>
        ))}
      </div>

      {pendingCount > 0 && filter !== "pending" && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          ⚠️ มี <b>{pendingCount}</b> บัญชีรอการอนุมัติ —{" "}
          <button
            onClick={() => setFilter("pending")}
            className="font-bold underline"
          >
            ดูตอนนี้
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-brand-100 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3 text-left">ชื่อ</th>
              <th className="px-4 py-3 text-left">Username</th>
              <th className="px-4 py-3 text-left">บทบาท</th>
              <th className="px-4 py-3 text-left">สถานะ</th>
              <th className="px-4 py-3 text-left">สมัครเมื่อ</th>
              <th className="px-4 py-3 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                  ไม่พบผู้ใช้งาน
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.user_id} className="border-t border-brand-100 hover:bg-brand-50/30">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-800">
                      {u.full_name || "—"}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">
                    {u.username || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {editingRole === u.user_id ? (
                      <select
                        defaultValue={u.role_code ?? ""}
                        onChange={(e) => changeRole(u.user_id, e.target.value)}
                        disabled={pending}
                        className="input !py-1 text-xs"
                        autoFocus
                        onBlur={() => setEditingRole(null)}
                      >
                        {ROLE_OPTIONS.map((r) => (
                          <option key={r.value} value={r.value}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <button
                        onClick={() =>
                          u.status === "approved" && setEditingRole(u.user_id)
                        }
                        className={`badge ${roleClass(u.role_code)} ${
                          u.status === "approved" ? "cursor-pointer hover:opacity-80" : ""
                        }`}
                      >
                        {roleLabel(u.role_code)}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {u.approved_at
                      ? new Date(u.approved_at).toLocaleDateString("th-TH")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      {u.status === "pending" && (
                        <>
                          <button
                            disabled={pending}
                            onClick={() => approve(u.user_id)}
                            className="rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
                          >
                            ✓ อนุมัติ
                          </button>
                          <button
                            disabled={pending}
                            onClick={() => reject(u.user_id)}
                            className="btn-danger"
                          >
                            ✕ ปฏิเสธ
                          </button>
                        </>
                      )}
                      {u.status === "rejected" && (
                        <button
                          disabled={pending}
                          onClick={() => approve(u.user_id)}
                          className="rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
                        >
                          ↺ อนุมัติย้อนกลับ
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending:  { label: "⏳ รออนุมัติ",   cls: "bg-amber-100 text-amber-700"    },
    approved: { label: "✅ อนุมัติแล้ว", cls: "bg-emerald-100 text-emerald-700" },
    rejected: { label: "🚫 ปฏิเสธ",     cls: "bg-red-100 text-red-700"        },
  };
  const m = map[status] ?? map.pending;
  return <span className={`badge ${m.cls}`}>{m.label}</span>;
}
