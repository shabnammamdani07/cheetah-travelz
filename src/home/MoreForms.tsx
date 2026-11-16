import { useState, type FormEvent } from "react";

import { Done, PHONE_PATTERN, SEND_FAILED, lines, saveLead, type Status } from "./EnquiryForms";
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

/* ---------- Trip page: seat request with optional referral code (captured, verified by the team) ---------- */
export function TripBookingForm({
  tripName,
  options,
}: {
  tripName: string;
  options: { title: string; sub: string; amount: number }[];
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const label = (o: { title: string; sub: string; amount: number }) =>
    `${o.title} (${o.sub}) — ₹${o.amount.toLocaleString("en-IN")}`;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setStatus("sending");
    setError("");
    try {
      let r: Response;
      try {
        r = await fetch("/api/public/enquiry", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name: String(f.get("name") || ""),
            phone: String(f.get("phone") || ""),
            email: String(f.get("email") || ""),
            trip: `Booking request — ${tripName}`,
            referralCode: String(f.get("referralCode") || ""),
            message: lines([
              ["Trip", tripName],
              ["Option", f.get("option")],
              ["Seats", f.get("seats")],
              ["Message", f.get("message")],
            ]),
            company: String(f.get("company") || ""),
          }),
        });
      } catch {
        throw new Error(SEND_FAILED);
      }
      const j = (await r.json().catch(() => ({}))) as { error?: string; referralCode?: string };
      if (!r.ok) throw new Error(r.status < 500 && j.error ? j.error : SEND_FAILED);
      setCode(j.referralCode || "");
      setStatus("done");
      track("trip_booking_request", { trip: tripName });
    } catch (err) {
      setStatus("error");
      setError((err as Error).message);
    }
  }

  if (status === "done")
    return (
      <Done
        text={
          code
            ? `We've received your seat request and noted referral code ${code}. We'll verify the code and confirm any offer, your seat and payment details shortly.`
            : "We've received your seat request. Our team will contact you shortly to confirm your seat and payment details."
        }
        onReset={() => setStatus("idle")}
      />
    );

  return (
    <form className="ct-form" onSubmit={submit} aria-labelledby="booking-form-title">
      <p className="ct-eyebrow">Request your seat</p>
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
              <option key={label(o)} value={label(o)}>
                {o.title} · ₹{o.amount.toLocaleString("en-IN")}
              </option>
            ))}
          </select>
        </label>
        <label>
          Seats *
          <select name="seats" required defaultValue="1">
            {["1", "2", "3", "4", "5", "6+"].map((n) => (
              <option key={n}>{n}</option>
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
          aria-describedby="trip-referral-hint"
        />
      </label>
      <p id="trip-referral-hint" className="ct-hint">
        Leave blank to skip. Our team verifies codes before payment — no discount is applied
        automatically yet.
      </p>
      <label>
        <span>
          Message <small>(optional)</small>
        </span>
        <textarea
          name="message"
          rows={3}
          maxLength={800}
          placeholder="Travelling with friends? Any questions?"
        />
      </label>
      <input name="company" tabIndex={-1} autoComplete="off" className="ct-hp" aria-hidden="true" />
      {status === "error" && (
        <p className="ct-error" role="alert">
          {error}
        </p>
      )}
      <button className="ct-btn ct-btn--primary ct-btn--block" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Request My Seat"}
      </button>
    </form>
  );
}
