import AppShell from "@/components/AppShell";
import { createClient } from "@/lib/supabase-server";
import LogsClient, { type LogRow } from "./LogsClient";

export const dynamic = "force-dynamic";

export default async function LogsPage() {
  const supabase = await createClient();

  // ดึง audit logs + join profile แยก (Supabase ไม่รองรับ join auth schema ตรง)
  const { data: logs } = await supabase
    .from("audit_logs")
    .select("*")
    .order("changed_at", { ascending: false })
    .limit(300);

  const userIds = Array.from(new Set((logs ?? []).map((l) => l.user_id).filter(Boolean)));
  const { data: profiles } = userIds.length
    ? await supabase
        .from("profiles")
        .select("user_id, full_name, username, role_code")
        .in("user_id", userIds)
    : { data: [] as any[] };

  const profileMap = new Map<string, any>();
  (profiles ?? []).forEach((p) => profileMap.set(p.user_id, p));

  const rows: LogRow[] = (logs ?? []).map((l) => {
    const profile = l.user_id ? profileMap.get(l.user_id) : null;
    return {
      audit_id: l.audit_id,
      item_id: l.item_id,
      module_type: l.module_type,
      action_type: l.action_type,
      old_value: l.old_value,
      new_value: l.new_value,
      changed_at: l.changed_at,
      user_name: profile?.full_name || profile?.username || null,
      user_role: profile?.role_code || null,
    };
  });

  return (
    <AppShell title="📋 Audit Log">
      <LogsClient rows={rows} />
    </AppShell>
  );
}
