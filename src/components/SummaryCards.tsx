"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import CountUp from "./CountUp";

type StatusValue = "all" | "green" | "yellow" | "red";

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = (searchParams.get("status") as StatusValue | null) ?? "all";

  function setFilter(s: StatusValue) {
    const next = new URLSearchParams(searchParams);
    if (s === "all") next.delete("status");
    else next.set("status", s);
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const cards: {
    key: StatusValue;
    label: string;
    threshold: string;
    value: number;
    color: string;
    bg: string;
    border: string;
    ring: string;
    dot: string | null;
  }[] = [
    {
      key: "all",
      label: "ทั้งหมด",
      threshold: "รวมทุกสถานะ",
      value: total,
      color: "text-brand-900",
      bg: "bg-white",
      border: "border-brand-100",
      ring: "ring-brand-500/40",
      dot: null,
    },
    {
      key: "green",
      label: "ปกติ",
      threshold: "เหลือ > 60 วัน",
      value: green,
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      ring: "ring-emerald-500/40",
      dot: "bg-emerald-500",
    },
    {
      key: "yellow",
      label: "เฝ้าระวัง",
      threshold: "เหลือ 1–60 วัน",
      value: yellow,
      color: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200",
      ring: "ring-amber-500/40",
      dot: "bg-amber-500",
    },
    {
      key: "red",
      label: "ด่วน / เกิน",
      threshold: "≤ 0 วัน (เกินกำหนด)",
      value: red,
      color: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-200",
      ring: "ring-red-500/40",
      dot: "bg-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((c, i) => {
        const isActive = active === c.key;
        return (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className={`group relative rounded-2xl border ${c.border} ${c.bg} p-5 text-left shadow-sm transition-all hover:shadow-md focus:outline-none focus:ring-2 ${c.ring} opacity-0 animate-fade-in ${
              isActive ? `ring-2 ${c.ring} shadow-md` : ""
            }`}
            style={{ animationDelay: `${i * 40}ms`, animationFillMode: "forwards" }}
          >
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {c.label}
              </div>
              {c.dot && (
                <span
                  className={`inline-block h-2 w-2 rounded-full ${c.dot} ${
                    isActive ? "animate-pulse" : ""
                  }`}
                />
              )}
            </div>
            <div className={`mt-2 text-3xl font-bold ${c.color}`}>
              <CountUp value={c.value} />
            </div>
            <div className="mt-1 text-[10px] font-medium text-slate-400">
              {c.threshold}
            </div>
            {isActive && (
              <div className="absolute right-2 top-2 rounded-full bg-white/80 px-2 py-0.5 text-[9px] font-bold text-slate-600 shadow-sm backdrop-blur">
                กำลังกรอง
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
