import { describe, expect, it } from "vitest";
import { getTrip } from "@/home/trips";
import { reserveTotalPaise } from "@/lib/payments.functions";

describe("online reserve amount", () => {
  it("Goa charges ₹2,900 per person", () => {
    expect(getTrip("goa-girls-dec-2026")?.detail.reservePerPerson).toBe(2900);
    expect(reserveTotalPaise(2900, 2)).toBe(580000);
  });
  it("Igatpuri charges ₹4,300 per person", () => {
    expect(getTrip("igatpuri-camping")?.detail.reservePerPerson).toBe(4300);
  });
});
