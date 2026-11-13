import { createFileRoute } from "@tanstack/react-router";

import { useAdmin } from "@/admin/AdminLayout";
import { Dashboard } from "@/admin/pages";

export const Route = createFileRoute("/admin/")({
  component: function DashboardPage() {
    const { username } = useAdmin();
    return <Dashboard username={username} />;
  },
});
