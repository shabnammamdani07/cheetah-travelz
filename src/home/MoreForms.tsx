import { useState, type FormEvent } from "react";

import { Done, PHONE_PATTERN, SEND_FAILED, lines, saveLead, type Status } from "./EnquiryForms";
import { confirmTripPayment, startTripPayment } from "@/lib/payments.functions";

import { track } from "./track";

/* ---------- Contact Us: general enquiry with service selection ---------- */
export function ContactForm({ defaultService = "" }: { defaultService?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setStatus("sending");
    setError("");
    try {
      await saveLead({
        name: String(f.get("name") || ""),
        phone: String(f.get("phone") || ""),
        email: String(f.get("email") || ""),
        trip: `Contact — ${String(f.get("service") || "General")}`,
        message: lines([
          ["Service", f.get("service")],
          ["Message", f.get("message")],
        ]),
        company: String(f.get("company") || ""),
      });
      setStatus("done");
      track("contact_enquiry_submit", { service: String(f.get("service") || "") });
    } catch (err) {
      setStatus("error");
      setError((err as Error).message);
    }
  }

  if (status === "done")
    return <Done text="Our team will get back to you shortly." onReset={() => setStatus("idle")} />;

  return (
    <form className="ct-form" onSubmit={submit} aria-labelledby="contact-form-title">
      <p className="ct-eyebrow">Send us a message</p>
      <h3 id="contact-form-title" className="ct-form__title">
        How can we help?
      </h3>
      <div className="ct-grid2">
        <label>
          Your name *<input name="name" required maxLength={80} autoComplete="name" />
        </label>
        <label>
          Phone / WhatsApp *
          <input
            name="phone"
            required
            inputMode="tel"
            autoComplete="tel"
            pattern={PHONE_PATTERN}
            maxLength={20}
            placeholder="+91 98765 43210"
            title="Enter a valid phone number"
          />
        </label>
      </div>
      <label>
        <span>
          Email <small>(optional)</small>
        </span>
        <input name="email" type="email" maxLength={120} autoComplete="email" />
      </label>
      <label>
        I'm interested in *
        <select name="service" required defaultValue={defaultService}>
          <option value="" disabled>
            Choose a service
          </option>
          <option>Solo Group Trips</option>
          <option>Customized Holidays</option>
          <option>Cars &amp; Buses</option>
          <option>Something else</option>
        </select>
      </label>
      <label>
        Message *
        <textarea
          name="message"
          required
          rows={4}
          maxLength={1000}
          placeholder="Tell us what you're planning…"
        />
      </label>
      <input name="company" tabIndex={-1} autoComplete="off" className="ct-hp" aria-hidden="true" />
      {status === "error" && (
        <p className="ct-error" role="alert">
          {error}
        </p>
      )}
      <button className="ct-btn ct-btn--primary ct-btn--block" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}

/* ---------- Trip page: pay the reserve amount online with Razorpay ---------- */
declare global {
  interface Window {
    Razorpay?: new (o: Record<string, unknown>) => {
      open: () => void;
      on: (e: string, cb: (r: { error: { description: string } }) => void) => void;
    };
  }
}

function loadCheckout(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => res();
    s.onerror = () => rej(new Error("Couldn't load the payment window. Please try again."));
    document.body.appendChild(s);
  });
}

