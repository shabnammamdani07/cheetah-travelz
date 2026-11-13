import { Link } from "@tanstack/react-router";
import type { Rec } from "./api";
import { fmtDate, inr } from "./api";
import { Icon } from "./icons";
import { Pill, type ResourceConfig } from "./ResourcePage";

const today = () => new Date().toISOString().slice(0, 10);
const uniq = (rows: Rec[], k: string) =>
  [...new Set(rows.map((r) => r[k]).filter(Boolean))].sort() as string[];
const waLink = (phone?: string, text = "") => {
  const d = String(phone || "").replace(/\D/g, "");
  return d
    ? `https://wa.me/${d.length === 10 ? "91" + d : d}${text ? `?text=${encodeURIComponent(text)}` : ""}`
    : "";
};
const Contact = ({ r, msg }: { r: Rec; msg?: string }) => (
  <>
    {r.phone && (
      <a
        className="icon-btn icon-btn--wa"
        title="WhatsApp"
        href={waLink(r.phone, msg)}
        target="_blank"
        rel="noopener"
      >
        <Icon name="whatsapp" size={16} />
      </a>
    )}
    {r.phone && (
      <a className="icon-btn" title="Call" href={`tel:${r.phone}`}>
        <Icon name="phone" size={16} />
      </a>
    )}
  </>
);

/* Referral code — free text captured from the website form or typed in by the team.
   Not checked against Promo Codes and gives no automatic discount. */
const REFERRAL_FIELD = {
  key: "referralCode",
  label: "Referral code",
  emptyText: "Not provided",
  placeholder: "Leave blank if none",
  hint: "Saved as entered (upper-case). Not auto-verified and no discount is applied — check it manually.",
};
const RefTag = ({ code }: { code?: string }) =>
  code ? (
    <span className="ref-tag" title="Referral code (not verified)">
      Ref: {code}
    </span>
  ) : null;
/* Opens Bookings with a new booking pre-filled from this lead — the referral code travels with it. */
const CreateBookingFromLead = ({ r }: { r: Rec }) => (
  <Link
    className="icon-btn"
    title="Create booking from this lead"
    aria-label={`Create booking for ${r.name || "this lead"}`}
    to="/admin/bookings"
    onClick={() => {
      try {
        sessionStorage.setItem(
          "ct_prefill_bookings",
          JSON.stringify({
            traveller: r.name || "",
            phone: r.phone || "",
            email: r.email || "",
            trip: r.trip || "",
            referralCode: r.referralCode || "",
            notes: r.message ? `From website enquiry: ${r.message}` : "From website enquiry",
          }),
        );
      } catch {
        /* ignore */
      }
    }}
  >
    <Icon name="plus" size={16} />
  </Link>
);

export const TRIPS: ResourceConfig = {
  name: "trips",
  title: "Manage Trips",
  subtitle: "View, add or edit all travel destinations",
  addLabel: "Add Trip",
  singular: "trip",
  searchKeys: ["name", "destination"],
  filters: [{ key: "status", label: "All Status", options: ["Published", "Draft", "Completed"] }],
  defaults: () => ({ status: "Draft", startDate: today() }),
  columns: [
    {
      key: "image",
      label: "Image",
      width: "72px",
      render: (r) =>
        r.image ? (
          <img className="thumb" src={r.image} alt="" />
        ) : (
          <span className="thumb thumb--empty" />
        ),
    },
    { key: "name", label: "Trip Name", render: (r) => <b>{r.name}</b> },
    { key: "destination", label: "Destination" },
    { key: "startDate", label: "Date", render: (r) => fmtDate(r.startDate) },
    { key: "price", label: "Price", render: (r) => (r.price ? inr(r.price) : "—") },
    { key: "seats", label: "Seats" },
    { key: "status", label: "Status", render: (r) => <Pill value={r.status} /> },
  ],
  fields: [
    { key: "name", label: "Trip name", required: true, placeholder: "Goa Trip" },
    { key: "destination", label: "Destination", required: true, placeholder: "North & South Goa" },
    { key: "startDate", label: "Start date", type: "date", required: true },
    { key: "endDate", label: "End date", type: "date" },
    { key: "price", label: "Price (₹)", type: "number", placeholder: "10900" },
    { key: "seats", label: "Seats", type: "number", placeholder: "30" },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: ["Published", "Draft", "Completed"],
      required: true,
    },
    { key: "image", label: "Cover image", type: "image" },
    { key: "description", label: "Short description", type: "textarea" },
  ],
};

