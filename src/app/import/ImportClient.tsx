"use client";
import { useState } from "react";
import Papa from "papaparse";
import { createClient } from "@/lib/supabase-browser";

type Mod = "pharmacy" | "maintenance";

const PHARMACY_HEADERS = [
  "item_id","item_name","category","generic_name","trade_name","lot_no",
  "manufacture_date","expiry_date","quantity","unit","received_date","supplier",
  "zone","shelf","storage_condition","note",
];
const MAINTENANCE_HEADERS = [
  "item_id","item_name","machine_type","serial_no","manufacturer","model",
  "installation_date","last_maintenance_date","next_maintenance_date",
  "maintenance_cycle_days","responsible_team","area","line","position",
  "maintenance_note",
];

function csvTemplate(mod: Mod) {
  const headers = mod === "pharmacy" ? PHARMACY_HEADERS : MAINTENANCE_HEADERS;
  const example =
    mod === "pharmacy"
      ? "MED-000001,Amoxicillin 500mg,Antibiotic,Amoxicillin,Amoxil,LOT-001,2025-01-01,2027-01-01,500,Capsule,2025-01-15,Pharma Co,Zone A,Shelf A01,Cool,ตัวอย่าง"
      : "MAC-00001,CNC Milling Machine,CNC,SN-001,Mazak,V300,2020-01-01,2025-01-01,2026-01-01,180,Team A,Area B,Line 01,M-01,ตัวอย่าง";
  return headers.join(",") + "\n" + example;
}

