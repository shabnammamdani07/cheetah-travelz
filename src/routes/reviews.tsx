import { createFileRoute } from "@tanstack/react-router";

import { pageHead } from "@/home/head";
import { ReviewsPage } from "@/home/pages";

export const Route = createFileRoute("/reviews")({
  head: () =>
    pageHead("Traveller Reviews", "Genuine Google reviews from Cheetah Travelz travellers."),
  component: ReviewsPage,
});
