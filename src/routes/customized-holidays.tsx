import { createFileRoute } from "@tanstack/react-router";

import { pageHead } from "@/home/head";
import { HolidaysPage } from "@/home/pages";

export const Route = createFileRoute("/customized-holidays")({
  head: () =>
    pageHead(
      "Customized Holidays",
      "Private holidays for couples, honeymooners, families and groups — planned around your dates, destination and budget.",
    ),
  component: HolidaysPage,
});
