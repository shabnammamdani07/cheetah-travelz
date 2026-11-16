import { createFileRoute } from "@tanstack/react-router";

import { pageHead } from "@/home/head";
import { TripsPage } from "@/home/pages";

export const Route = createFileRoute("/group-trips")({
  head: () =>
    pageHead(
      "Solo Group Trips",
      "Upcoming solo group trips from Mumbai with Cheetah Travelz — confirmed dates, prices and itineraries.",
    ),
  component: TripsPage,
});
