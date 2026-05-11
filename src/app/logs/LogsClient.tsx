"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

export type LogRow = {
  audit_id: string;
  item_id: string | null;
  module_type: string | null;
  action_type: string | null;
  old_value: any;
  new_value: any;
  changed_at: string;
  user_name: string | null;
  user_role: string | null;
};

const ACTION_META: Record<string, { label: string; cls: string; icon: string }> = {
  create:     { label: "สร้าง",     cls: "bg-emerald-100 text-emerald-700", icon: "➕" },
  update:     { label: "แก้ไข",     cls: "bg-sky-100    text-sky-700",      icon: "✏️" },
  delete:     { label: "ลบ",        cls: "bg-red-100    text-red-700",      icon: "🗑" },
  delete_all: { label: "ลบทั้งหมด", cls: "bg-red-200    text-red-800",      icon: "💥" },
  deactivate: { label: "ปิดใช้งาน", cls: "bg-amber-100  text-amber-700",    icon: "⏸" },
};

const FIELD_LABEL: Record<string, string> = {
  item_name: "ชื่อ",
  category: "หมวดหมู่",
  lot_no: "เลขล็อต",
  expiry_date: "วันหมดอายุ",
  quantity: "จำนวน",
  unit: "หน่วย",
  location_code: "ตำแหน่ง",
  location: "ตำแหน่ง",
  supplier: "Supplier",
  machine_type: "ประเภท",
  serial_no: "Serial No",
  manufacturer: "ผู้ผลิต",
  model: "รุ่น",
  last_maintenance_date: "ซ่อมล่าสุด",
  next_maintenance_date: "ซ่อมครั้งถัดไป",
  maintenance_cycle_days: "รอบ (วัน)",
  responsible_team: "ทีมรับผิดชอบ",
  count: "จำนวนรายการ",
  deleted_ids: "Item ID ที่ลบ",
};

