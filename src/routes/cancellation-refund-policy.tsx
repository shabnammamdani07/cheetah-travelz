import { createFileRoute } from "@tanstack/react-router";

import { pageHead } from "@/home/head";
import { RefundPage } from "@/home/pages";

export const Route = createFileRoute("/cancellation-refund-policy")({
  head: () =>
    pageHead(
      "Cancellation & Refund Policy",
      "How cancellations, transfers and refunds work for Cheetah Travelz bookings.",
    ),
  component: RefundPage,
});
