const GATEWAY_URL = "https://connector-gateway.lovable.dev/razorpay";

export function razorpayEnv() {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["RAZORPAY_CONNECTION_KEY"];
  const keyId = process.env["RAZORPAY_CONNECTION_KEY_ID"];
  if (!lovableKey || !connectionKey || !keyId) throw new Error("Razorpay is not connected");
  return { lovableKey, connectionKey, keyId };
}

export async function razorpay<T = any>(
  path: string,
  init: { method?: string; body?: unknown } = {},
): Promise<T> {
  const { lovableKey, connectionKey } = razorpayEnv();
  const res = await fetch(`${GATEWAY_URL}/${path}`, {
    method: init.method ?? "GET",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": connectionKey,
      "Content-Type": "application/json",
    },
    ...(init.body ? { body: JSON.stringify(init.body) } : {}),
  });
  if (!res.ok) throw new Error(`Razorpay ${path} failed [${res.status}]: ${await res.text()}`);
  return res.json() as Promise<T>;
}

/** The only code that marks a booking paid: reads the order back from Razorpay. */
export async function confirmBooking(bookingId: string): Promise<"paid" | "pending"> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: b, error } = await supabaseAdmin
    .from("trip_bookings")
    .select("id, status, amount_paise, razorpay_order_id")
    .eq("id", bookingId)
    .maybeSingle();
  if (error) throw error;
  if (!b || !b.razorpay_order_id) return "pending";
  if (b.status === "paid") return "paid";

  const order = await razorpay<{ status: string; amount_paid: number }>(`orders/${b.razorpay_order_id}`);
  let paymentId: string | null = null;
  let paid = order.status === "paid" && order.amount_paid === b.amount_paise;
  const payments = await razorpay<{ items: { id: string; status: string; amount: number }[] }>(
    `orders/${b.razorpay_order_id}/payments`,
  );
  if (paid) paymentId = payments.items.find((p) => p.status === "captured")?.id ?? null;
  if (!paid && order.status === "attempted") {
    const auth = payments.items.find((p) => p.status === "authorized");
    if (auth) {
      const cap = await razorpay<{ status: string; amount: number }>(`payments/${auth.id}/capture`, {
        method: "POST",
        body: { amount: b.amount_paise, currency: "INR" },
      });
      if (cap.status === "captured" && cap.amount === b.amount_paise) {
        paid = true;
        paymentId = auth.id;
      }
    }
  }
  if (!paid) return "pending";
  const { error: upErr } = await supabaseAdmin
    .from("trip_bookings")
    .update({ status: "paid", razorpay_payment_id: paymentId, paid_at: new Date().toISOString() })
    .eq("id", b.id)
    .eq("status", "pending");
  if (upErr) throw upErr;
  return "paid";
}
