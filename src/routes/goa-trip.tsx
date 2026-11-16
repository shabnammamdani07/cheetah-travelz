import { createFileRoute } from "@tanstack/react-router";

import SiteHome from "@/site/Home";
import siteCss from "@/site/site.css?url";

// Goa Group Trip (21–24 Nov) — the previous homepage, kept intact: itinerary, pricing,
// booking steps, enquiry form with referral code, and terms (#terms).
// Step 4 replaces this with the reusable individual-trip template.
export const Route = createFileRoute("/goa-trip")({
  head: () => ({
    meta: [
      { title: "Goa Group Trip · 21–24 Nov 2026 | Cheetah Travelz" },
      {
        name: "description",
        content:
          "Goa group trip from Mumbai, 21–24 Nov 2026: yacht party, water sports, sunset kayaking, North & South Goa sightseeing. From ₹8,900.",
      },
    ],
    links: [{ rel: "stylesheet", href: siteCss }],
  }),
  component: SiteHome,
});
