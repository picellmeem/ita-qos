import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function ScanPage({ params }: { params: Promise<{ uid: string }> }) {
  const { uid } = await params;
  const supabase = await createClient();

  // 1) ลองหาผ่าน NFC mapping ก่อน
  const { data: mapping } = await supabase
    .from("nfc_mappings")
    .select("item_id, items(module_type)")
    .eq("nfc_tag_uid", uid)
    .eq("mapping_status", "active")
    .maybeSingle();

  if (mapping) {
    const mod = (mapping.items as any)?.module_type as "pharmacy" | "maintenance";
    redirect(`/${mod}/${mapping.item_id}`);
  }

  // 2) Fallback — ใช้ uid เป็น item_id ตรงๆ (สำหรับ QR code)
  const { data: item } = await supabase
    .from("items")
    .select("item_id, module_type")
    .eq("item_id", uid)
    .maybeSingle();

  if (item) {
    redirect(`/${item.module_type}/${item.item_id}`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="card max-w-md text-center">
        <div className="text-3xl">⚠️</div>
        <h1 className="mt-3 text-lg font-bold text-brand-900">ไม่พบ Tag / Item นี้</h1>
        <p className="mt-2 text-sm text-slate-500">
          ตัวอ้างอิง <span className="font-mono">{uid}</span> ยังไม่ได้ผูกกับรายการในระบบ
        </p>
        <a href="/home" className="btn-secondary mt-4 inline-block">
          กลับหน้าหลัก
        </a>
      </div>
    </div>
  );
}
