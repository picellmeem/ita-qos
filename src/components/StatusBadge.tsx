import type { StatusColor } from "@/lib/types";

const map: Record<StatusColor, { label: string; cls: string; dot: string; pulse: boolean }> = {
  green:  { label: "ปกติ",      cls: "badge-green",  dot: "bg-emerald-500", pulse: false },
  yellow: { label: "เฝ้าระวัง", cls: "badge-yellow", dot: "bg-amber-500",   pulse: false },
  red:    { label: "ด่วน",      cls: "badge-red",    dot: "bg-red-500",     pulse: true  },
};

export function StatusBadge({ status }: { status: StatusColor }) {
  const m = map[status];
  return (
    <span className={`badge ${m.cls}`}>
      <span className="relative flex h-2 w-2">
        {m.pulse && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${m.dot} opacity-75`} />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${m.dot}`} />
      </span>
      {m.label}
    </span>
  );
}

export function StatusDot({ status }: { status: StatusColor }) {
  const m = map[status];
  return <span className={`inline-block h-2 w-2 rounded-full ${m.dot}`} />;
}
