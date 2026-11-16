import { createFileRoute } from "@tanstack/react-router";

import { pageHead } from "@/home/head";
import { AboutPage } from "@/home/pages";

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead(
      "About Us",
      "Cheetah Travelz is an MSME-registered travel company from Mumbai: solo group trips, customized holidays and chauffeur-driven cars & buses.",
    ),
  component: AboutPage,
});
