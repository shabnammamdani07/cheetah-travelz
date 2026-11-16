import { createFileRoute } from "@tanstack/react-router";

import { pageHead } from "@/home/head";
import { AccountPage } from "@/home/pages";

export const Route = createFileRoute("/account")({
  head: () =>
    pageHead("My Account", "Your Cheetah Travelz bookings, trip history and reward points.", {
      noindex: true,
    }),
  component: AccountPage,
});
