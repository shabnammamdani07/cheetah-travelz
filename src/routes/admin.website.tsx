import { createFileRoute } from "@tanstack/react-router";

import { WebsiteInfo } from "@/admin/pages";

export const Route = createFileRoute("/admin/website")({
  component: WebsiteInfo,
});
