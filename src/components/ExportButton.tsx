"use client";
import { useState } from "react";
import { fmtDate } from "@/lib/status";

type Row = Record<string, any>;

const STATUS_LABEL: Record<string, string> = {
  green: "ปกติ",
  yellow: "เฝ้าระวัง",
  red: "ด่วน",
};

function toCsv(rows: Row[], columns: { key: string; label: string }[]) {
  const header = columns.map((c) => `"${c.label}"`).join(",");
  const body = rows
    .map((r) =>
      columns
        .map((c) => {
          let v = r[c.key];
          if (v == null) v = "";
          if (c.key === "status_color") v = STATUS_LABEL[v] ?? v;
          if (typeof v === "string" && (v.includes(",") || v.includes('"'))) {
            v = `"${v.replace(/"/g, '""')}"`;
          } else {
            v = `"${v}"`;
          }
          return v;
        })
        .join(","),
    )
    .join("\n");
  // Add UTF-8 BOM so Excel opens Thai correctly
  return "﻿" + header + "\n" + body;
}

function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function buildPrintHtml(rows: Row[], columns: { key: string; label: string }[], title: string) {
  const head = columns.map((c) => `<th>${c.label}</th>`).join("");
  const body = rows
    .map((r) => {
      const tds = columns
        .map((c) => {
          let v = r[c.key];
          if (v == null) v = "";
          if (c.key === "status_color") {
            const cls =
              v === "green" ? "g" : v === "yellow" ? "y" : v === "red" ? "r" : "";
            v = `<span class="badge ${cls}">${STATUS_LABEL[v] ?? v}</span>`;
            return `<td>${v}</td>`;
          }
          if (c.key.includes("date")) v = v ? new Date(v).toLocaleDateString("th-TH") : "-";
          return `<td>${v}</td>`;
        })
        .join("");
      return `<tr>${tds}</tr>`;
    })
    .join("");

  const today = new Date().toLocaleString("th-TH");

  return `<!doctype html><html lang="th"><head><meta charset="utf-8" />
  <title>${title}</title>
  <style>
    body { font-family: 'Inter','Noto Sans Thai',sans-serif; padding: 24px; color: #1e293b; }
    h1 { color: #1a3a6b; font-size: 18px; margin: 0 0 4px; }
    .meta { color: #94a3b8; font-size: 11px; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; }
    th { text-align: left; background: #f0f5ff; color: #1a56db; padding: 8px; border-bottom: 1px solid #c7d9ff; text-transform: uppercase; font-size: 10px; letter-spacing: 0.04em; }
    td { padding: 7px 8px; border-bottom: 1px solid #f1f5f9; }
    tr:nth-child(even) td { background: #fafbff; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 10px; font-weight: 700; }
    .badge.g { background: #dcfce7; color: #15803d; }
    .badge.y { background: #fef9c3; color: #a16207; }
    .badge.r { background: #fee2e2; color: #b91c1c; }
    @page { size: A4 landscape; margin: 12mm; }
  </style></head><body>
  <h1>${title}</h1>
  <div class="meta">สร้างเมื่อ ${today} · ทั้งหมด ${rows.length} รายการ · ITA-QOS</div>
  <table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>
  <script>setTimeout(() => window.print(), 300);</script>
  </body></html>`;
}

export default function ExportButton({
  rows,
  module,
  filename,
}: {
  rows: Row[];
  module: "pharmacy" | "maintenance";
  filename: string;
}) {
  const [open, setOpen] = useState(false);

  const columns =
    module === "pharmacy"
      ? [
          { key: "item_id", label: "Item ID" },
          { key: "item_name", label: "ชื่อยา" },
          { key: "category", label: "หมวดหมู่" },
          { key: "lot_no", label: "เลขล็อต" },
          { key: "expiry_date", label: "วันหมดอายุ" },
          { key: "days_remaining", label: "เหลือ (วัน)" },
          { key: "quantity", label: "จำนวน" },
          { key: "unit", label: "หน่วย" },
          { key: "location_code", label: "ตำแหน่ง" },
          { key: "supplier", label: "ผู้ผลิต" },
          { key: "status_color", label: "สถานะ" },
        ]
      : [
          { key: "item_id", label: "Item ID" },
          { key: "item_name", label: "ชื่อเครื่อง" },
          { key: "machine_type", label: "ประเภท" },
          { key: "serial_no", label: "Serial" },
          { key: "manufacturer", label: "ผู้ผลิต" },
          { key: "model", label: "รุ่น" },
          { key: "last_maintenance_date", label: "ซ่อมล่าสุด" },
          { key: "next_maintenance_date", label: "ซ่อมถัดไป" },
          { key: "days_remaining", label: "เหลือ (วัน)" },
          { key: "responsible_team", label: "ทีม" },
          { key: "location_code", label: "ตำแหน่ง" },
          { key: "status_color", label: "สถานะ" },
        ];

  function exportCsv() {
    const csv = toCsv(rows, columns);
    downloadBlob(csv, `${filename}.csv`, "text/csv;charset=utf-8");
    setOpen(false);
  }

  function exportPdf() {
    const title = module === "pharmacy" ? "รายงานยา (Pharmacy)" : "รายงานเครื่องมือ (Maintenance)";
    const html = buildPrintHtml(rows, columns, title);
    const w = window.open("", "_blank", "width=1200,height=800");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="btn-secondary"
        disabled={rows.length === 0}
      >
        📥 Export
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} className="fixed inset-0 z-30" />
          <div className="absolute right-0 top-full z-40 mt-1 w-48 overflow-hidden rounded-xl border border-brand-100 bg-white shadow-lg">
            <button
              onClick={exportCsv}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-brand-50"
            >
              <span className="text-base">📊</span>
              <div className="text-left">
                <div className="font-semibold">Excel / CSV</div>
                <div className="text-[10px] text-slate-400">เปิดใน Excel ได้</div>
              </div>
            </button>
            <button
              onClick={exportPdf}
              className="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-2.5 text-sm text-slate-700 hover:bg-brand-50"
            >
              <span className="text-base">📄</span>
              <div className="text-left">
                <div className="font-semibold">PDF / พิมพ์</div>
                <div className="text-[10px] text-slate-400">รายงาน A4 แนวนอน</div>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
