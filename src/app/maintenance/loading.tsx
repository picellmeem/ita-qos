import AppShell from "@/components/AppShell";
import { DashboardSkeleton } from "@/components/Loading";

export default function Loading() {
  return (
    <AppShell title="⚙️ Maintenance Dashboard">
      <DashboardSkeleton />
    </AppShell>
  );
}
