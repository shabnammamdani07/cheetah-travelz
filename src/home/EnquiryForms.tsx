import { useState, type FormEvent, type RefObject } from "react";

import { BUDGETS, DESTINATIONS, VEHICLES } from "./data";
import { Icon } from "./Icon";
import { track } from "./track";

/*
 * Holiday + vehicle enquiry forms (homepage, and reused on the service pages in Step 4).
 * Leads are saved through the existing enquiry endpoint, which stores them in the admin panel's
 * Enquiries list (the team's notification channel — new leads show a badge there).
 */
export type Status = "idle" | "sending" | "done" | "error";
export const PHONE_PATTERN = "[+0-9][0-9 \\-]{6,19}";
const today = () => new Date().toISOString().slice(0, 10);

export const SEND_FAILED =
  "We couldn't send your enquiry right now. Your details are still here — please try again, or WhatsApp us.";

export async function saveLead(payload: Record<string, string>) {
  let r: Response;
  try {
    r = await fetch("/api/public/enquiry", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(SEND_FAILED); // network down / backend unreachable
  }
  const j = (await r.json().catch(() => ({}))) as { error?: string };
  if (!r.ok) throw new Error(r.status < 500 && j.error ? j.error : SEND_FAILED);
}

export const lines = (pairs: [string, FormDataEntryValue | null][]) =>
  pairs
    .filter(([, v]) => v !== null && String(v).trim() !== "")
    .map(([k, v]) => `${k}: ${String(v).trim()}`)
    .join("\n");

export function Done({ text, onReset }: { text: string; onReset: () => void }) {
  return (
    <div className="ct-done" role="status" aria-live="polite">
      <span className="ct-done__tick">
        <Icon name="check" size={20} />
      </span>
      <div>
        <strong>Thank you!</strong>
        <p>{text}</p>
        <button type="button" className="ct-link" onClick={onReset}>
          Send another enquiry
        </button>
      </div>
    </div>
  );
}

export function HolidayForm({
  destination,
  setDestination,
  formRef,
}: {
  destination: string;
  setDestination: (v: string) => void;
  formRef: RefObject<HTMLFormElement | null>;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const from = String(f.get("from") || ""),
      to = String(f.get("to") || "");
    if (to && from && to < from) {
      setStatus("error");
      setError("Your return date is before your start date.");
      return;
    }
    setStatus("sending");
    setError("");
    try {
      await saveLead({
        name: String(f.get("name") || ""),
        phone: String(f.get("phone") || ""),
        email: String(f.get("email") || ""),
        trip: `Customized Holiday — ${String(f.get("destination") || "").trim()}`,
        message: lines([
          ["Service", "Customized Holiday"],
          ["Destination", f.get("destination")],
          ["Travel dates", from ? `${from}${to ? ` to ${to}` : ""}` : ""],
          ["Adults", f.get("adults")],
          ["Children", f.get("children")],
          ["Pickup city", f.get("pickup")],
          ["Approx. budget", f.get("budget")],
          ["Special requirements", f.get("requirements")],
        ]),
        company: String(f.get("company") || ""),
      });
      setStatus("done");
      track("holiday_enquiry_submit", { destination: String(f.get("destination") || "") });
    } catch (err) {
      setStatus("error"); // entries stay in the form so nothing is lost
      setError((err as Error).message);
    }
  }

  if (status === "done")
    return (
      <Done
        text="Our team will contact you shortly with a customised quotation."
        onReset={() => setStatus("idle")}
      />
    );

  return (
    <form ref={formRef} className="ct-form" onSubmit={submit} aria-labelledby="holiday-form-title">
      <p className="ct-eyebrow">Enquiry form</p>
      <h3 id="holiday-form-title" className="ct-form__title">
        Tell us about your trip
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
        Destination *
        <input
          name="destination"
          required
          list="ct-destinations"
          maxLength={60}
          placeholder="Where would you like to go?"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <datalist id="ct-destinations">
          {DESTINATIONS.map((d) => (
            <option key={d.name} value={d.name} />
          ))}
        </datalist>
      </label>
      <div className="ct-grid2">
        <label>
          Travel from
          <input name="from" type="date" min={today()} />
        </label>
        <label>
          Travel to
          <input name="to" type="date" min={today()} />
        </label>
      </div>
      <div className="ct-grid2">
        <label>
          Number of adults *
          <select name="adults" required defaultValue="2">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
        <label>
          Number of children
          <select name="children" defaultValue="0">
            {["0", "1", "2", "3", "4", "5+"].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="ct-grid2">
        <label>
          Pickup city
          <input
            name="pickup"
            maxLength={60}
            placeholder="e.g. Mumbai"
            autoComplete="address-level2"
          />
        </label>
        <label>
          Approximate budget
          <select name="budget" defaultValue="">
            <option value="">Select a range</option>
            {BUDGETS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Special requirements or preferences
        <textarea
          name="requirements"
          rows={3}
          maxLength={800}
          placeholder="Tell us what matters most…"
        />
      </label>
      <input name="company" tabIndex={-1} autoComplete="off" className="ct-hp" aria-hidden="true" />
      {status === "error" && (
        <p className="ct-error" role="alert">
          {error}
        </p>
      )}
      <button className="ct-btn ct-btn--primary ct-btn--block" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Plan My Holiday"}
      </button>
    </form>
  );
}

export function VehicleForm({
  vehicle,
  setVehicle,
  formRef,
}: {
  vehicle: string;
  setVehicle: (v: string) => void;
  formRef: RefObject<HTMLFormElement | null>;
}) {
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
        trip: `Vehicle quote — ${String(f.get("vehicle") || "Any vehicle")}`,
        message: lines([
          ["Service", "Cars & Buses"],
          ["Pickup", f.get("pickup")],
          ["Destination", f.get("destination")],
          ["Travel date", f.get("date")],
          ["Return date / duration", f.get("return")],
          ["Passengers", f.get("passengers")],
          ["Vehicle preference", f.get("vehicle")],
          ["Additional requirements", f.get("requirements")],
        ]),
        company: String(f.get("company") || ""),
      });
      setStatus("done");
      track("vehicle_quote_submit", { vehicle: String(f.get("vehicle") || "") });
    } catch (err) {
      setStatus("error");
      setError((err as Error).message);
    }
  }

  if (status === "done")
    return (
      <Done
        text="Our team will contact you shortly with your vehicle quote."
        onReset={() => setStatus("idle")}
      />
    );

  return (
    <form ref={formRef} className="ct-form" onSubmit={submit} aria-labelledby="vehicle-form-title">
      <p className="ct-eyebrow">Vehicle enquiry form</p>
      <h3 id="vehicle-form-title" className="ct-form__title">
        Request your quote
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
          Pickup location *
          <input name="pickup" required maxLength={80} placeholder="Pickup point" />
        </label>
        <label>
          Destination *
          <input name="destination" required maxLength={80} placeholder="e.g. Lonavala" />
        </label>
      </div>
      <div className="ct-grid2">
        <label>
          Travel date *<input name="date" type="date" required min={today()} />
        </label>
        <label>
          Return date / duration
          <input name="return" maxLength={40} placeholder="e.g. 3 days" />
        </label>
      </div>
      <div className="ct-grid2">
        <label>
          Passengers *
          <input
            name="passengers"
            type="number"
            required
            min={1}
            max={60}
            inputMode="numeric"
            placeholder="e.g. 4"
          />
        </label>
        <label>
          Vehicle preference
          <select name="vehicle" value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
            <option value="">Not sure</option>
            {VEHICLES.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Additional requirements
        <textarea
          name="requirements"
          rows={3}
          maxLength={800}
          placeholder="Luggage, stops, events…"
        />
      </label>
      <input name="company" tabIndex={-1} autoComplete="off" className="ct-hp" aria-hidden="true" />
      {status === "error" && (
        <p className="ct-error" role="alert">
          {error}
        </p>
      )}
      <button className="ct-btn ct-btn--primary ct-btn--block" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Request a Quote"}
      </button>
    </form>
  );
}
