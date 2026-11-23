import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { CircleCheck, Compass, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  buildTripNotices,
  canShowNotification,
  DISPLAY_TIME,
  FIRST_DELAY,
  loadNotificationBookings,
  NOTIFICATION_LIMIT,
  NOTIFICATION_SESSION_KEY,
  QUIET_TIME,
  readNotificationSession,
  type NotificationSession,
  type TripNotice,
} from "./trip-notifications";

export function TripNotification() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const allowed = !pathname.startsWith("/admin") && pathname !== "/account";
  const allowedRef = useRef(allowed);
  allowedRef.current = allowed;
  const [notice, setNotice] = useState<TripNotice | null>(null);
  const [obstructed, setObstructed] = useState(false);
  const session = useRef<NotificationSession>(readNotificationSession(null));
  const save = () => {
    try {
      sessionStorage.setItem(NOTIFICATION_SESSION_KEY, JSON.stringify(session.current));
    } catch {
      /* Keep in-memory state. */
    }
  };

  useEffect(() => {
    try {
      session.current = readNotificationSession(sessionStorage.getItem(NOTIFICATION_SESSION_KEY));
    } catch {
      /* Storage is optional. */
    }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    let items: TripNotice[] = [];
    let suggestionIndex = 0;
    const show = () => {
      if (
        cancelled ||
        session.current.dismissed ||
        session.current.count >= NOTIFICATION_LIMIT ||
        items.length === 0
      )
        return;
      if (
        !allowedRef.current ||
        document.hidden ||
        document.querySelector(".ct-menu.is-open") ||
        !canShowNotification(session.current, Date.now())
      ) {
        timer = setTimeout(show, 1000);
        return;
      }
      const index = items.some((item) => item.verified)
        ? Math.floor(Math.random() * items.length)
        : suggestionIndex++ % items.length;
      const next = items[index];
      if (!next) return;
      session.current = {
        ...session.current,
        count: session.current.count + 1,
        lastShown: Date.now(),
      };
      save();
      setNotice(next);
      hideTimer = setTimeout(() => setNotice(null), DISPLAY_TIME);
      timer = setTimeout(show, DISPLAY_TIME + QUIET_TIME);
    };
    void loadNotificationBookings()
      .catch(() => [])
      .then((rows) => {
        if (cancelled) return;
        const today = new Date(Date.now() + 330 * 60 * 1000).toISOString().slice(0, 10);
        items = buildTripNotices(rows, today);
        timer = setTimeout(show, FIRST_DELAY);
      });
    return () => {
      cancelled = true;
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    const check = () => {
      const bottom = window.innerHeight - (window.innerWidth < 768 ? 96 : 20);
      const right = 16 + Math.min(340, window.innerWidth - 32);
      const collision = [
        ...document.querySelectorAll(
          ".ct-bookcard a, .ct-bookform button, a[href*='wa.me'], .ct-menu.is-open",
        ),
      ].some((element) => {
        const rect = element.getBoundingClientRect();
        return (
          rect.width > 0 &&
          rect.height > 0 &&
          rect.left < right &&
          rect.right > 16 &&
          rect.top < bottom &&
          rect.bottom > bottom - 124
        );
      });
      setObstructed(collision);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    const observer = new MutationObserver(check);
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "hidden"],
    });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [pathname, notice]);

  if (!notice || !allowed || obstructed) return null;
  const NoticeIcon = notice.verified ? CircleCheck : Compass;
  return (
    <aside className="ct-trip-notice" aria-label="Trip notification">
      <Button asChild variant="ghost" className="ct-trip-notice__link">
        <Link to="/trips/$slug" params={{ slug: notice.trip.slug }}>
          <span className="ct-trip-notice__icon">
            <NoticeIcon aria-hidden="true" />
          </span>
          <span className="ct-trip-notice__copy" aria-live="polite">
            <span className="ct-trip-notice__title">
              {notice.verified
                ? `A traveller booked the ${notice.trip.name}.`
                : `Explore the ${notice.trip.name}`}
            </span>
            <span className="ct-trip-notice__detail">
              {notice.verified ? "Verified booking" : "View trip details"}
            </span>
          </span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="ct-trip-notice__close"
        aria-label="Dismiss trip notifications"
        title="Dismiss trip notifications"
        onClick={() => {
          session.current = { ...session.current, dismissed: true };
          save();
          setNotice(null);
        }}
      >
        <X aria-hidden="true" />
      </Button>
    </aside>
  );
}
