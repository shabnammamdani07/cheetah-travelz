import { createFileRoute } from "@tanstack/react-router";

import ResourcePage from "@/admin/ResourcePage";
import { STORIES } from "@/admin/resources";

export const Route = createFileRoute("/admin/stories")({
  component: () => <ResourcePage key="stories" cfg={STORIES} />,
});
