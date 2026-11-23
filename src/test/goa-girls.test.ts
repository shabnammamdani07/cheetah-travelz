import { describe, expect, it } from "vitest";
import { getTrip } from "@/home/trips";

describe("Goa girls trip", () => {
  it("runs 10–13 Dec 2026 with ₹8,900 / ₹10,900 options and ₹2,900 advance", () => {
    const t = getTrip("goa-girls-dec-2026");
    expect(t?.departure.startDate).toBe("2026-12-10");
    expect(t?.detail.priceOptions.map((o) => o.amount)).toEqual([8900, 10900]);
    expect(t?.detail.reservePerPerson).toBe(2900);
  });
});
