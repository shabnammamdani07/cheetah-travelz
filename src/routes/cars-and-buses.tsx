import { createFileRoute } from "@tanstack/react-router";

import { pageHead } from "@/home/head";
import { TransportPage } from "@/home/pages";

export const Route = createFileRoute("/cars-and-buses")({
  head: () =>
    pageHead(
      "Cars & Buses",
      "Chauffeur-driven Sedans, SUVs, Innova Crysta, Tempo Travellers and AC buses for airport transfers, outstation and group travel.",
    ),
  component: TransportPage,
});