export default function LogsClient({ rows }: { rows: LogRow[] }) {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (filter !== "all" && r.action_type !== filter) return false;
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        (r.item_id ?? "").toLowerCase().includes(s) ||
        (r.user_name ?? "").toLowerCase().includes(s) ||
        (r.module_type ?? "").toLowerCase().includes(s)
      );
    });
  }, [rows, filter, search]);

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="card flex flex-wrap items-center gap-3">
        <input
          className="input flex-1 min-w-[200px]"
          placeholder="🔍 ค้นหา Item ID, ชื่อผู้ใช้, โมดูล..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-1.5">
          {[
            ["all", "ทั้งหมด"],
            ["create", "สร้าง"],
            ["update", "แก้ไข"],
            ["delete", "ลบ"],
            ["delete_all", "ลบทั้งหมด"],
            ["deactivate", "ปิดใช้งาน"],
          ].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === v
                  ? "bg-brand-500 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs text-slate-400">
        แสดง {filtered.length} จาก {rows.length} รายการ
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="card text-center text-slate-400 py-12">ไม่พบรายการ</div>
        ) : (
          filtered.map((r) => (
            <LogItem
              key={r.audit_id}
              row={r}
              expanded={openId === r.audit_id}
              onToggle={() => setOpenId(openId === r.audit_id ? null : r.audit_id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function LogItem({
  row,
  expanded,
  onToggle,
}: {
  row: LogRow;
  expanded: boolean;
  onToggle: () => void;
}) {
  const meta = ACTION_META[row.action_type ?? ""] ?? {
    label: row.action_type,
    cls: "bg-slate-100 text-slate-600",
    icon: "•",
  };
  const time = new Date(row.changed_at).toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const initial = (row.user_name ?? "?")[0].toUpperCase();

  const hasDetails = row.old_value || row.new_value;

  return (
    <div className="rounded-2xl border border-brand-100 bg-white shadow-sm transition hover:shadow-md">
      <button
        onClick={onToggle}
        disabled={!hasDetails}
        className="flex w-full items-center gap-3 px-4 py-3 text-left disabled:cursor-default"
      >
        {/* Action icon */}
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base ${meta.cls}`}>
          {meta.icon}
        </div>

        {/* Main info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className={`badge ${meta.cls}`}>{meta.label}</span>
            {row.item_id && (
              <Link
                href={`/${row.module_type}/${row.item_id}`}
                onClick={(e) => e.stopPropagation()}
                className="rounded-md bg-brand-50 px-2 py-0.5 font-mono text-[11px] font-bold text-brand-500 hover:bg-brand-100"
              >
                {row.item_id}
              </Link>
            )}
            <span className="text-[11px] uppercase tracking-wider text-slate-400">
              {row.module_type}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-sky-400 text-[10px] font-bold text-white">
                {initial}
              </span>
              <span className="font-medium text-slate-700">{row.user_name ?? "ไม่ระบุ"}</span>
              {row.user_role && (
                <span className="text-[10px] text-slate-400">· {row.user_role}</span>
              )}
            </span>
            <span className="text-slate-300">•</span>
            <span>{time}</span>
          </div>
        </div>

        {/* Expand arrow */}
        {hasDetails && (
          <span className={`shrink-0 text-slate-400 transition ${expanded ? "rotate-180" : ""}`}>
            ▼
          </span>
        )}
      </button>

      {/* Expanded detail */}
      {expanded && hasDetails && (
        <div className="border-t border-slate-100 px-4 py-3 animate-fade-in">
          {row.action_type === "update" ? (
            <DiffView oldValue={row.old_value} newValue={row.new_value} />
          ) : (
            <KeyValueView value={row.new_value ?? row.old_value} />
          )}
        </div>
      )}
    </div>
  );
}

function DiffView({ oldValue, newValue }: { oldValue: any; newValue: any }) {
  const allKeys = Array.from(
    new Set([...Object.keys(oldValue ?? {}), ...Object.keys(newValue ?? {})]),
  );
  const changed = allKeys.filter((k) => {
    const o = oldValue?.[k];
    const n = newValue?.[k];
    return JSON.stringify(o) !== JSON.stringify(n);
  });

  if (changed.length === 0) {
    return <div className="text-xs text-slate-400">ไม่มีการเปลี่ยนแปลง</div>;
  }

  return (
    <div className="space-y-2 text-xs">
      <div className="font-semibold text-slate-700">เปลี่ยนแปลง {changed.length} ค่า:</div>
      {changed.map((k) => (
        <div key={k} className="grid grid-cols-[120px_1fr_20px_1fr] items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
          <div className="font-semibold text-slate-600">{FIELD_LABEL[k] ?? k}</div>
          <div className="rounded bg-red-50 px-2 py-1 font-mono text-[11px] text-red-700 line-through opacity-70">
            {formatValue(oldValue?.[k])}
          </div>
          <div className="text-center text-slate-400">→</div>
          <div className="rounded bg-emerald-50 px-2 py-1 font-mono text-[11px] font-semibold text-emerald-700">
            {formatValue(newValue?.[k])}
          </div>
        </div>
      ))}
    </div>
  );
}

function KeyValueView({ value }: { value: any }) {
  if (!value) return <div className="text-xs text-slate-400">ไม่มีข้อมูล</div>;
  const entries = Object.entries(value);
  return (
    <div className="grid gap-1.5 text-xs sm:grid-cols-2">
      {entries.map(([k, v]) => (
        <div key={k} className="flex gap-2 rounded-md bg-slate-50 px-2.5 py-1.5">
          <span className="w-28 shrink-0 font-semibold text-slate-500">
            {FIELD_LABEL[k] ?? k}
          </span>
          <span className="flex-1 truncate font-mono text-slate-700">
            {formatValue(v)}
          </span>
        </div>
      ))}
    </div>
  );
}

function formatValue(v: any): string {
  if (v == null || v === "") return "—";
  if (Array.isArray(v)) return v.slice(0, 5).join(", ") + (v.length > 5 ? ` …+${v.length - 5}` : "");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}
