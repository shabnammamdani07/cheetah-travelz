import { DEPARTURES, type Departure } from "./data";

export const NOTIFICATION_SESSION_KEY = "ct-trip-notifications-v1";
export const NOTIFICATION_LIMIT = 3;
export const FIRST_DELAY = 5000;
export const DISPLAY_TIME = 8000;
export const QUIET_TIME = 15000;
export type NotificationSession = { count: number; dismissed: boolean; lastShown: number };
export type TripNotice = { trip: Departure; verified: boolean };

export function readNotificationSession(value: string | null): NotificationSession {
  try {
    const parsed: unknown = JSON.parse(value ?? "null");
    if (
      parsed &&
      typeof parsed === "object" &&
      "count" in parsed &&
      "dismissed" in parsed &&
      "lastShown" in parsed &&
      typeof parsed.count === "number" &&
      Number.isInteger(parsed.count) &&
      parsed.count >= 0 &&
      typeof parsed.dismissed === "boolean" &&
      typeof parsed.lastShown === "number" &&
      Number.isFinite(parsed.lastShown)
    ) {
      return { count: parsed.count, dismissed: parsed.dismissed, lastShown: parsed.lastShown };
    }
  } catch {
    /* Invalid storage must not break the site. */
  }
  return { count: 0, dismissed: false, lastShown: 0 };
}

export function canShowNotification(session: NotificationSession, now: number): boolean {
  return (
    !session.dismissed &&
    session.count < NOTIFICATION_LIMIT &&
    (session.lastShown === 0 || now >= session.lastShown + DISPLAY_TIME + QUIET_TIME)
  );
}

export function buildTripNotices(
  rows: readonly { trip_slug: string }[],
  today: string,
): TripNotice[] {
  const trips = DEPARTURES.filter((trip) => trip.startDate >= today);
  const confirmed = rows
    .flatMap((row) => {
      const trip = trips.find((candidate) => candidate.slug === row.trip_slug);
      return trip ? [{ trip, verified: true }] : [];
    })
    .slice(0, 100);
  return confirmed.length ? confirmed : trips.map((trip) => ({ trip, verified: false }));
}

export async function loadNotificationBookings(): Promise<{ trip_slug: string }[]> {
  // The public RPC returns only anonymous trip identifiers, never customer data.
  const { supabase } = await import("@/integrations/supabase/client");
  const { data, error } = await supabase.rpc("trip_notification_bookings");
  return error ? [] : (data ?? []);
}
