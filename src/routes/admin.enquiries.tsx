import { createFileRoute } from "@tanstack/react-router";

import ResourcePage from "@/admin/ResourcePage";
import { ENQUIRIES } from "@/admin/resources";

export const Route = createFileRoute("/admin/enquiries")({
  component: () => <ResourcePage key="enquiries" cfg={ENQUIRIES} />,
});
