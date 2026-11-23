import { describe, expect, it } from "vitest";
import { upcomingTrips } from "@/home/data";
import { canBookOnline, getTrip } from "@/home/trips";

describe("Goa New Year itinerary", () => {
  it("runs from 30 December 2026 to 4 January 2027", () => {
    const trip = getTrip("goa-new-year-2027");
    expect(trip?.departure.startDate).toBe("2026-12-30");
    expect(trip?.departure.endDate).toBe("2027-01-04");
    expect(trip?.detail.itinerary).toHaveLength(6);
    expect(trip?.detail.itinerary[0]?.stops[0]?.time).toBe("09:00 PM");
    expect(trip?.detail.itinerary[5]?.stops[0]?.time).toBe("04:00 AM");
  });
  it("includes 3 breakfasts, 1 lunch and 2 dinners", () => {
    expect(getTrip("goa-new-year-2027")?.detail.included).toEqual([["Meals", "3 breakfasts, 1 lunch & 2 dinners"]]);
  });
  it("schedules the yacht party on 2 January at 5 PM", () => {
    expect(getTrip("goa-new-year-2027")?.detail.itinerary[3]?.stops.find((s) => s.title === "Private yacht party & sunset")?.time).toBe("05:00 PM");
  });
  it("shows a 3-star hotel stay", () => {
    expect(getTrip("goa-new-year-2027")?.detail.stayText).toContain("3-star hotel");
  });
  it("charges a ₹2,900 advance online against the ₹14,900 package price", () => {
    const trip = getTrip("goa-new-year-2027");
    expect(trip).not.toBeNull();
    if (!trip) throw new Error("Missing New Year trip");
    expect(trip.departure.priceFrom).toBe(14900);
    expect(trip.detail.priceOptions.map((o) => o.amount)).toEqual([14900]);
    expect(trip.detail.reservePerPerson).toBe(2900);
    expect(canBookOnline(trip.detail)).toBe(true);
  });
  it("retains every existing departure on Explore Group Trips", () => {
    expect(upcomingTrips("2026-11-20", Infinity).map((t) => t.slug)).toEqual([
      "goa-girls-dec-2026", "goa-christmas-dec-2026", "goa-new-year-2027", "igatpuri-camping",
    ]);
  });
});