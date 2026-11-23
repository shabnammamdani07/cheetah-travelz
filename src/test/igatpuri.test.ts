import { describe, expect, it } from "vitest";
import { getTrip } from "@/home/trips";

describe("Igatpuri camping trip", () => {
  it("is listed at ₹4,300 per person", () => {
    const t = getTrip("igatpuri-camping");
    expect(t?.departure.priceFrom).toBe(4300);
    expect(t?.detail.priceOptions[0]?.amount).toBe(4300);
  });

  it("runs 16–17 Jan 2027", () => {
    const t = getTrip("igatpuri-camping");
    expect(t?.departure.dateLabel).toBe("16–17 Jan 2027");
    expect(t?.departure.startDate).toBe("2027-01-16");
    expect(t?.departure.endDate).toBe("2027-01-17");
  });
});
