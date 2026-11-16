import { createFileRoute } from "@tanstack/react-router";

import { pageHead } from "@/home/head";
import { TermsPage } from "@/home/pages";

export const Route = createFileRoute("/terms")({
  head: () =>
    pageHead(
      "Terms & Conditions",
      "Booking, payment, accommodation and conduct terms for Cheetah Travelz trips.",
    ),
  component: TermsPage,
});
