import { createFileRoute } from "@tanstack/react-router";

import ResourcePage from "@/admin/ResourcePage";
import { USERS } from "@/admin/resources";

export const Route = createFileRoute("/admin/users")({
  component: () => <ResourcePage key="users" cfg={USERS} />,
});
