import { createFileRoute } from "@tanstack/react-router";

import { pageHead } from "@/home/head";
import { BlogIndexPage } from "@/home/pages";

export const Route = createFileRoute("/blog/")({
  head: () =>
    pageHead("Travel Guides", "Trip guides and travel tips from the Cheetah Travelz team."),
  component: BlogIndexPage,
});
