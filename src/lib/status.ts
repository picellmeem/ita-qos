import type { StatusColor } from "./types";

export function calcStatus(criticalDate: string | null | undefined): StatusColor {
  if (!criticalDate) return "red";
  const d = new Date(criticalDate);
  const days = Math.ceil((d.getTime() - Date.now()) / 86_400_000);
  if (days > 60) return "green";
  if (days >= 1) return "yellow";
  return "red";
}

export function statusLabel(s: StatusColor): string {
  return s === "green" ? "ปกติ" : s === "yellow" ? "ต้องการความสนใจ" : "ด่วน / เกินกำหนด";
}

export function statusMessage(s: StatusColor, days: number | null, mode: "expiry" | "maintenance"): string {
  if (days === null) return "ไม่มีข้อมูลวันที่";
  const noun = mode === "expiry" ? "หมดอายุ" : "ซ่อมบำรุง";
  if (days < 0) return `${noun} เกินกำหนด ${Math.abs(days)} วัน`;
  if (days === 0) return `${noun} วันนี้`;
  return `จะ${noun}ใน ${days} วัน`;
}

export function fmtDate(d: string | null | undefined): string {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" });
}
