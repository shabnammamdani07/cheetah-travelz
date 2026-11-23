import { createFileRoute } from "@tanstack/react-router";

// Never trusts the event body: it only looks up the booking and re-reads the order from Razorpay.
export const Route = createFileRoute("/api/public/razorpay-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const evt = (await request.json().catch(() => null)) as any;
        const orderId: unknown =
          evt?.payload?.payment?.entity?.order_id ?? evt?.payload?.order?.entity?.id;
        if (typeof orderId !== "string") return new Response("ok");
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: b } = await supabaseAdmin
          .from("trip_bookings")
          .select("id")
          .eq("razorpay_order_id", orderId)
          .maybeSingle();
        if (!b) return new Response("ok");
        try {
          const { confirmBooking } = await import("@/lib/razorpay.server");
          await confirmBooking(b.id);
          return new Response("ok");
        } catch (e) {
          console.error(e);
          return new Response("retry", { status: 500 });
        }
      },
    },
  },
});
