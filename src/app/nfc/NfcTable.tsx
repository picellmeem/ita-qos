"use client";
import Link from "next/link";
import { useTransition } from "react";
import { unassignNfcTag } from "@/lib/actions";

type Row = {
  mapping_id: string;
  nfc_tag_uid: string;
  item_id: string;
  assigned_at: string;
  items: { item_name: string; module_type: "pharmacy" | "maintenance" } | null;
};

export default function NfcTable({ rows }: { rows: Row[] }) {
  const [pending, start] = useTransition();

  if (rows.length === 0) {
    return (
      <div className="card text-center text-slate-400 text-sm py-12">
        ยังไม่มี Mapping ที่ใช้งาน
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-brand-100 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-4 py-3 text-left">Item</th>
            <th className="px-4 py-3 text-left">Tag UID</th>
            <th className="px-4 py-3 text-left">โมดูล</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.mapping_id} className="border-t border-brand-100">
              <td className="px-4 py-3">
                <Link
                  href={`/${r.items?.module_type}/${r.item_id}`}
                  className="font-mono text-xs font-semibold text-brand-500 hover:underline"
                >
                  {r.item_id}
                </Link>
                <div className="text-xs text-slate-500">{r.items?.item_name}</div>
              </td>
              <td className="px-4 py-3 font-mono text-xs">{r.nfc_tag_uid}</td>
              <td className="px-4 py-3">
                <span className="badge badge-gray">{r.items?.module_type ?? "-"}</span>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  disabled={pending}
                  onClick={() => {
                    if (!confirm("ยกเลิกการผูก NFC Tag นี้?")) return;
                    start(() => unassignNfcTag(r.mapping_id));
                  }}
                  className="btn-danger"
                >
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
