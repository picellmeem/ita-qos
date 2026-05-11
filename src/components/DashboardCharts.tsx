"use client";
import dynamic from "next/dynamic";
import { useMemo } from "react";

// Lazy load recharts — ลดขนาด bundle หลัก
const ResponsiveContainer = dynamic(() => import("recharts").then((m) => m.ResponsiveContainer), { ssr: false });
const PieChart  = dynamic(() => import("recharts").then((m) => m.PieChart), { ssr: false });
const Pie       = dynamic(() => import("recharts").then((m) => m.Pie), { ssr: false });
const Cell      = dynamic(() => import("recharts").then((m) => m.Cell as any), { ssr: false });
const Tooltip   = dynamic(() => import("recharts").then((m) => m.Tooltip as any), { ssr: false });
const BarChart  = dynamic(() => import("recharts").then((m) => m.BarChart), { ssr: false });
const Bar       = dynamic(() => import("recharts").then((m) => m.Bar), { ssr: false });
const XAxis     = dynamic(() => import("recharts").then((m) => m.XAxis as any), { ssr: false });
const YAxis     = dynamic(() => import("recharts").then((m) => m.YAxis as any), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((m) => m.CartesianGrid as any), { ssr: false });
const AreaChart = dynamic(() => import("recharts").then((m) => m.AreaChart), { ssr: false });
const Area      = dynamic(() => import("recharts").then((m) => m.Area), { ssr: false });

const COLORS = {
  green:  "#10b981",
  yellow: "#f59e0b",
  red:    "#ef4444",
  brand:  "#1a56db",
};

type StatusData = { name: string; value: number; color: string };
type CategoryData = { category: string; count: number };
type TimelineData = { month: string; count: number };

function ChartFallback() {
  return (
    <div className="flex h-[220px] items-center justify-center">
      <div className="h-32 w-32 rounded-full border-4 border-slate-100 border-t-brand-500 animate-spin opacity-40" />
    </div>
  );
}

export function StatusPieChart({ green, yellow, red }: { green: number; yellow: number; red: number }) {
  const data: StatusData[] = useMemo(
    () =>
      [
        { name: "🟢 ปกติ",    value: green,  color: COLORS.green },
        { name: "🟡 เฝ้าระวัง", value: yellow, color: COLORS.yellow },
        { name: "🔴 ด่วน",     value: red,    color: COLORS.red },
      ].filter((d) => d.value > 0),
    [green, yellow, red],
  );

  const total = green + yellow + red;

  return (
    <div className="card h-full">
      <div className="card-title">สัดส่วนสถานะ</div>
      {total === 0 ? (
        <div className="flex h-48 items-center justify-center text-sm text-slate-400">
          ไม่มีข้อมูล
        </div>
      ) : (
        <div className="relative">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2} dataKey="value">
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="white" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2eaff", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-brand-900">{total}</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">ทั้งหมด</div>
          </div>
        </div>
      )}
      <div className="mt-3 flex flex-wrap justify-center gap-3 text-xs">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
            <span className="text-slate-600">{d.name}</span>
            <span className="font-bold text-slate-800">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CategoryBarChart({ data, title }: { data: CategoryData[]; title: string }) {
  const top = useMemo(() => data.slice(0, 8), [data]);
  return (
    <div className="card h-full">
      <div className="card-title">{title}</div>
      {top.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-sm text-slate-400">ไม่มีข้อมูล</div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={top} layout="vertical" margin={{ left: 12, right: 16, top: 4, bottom: 4 }}>
            <CartesianGrid horizontal={false} stroke="#f1f5f9" />
            <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis type="category" dataKey="category" tick={{ fill: "#475569", fontSize: 11 }} width={140} />
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2eaff", fontSize: 12 }} cursor={{ fill: "#f0f5ff" }} />
            <Bar dataKey="count" fill={COLORS.brand} radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function TimelineAreaChart({ data, title }: { data: TimelineData[]; title: string }) {
  return (
    <div className="card h-full">
      <div className="card-title">{title}</div>
      {data.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-sm text-slate-400">ไม่มีข้อมูล</div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ left: 0, right: 12, top: 8, bottom: 4 }}>
            <defs>
              <linearGradient id="timelineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.brand} stopOpacity={0.4} />
                <stop offset="100%" stopColor={COLORS.brand} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2eaff", fontSize: 12 }} cursor={{ fill: "#f0f5ff" }} />
            <Area type="monotone" dataKey="count" stroke={COLORS.brand} strokeWidth={2.5} fill="url(#timelineGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
