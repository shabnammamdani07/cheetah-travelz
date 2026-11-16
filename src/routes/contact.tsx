import { createFileRoute } from "@tanstack/react-router";

import { pageHead } from "@/home/head";
import { ContactPage } from "@/home/pages";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead(
      "Contact Us",
      "Call or WhatsApp Cheetah Travelz on +91 72085 78110, or send us a message about group trips, holidays or vehicles.",
    ),
  component: ContactPage,
});
