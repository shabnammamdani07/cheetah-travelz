import { createFileRoute } from "@tanstack/react-router";

import { Analytics } from "@/admin/pages";

export const Route = createFileRoute("/admin/analytics")({
  component: Analytics,
});
