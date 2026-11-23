import { createFileRoute } from "@tanstack/react-router";

import HomePage from "@/home/HomePage";
import homeCss from "@/home/home.css?url";

// Cheetah Travelz homepage — three equal services: Solo Group Trips, Customized Holidays, Cars & Buses.
// Built from "Homepage Design & Mobile Wireframe" v1.0. Content/data: src/home/data.ts (verified data only).
// The home route ships no og:image, so serve-time hosting can inject the project's social preview.
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cheetah Travelz — Group Trips, Customized Holidays & Cars and Buses" },
      {
        name: "description",
        content:
          "Cheetah Travelz: solo group trips, customized holidays for couples, families and private groups, and chauffeur-driven cars & buses from Mumbai. MSME registered.",
      },
      { property: "og:title", content: "Cheetah Travelz — Your Journey. Your Way." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:description",
        content:
          "Solo group trips, customized holidays and chauffeur-driven cars & buses — one travel company.",
      },
    ],
    links: [
      { rel: "stylesheet", href: homeCss },
      { rel: "preload", as: "image", href: "/assets/img/hero-travel.jpg", fetchPriority: "high" },
    ],
  }),
  component: HomePage,
});
