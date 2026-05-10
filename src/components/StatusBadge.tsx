import type { StatusColor } from "@/lib/types";

const map: Record<StatusColor, { label: string; cls: string; dot: string }> = {
  green:  { label: "ปกติ",      cls: "badge-green",  dot: "bg-emerald-500" },
  yellow: { label: "เฝ้าระวัง", cls: "badge-yellow", dot: "bg-amber-500"   },
  red:    { label: "ด่วน",      cls: "badge-red",    dot: "bg-red-500"     },
};

export function StatusBadge({ status }: { status: StatusColor }) {
  const m = map[status];
  return (
    <span className={`badge ${m.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

export function StatusDot({ status }: { status: StatusColor }) {
  const m = map[status];
  return <span className={`inline-block h-2 w-2 rounded-full ${m.dot}`} />;
}
