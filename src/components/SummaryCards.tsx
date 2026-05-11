import CountUp from "./CountUp";

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
    { label: "ทั้งหมด",       value: total,  color: "text-brand-900",   bg: "bg-white",      border: "border-brand-100",    dot: null },
    { label: "ปกติ",         value: green,  color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200",  dot: "bg-emerald-500" },
    { label: "เฝ้าระวัง",     value: yellow, color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200",    dot: "bg-amber-500" },
    { label: "ด่วน / เกิน",   value: red,    color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200",      dot: "bg-red-500" },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((c, i) => (
        <div
          key={c.label}
          className={`group rounded-2xl border ${c.border} ${c.bg} p-5 shadow-sm transition-shadow hover:shadow-md opacity-0 animate-fade-in`}
          style={{ animationDelay: `${i * 40}ms`, animationFillMode: "forwards" }}
        >
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {c.label}
            </div>
            {c.dot && (
              <span className={`inline-block h-2 w-2 rounded-full ${c.dot} group-hover:animate-pulse`} />
            )}
          </div>
          <div className={`mt-2 text-3xl font-bold ${c.color}`}>
            <CountUp value={c.value} />
          </div>
        </div>
      ))}
    </div>
  );
}
