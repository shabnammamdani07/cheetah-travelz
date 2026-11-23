import { describe, expect, it } from "vitest";
import { upcomingTrips } from "@/home/data";
import { getTrip } from "@/home/trips";

describe("24–27 December Goa trip", () => {
  it("lists the departure and returns to Mumbai on 28 December", () => {
    const trip = getTrip("goa-christmas-dec-2026", "2026-11-20");
    expect(trip?.departure.startDate).toBe("2026-12-24");
    expect(trip?.departure.endDate).toBe("2026-12-28");
    expect(upcomingTrips("2026-11-20").map((t) => t.slug)).toContain("goa-christmas-dec-2026");
    expect(trip?.detail.itinerary.at(-1)?.stops[0]?.time).toBe("05:30 AM");
  });
  it("uses the PDF's three prices before 30 November", () => {
    expect(getTrip("goa-christmas-dec-2026", "2026-11-29")?.detail.priceOptions.map((o) => o.amount)).toEqual([8900, 10900, 14900]);
  });
  it("uses ₹13,400 regular pushback pricing from 30 November", () => {
    expect(getTrip("goa-christmas-dec-2026", "2026-11-30")?.detail.priceOptions.map((o) => o.amount)).toEqual([8900, 13400, 14900]);
  });
  it("charges a ₹2,900 per-person booking advance", () => {
    expect(getTrip("goa-christmas-dec-2026")?.detail.reservePerPerson).toBe(2900);
  });
  it("schedules the yacht on 27 December at 3:30 PM and departure at 6 PM", () => {
    const day = getTrip("goa-christmas-dec-2026")?.detail.itinerary[3];
    expect(day?.stops.find((s) => s.title === "Private Yacht Party")?.time).toBe("03:30 PM");
    expect(day?.stops.find((s) => s.title === "Depart for Mumbai")?.time).toBe("06:00 PM");
  });
});