import { createFileRoute } from "@tanstack/react-router";

import { pageHead } from "@/home/head";
import { TripPage } from "@/home/pages";
import { getTrip } from "@/home/trips";

// Reusable individual-trip template. Trip data: src/home/data.ts (DEPARTURES) + src/home/trips.ts.
export const Route = createFileRoute("/trips/$slug")({
  head: ({ params }) => {
    const t = getTrip(params.slug);
    return t
      ? pageHead(
          `${t.departure.name} · ${t.departure.dateLabel}`,
          `${t.departure.name}, ${t.departure.dateLabel} (${t.departure.duration}) — itinerary, inclusions, stay, prices from ₹${t.departure.priceFrom.toLocaleString("en-IN")} and booking.`,
        )
      : pageHead("Trip not found", "This trip isn't listed any more.", { noindex: true });
  },
  component: function TripRoute() {
    const { slug } = Route.useParams();
    return <TripPage slug={slug} />;
  },
});
