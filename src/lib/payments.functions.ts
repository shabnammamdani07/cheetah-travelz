import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getTrip, isPast } from "@/home/trips";

const startSchema = z.object({
  slug: z.string().min(1).max(80),
  option: z.string().min(1).max(200),
  seats: z.number().int().min(1).max(6),
  name: z.string().trim().min(1).max(80),
  phone: z.string().trim().min(6).max(20),
  email: z.string().trim().email().max(120).optional().or(z.literal("")),
  referralCode: z.string().trim().max(30).optional(),
  message: z.string().trim().max(800).optional(),
});

/** Online amount = per-person reserve × seats, computed on the server only. */
export function reserveTotalPaise(perPersonRupees: number, seats: number) {
  return perPersonRupees * seats * 100;
}

export const startTripPayment = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => startSchema.parse(d))
  .handler(async ({ data }) => {
    const trip = getTrip(data.slug);
    if (!trip || isPast(trip.departure)) throw new Error("This trip is not open for booking.");
    const opt = trip.detail.priceOptions.find((o) => o.title === data.option);
    if (!opt) throw new Error("Please choose a valid option.");
    const amount = reserveTotalPaise(trip.detail.reservePerPerson, data.seats);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { razorpay, razorpayEnv } = await import("./razorpay.server");
    const { data: booking, error } = await supabaseAdmin
      .from("trip_bookings")
      .insert({
        trip_slug: data.slug,
        trip_name: `${trip.departure.name} (${trip.departure.dateLabel})`,
        option_title: opt.title,
        seats: data.seats,
        customer_name: data.name,
        phone: data.phone,
        email: data.email || null,
        referral_code: data.referralCode?.toUpperCase() || null,
        message: data.message || null,
        amount_paise: amount,
      })
      .select("id")
      .single();
    if (error) throw error;

    const order = await razorpay<{ id: string; amount: number; currency: string }>("orders", {
      method: "POST",
      body: { amount, currency: "INR", receipt: booking.id.slice(0, 36), notes: { bookingId: booking.id } },
    });
    await supabaseAdmin.from("trip_bookings").update({ razorpay_order_id: order.id }).eq("id", booking.id);
    return {
      bookingId: booking.id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: razorpayEnv().keyId,
    };
  });

export const confirmTripPayment = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ bookingId: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { confirmBooking } = await import("./razorpay.server");
    return { status: await confirmBooking(data.bookingId) };
  });
