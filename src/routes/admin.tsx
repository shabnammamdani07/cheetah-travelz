import { createFileRoute } from "@tanstack/react-router";

import AdminLayout from "@/admin/AdminLayout";
import adminCss from "@/admin/admin.css?url";

// Cheetah Travelz admin panel. Login, sidebar and session live in src/admin/AdminLayout.tsx;
// each section is its own route file (admin.trips.tsx, admin.enquiries.tsx, …).
// Client-only: the panel reads the login token from localStorage.
export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Admin · Cheetah Travelz" }, { name: "robots", content: "noindex, nofollow" }],
    links: [{ rel: "stylesheet", href: adminCss }],
  }),
  component: AdminLayout,
});
