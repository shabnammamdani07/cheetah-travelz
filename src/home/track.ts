/* Analytics hook for CTA / form events. Sends to GA4 (gtag / dataLayer) and Meta Pixel
   only when those are configured on the page; otherwise it does nothing. */
type W = Window & {
  dataLayer?: unknown[];
  gtag?: (...a: unknown[]) => void;
  fbq?: (...a: unknown[]) => void;
};

export function track(event: string, params: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  const w = window as W;
  try {
    if (w.gtag) w.gtag("event", event, params);
    else w.dataLayer?.push({ event, ...params });
    w.fbq?.("trackCustom", event, params);
  } catch {
    /* analytics must never break the page */
  }
}
