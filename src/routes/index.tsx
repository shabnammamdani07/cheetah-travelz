import { createFileRoute } from "@tanstack/react-router";

import SiteHome from "@/site/Home";
import siteCss from "@/site/site.css?url";

// The public Cheetah Travelz website. Copy (prices, dates, itinerary, reviews…) lives in
// src/site/content.ts; the look lives in src/site/site.css; animations in src/site/siteEffects.ts.
// The home route ships no og:image, so serve-time hosting can inject the project's social preview.
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cheetah Travelz — Solo & group trips from Mumbai" },
      {
        name: "description",
        content:
          "Cheetah Travelz — MSME registered solo & private group trips from Mumbai to Goa, Daman, Mahabaleshwar, Lonavala and anywhere in India, plus chauffeur-driven cars & buses. Next trip: Goa, 21–24 Nov.",
      },
      { property: "og:title", content: "Cheetah Travelz — We take you everywhere" },
      {
        property: "og:description",
        content:
          "Solo & group trips to Goa, Daman, Mahabaleshwar, Lonavala and beyond. Next departure: Goa, 21–24 Nov.",
      },
    ],
    links: [{ rel: "stylesheet", href: siteCss }],
  }),
  component: SiteHome,
});
