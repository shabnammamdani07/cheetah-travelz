/* Thin client for the /api Netlify Function. The session token lives in localStorage for 12 hours. */
const KEY = "ct_admin_token";

export const session = {
  get token() {
    try {
      return localStorage.getItem(KEY) || "";
    } catch {
      return "";
    }
  },
  set(t: string) {
    try {
      localStorage.setItem(KEY, t);
    } catch {
      /* private mode */
    }
  },
  clear() {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  },
};

export class ApiError extends Error {
  constructor(
    msg: string,
    public status: number,
  ) {
    super(msg);
  }
}

let onUnauthorized: () => void = () => {};
export const setUnauthorizedHandler = (fn: () => void) => {
  onUnauthorized = fn;
};

export async function api<T = any>(
  path: string,
  opts: { method?: string; body?: unknown } = {},
): Promise<T> {
  const init: RequestInit = {
    method: opts.method || "GET",
    headers: {
      "content-type": "application/json",
      ...(session.token ? { authorization: `Bearer ${session.token}` } : {}),
    },
  };
  if (opts.body !== undefined) init.body = JSON.stringify(opts.body);
  const r = await fetch(`/api/${path}`, init);
  const data = await r.json().catch(() => ({}));
  if (r.status === 401 && path !== "login") {
    session.clear();
    onUnauthorized();
  }
  if (!r.ok) throw new ApiError(data.error || `Request failed (${r.status})`, r.status);
  return data as T;
}

/* One stored record (trip, booking, lead…). Known fields are listed so they can be read as rec.field;
   anything else is still allowed through the index signature. */
export type Rec = {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  name?: any;
  title?: any;
  destination?: any;
  startDate?: any;
  endDate?: any;
  price?: any;
  seats?: any;
  image?: any;
  description?: any;
  status?: any;
  trip?: any;
  date?: any;
  link?: any;
  body?: any;
  bookingId?: any;
  traveller?: any;
  phone?: any;
  email?: any;
  amount?: any;
  payment?: any;
  promo?: any;
  referralCode?: any;
  notes?: any;
  method?: any;
  reference?: any;
  code?: any;
  discount?: any;
  type?: any;
  validUntil?: any;
  used?: any;
  limit?: any;
  joined?: any;
  tripsJoined?: any;
  city?: any;
  gender?: any;
  message?: any;
  source?: any;
  [k: string]: any;
};

export const collection = (name: string) => ({
  list: () => api<Rec[]>(name),
  create: (body: Partial<Rec>) => api<Rec>(name, { method: "POST", body }),
  update: (id: string, body: Partial<Rec>) => api<Rec>(`${name}/${id}`, { method: "PUT", body }),
  remove: (id: string) => api(`${name}/${id}`, { method: "DELETE" }),
});

export function downloadCsv(filename: string, rows: Rec[], cols: { key: string; label: string }[]) {
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [
    cols.map((c) => esc(c.label)).join(","),
    ...rows.map((r) => cols.map((c) => esc(r[c.key])).join(",")),
  ].join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export const inr = (n: unknown) => "₹" + (Number(n) || 0).toLocaleString("en-IN");
export const fmtDate = (s?: string) => {
  if (!s) return "—";
  const d = new Date(s.length === 10 ? s + "T00:00:00" : s);
  return isNaN(+d)
    ? s
    : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};
