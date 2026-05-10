"use client";
import { useTransition } from "react";
import { deleteItem } from "@/lib/actions";

export default function DeleteItemButton({
  itemId,
  module,
  itemName,
  variant = "icon",
}: {
  itemId: string;
  module: "pharmacy" | "maintenance";
  itemName?: string;
  variant?: "icon" | "full";
}) {
  const [pending, start] = useTransition();

  function onClick() {
    const label = itemName ? `"${itemName}" (${itemId})` : itemId;
    if (!confirm(`ลบรายการ ${label}?\n\nการลบจะไม่สามารถกู้คืนได้`)) return;
    start(async () => {
      const r = await deleteItem(itemId, module);
      if (r?.error) alert("ลบไม่สำเร็จ: " + r.error);
    });
  }

  if (variant === "icon") {
    return (
      <button
        disabled={pending}
        onClick={onClick}
        title="ลบรายการ"
        className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
      >
        🗑
      </button>
    );
  }

  return (
    <button disabled={pending} onClick={onClick} className="btn-danger">
      🗑 {pending ? "กำลังลบ..." : "ลบรายการ"}
    </button>
  );
}
