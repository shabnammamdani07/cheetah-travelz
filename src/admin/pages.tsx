import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { api, collection, fmtDate, inr, session, type Rec } from "./api";
import { Icon } from "./icons";
import ResourcePage, { Pill } from "./ResourcePage";
import { PAYMENTS } from "./resources";

/* ---------- data helpers ---------- */
type ListName = "trips" | "bookings" | "payments" | "users" | "enquiries";
function useAll(names: ListName[]) {
  const [data, setData] = useState<Partial<Record<ListName, Rec[]>>>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all(
      names.map((n) =>
        collection(n)
          .list()
          .catch(() => [] as Rec[]),
      ),
    ).then((lists) => {
      setData(Object.fromEntries(names.map((n, i) => [n, lists[i]])));
      setLoading(false);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return { data, loading };
}
const monthKey = (s?: string) => (s || "").slice(0, 7);
function lastMonths(n: number) {
  const out: string[] = [],
    d = new Date();
  d.setDate(1);
  for (let i = n - 1; i >= 0; i--) {
    const x = new Date(d.getFullYear(), d.getMonth() - i, 1);
    out.push(`${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}`);
  }
  return out;
}
const mLabel = (k: string) =>
  new Date(k + "-01T00:00:00").toLocaleDateString("en-IN", { month: "short" });

/* ---------- charts ---------- */
export function LineChart({
  points,
  height = 180,
}: {
  points: { label: string; value: number }[];
  height?: number;
}) {
  const W = 600,
    H = height,
    pad = 28,
    max = Math.max(1, ...points.map((p) => p.value));
  const x = (i: number) => pad + (i * (W - pad * 2)) / Math.max(1, points.length - 1);
  const y = (v: number) => H - pad - (v / max) * (H - pad * 2);
  const line = points.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.value)}`).join(" ");
  return (
    <svg
      className="chart"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Revenue chart"
    >
      <defs>
        <linearGradient id="lg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ff6b1a" stopOpacity=".28" />
          <stop offset="1" stopColor="#ff6b1a" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((t) => (
        <line
          key={t}
          x1={pad}
          x2={W - pad}
          y1={pad + t * (H - pad * 2)}
          y2={pad + t * (H - pad * 2)}
          className="grid"
        />
      ))}
      {points.length > 1 && (
        <path
          d={`${line} L${x(points.length - 1)},${H - pad} L${x(0)},${H - pad}Z`}
          fill="url(#lg)"
        />
      )}
      <path
        d={line}
        fill="none"
        stroke="#ff6b1a"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(p.value)} r="4" fill="#fff" stroke="#ff6b1a" strokeWidth="2.5">
            <title>{`${p.label}: ${inr(p.value)}`}</title>
          </circle>
          <text x={x(i)} y={H - 6} textAnchor="middle" className="axis">
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
export function BarChart({
  bars,
  money,
}: {
  bars: { label: string; value: number }[];
  money?: boolean;
}) {
  const max = Math.max(1, ...bars.map((b) => b.value));
  return (
    <div className="bars">
      {bars.length === 0 && <p className="muted">No data yet.</p>}
      {bars.map((b) => (
        <div key={b.label} className="bars__row">
          <span className="bars__label" title={b.label}>
            {b.label}
          </span>
          <span className="bars__track">
            <i style={{ width: `${(b.value / max) * 100}%` }} />
          </span>
          <span className="bars__val">{money ? inr(b.value) : b.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Dashboard ---------- */
export function Dashboard({ username }: { username: string }) {
  const { data, loading } = useAll(["trips", "bookings", "payments", "users", "enquiries"]);
  const t = data.trips || [],
    b = data.bookings || [],
    p = data.payments || [],
    u = data.users || [],
    e = data.enquiries || [];
  const todayIso = new Date().toISOString().slice(0, 10);
  const months = lastMonths(12);
  const revenue = months.map((m) => ({
    label: mLabel(m),
    value: p
      .filter((x) => x.status === "Paid" && monthKey(x.date) === m)
      .reduce((s, x) => s + (Number(x.amount) || 0), 0),
  }));
  const total = revenue.reduce((s, x) => s + x.value, 0);
  const thisMonth = revenue.at(-1)?.value ?? 0,
    lastMonth = revenue.at(-2)?.value ?? 0;
  const change = lastMonth ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : null;
  const newLeads = e.filter((x) => x.status === "New").length;
  const stats = [
    {
      label: "Total Trips",
      value: t.length,
      sub: `${t.filter((x) => x.status === "Published").length} published`,
      icon: "trips",
      tone: "green",
    },
    {
      label: "Upcoming Trips",
      value: t.filter((x) => x.startDate >= todayIso && x.status !== "Completed").length,
      sub: "from today",
      icon: "bookings",
      tone: "blue",
    },
    {
      label: "Total Travellers",
      value: u.length,
      sub: `${u.filter((x) => x.status === "Active").length} active`,
      icon: "users",
      tone: "purple",
    },
    {
      label: "Total Bookings",
      value: b.length,
      sub: `${b.filter((x) => monthKey(x.date) === monthKey(todayIso)).length} this month`,
      icon: "billing",
      tone: "orange",
    },
    {
      label: "New Leads",
      value: newLeads,
      sub: `${e.length} enquiries total`,
      icon: "enquiries",
      tone: "red",
      link: true,
    },
  ];
  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1>Welcome back, {username}!</h1>
          <p>Here's what's happening with your Cheetah Travelz portal.</p>
        </div>
        <span className="date-chip">
          {new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
      <div className="stats">
        {stats.map((s) => {
          const inner = (
            <>
              <span className={`stat__icon tone-${s.tone}`}>
                <Icon name={s.icon} size={20} />
              </span>
              <div>
                <small>{s.label}</small>
                <strong>{loading ? "…" : s.value}</strong>
                <em>
                  <Icon name="arrowUp" size={12} /> {s.sub}
                </em>
              </div>
            </>
          );
          return "link" in s ? (
            <Link key={s.label} to="/admin/enquiries" className="stat stat--link">
              {inner}
            </Link>
          ) : (
            <div key={s.label} className="stat">
              {inner}
            </div>
          );
        })}
      </div>
      <div className="grid-2">
        <div className="card pad">
          <div className="card__head">
            <h3>Revenue Overview</h3>
            <span className="muted">Last 12 months</span>
          </div>
          <div className="rev">
            <strong>{inr(total)}</strong>
            {change !== null && (
              <span className={`delta ${change < 0 ? "neg" : ""}`}>
                {change >= 0 ? "↗" : "↘"} {Math.abs(change)}% vs last month
              </span>
            )}
          </div>
          <p className="muted small">Total collected (payments marked Paid)</p>
          <LineChart points={revenue} />
          <div className="card__head mt">
            <h3>Quick Actions</h3>
          </div>
          <div className="quick">
            <Link className="abtn" to="/admin/trips">
              <Icon name="plus" size={15} /> Add Trip
            </Link>
            <Link className="abtn abtn--soft" to="/admin/bookings">
              <Icon name="plus" size={15} /> Add Booking
            </Link>
            <Link className="abtn abtn--soft" to="/admin/enquiries">
              <Icon name="enquiries" size={15} /> View Leads
            </Link>
            <Link className="abtn abtn--soft" to="/admin/website">
              <Icon name="website" size={15} /> Update Website
            </Link>
          </div>
        </div>
        <div className="card pad">
          <div className="card__head">
            <h3>Recent Bookings</h3>
            <Link to="/admin/bookings" className="link-sm">
              View all
            </Link>
          </div>
          <table className="table table--compact">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Traveller</th>
                <th>Trip</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {b.slice(0, 5).map((x) => (
                <tr key={x.id}>
                  <td>{x.bookingId}</td>
                  <td>{x.traveller}</td>
                  <td>{x.trip}</td>
                  <td>{inr(x.amount)}</td>
                  <td>
                    <Pill value={x.status} />
                  </td>
                </tr>
              ))}
              {!loading && !b.length && (
                <tr>
                  <td colSpan={5} className="empty">
                    No bookings yet — <Link to="/admin/bookings">add your first</Link>.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="card__head mt">
            <h3>Latest Leads</h3>
            <Link to="/admin/enquiries" className="link-sm">
              View all
            </Link>
          </div>
          <ul className="leads">
            {e.slice(0, 4).map((x) => (
              <li key={x.id}>
                <div>
                  <b>{x.name}</b>
                  <span>
                    {x.trip || "General enquiry"} · {fmtDate(x.createdAt)}
                  </span>
                </div>
                <Pill value={x.status} />
              </li>
            ))}
            {!loading && !e.length && (
              <li className="muted">
                No enquiries yet. They'll appear here as soon as someone fills the form on the
                website.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ---------- Billing (payments + summary + revenue report) ---------- */
export function Billing() {
  const [tab, setTab] = useState<"payments" | "report">("payments");
  const tabs = (
    <div className="tabs">
      <button className={tab === "payments" ? "on" : ""} onClick={() => setTab("payments")}>
        Payments
      </button>
      <button className={tab === "report" ? "on" : ""} onClick={() => setTab("report")}>
        Revenue Report
      </button>
    </div>
  );
  const header = (rows: Rec[]) => {
    const sum = (s: string) =>
      rows.filter((r) => r.status === s).reduce((a, r) => a + (Number(r.amount) || 0), 0);
    return (
      <div className="stats stats--3">
        <div className="stat">
          <span className="stat__icon tone-green">
            <Icon name="billing" size={20} />
          </span>
          <div>
            <small>Total Collected</small>
            <strong>{inr(sum("Paid"))}</strong>
          </div>
        </div>
        <div className="stat">
          <span className="stat__icon tone-orange">
            <Icon name="bookings" size={20} />
          </span>
          <div>
            <small>Pending Amount</small>
            <strong>{inr(sum("Pending"))}</strong>
          </div>
        </div>
        <div className="stat">
          <span className="stat__icon tone-red">
            <Icon name="trash" size={20} />
          </span>
          <div>
            <small>Refunded</small>
            <strong>{inr(sum("Refunded"))}</strong>
          </div>
        </div>
      </div>
    );
  };
  if (tab === "report")
    return (
      <div className="page">
        <div className="page__head">
          <div>
            <h1>Billing & Payments</h1>
            <p>Revenue by month and by trip</p>
          </div>
        </div>
        {tabs}
        <RevenueReport />
      </div>
    );
  return <ResourcePage cfg={{ ...PAYMENTS, tabs, header }} />;
}
function RevenueReport() {
  const { data } = useAll(["payments"]);
  const p = (data.payments || []).filter((x) => x.status === "Paid");
  const months = lastMonths(12);
  const byTrip = Object.entries(
    p.reduce<Record<string, number>>((a, x) => {
      const k = x.trip || "Other";
      a[k] = (a[k] || 0) + (Number(x.amount) || 0);
      return a;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);
  return (
    <div className="grid-2">
      <div className="card pad">
        <div className="card__head">
          <h3>Monthly revenue</h3>
        </div>
        <LineChart
          points={months.map((m) => ({
            label: mLabel(m),
            value: p
              .filter((x) => monthKey(x.date) === m)
              .reduce((s, x) => s + (Number(x.amount) || 0), 0),
          }))}
        />
      </div>
      <div className="card pad">
        <div className="card__head">
          <h3>Revenue by trip</h3>
        </div>
        <BarChart money bars={byTrip.map(([label, value]) => ({ label, value }))} />
      </div>
    </div>
  );
}

/* ---------- Analytics ---------- */
export function Analytics() {
  const { data, loading } = useAll(["enquiries", "bookings", "users"]);
  const e = data.enquiries || [],
    b = data.bookings || [];
  const days = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (13 - i));
        return d.toISOString().slice(0, 10);
      }),
    [],
  );
  const perDay = days.map((d) => ({
    d,
    n: e.filter((x) => (x.createdAt || "").slice(0, 10) === d).length,
  }));
  const maxDay = Math.max(1, ...perDay.map((x) => x.n));
  const count = (rows: Rec[], k: string) =>
    Object.entries(
      rows.reduce<Record<string, number>>((a, r) => {
        const v = r[k] || "Unknown";
        a[v] = (a[v] || 0) + 1;
        return a;
      }, {}),
    )
      .sort((x, y) => y[1] - x[1])
      .map(([label, value]) => ({ label, value }));
  const converted = e.filter((x) => x.status === "Converted").length;
  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1>Analytics</h1>
          <p>Leads, conversions and what people are asking about</p>
        </div>
      </div>
      <div className="stats stats--3">
        <div className="stat">
          <span className="stat__icon tone-blue">
            <Icon name="enquiries" size={20} />
          </span>
          <div>
            <small>Leads (last 14 days)</small>
            <strong>{loading ? "…" : perDay.reduce((s, x) => s + x.n, 0)}</strong>
          </div>
        </div>
        <div className="stat">
          <span className="stat__icon tone-green">
            <Icon name="arrowUp" size={20} />
          </span>
          <div>
            <small>Lead → booking rate</small>
            <strong>{e.length ? Math.round((converted / e.length) * 100) : 0}%</strong>
          </div>
        </div>
        <div className="stat">
          <span className="stat__icon tone-orange">
            <Icon name="bookings" size={20} />
          </span>
          <div>
            <small>Confirmed bookings</small>
            <strong>{b.filter((x) => x.status === "Confirmed").length}</strong>
          </div>
        </div>
      </div>
      <div className="card pad">
        <div className="card__head">
          <h3>Website enquiries per day</h3>
          <span className="muted">Last 14 days</span>
        </div>
        <div className="cols">
          {perDay.map((x) => (
            <div key={x.d} className="cols__c" title={`${fmtDate(x.d)}: ${x.n}`}>
              <i style={{ height: `${(x.n / maxDay) * 100}%` }} />
              <span>{x.d.slice(8)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid-3">
        <div className="card pad">
          <div className="card__head">
            <h3>Leads by interest</h3>
          </div>
          <BarChart bars={count(e, "trip")} />
        </div>
        <div className="card pad">
          <div className="card__head">
            <h3>Lead status</h3>
          </div>
          <BarChart bars={count(e, "status")} />
        </div>
        <div className="card pad">
          <div className="card__head">
            <h3>Bookings by trip</h3>
          </div>
          <BarChart bars={count(b, "trip")} />
        </div>
      </div>
    </div>
  );
}

/* ---------- Website info ---------- */
const SITE_FIELDS = [
  { key: "phone", label: "Phone number", icon: "phone" },
  { key: "whatsapp", label: "WhatsApp number (with country code)", icon: "whatsapp" },
  { key: "email", label: "Email address", icon: "mail" },
  { key: "upi", label: "UPI ID", icon: "billing" },
  { key: "instagram", label: "Instagram link", icon: "external" },
  { key: "google", label: "Google reviews link", icon: "external" },
];
export function WebsiteInfo() {
  type SiteInfo = {
    phone?: string;
    whatsapp?: string;
    email?: string;
    upi?: string;
    instagram?: string;
    google?: string;
    address?: string;
    [k: string]: string | undefined;
  };
  const [site, setSite] = useState<SiteInfo | null>(null);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    api("site")
      .then(setSite)
      .catch((e) => setMsg(e.message));
  }, []);
  async function save(ev: FormEvent) {
    ev.preventDefault();
    setMsg("");
    try {
      setSite(await api("site", { method: "PUT", body: site }));
      setMsg("Saved — the website now shows these details.");
    } catch (e) {
      setMsg((e as Error).message);
    }
  }
  if (!site)
    return (
      <div className="page">
        <p className="muted">{msg || "Loading…"}</p>
      </div>
    );
  const set = (k: string) => (e: { target: { value: string } }) =>
    setSite({ ...site, [k]: e.target.value });
  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1>Website Information</h1>
          <p>Update the contact details shown on your public site</p>
        </div>
        <a className="abtn abtn--ghost" href="/" target="_blank" rel="noopener">
          <Icon name="external" size={15} /> View site
        </a>
      </div>
      <div className="grid-2 grid-2--wide">
        <form className="card pad form-stack" onSubmit={save}>
          {SITE_FIELDS.map((f) => (
            <label key={f.key}>
              <span>{f.label}</span>
              <div className="input-icon">
                <Icon name={f.icon} size={16} />
                <input value={site[f.key] || ""} onChange={set(f.key)} />
              </div>
            </label>
          ))}
          <label>
            <span>Address</span>
            <textarea rows={3} value={site.address || ""} onChange={set("address")} />
          </label>
          <div className="row-between">
            <button className="abtn">Save Changes</button>
            {msg && <span className="ok">{msg}</span>}
          </div>
        </form>
        <div className="card pad preview">
          <div className="card__head">
            <h3>Quick Preview</h3>
          </div>
          <div className="preview__card">
            <div className="preview__brand">
              <img src="/assets/img/logo.png" alt="" />
              <b>CHEETAH TRAVELZ</b>
            </div>
            <p>
              <Icon name="phone" size={15} /> {site.phone || "—"}
            </p>
            {site.email && (
              <p>
                <Icon name="mail" size={15} /> {site.email}
              </p>
            )}
            <p>
              <Icon name="whatsapp" size={15} /> wa.me/
              {String(site.whatsapp || "").replace(/\D/g, "")}
            </p>
            <p>
              <Icon name="billing" size={15} /> UPI · {site.upi || "—"}
            </p>
            {site.address && (
              <p>
                <Icon name="pin" size={15} /> {site.address}
              </p>
            )}
            <div className="preview__social">
              <a href={site.instagram} target="_blank" rel="noopener">
                Instagram
              </a>
              <a href={site.google} target="_blank" rel="noopener">
                Google
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Settings ---------- */
export function Settings({
  username,
  isDefault,
  onChanged,
}: {
  username: string;
  isDefault: boolean;
  onChanged: (u: string) => void;
}) {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as {
      newUsername: string;
      currentPassword: string;
      newPassword: string;
      confirm: string;
    };
    if (f.newPassword !== f.confirm)
      return setMsg({ ok: false, text: "New passwords do not match." });
    try {
      const r = await api<{ token: string; username: string }>("account", {
        method: "POST",
        body: {
          currentPassword: f.currentPassword,
          newUsername: f.newUsername,
          newPassword: f.newPassword,
        },
      });
      session.set(r.token);
      onChanged(r.username);
      (e.target as HTMLFormElement).reset();
      setMsg({ ok: true, text: "Saved. Use your new details next time you log in." });
    } catch (err) {
      setMsg({ ok: false, text: (err as Error).message });
    }
  }
  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1>Settings</h1>
          <p>Change your admin login</p>
        </div>
      </div>
      {isDefault && (
        <div className="alert">
          <Icon name="shield" /> You're still using the default <b>admin / admin</b> login. Anyone
          who guesses it can see your leads — set a new password below.
        </div>
      )}
      <form className="card pad form-stack narrow" onSubmit={save}>
        <label>
          <span>Username</span>
          <input name="newUsername" defaultValue={username} required />
        </label>
        <label>
          <span>Current password</span>
          <input name="currentPassword" type="password" required autoComplete="current-password" />
        </label>
        <label>
          <span>New password (min 8 characters)</span>
          <input
            name="newPassword"
            type="password"
            minLength={8}
            required
            autoComplete="new-password"
          />
        </label>
        <label>
          <span>Confirm new password</span>
          <input
            name="confirm"
            type="password"
            minLength={8}
            required
            autoComplete="new-password"
          />
        </label>
        <div className="row-between">
          <button className="abtn">Update login</button>
          {msg && <span className={msg.ok ? "ok" : "form-err"}>{msg.text}</span>}
        </div>
      </form>
    </div>
  );
}
