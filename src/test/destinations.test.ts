import { describe, expect, it } from "vitest";

import { DESTINATIONS } from "@/home/data";

const names = DESTINATIONS.map((d) => d.name);

/* The client asked for these places to be selectable when planning a trip. */
describe("Holiday destinations", () => {
  it("offers every destination the client asked to add", () => {
    for (const n of ["Kerala", "Kashmir", "Ladakh", "Kutch", "Ooty", "Punjab", "Delhi"]) {
      expect(names).toContain(n);
    }
  });

  it("keeps the tiles that already had photos", () => {
    expect(names).toContain("Goa");
    expect(names).toContain("Rajasthan");
    expect(DESTINATIONS.find((d) => d.name === "Kerala")?.image).toBe("kerala.jpg");
  });
});
