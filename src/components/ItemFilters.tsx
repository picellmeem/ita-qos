"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { StatusBadge } from "./StatusBadge";
import DeleteItemButton from "./DeleteItemButton";
import { fmtDate } from "@/lib/status";
import type { StatusColor } from "@/lib/types";

type Row = {
  item_id: string;
  item_name: string;
  category: string | null;
  location_code: string | null;
  status_color: StatusColor;
  days_remaining: number | null;
  date: string | null;
  extra: string | null;
};

export default function ItemFilters({
  module,
  rows,
  dateLabel,
}: {
  module: "pharmacy" | "maintenance";
  rows: Row[];
  dateLabel: string;
}) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | StatusColor>("all");

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (filter !== "all" && r.status_color !== filter) return false;
      if (!q) return true;
      const s = q.toLowerCase();
      return (
        r.item_id.toLowerCase().includes(s) ||
        r.item_name.toLowerCase().includes(s) ||
        (r.location_code ?? "").toLowerCase().includes(s) ||
        (r.extra ?? "").toLowerCase().includes(s)
      );
    });
  }, [rows, q, filter]);

  // reset to page 1 when filter/search changes
  useMemo(() => setPage(1), [q, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="card mt-6">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          className="input flex-1 min-w-[200px]"
          placeholder="🔍 ค้นหา Item ID, ชื่อ, ตำแหน่ง..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="flex gap-1.5">
          {([
            ["all", "ทั้งหมด"],
            ["green", "🟢 ปกติ"],
            ["yellow", "🟡 เฝ้าระวัง"],
            ["red", "🔴 ด่วน"],
          ] as const).map(([v, l]) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === v
                  ? "bg-brand-500 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-brand-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3 text-left">Item ID</th>
              <th className="px-4 py-3 text-left">ชื่อ</th>
              <th className="px-4 py-3 text-left">ตำแหน่ง</th>
              <th className="px-4 py-3 text-left">{dateLabel}</th>
              <th className="px-4 py-3 text-left">เหลือ (วัน)</th>
              <th className="px-4 py-3 text-left">สถานะ</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                  ไม่พบรายการ
                </td>
              </tr>
            ) : (
              paged.map((r) => (
                <tr key={r.item_id} className="border-t border-brand-100 hover:bg-brand-50/40">
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-brand-50 px-2 py-0.5 font-mono text-xs font-semibold text-brand-500">
                      {r.item_id}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">{r.item_name}</td>
                  <td className="px-4 py-3 text-slate-600">{r.location_code || "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{fmtDate(r.date)}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {r.days_remaining === null ? "-" : r.days_remaining < 0 ? `เกิน ${Math.abs(r.days_remaining)}` : r.days_remaining}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status_color} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/${module}/${r.item_id}`} className="btn-secondary !px-3 !py-1 text-xs">
                        เปิด →
                      </Link>
                      <DeleteItemButton itemId={r.item_id} module={module} itemName={r.item_name} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="text-slate-400">
          แสดง {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} จาก {filtered.length} รายการ
          {filtered.length !== rows.length && ` (กรองจาก ${rows.length})`}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="rounded-md border border-brand-100 px-2.5 py-1 font-semibold text-slate-600 hover:bg-brand-50 disabled:opacity-40"
            >
              ←
            </button>
            <span className="px-2 font-semibold text-slate-700">
              {safePage} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="rounded-md border border-brand-100 px-2.5 py-1 font-semibold text-slate-600 hover:bg-brand-50 disabled:opacity-40"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
