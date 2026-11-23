import { describe, expect, it } from "vitest";
import { getTrip } from "@/home/trips";
import { DEPARTURES } from "@/home/data";

describe("21–24 Nov Goa trip removed", () => {
  it("has no trip page", () => {
    expect(getTrip("goa-nov-2026")).toBeNull();
  });
  it("is not listed anywhere on the site", () => {
    expect(DEPARTURES.map((d) => d.slug)).not.toContain("goa-nov-2026");
  });
});