export function TripBookingForm({
  slug,
  tripName,
  options,
  reservePerPerson,
}: {
  slug: string;
  tripName: string;
  options: { title: string; sub: string; amount: number }[];
  reservePerPerson: number;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [seats, setSeats] = useState(1);
  const [paid, setPaid] = useState(false);
  const total = reservePerPerson * seats;

  async function confirm(bookingId: string) {
    try {
      const r = await confirmTripPayment({ data: { bookingId } });
      if (r.status === "paid") {
        setPaid(true);
        setStatus("done");
        track("trip_payment_success", { trip: slug });
        return;
      }
    } catch {
      /* fall through */
    }
    setStatus("idle");
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setStatus("sending");
    setError("");
    try {
      const o = await startTripPayment({
        data: {
          slug,
          option: String(f.get("option") || ""),
          seats,
          name: String(f.get("name") || ""),
          phone: String(f.get("phone") || ""),
          email: String(f.get("email") || ""),
          referralCode: String(f.get("referralCode") || ""),
          message: String(f.get("message") || ""),
        },
      });
      await loadCheckout();
      const rzp = new window.Razorpay!({
        key: o.keyId,
        order_id: o.orderId,
        amount: o.amount,
        currency: o.currency,
        name: "Cheetah Travelz",
        description: tripName,
        prefill: {
          name: String(f.get("name") || ""),
          contact: String(f.get("phone") || ""),
          email: String(f.get("email") || ""),
        },
        theme: { color: "#f26b1d" },
        handler: () => confirm(o.bookingId),
        modal: { ondismiss: () => confirm(o.bookingId) },
      });
      rzp.on("payment.failed", (r) => {
        setError(r.error.description || "Payment failed. Please try again.");
        setStatus("error");
      });
      track("trip_payment_start", { trip: slug, seats });
      rzp.open();
    } catch (err) {
      setStatus("error");
      setError((err as Error).message || SEND_FAILED);
    }
  }

  if (status === "done" && paid)
    return (
      <Done
        text={`Payment received — your ${seats > 1 ? `${seats} seats are` : "seat is"} reserved! Our team will WhatsApp you the confirmation and pickup details shortly.`}
        onReset={() => setStatus("idle")}
      />
    );

  return (
    <form className="ct-form" onSubmit={submit} aria-labelledby="booking-form-title">
      <p className="ct-eyebrow">Reserve your seat</p>
      <h3 id="booking-form-title" className="ct-form__title">
        Book this trip
      </h3>
      <div className="ct-grid2">
        <label>
          Your name *<input name="name" required maxLength={80} autoComplete="name" />
        </label>
        <label>
          Phone / WhatsApp *
          <input
            name="phone"
            required
            inputMode="tel"
            autoComplete="tel"
            pattern={PHONE_PATTERN}
            maxLength={20}
            placeholder="+91 98765 43210"
            title="Enter a valid phone number"
          />
        </label>
      </div>
      <label>
        <span>
          Email <small>(optional)</small>
        </span>
        <input name="email" type="email" maxLength={120} autoComplete="email" />
      </label>
      <div className="ct-grid2">
        <label>
          Option *
          <select name="option" required>
            {options.map((o) => (
              <option key={o.title + o.sub} value={o.title}>
                {o.title} · ₹{o.amount.toLocaleString("en-IN")}
              </option>
            ))}
          </select>
        </label>
        <label>
          Seats *
          <select
            name="seats"
            required
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        <span>
          Do you have a referral code? <small>(optional)</small>
        </span>
        <input
          name="referralCode"
          className="ct-form__ref"
          maxLength={30}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder="e.g. RIYA10"
        />
      </label>
      <label>
        <span>
          Message <small>(optional)</small>
        </span>
        <textarea name="message" rows={3} maxLength={800} placeholder="Any questions?" />
      </label>
      <p className="ct-hint">
        Pay now: <b>₹{total.toLocaleString("en-IN")}</b> (₹
        {reservePerPerson.toLocaleString("en-IN")} × {seats}). Secure payment by Razorpay — UPI,
        cards &amp; net banking.
      </p>
      {status === "error" && (
        <p className="ct-error" role="alert">
          {error}
        </p>
      )}
      <button className="ct-btn ct-btn--primary ct-btn--block" disabled={status === "sending"}>
        {status === "sending" ? "Opening payment…" : `Pay ₹${total.toLocaleString("en-IN")} & Reserve`}
      </button>
    </form>
  );
}
