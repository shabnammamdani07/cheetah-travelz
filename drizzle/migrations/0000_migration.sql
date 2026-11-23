CREATE TABLE public.trip_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_slug text NOT NULL,
  trip_name text NOT NULL,
  option_title text NOT NULL,
  seats integer NOT NULL CHECK (seats BETWEEN 1 AND 6),
  customer_name text NOT NULL,
  phone text NOT NULL,
  email text,
  referral_code text,
  message text,
  amount_paise integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  razorpay_order_id text UNIQUE,
  razorpay_payment_id text,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.trip_bookings TO service_role;
ALTER TABLE public.trip_bookings ENABLE ROW LEVEL SECURITY;