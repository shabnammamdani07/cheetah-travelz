import { createFileRoute } from "@tanstack/react-router";

import ResourcePage from "@/admin/ResourcePage";
import { PROMOS } from "@/admin/resources";

export const Route = createFileRoute("/admin/promos")({
  component: () => <ResourcePage key="promos" cfg={PROMOS} />,
});
