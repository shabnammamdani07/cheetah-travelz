import { QueryClient } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FEATURED_TRIP_SLUG, TripsPage } from "@/home/pages";

/* The Explore Group Trips page must show the girls trip's day-by-day plan, not just a card. */
async function renderTripsPage() {
  const root = createRootRoute();
  const page = createRoute({ getParentRoute: () => root, path: "/", component: TripsPage });
  const router = createRouter({
    routeTree: root.addChildren([page]),
    history: createMemoryHistory({ initialEntries: ["/"] }),
    context: { queryClient: new QueryClient() },
  });
  render(<RouterProvider router={router} />);
  // RouterProvider mounts empty until the router resolves its first match.
  await screen.findByRole("heading", { name: "Goa Girls Trip · 10–13 Dec 2026" });
}

describe("Explore Group Trips page", () => {
  it("shows the Goa girls trip itinerary (10–13 Dec 2026) on the page itself", async () => {
    await renderTripsPage();

    expect(screen.getByText("Goa Girls Trip · 10–13 Dec 2026")).toBeTruthy();
    const girlsItinerary = within(screen.getByRole("region", { name: "Goa Girls Trip · 10–13 Dec 2026" }));
    expect(girlsItinerary.getByText("Private Yacht Party")).toBeTruthy();
    expect(screen.getByText("Night on the beach")).toBeTruthy();
    expect(girlsItinerary.getByText("Kayaking & sunset")).toBeTruthy();
    expect(screen.getByText("Water sports")).toBeTruthy();
    expect(girlsItinerary.getByText("Arrival in Mumbai")).toBeTruthy();
  });

  it("features the girls trip slug", () => {
    expect(FEATURED_TRIP_SLUG).toBe("goa-girls-dec-2026");
  });
});
