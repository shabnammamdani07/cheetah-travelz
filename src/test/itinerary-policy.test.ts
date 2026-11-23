import { describe, expect, it } from "vitest";
import { ITINERARY_POLICY, getTrip } from "@/home/trips";

describe("itinerary policy rules", () => {
  it("charges 100% for a no-show or failure to transfer before departure", () => {
    expect(ITINERARY_POLICY.noShowChargePercent).toBe(100);
  });
  it("offers a full 100% booking refund when the organizer cancels", () => {
    expect(ITINERARY_POLICY.organizerCancellationRefundPercent).toBe(100);
  });
  it("requires arrival 15 minutes before departure", () => {
    expect(ITINERARY_POLICY.arrivalMinutesBeforeDeparture).toBe(15);
  });
  it("uses triple sharing by default for hotels", () => {
    expect(ITINERARY_POLICY.defaultHotelOccupancy).toBe(3);
  });
  it("uses 3-star hotels", () => {
    expect(ITINERARY_POLICY.hotelStars).toBe(3);
  });
  it("provides one double bed and one sofa-cum-bed or mattress", () => {
    expect(ITINERARY_POLICY.doubleBeds).toBe(1);
    expect(ITINERARY_POLICY.extraBedsOrMattresses).toBe(1);
  });
  it.each(["goa-girls-dec-2026", "goa-christmas-dec-2026", "goa-new-year-2027"])("preserves the ₹2,900 Goa booking amount for %s", (slug) => {
    expect(getTrip(slug)?.detail.reservePerPerson).toBe(2900);
  });
  it("does not change Igatpuri's existing ₹4,300 payment", () => {
    expect(getTrip("igatpuri-camping")?.detail.reservePerPerson).toBe(4300);
  });
});