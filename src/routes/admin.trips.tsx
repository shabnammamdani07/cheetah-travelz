import { createFileRoute } from "@tanstack/react-router";

import ResourcePage from "@/admin/ResourcePage";
import { TRIPS } from "@/admin/resources";

export const Route = createFileRoute("/admin/trips")({
  component: () => <ResourcePage key="trips" cfg={TRIPS} />,
});
