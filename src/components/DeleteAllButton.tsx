"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteAllInModule } from "@/lib/actions";

export default function DeleteAllButton({
  module,
  totalCount,
}: {
  module: "pharmacy" | "maintenance";
  totalCount: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  function onConfirm() {
    setErr(null);
    start(async () => {
      const r = await deleteAllInModule(module, confirmation);
      if (r?.error) {
        setErr(r.error);
        return;
      }
      setOpen(false);
      setConfirmation("");
      router.refresh();
    });
  }

  if (totalCount === 0) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
      >
        🗑 ลบทั้งหมด
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-3 flex items-start gap-3">
              <div className="text-2xl">⚠️</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">
                  ลบรายการทั้งหมด?
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  จะลบรายการ <span className="font-bold text-red-600">{totalCount}</span> รายการ
                  ใน{module === "pharmacy" ? "โมดูลยา" : "โมดูลเครื่องจักร"} ทั้งหมด
                  รวมถึง NFC mapping และ scan log ที่เกี่ยวข้อง
                </p>
                <p className="mt-2 text-xs font-semibold text-red-600">
                  การลบจะไม่สามารถกู้คืนได้
                </p>
              </div>
            </div>

            <div className="mt-4">
              <label className="label">
                พิมพ์คำว่า <span className="font-mono text-red-600">DELETE ALL</span> เพื่อยืนยัน
              </label>
              <input
                type="text"
                className="input font-mono"
                placeholder="DELETE ALL"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                autoFocus
              />
              {err && (
                <p className="mt-2 text-xs font-semibold text-red-600">{err}</p>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => {
                  setOpen(false);
                  setConfirmation("");
                  setErr(null);
                }}
                className="btn-secondary"
              >
                ยกเลิก
              </button>
              <button
                disabled={
                  pending ||
                  !["DELETE ALL", "DELETEALL"].includes(
                    confirmation.trim().toUpperCase().replace(/\s+/g, " "),
                  )
                }
                onClick={onConfirm}
                className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                {pending ? "กำลังลบ..." : `ลบทั้งหมด ${totalCount} รายการ`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