export const STORIES: ResourceConfig = {
  name: "stories",
  title: "Stories",
  subtitle: "Trip stories, reels and highlights to share",
  addLabel: "Add Story",
  singular: "story",
  plural: "stories",
  searchKeys: ["title", "trip"],
  filters: [{ key: "status", label: "All Status", options: ["Published", "Draft"] }],
  defaults: () => ({ status: "Draft", date: today() }),
  columns: [
    {
      key: "image",
      label: "Image",
      width: "72px",
      render: (r) =>
        r.image ? (
          <img className="thumb" src={r.image} alt="" />
        ) : (
          <span className="thumb thumb--empty" />
        ),
    },
    { key: "title", label: "Title", render: (r) => <b>{r.title}</b> },
    { key: "trip", label: "Trip" },
    { key: "date", label: "Date", render: (r) => fmtDate(r.date) },
    { key: "status", label: "Status", render: (r) => <Pill value={r.status} /> },
  ],
  fields: [
    { key: "title", label: "Title", required: true },
    { key: "trip", label: "Trip", placeholder: "Goa · Nov 2026" },
    { key: "date", label: "Date", type: "date" },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: ["Published", "Draft"],
      required: true,
    },
    { key: "link", label: "Instagram / reel link", full: true },
    { key: "image", label: "Image", type: "image" },
    { key: "body", label: "Story", type: "textarea" },
  ],
};

export const BOOKINGS: ResourceConfig = {
  name: "bookings",
  title: "Manage Bookings",
  subtitle: "View and manage all trip bookings",
  addLabel: "Add Booking",
  singular: "booking",
  searchKeys: ["bookingId", "traveller", "trip", "phone"],
  exportable: true,
  filters: [
    { key: "trip", label: "All Trips", options: (rows) => uniq(rows, "trip") },
    { key: "status", label: "All Status", options: ["Confirmed", "Pending", "Cancelled"] },
  ],
  defaults: () => ({ status: "Pending", payment: "Pending", date: today() }),
  quickStatus: { key: "status", options: ["Confirmed", "Pending", "Cancelled"] },
  rowActions: (r) => (
    <Contact
      r={r}
      msg={`Hi ${r.traveller || ""}, this is Cheetah Travelz about your booking ${r.bookingId || ""}.`}
    />
  ),
  columns: [
    { key: "bookingId", label: "Booking ID", render: (r) => <b>{r.bookingId}</b> },
    {
      key: "traveller",
      label: "Traveller",
      render: (r) => (
        <>
          <b>{r.traveller}</b>
          <RefTag code={r.referralCode} />
        </>
      ),
    },
    { key: "trip", label: "Trip" },
    { key: "amount", label: "Amount", render: (r) => inr(r.amount) },
    { key: "status", label: "Status", render: (r) => <Pill value={r.status} /> },
    { key: "payment", label: "Payment", render: (r) => <Pill value={r.payment} /> },
  ],
  fields: [
    { key: "bookingId", label: "Booking ID", placeholder: "Auto (e.g. CT1043)" },
    { key: "traveller", label: "Traveller name", required: true },
    { key: "phone", label: "Phone", type: "tel" },
    { key: "email", label: "Email", type: "email" },
    { key: "trip", label: "Trip", required: true, placeholder: "Goa Trip" },
    { key: "seats", label: "Seats", type: "number" },
    { key: "amount", label: "Amount (₹)", type: "number", required: true },
    { key: "promo", label: "Promo code" },
    REFERRAL_FIELD,
    {
      key: "status",
      label: "Status",
      type: "select",
      options: ["Confirmed", "Pending", "Cancelled"],
      required: true,
    },
    {
      key: "payment",
      label: "Payment",
      type: "select",
      options: ["Paid", "Partial", "Pending", "Refunded"],
      required: true,
    },
    { key: "date", label: "Booked on", type: "date" },
    { key: "notes", label: "Notes", type: "textarea" },
  ],
};

