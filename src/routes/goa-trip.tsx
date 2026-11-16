import { createFileRoute, redirect } from "@tanstack/react-router";

// Old Goa trip URL — now served by the reusable trip template.
export const Route = createFileRoute("/goa-trip")({
  beforeLoad: () => {
    throw redirect({ to: "/trips/$slug", params: { slug: "goa-nov-2026" }, statusCode: 301 });
  },
});
