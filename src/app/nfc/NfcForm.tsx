"use client";
import { useState, useTransition } from "react";
import { assignNfcTag } from "@/lib/actions";

type Item = { item_id: string; item_name: string };

export default function NfcForm({ pharmacy, maintenance }: { pharmacy: Item[]; maintenance: Item[] }) {
  const [mod, setMod] = useState<"pharmacy" | "maintenance">("pharmacy");
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [pending, start] = useTransition();
  const items = mod === "pharmacy" ? pharmacy : maintenance;

  function onSubmit(formData: FormData) {
    setMsg(null);
    start(async () => {
      const r = await assignNfcTag(formData);
      if (r?.error) setMsg({ kind: "err", text: r.error });
      else setMsg({ kind: "ok", text: "ผูก NFC Tag สำเร็จ" });
    });
  }

  return (
    <form action={onSubmit} className="card space-y-4">
      <h2 className="text-base font-semibold text-brand-900">ผูก NFC Tag เข้ากับรายการ</h2>

      {msg && (
        <div className={`rounded-lg px-3 py-2 text-sm font-medium ${msg.kind === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
          {msg.text}
        </div>
      )}

      <div>
        <label className="label">โมดูล</label>
        <select className="input" value={mod} onChange={(e) => setMod(e.target.value as any)}>
          <option value="pharmacy">💊 Pharmacy</option>
          <option value="maintenance">⚙️ Maintenance</option>
        </select>
      </div>

      <div>
        <label className="label">เลือกรายการ *</label>
        <select name="item_id" required className="input">
          <option value="">— เลือก —</option>
          {items.map((i) => (
            <option key={i.item_id} value={i.item_id}>
              {i.item_id} — {i.item_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">NFC Tag UID *</label>
        <input
          name="nfc_tag_uid"
          required
          className="input font-mono"
          placeholder="04:A3:B2:C1:D8:E5:F0"
        />
        <p className="mt-1 text-[11px] text-slate-400">
          ผูก URL ของ tag เป็น <span className="font-mono">https://yourdomain/scan/&lt;TAG_UID&gt;</span>
        </p>
      </div>

      <button disabled={pending} className="btn-primary w-full">
        {pending ? "กำลังบันทึก..." : "💾 บันทึก"}
      </button>
    </form>
  );
}
