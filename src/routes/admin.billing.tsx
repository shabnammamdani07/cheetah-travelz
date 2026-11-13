import { createFileRoute } from "@tanstack/react-router";

import { Billing } from "@/admin/pages";

export const Route = createFileRoute("/admin/billing")({
  component: Billing,
});