export const PAYMENTS: ResourceConfig = {
  name: "payments",
  title: "Billing & Payments",
  subtitle: "Track every payment received and pending",
  addLabel: "Record Payment",
  singular: "payment",
  searchKeys: ["bookingId", "traveller", "trip"],
  exportable: true,
  filters: [
    { key: "trip", label: "All Trips", options: (rows) => uniq(rows, "trip") },
    { key: "status", label: "All Status", options: ["Paid", "Pending", "Refunded"] },
    { key: "method", label: "All Methods", options: ["UPI", "Bank transfer", "Cash", "Card"] },
  ],
  defaults: () => ({ status: "Paid", method: "UPI", date: today() }),
  quickStatus: { key: "status", options: ["Paid", "Pending", "Refunded"] },
  columns: [
    { key: "date", label: "Date", render: (r) => fmtDate(r.date) },
    { key: "bookingId", label: "Booking ID" },
    { key: "traveller", label: "Traveller" },
    { key: "trip", label: "Trip" },
    { key: "amount", label: "Amount", render: (r) => <b>{inr(r.amount)}</b> },
    { key: "status", label: "Status", render: (r) => <Pill value={r.status} /> },
    { key: "method", label: "Method" },
  ],
  fields: [
    { key: "date", label: "Date", type: "date", required: true },
    { key: "bookingId", label: "Booking ID", placeholder: "CT1042" },
    { key: "traveller", label: "Traveller", required: true },
    { key: "trip", label: "Trip" },
    { key: "amount", label: "Amount (₹)", type: "number", required: true },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: ["Paid", "Pending", "Refunded"],
      required: true,
    },
    {
      key: "method",
      label: "Method",
      type: "select",
      options: ["UPI", "Bank transfer", "Cash", "Card"],
    },
    { key: "reference", label: "UPI / transaction ref" },
  ],
};

export const PROMOS: ResourceConfig = {
  name: "promos",
  title: "Manage Promo Codes",
  subtitle: "Create, edit and track promo codes used by travellers",
  addLabel: "Create Promo Code",
  singular: "promo code",
  searchKeys: ["code"],
  filters: [{ key: "status", label: "All Status", options: ["Active", "Paused", "Expired"] }],
  defaults: () => ({ type: "Percentage", status: "Active", used: 0 }),
  columns: [
    { key: "code", label: "Code", render: (r) => <code className="code">{r.code}</code> },
    {
      key: "discount",
      label: "Discount",
      render: (r) => (r.type === "Fixed" ? inr(r.discount) : `${r.discount || 0}%`),
    },
    { key: "type", label: "Type" },
    { key: "validUntil", label: "Valid until", render: (r) => fmtDate(r.validUntil) },
    { key: "used", label: "Usage", render: (r) => `${r.used || 0}/${r.limit || "∞"}` },
    {
      key: "status",
      label: "Status",
      render: (r) => <Pill value={r.validUntil && r.validUntil < today() ? "Expired" : r.status} />,
    },
  ],
  fields: [
    { key: "code", label: "Code", required: true, placeholder: "WELCOME5" },
    {
      key: "type",
      label: "Type",
      type: "select",
      options: ["Percentage", "Fixed"],
      required: true,
    },
    { key: "discount", label: "Discount (% or ₹)", type: "number", required: true },
    { key: "validUntil", label: "Valid until", type: "date" },
    { key: "limit", label: "Usage limit", type: "number" },
    { key: "used", label: "Times used", type: "number" },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: ["Active", "Paused", "Expired"],
      required: true,
    },
    { key: "notes", label: "Who can use it", type: "textarea" },
  ],
};

