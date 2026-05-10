import AppShell from "@/components/AppShell";
import { createClient } from "@/lib/supabase-server";
import StickersClient from "./StickersClient";

export const dynamic = "force-dynamic";

export default async function PrintStickersPage() {
  const supabase = await createClient();
  const [{ data: pharmacy }, { data: maintenance }] = await Promise.all([
    supabase.from("items").select("item_id, item_name, module_type").eq("module_type", "pharmacy").eq("active_flag", true).order("item_id"),
    supabase.from("items").select("item_id, item_name, module_type").eq("module_type", "maintenance").eq("active_flag", true).order("item_id"),
  ]);

  return (
    <AppShell title="🏷 พิมพ์ NFC/QR Stickers">
      <StickersClient
        pharmacy={pharmacy ?? []}
        maintenance={maintenance ?? []}
      />
    </AppShell>
  );
}
