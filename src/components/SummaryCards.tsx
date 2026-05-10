export function SummaryCards({
  total,
  green,
  yellow,
  red,
}: {
  total: number;
  green: number;
  yellow: number;
  red: number;
}) {
  const cards = [
    { label: "ทั้งหมด",       value: total,  color: "text-brand-900",   bg: "bg-white",    border: "border-brand-100" },
    { label: "ปกติ",         value: green,  color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
    { label: "เฝ้าระวัง",     value: yellow, color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
    { label: "ด่วน / เกิน",   value: red,    color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className={`rounded-2xl border ${c.border} ${c.bg} p-5 shadow-sm`}>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{c.label}</div>
          <div className={`mt-2 text-3xl font-bold ${c.color}`}>{c.value}</div>
        </div>
      ))}
    </div>
  );
}
