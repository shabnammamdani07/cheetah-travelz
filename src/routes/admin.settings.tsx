import { createFileRoute } from "@tanstack/react-router";

import { useAdmin } from "@/admin/AdminLayout";
import { Settings } from "@/admin/pages";

export const Route = createFileRoute("/admin/settings")({
  component: function SettingsPage() {
    const { username, isDefault, setUser } = useAdmin();
    return <Settings username={username} isDefault={isDefault} onChanged={setUser} />;
  },
});
