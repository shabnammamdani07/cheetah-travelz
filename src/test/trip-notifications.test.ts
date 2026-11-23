import { describe, expect, it } from "vitest";
import {
  buildTripNotices,
  canShowNotification,
  DISPLAY_TIME,
  FIRST_DELAY,
  QUIET_TIME,
  readNotificationSession,
} from "@/home/trip-notifications";

describe("trip notification rules", () => {
  it("suggests actual upcoming trips when no confirmed bookings exist", () => {
    const notices = buildTripNotices([], "2026-11-20");
    expect(notices.length).toBe(4);
    expect(notices.every((item) => !item.verified)).toBe(true);
    expect(notices.find((item) => item.trip.slug === "igatpuri-camping")?.trip.href).toBe(
      "/trips/igatpuri-camping",
    );
  });
  it("uses only known upcoming trip links for confirmed bookings", () => {
    const notices = buildTripNotices(
      [{ trip_slug: "goa-girls-dec-2026" }, { trip_slug: "unknown" }],
      "2026-11-20",
    );
    expect(notices.length).toBe(1);
    expect(notices[0]?.verified).toBe(true);
    expect(notices[0]?.trip.href).toBe("/trips/goa-girls-dec-2026");
  });
  it("selects from no more than 100 eligible bookings", () => {
    const rows = Array.from({ length: 120 }, () => ({ trip_slug: "goa-girls-dec-2026" }));
    expect(buildTripNotices(rows, "2026-11-20").length).toBe(100);
  });
  it("falls back when booking trips are expired or unknown", () => {
    const notices = buildTripNotices([{ trip_slug: "goa-nov-2026" }], "2026-11-22");
    expect(notices.length).toBe(4);
    expect(notices.every((item) => !item.verified)).toBe(true);
  });
  it("stops after three notifications per session", () => {
    expect(canShowNotification({ count: 2, dismissed: false, lastShown: 0 }, 100000)).toBe(true);
    expect(canShowNotification({ count: 3, dismissed: false, lastShown: 0 }, 100000)).toBe(false);
  });
  it("waits at least 15 seconds after the previous notification hides", () => {
    const session = { count: 1, dismissed: false, lastShown: 10000 };
    expect(QUIET_TIME).toBe(15000);
    expect(canShowNotification(session, 10000 + DISPLAY_TIME + 14999)).toBe(false);
    expect(canShowNotification(session, 10000 + DISPLAY_TIME + 15000)).toBe(true);
  });
  it("preserves dismissal across page mounts", () => {
    const saved = JSON.stringify({ count: 1, dismissed: true, lastShown: 10000 });
    expect(canShowNotification(readNotificationSession(saved), 999999)).toBe(false);
  });
  it("delays the first notification by five seconds", () => {
    expect(FIRST_DELAY).toBe(5000);
  });
  it("recovers safely from invalid session storage", () => {
    expect(readNotificationSession("broken")).toEqual({ count: 0, dismissed: false, lastShown: 0 });
  });
});
