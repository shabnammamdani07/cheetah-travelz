# Steps 5–6: bookings, payments, accounts, rewards and content editing

Steps 1–4 (homepage, pages, navigation, trip template, forms) are built and live in this repo.
Steps 5–6 need a **backend**: a database, customer sign-in, and server-side code that
can hold the Razorpay secret key and calculate prices. On Lovable that backend is **Lovable Cloud**.
Lovable's rules for this project say database changes must be made by Lovable itself, so run the
prompt below in the Lovable chat (Build mode) and approve any database / Cloud prompts it shows.

## What the client still needs to provide

| Needed | Why |
| --- | --- |
| Razorpay **test** Key ID + Key Secret (and later live keys), added in Lovable → Secrets | Create orders and verify payments on the server |
| Influencer names and their codes, per trip | 10% referral discount + attribution |
| Reward points rules (points per completed solo trip / private trip, any expiry) | Earning rules — kept configurable until confirmed |
| Team notification channel: email address and/or WhatsApp number for new leads and paid bookings | "Notify the team through its configured channel" |
| Privacy Policy text | Footer legal link |

## Prompt to paste into Lovable

```
Enable Lovable Cloud for this project and build the backend for the existing Cheetah Travelz site. Do not redesign any pages; only add backend and wire the existing UI where noted.

DATABASE (with row-level security on every table):
1. trips: id, slug (unique), name, destination, departure_city, age_group (nullable), image, summary, status (draft/published), created_at.
2. departures: id, trip_id → trips, start_date, end_date, date_label, duration, seats_total (nullable), status (draft/published/cancelled). Upcoming = published and start_date >= today.
3. departure_prices: id, departure_id, title, description, amount_inr (integer rupees).
4. influencer_codes: id, code (unique, upper-case), influencer_name, trip_id (nullable = all trips), discount_percent default 10, active boolean, created_at.
5. customer_profiles: id = auth.users.id, name, phone, email, created_at.
6. bookings: id, booking_ref (unique, e.g. CT1043), customer_id (nullable, → customer_profiles), customer_name, phone, email, departure_id, price_id, seats, trip_type (solo_group / private), original_amount, discount_amount, final_amount, influencer_code_id (nullable), status (pending/confirmed/cancelled/completed), payment_status (pending/paid/failed/refunded), razorpay_order_id, razorpay_payment_id, source (website/offline), created_at.
7. reward_rules: id, trip_type, points_per_completed_trip, active — editable by admins; no hard-coded values.
8. reward_ledger: id, customer_id, booking_id (unique — points awarded once per booking), points, reason, created_at.
9. enquiries: id, name, phone, email, trip, message, referral_code, status (New/Contacted/Converted/Closed), source, created_at — the website forms post here (public insert only, admins read).
10. blog_posts (slug, title, date, image, excerpt, body markdown, published) and reviews (name, text, rating, source, published, sort) — public read of published rows, admin write.
11. site_settings (single row JSON) and user_roles with an 'admin' role + has_role() function.

AUTH: email + password (or email OTP) sign-in for customers. Customers can read only their own profile, bookings and reward_ledger rows. Admins (has_role admin) can read/write everything.

EDGE FUNCTIONS (server-side; never trust prices or discounts from the browser):
- quote-booking: input { departure_id, price_id, seats, referral_code? }. Look up the price on the server; if referral_code is active for that trip, apply its discount_percent. Return { original, discount, final, code_valid, influencer_name? }.
- create-razorpay-order: same inputs + customer details; recompute the quote on the server, create a Razorpay order in INR (paise) with RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET, insert a pending booking, return the order id + key id.
- verify-razorpay-payment and a razorpay-webhook: verify the signature with the secret; only then set payment_status = paid and status = confirmed; handle failed / cancelled payments; notify the team.
- complete-booking (admin): mark a booking completed and award reward points once, using reward_rules.
- link-offline-booking (admin): attach an offline private booking to a customer account.

SECRETS: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET (test mode first).

Seed: one trip "Goa Group Trip" (slug goa-nov-2026), departure 2026-11-21 to 2026-11-25, label "21–24 Nov 2026", duration "4 Nights / 3 Days", prices: Goa to Goa ₹8,900; Mumbai–Goa–Mumbai by AC Pushback bus ₹10,900; Mumbai–Goa–Mumbai by AC Sleeper bus ₹14,900. Do not invent any other trips, prices, codes or reviews.
```

## After Lovable finishes

Claude pulls the generated Supabase client and wires the existing pages to it:
trip listing/details from `trips`/`departures`, the trip page's **Book Now** → quote → Razorpay checkout,
the referral field → server-side 10% discount with original / discount / final shown,
**My Account** → sign-in, bookings (upcoming / past), completed solo / private / total trip counts,
reward points and history, and the admin panel → influencer codes, rewards rules, bookings, blog posts and reviews.
