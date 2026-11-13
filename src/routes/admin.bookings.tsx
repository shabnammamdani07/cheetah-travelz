import { createFileRoute } from "@tanstack/react-router";

import ResourcePage from "@/admin/ResourcePage";
import { BOOKINGS } from "@/admin/resources";

export const Route = createFileRoute("/admin/bookings")({
  component: () => <ResourcePage key="bookings" cfg={BOOKINGS} />,
});