export const USERS: ResourceConfig = {
  name: "users",
  title: "Manage Users / Travellers",
  subtitle: "Registered travellers and trip participants",
  addLabel: "Add Traveller",
  singular: "traveller",
  searchKeys: ["name", "email", "phone", "city"],
  exportable: true,
  filters: [{ key: "status", label: "All Status", options: ["Active", "Inactive"] }],
  defaults: () => ({ status: "Active", joined: today(), tripsJoined: 0 }),
  rowActions: (r) => <Contact r={r} />,
  columns: [
    { key: "name", label: "Name", render: (r) => <b>{r.name}</b> },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "joined", label: "Joined on", render: (r) => fmtDate(r.joined) },
    { key: "tripsJoined", label: "Trips joined" },
    { key: "status", label: "Status", render: (r) => <Pill value={r.status} /> },
  ],
  fields: [
    { key: "name", label: "Name", required: true },
    { key: "phone", label: "Phone", type: "tel" },
    { key: "email", label: "Email", type: "email" },
    { key: "city", label: "City" },
    { key: "gender", label: "Gender", type: "select", options: ["Female", "Male", "Other"] },
    { key: "joined", label: "Joined on", type: "date" },
    { key: "tripsJoined", label: "Trips joined", type: "number" },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: ["Active", "Inactive"],
      required: true,
    },
    { key: "notes", label: "Notes", type: "textarea" },
  ],
};

export const ENQUIRIES: ResourceConfig = {
  name: "enquiries",
  title: "Contact Enquiries",
  subtitle: "Leads from the website form — call or WhatsApp them back",
  addLabel: "Add Lead",
  singular: "enquiry",
  plural: "enquiries",
  searchKeys: ["name", "email", "phone", "message", "trip"],
  exportable: true,
  filters: [
    { key: "status", label: "All Status", options: ["New", "Contacted", "Converted", "Closed"] },
    { key: "trip", label: "All Interests", options: (rows) => uniq(rows, "trip") },
    { key: "source", label: "All Sources", options: (rows) => uniq(rows, "source") },
  ],
  defaults: () => ({ status: "New", source: "Phone call" }),
  quickStatus: { key: "status", options: ["New", "Contacted", "Converted", "Closed"] },
  rowActions: (r) => (
    <>
      <Contact
        r={r}
        msg={`Hi ${r.name || ""}! Thanks for your enquiry with Cheetah Travelz${r.trip ? ` about ${r.trip}` : ""}.`}
      />
      <CreateBookingFromLead r={r} />
    </>
  ),
  columns: [
    {
      key: "name",
      label: "Name",
      render: (r) => (
        <>
          <b>{r.name}</b>
          <RefTag code={r.referralCode} />
        </>
      ),
    },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email", render: (r) => r.email || <span className="muted">—</span> },
    { key: "trip", label: "Interested in" },
    {
      key: "message",
      label: "Message",
      render: (r) => (
        <span className="clip" title={r.message}>
          {r.message || "—"}
        </span>
      ),
    },
    { key: "createdAt", label: "Date", render: (r) => fmtDate(r.createdAt) },
    { key: "status", label: "Status", render: (r) => <Pill value={r.status} /> },
  ],
  fields: [
    { key: "name", label: "Name", required: true },
    { key: "phone", label: "Phone", type: "tel", required: true },
    { key: "email", label: "Email", type: "email" },
    { key: "trip", label: "Interested in" },
    REFERRAL_FIELD,
    {
      key: "source",
      label: "Source",
      type: "select",
      options: ["Website form", "Phone call", "WhatsApp", "Instagram", "Referral"],
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: ["New", "Contacted", "Converted", "Closed"],
      required: true,
    },
    { key: "message", label: "Message", type: "textarea" },
    { key: "notes", label: "Follow-up notes", type: "textarea" },
  ],
};
