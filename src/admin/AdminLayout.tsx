import { createContext, useContext, useEffect, useState, type FormEvent } from "react";
import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { api, session, setUnauthorizedHandler } from "./api";
import { Icon } from "./icons";

/* Admin session shared with every /admin page (see src/routes/admin.*.tsx). */
type AdminSession = {
  username: string;
  isDefault: boolean;
  setUser: (u: string) => void;
  logout: () => void;
};
const AdminCtx = createContext<AdminSession | null>(null);
export const useAdmin = () => {
  const v = useContext(AdminCtx);
  if (!v) throw new Error("useAdmin must be used inside the /admin layout");
  return v;
};

const NAV = [
  { to: "/admin", label: "Dashboard", icon: "dashboard", exact: true },
  { to: "/admin/trips", label: "Trips", icon: "trips" },
  { to: "/admin/stories", label: "Stories", icon: "stories" },
  { to: "/admin/bookings", label: "Bookings", icon: "bookings" },
  { to: "/admin/billing", label: "Billing", icon: "billing" },
  { to: "/admin/promos", label: "Promo Codes", icon: "promos" },
  { to: "/admin/users", label: "Users / Travellers", icon: "users" },
  { to: "/admin/enquiries", label: "Enquiries", icon: "enquiries", badge: true },
  { to: "/admin/website", label: "Website Info", icon: "website" },
  { to: "/admin/analytics", label: "Analytics", icon: "analytics" },
  { to: "/admin/settings", label: "Settings", icon: "settings" },
] as const;

function Login({ onLogin }: { onLogin: (u: string, d: boolean) => void }) {
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    setBusy(true);
    setErr("");
    try {
      const r = await api<{ token: string; username: string; isDefault: boolean }>("login", {
        method: "POST",
        body: f,
      });
      session.set(r.token);
      onLogin(r.username, r.isDefault);
    } catch (e2) {
      setErr((e2 as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="login">
      <div className="login__panel">
        <div className="login__brand">
          <img src="/assets/img/logo.png" alt="" />
          <div>
            <b>CHEETAH TRAVELZ</b>
            <span>Admin Portal</span>
          </div>
        </div>
        <form className="login__form" onSubmit={submit}>
          <h1>Admin Login</h1>
          <p>Only authorized personnel can access this portal.</p>
          <label className="login__field">
            <Icon name="user" />
            <input
              name="username"
              placeholder="Username"
              autoComplete="username"
              required
              autoFocus
            />
          </label>
          <label className="login__field">
            <Icon name="lock" />
            <input
              name="password"
              type={show ? "text" : "password"}
              placeholder="Password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="login__eye"
              onClick={() => setShow(!show)}
              aria-label={show ? "Hide password" : "Show password"}
            >
              <Icon name={show ? "eyeOff" : "eye"} />
            </button>
          </label>
          {err && (
            <p className="login__err" role="alert">
              {err}
            </p>
          )}
          <button className="login__btn" disabled={busy}>
            {busy ? "Signing in…" : "Login"}
          </button>
          <p className="login__hint">
            Forgot password? Ask the site owner to reset it in Settings.
          </p>
        </form>
        <p className="login__secure">
          <Icon name="shield" size={15} /> Secure access · sessions expire after 12 hours
        </p>
      </div>
      <div className="login__art" style={{ backgroundImage: "url(/assets/img/m-valley.jpg)" }}>
        <p className="login__script">
          Explore
          <br />
          Connect
          <br />
          Belong
        </p>
      </div>
    </div>
  );
}

function Shell() {
  const { username, isDefault, logout } = useAdmin();
  const [open, setOpen] = useState(false);
  const [newLeads, setNewLeads] = useState(0);
  const pathname = useLocation({ select: (l) => l.pathname });
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    api<any[]>("enquiries")
      .then((r) => setNewLeads(r.filter((x) => x.status === "New").length))
      .catch(() => {});
  }, [pathname]);
  return (
    <div className={`adm ${open ? "nav-open" : ""}`}>
      <aside className="side">
        <div className="side__brand">
          <img src="/assets/img/logo.png" alt="" />
          <span>
            CHEETAH
            <br />
            <b>TRAVELZ</b>
          </span>
        </div>
        <nav>
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeProps={{ className: "on" }}
              activeOptions={{ exact: "exact" in n }}
            >
              <Icon name={n.icon} /> <span>{n.label}</span>
              {"badge" in n && newLeads > 0 && <em>{newLeads}</em>}
            </Link>
          ))}
        </nav>
        <button className="side__logout" onClick={logout}>
          <Icon name="logout" /> Logout
        </button>
      </aside>
      <div className="side-scrim" onClick={() => setOpen(false)} />
      <div className="main">
        <header className="top">
          <button className="top__menu" onClick={() => setOpen(true)} aria-label="Open menu">
            <Icon name="menu" />
          </button>
          <div className="top__right">
            <a className="top__site" href="/" target="_blank" rel="noopener">
              <Icon name="external" size={15} /> View website
            </a>
            <Link to="/admin/enquiries" className="top__bell" aria-label="New leads">
              <Icon name="bell" />
              {newLeads > 0 && <i>{newLeads}</i>}
            </Link>
            <div className="top__user">
              <span className="avatar">{username.slice(0, 1).toUpperCase()}</span>
              <div>
                <b>{username}</b>
                <small>Super Admin</small>
              </div>
            </div>
          </div>
        </header>
        {isDefault && pathname !== "/admin/settings" && (
          <div className="alert alert--top">
            <Icon name="shield" /> You're using the default <b>admin / admin</b> login.{" "}
            <Link to="/admin/settings">Change it now →</Link>
          </div>
        )}
        <Outlet />
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [state, setState] = useState<{ ready: boolean; username: string; isDefault: boolean }>({
    ready: false,
    username: "",
    isDefault: false,
  });
  useEffect(() => {
    setUnauthorizedHandler(() => setState({ ready: true, username: "", isDefault: false }));
    if (!session.token) return setState({ ready: true, username: "", isDefault: false });
    api<{ username: string; isDefault: boolean }>("me")
      .then((r) => setState({ ready: true, ...r }))
      .catch(() => setState({ ready: true, username: "", isDefault: false }));
  }, []);
  if (!state.ready)
    return (
      <div className="adm-loading">
        <img src="/assets/img/logo.png" alt="" />
      </div>
    );
  if (!state.username)
    return (
      <Login onLogin={(username, isDefault) => setState({ ready: true, username, isDefault })} />
    );
  const value: AdminSession = {
    username: state.username,
    isDefault: state.isDefault,
    setUser: (u) => setState({ ready: true, username: u, isDefault: false }),
    logout: () => {
      session.clear();
      setState({ ready: true, username: "", isDefault: false });
    },
  };
  return (
    <AdminCtx.Provider value={value}>
      <Shell />
    </AdminCtx.Provider>
  );
}