function downloadTemplate(mod: Mod) {
  const blob = new Blob([csvTemplate(mod)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${mod}_template.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ImportClient() {
  const [mod, setMod] = useState<Mod>("pharmacy");
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [errors, setErrors] = useState<{ row: number; msg: string }[]>([]);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [summary, setSummary] = useState<{ ok: number; failed: number } | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  function onFile(file: File) {
    setFileName(file.name);
    setSummary(null);
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const errs: { row: number; msg: string }[] = [];
        res.data.forEach((r, i) => {
          if (!r.item_id) errs.push({ row: i + 2, msg: "ขาด item_id" });
          if (!r.item_name) errs.push({ row: i + 2, msg: "ขาด item_name" });
          if (mod === "pharmacy" && !r.expiry_date) errs.push({ row: i + 2, msg: "ขาด expiry_date" });
          if (mod === "maintenance" && !r.next_maintenance_date) errs.push({ row: i + 2, msg: "ขาด next_maintenance_date" });
        });
        setErrors(errs);
        setRows(res.data);
      },
    });
  }

  async function doImport() {
    const supabase = createClient();
    const valid = rows.filter((r) => r.item_id && r.item_name);
    setProgress({ done: 0, total: valid.length });
    let ok = 0, failed = 0;

    for (let i = 0; i < valid.length; i++) {
      const r = valid[i];
      try {
        if (mod === "pharmacy") {
          const location_code = [r.zone, r.shelf].filter(Boolean).join("-").replace(/\s+/g, "-") || "UNSPECIFIED";
          await supabase.from("locations").upsert({ location_code, zone: r.zone || null, shelf_or_line: r.shelf || null }, { onConflict: "location_code" });
          await supabase.from("items").upsert({
            item_id: r.item_id, item_name: r.item_name, module_type: "pharmacy",
            category: r.category || null, location_code,
          }, { onConflict: "item_id" });
          await supabase.from("pharmacy_items").upsert({
            item_id: r.item_id,
            generic_name: r.generic_name || null, trade_name: r.trade_name || null, lot_no: r.lot_no || null,
            manufacture_date: r.manufacture_date || null, expiry_date: r.expiry_date || null,
            quantity: r.quantity ? Number(r.quantity) : null, unit: r.unit || null,
            received_date: r.received_date || null, supplier: r.supplier || null,
            storage_condition: r.storage_condition || null, note: r.note || null,
          }, { onConflict: "item_id" });
        } else {
          const location_code = [r.area, r.line, r.position].filter(Boolean).join("-").replace(/\s+/g, "-") || "UNSPECIFIED";
          await supabase.from("locations").upsert({
            location_code, department_or_area: r.area || null, shelf_or_line: r.line || null, position: r.position || null,
          }, { onConflict: "location_code" });
          await supabase.from("items").upsert({
            item_id: r.item_id, item_name: r.item_name, module_type: "maintenance",
            category: r.machine_type || null, location_code,
          }, { onConflict: "item_id" });
          await supabase.from("maintenance_items").upsert({
            item_id: r.item_id,
            machine_type: r.machine_type || null, serial_no: r.serial_no || null,
            manufacturer: r.manufacturer || null, model: r.model || null,
            installation_date: r.installation_date || null,
            last_maintenance_date: r.last_maintenance_date || null,
            next_maintenance_date: r.next_maintenance_date || null,
            maintenance_cycle_days: r.maintenance_cycle_days ? Number(r.maintenance_cycle_days) : null,
            responsible_team: r.responsible_team || null,
            maintenance_note: r.maintenance_note || null,
          }, { onConflict: "item_id" });
        }
        ok++;
      } catch {
        failed++;
      }
      setProgress({ done: i + 1, total: valid.length });
    }

    await supabase.from("import_logs").insert({
      module_type: mod, file_name: fileName,
      row_total: rows.length, row_success: ok, row_failed: failed,
    });

    setSummary({ ok, failed });
  }

  function reset() {
    setRows([]); setErrors([]); setProgress(null); setSummary(null); setFileName(null);
  }

  return (
    <div className="space-y-4">
      <Step n={1} title="เลือกโมดูลและดาวน์โหลด Template">
        <div className="flex flex-wrap items-center gap-3">
          <select className="input max-w-xs" value={mod} onChange={(e) => { reset(); setMod(e.target.value as Mod); }}>
            <option value="pharmacy">💊 Pharmacy</option>
            <option value="maintenance">⚙️ Maintenance</option>
          </select>
          <button onClick={() => downloadTemplate(mod)} className="btn-primary">
            ⬇️ ดาวน์โหลด Template
          </button>
        </div>
      </Step>

      <Step n={2} title="อัปโหลดไฟล์ CSV">
        <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-brand-100 bg-brand-50/40 p-10 text-center hover:border-brand-500 hover:bg-brand-50">
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
          />
          <div className="text-3xl">📂</div>
          <div className="mt-2 text-sm font-semibold text-brand-500">คลิกเพื่อเลือกไฟล์ CSV</div>
          {fileName && <div className="mt-2 text-xs text-slate-500">{fileName}</div>}
        </label>
      </Step>

      {rows.length > 0 && (
        <Step n={3} title="Preview">
          <div className="text-sm">
            <span className="font-semibold text-emerald-700">✓ {rows.length - errors.length} แถวพร้อม</span>
            {errors.length > 0 && (
              <span className="ml-3 font-semibold text-red-700">⚠ {errors.length} แถวมีปัญหา</span>
            )}
          </div>
          {errors.length > 0 && (
            <div className="mt-3 max-h-40 overflow-y-auto rounded-lg border border-red-200 bg-red-50 p-3 text-xs">
              {errors.slice(0, 50).map((e, i) => (
                <div key={i}>แถว {e.row}: {e.msg}</div>
              ))}
            </div>
          )}
          <div className="mt-3 max-h-72 overflow-auto rounded-lg border border-brand-100">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-slate-500">
                <tr>{Object.keys(rows[0] || {}).slice(0, 6).map((h) => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr>
              </thead>
              <tbody>
                {rows.slice(0, 20).map((r, i) => (
                  <tr key={i} className="border-t border-brand-100">
                    {Object.keys(rows[0]).slice(0, 6).map((h) => <td key={h} className="px-3 py-1.5">{r[h]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Step>
      )}

      {rows.length > 0 && (
        <Step n={4} title="ยืนยัน Import">
          {!summary ? (
            <div className="flex items-center gap-3">
              <button onClick={doImport} disabled={!!progress} className="btn-primary">
                ✅ ยืนยัน Import {rows.length - errors.length} แถว
              </button>
              <button onClick={reset} className="btn-secondary">ยกเลิก</button>
            </div>
          ) : (
            <div className="rounded-lg bg-emerald-50 p-3 text-sm">
              <div className="font-semibold text-emerald-700">เสร็จสิ้น!</div>
              <div className="mt-1 text-xs text-slate-600">
                สำเร็จ {summary.ok} / ล้มเหลว {summary.failed}
              </div>
            </div>
          )}

          {progress && (
            <div className="mt-3">
              <div className="text-xs text-slate-500">{progress.done} / {progress.total}</div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-brand-100">
                <div
                  className="h-full bg-brand-500 transition-all"
                  style={{ width: `${(progress.done / progress.total) * 100}%` }}
                />
              </div>
            </div>
          )}
        </Step>
      )}
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <div className="mb-3 flex items-center gap-2 font-bold text-brand-900">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-xs text-white">{n}</span>
        {title}
      </div>
      {children}
    </div>
  );
}
