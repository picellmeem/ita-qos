"use client";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

type Item = { item_id: string; item_name: string; module_type: string };

const SIZES = [
  { key: "3x8", label: "3×8 (24 ดวง/A4)", cols: 3, rows: 8 },
  { key: "2x5", label: "2×5 (10 ดวง/A4 - ใหญ่)", cols: 2, rows: 5 },
  { key: "4x10", label: "4×10 (40 ดวง/A4 - เล็ก)", cols: 4, rows: 10 },
];

export default function StickersClient({
  pharmacy,
  maintenance,
}: {
  pharmacy: Item[];
  maintenance: Item[];
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [size, setSize] = useState(SIZES[0]);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const printRef = useRef<HTMLDivElement>(null);

  // generate QR code data URLs for selected items
  useEffect(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    Promise.all(
      Array.from(selected).map(async (id) => {
        const url = `${origin}/scan/${id}`;
        const dataUrl = await QRCode.toDataURL(url, {
          width: 200,
          margin: 1,
          color: { dark: "#1a3a6b", light: "#ffffff" },
          errorCorrectionLevel: "M",
        });
        return [id, dataUrl] as const;
      }),
    ).then((entries) => {
      const next: Record<string, string> = {};
      entries.forEach(([id, url]) => {
        next[id] = url;
      });
      setPreviews(next);
    });
  }, [selected]);

  function toggle(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  function selectAll(items: Item[]) {
    const next = new Set(selected);
    items.forEach((i) => next.add(i.item_id));
    setSelected(next);
  }

  function deselectAll(items: Item[]) {
    const next = new Set(selected);
    items.forEach((i) => next.delete(i.item_id));
    setSelected(next);
  }

  function clearAll() {
    setSelected(new Set());
  }

  const allItems: Item[] = [...pharmacy, ...maintenance];
  const selectedItems = allItems.filter((i) => selected.has(i.item_id));

  function printStickers() {
    if (selectedItems.length === 0) return;
    window.print();
  }

  return (
    <>
      {/* Print-only area */}
      <div ref={printRef} className="print-area hidden print:block">
        <PrintSheet items={selectedItems} previews={previews} cols={size.cols} rows={size.rows} />
      </div>

      {/* Screen UI */}
      <div className="print:hidden">
        <div className="card mb-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="label">ขนาด sticker</label>
              <select
                className="input"
                value={size.key}
                onChange={(e) => setSize(SIZES.find((s) => s.key === e.target.value) ?? SIZES[0])}
              >
                {SIZES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <div className="rounded-lg bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-500">
                เลือกแล้ว: {selectedItems.length} รายการ
              </div>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={printStickers}
                disabled={selectedItems.length === 0}
                className="btn-primary flex-1"
              >
                🖨 พิมพ์ A4
              </button>
              {selected.size > 0 && (
                <button onClick={clearAll} className="btn-secondary">
                  ล้าง
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ItemList
            title="💊 Pharmacy"
            items={pharmacy}
            selected={selected}
            onToggle={toggle}
            onSelectAll={() => selectAll(pharmacy)}
            onDeselectAll={() => deselectAll(pharmacy)}
          />
          <ItemList
            title="⚙️ Maintenance"
            items={maintenance}
            selected={selected}
            onToggle={toggle}
            onSelectAll={() => selectAll(maintenance)}
            onDeselectAll={() => deselectAll(maintenance)}
          />
        </div>
      </div>

      <style jsx global>{`
        @page { size: A4; margin: 8mm; }
        @media print {
          body { background: white; }
          .print-area { display: block !important; }
          aside, header, nav { display: none !important; }
          main { margin: 0 !important; padding: 0 !important; }
        }
      `}</style>
    </>
  );
}

function ItemList({
  title,
  items,
  selected,
  onToggle,
  onSelectAll,
  onDeselectAll,
}: {
  title: string;
  items: Item[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}) {
  const selCount = items.filter((i) => selected.has(i.item_id)).length;
  return (
    <div className="card">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-brand-900">{title}</h3>
        <div className="flex gap-1.5">
          <button onClick={onSelectAll} className="text-[11px] font-semibold text-brand-500 hover:underline">
            เลือกทั้งหมด
          </button>
          <span className="text-slate-300">·</span>
          <button onClick={onDeselectAll} className="text-[11px] font-semibold text-slate-500 hover:underline">
            ยกเลิก
          </button>
        </div>
      </div>
      <div className="mb-3 text-xs text-slate-400">
        เลือกแล้ว {selCount} / {items.length}
      </div>
      <div className="max-h-[420px] space-y-1 overflow-y-auto pr-1">
        {items.map((it) => {
          const checked = selected.has(it.item_id);
          return (
            <label
              key={it.item_id}
              className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition ${
                checked ? "bg-brand-50" : "hover:bg-slate-50"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(it.item_id)}
                className="h-4 w-4 rounded text-brand-500 focus:ring-brand-500"
              />
              <span className="rounded-md bg-brand-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-brand-500">
                {it.item_id}
              </span>
              <span className="flex-1 truncate">{it.item_name}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function PrintSheet({
  items,
  previews,
  cols,
  rows,
}: {
  items: Item[];
  previews: Record<string, string>;
  cols: number;
  rows: number;
}) {
  const perPage = cols * rows;
  const pages: Item[][] = [];
  for (let i = 0; i < items.length; i += perPage) {
    pages.push(items.slice(i, i + perPage));
  }

  return (
    <>
      {pages.map((page, pageIdx) => (
        <div
          key={pageIdx}
          className="page-break"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gap: "4mm",
            width: "100%",
            height: "calc(100vh - 16mm)",
            pageBreakAfter: pageIdx < pages.length - 1 ? "always" : "auto",
          }}
        >
          {page.map((it) => (
            <Sticker key={it.item_id} item={it} qrUrl={previews[it.item_id]} />
          ))}
        </div>
      ))}
    </>
  );
}

function Sticker({ item, qrUrl }: { item: Item; qrUrl?: string }) {
  const icon = item.module_type === "pharmacy" ? "💊" : "⚙️";
  return (
    <div
      style={{
        border: "1.5px dashed #94a3b8",
        borderRadius: "8px",
        padding: "6px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontFamily: "'Inter','Noto Sans Thai',sans-serif",
        breakInside: "avoid",
      }}
    >
      <div style={{ fontSize: "10px", fontWeight: 700, color: "#1a3a6b", lineHeight: 1.2 }}>
        {icon} {item.item_name}
      </div>
      <div
        style={{
          fontFamily: "monospace",
          fontSize: "8px",
          background: "#f0f5ff",
          color: "#1a56db",
          padding: "1px 5px",
          borderRadius: "4px",
          fontWeight: 700,
          margin: "2px 0",
        }}
      >
        {item.item_id}
      </div>
      {qrUrl && (
        <img
          src={qrUrl}
          alt="QR"
          style={{ width: "70%", maxWidth: "60mm", height: "auto" }}
        />
      )}
      <div style={{ fontSize: "7px", color: "#94a3b8", letterSpacing: "0.5px", marginTop: "2px" }}>
        SCAN ME · ITA-QOS
      </div>
    </div>
  );
}
