CREATE OR REPLACE FUNCTION public.trip_notification_bookings()
RETURNS TABLE(trip_slug text)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT b.trip_slug FROM public.trip_bookings AS b
  WHERE b.status = 'paid' AND b.paid_at IS NOT NULL
  AND b.trip_slug IN ('goa-nov-2026', 'goa-girls-dec-2026', 'goa-christmas-dec-2026', 'goa-new-year-2027', 'igatpuri-camping')
  ORDER BY b.paid_at DESC, b.id
  LIMIT 100
$$;
REVOKE ALL ON FUNCTION public.trip_notification_bookings() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.trip_notification_bookings() TO anon, authenticated, service_role;