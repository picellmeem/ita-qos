import AppShell from "@/components/AppShell";
import { createClient } from "@/lib/supabase-server";
import NfcForm from "./NfcForm";
import NfcTable from "./NfcTable";

export const dynamic = "force-dynamic";

export default async function NfcPage() {
  const supabase = await createClient();

  const [pharmacy, maintenance, mappings] = await Promise.all([
    supabase.from("items").select("item_id,item_name").eq("module_type", "pharmacy").eq("active_flag", true).order("item_id"),
    supabase.from("items").select("item_id,item_name").eq("module_type", "maintenance").eq("active_flag", true).order("item_id"),
    supabase
      .from("nfc_mappings")
      .select("mapping_id, nfc_tag_uid, item_id, mapping_status, assigned_at, items(item_name, module_type)")
      .eq("mapping_status", "active")
      .order("assigned_at", { ascending: false })
      .limit(100),
  ]);

  return (
    <AppShell title="📱 NFC Mapping">
      <div className="grid gap-5 lg:grid-cols-[480px_1fr]">
        <NfcForm
          pharmacy={pharmacy.data ?? []}
          maintenance={maintenance.data ?? []}
        />
        <div>
          <h3 className="mb-3 text-sm font-semibold text-brand-900">Mapping ที่ใช้งาน</h3>
          <NfcTable rows={(mappings.data ?? []) as any[]} />
        </div>
      </div>
    </AppShell>
  );
}
