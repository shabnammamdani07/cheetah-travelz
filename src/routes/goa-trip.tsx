import { createFileRoute, redirect } from "@tanstack/react-router";

// Old Goa trip URL — now served by the reusable trip template.
export const Route = createFileRoute("/goa-trip")({
  beforeLoad: () => {
    throw redirect({ to: "/group-trips", statusCode: 301 });
  },
});
