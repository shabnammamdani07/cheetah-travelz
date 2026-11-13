import { useEffect, useMemo, useState, type ReactNode, type FormEvent } from "react";
import { collection, downloadCsv, type Rec } from "./api";
import { Icon } from "./icons";

export type Field = {
  key: string;
  label: string;
  type?: "text" | "number" | "date" | "select" | "textarea" | "image" | "email" | "tel";
  options?: string[];
  required?: boolean;
  placeholder?: string;
  full?: boolean;
  /** Shown in the details view when the value is blank (e.g. "Not provided"). */
  emptyText?: string;
  hint?: string;
};
export type Column = { key: string; label: string; render?: (r: Rec) => ReactNode; width?: string };
export type ResourceConfig = {
  name: string;
  title: string;
  subtitle: string;
  addLabel?: string;
  singular: string;
  plural?: string;
  columns: Column[];
  fields: Field[];
  searchKeys: string[];
  filters?: { key: string; label: string; options: string[] | ((rows: Rec[]) => string[]) }[];
  defaults?: () => Partial<Rec>;
  quickStatus?: { key: string; options: string[] };
  rowActions?: (r: Rec) => ReactNode;
  exportable?: boolean;
  header?: (rows: Rec[]) => ReactNode;
  tabs?: ReactNode;
};

const PAGE = 8;

export function Pill({ value }: { value?: string }) {
  if (!value) return <span className="muted">—</span>;
  return (
    <span
      className={`pill pill--${String(value)
        .toLowerCase()
        .replace(/[^a-z]/g, "")}`}
    >
      {value}
    </span>
  );
}

export function useCollection(name: string) {
  const api = useMemo(() => collection(name), [name]);
  const [rows, setRows] = useState<Rec[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = () => {
    setLoading(true);
    api
      .list()
      .then((r) => {
        setRows(r);
        setError("");
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, [api]);
  return { rows, setRows, loading, error, reload: load, api };
}

export default function ResourcePage({ cfg }: { cfg: ResourceConfig }) {
  const { rows, setRows, loading, error, api } = useCollection(cfg.name);
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Partial<Rec> | null>(null);
  const [viewing, setViewing] = useState<Rec | null>(null);
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState("");

  const shown = rows.filter(
    (r) =>
      (!q ||
        cfg.searchKeys.some((k) =>
          String(r[k] ?? "")
            .toLowerCase()
            .includes(q.toLowerCase()),
        )) &&
      Object.entries(filters).every(([k, v]) => !v || String(r[k]) === v),
  );
  const plural = cfg.plural || cfg.singular + "s";
  const pages = Math.max(1, Math.ceil(shown.length / PAGE));
  const slice = shown.slice((page - 1) * PAGE, page * PAGE);
  useEffect(() => setPage(1), [q, filters]);
  // Another page can hand over a pre-filled record (e.g. "Create booking" from a lead).
  useEffect(() => {
    const key = `ct_prefill_${cfg.name}`;
    try {
      const raw = sessionStorage.getItem(key);
      if (raw) {
        sessionStorage.removeItem(key);
        setFormErr("");
        setEditing({ ...(cfg.defaults?.() || {}), ...JSON.parse(raw) });
      }
    } catch {
      /* ignore */
    }
  }, [cfg]);

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget),
      body: Record<string, unknown> = {};
    cfg.fields.forEach((f) => {
      const v = fd.get(f.key);
      body[f.key] =
        f.type === "number" ? (v === "" || v == null ? "" : Number(v)) : String(v ?? "");
    });
    setSaving(true);
    setFormErr("");
    try {
      if (editing?.id) {
        const rec = await api.update(editing.id, body);
        setRows((rs) => rs.map((r) => (r.id === rec.id ? rec : r)));
      } else {
        const rec = await api.create(body);
        setRows((rs) => [rec, ...rs]);
      }
      setEditing(null);
    } catch (err) {
      setFormErr((err as Error).message);
    } finally {
      setSaving(false);
    }
  }
  async function remove(r: Rec) {
    if (!confirm(`Delete this ${cfg.singular}? This can't be undone.`)) return;
    await api.remove(r.id);
    setRows((rs) => rs.filter((x) => x.id !== r.id));
  }
  async function quick(r: Rec, value: string) {
    const rec = await api.update(r.id, { [cfg.quickStatus!.key]: value });
    setRows((rs) => rs.map((x) => (x.id === rec.id ? rec : x)));
  }

  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1>{cfg.title}</h1>
          <p>{cfg.subtitle}</p>
        </div>
        <div className="page__actions">
          {cfg.exportable && (
            <button
              className="abtn abtn--ghost"
              onClick={() =>
                downloadCsv(`${cfg.name}.csv`, shown, [
                  ...cfg.fields,
                  { key: "createdAt", label: "Created" },
                ])
              }
            >
              <Icon name="download" size={16} /> Export
            </button>
          )}
          {cfg.addLabel && (
            <button
              className="abtn"
              onClick={() => {
                setFormErr("");
                setEditing(cfg.defaults ? cfg.defaults() : {});
              }}
            >
              <Icon name="plus" size={16} /> {cfg.addLabel}
            </button>
          )}
        </div>
      </div>
      {cfg.tabs}
      {cfg.header?.(rows)}

      <div className="card">
        <div className="toolbar">
          <label className="search">
            <Icon name="search" size={16} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Search ${cfg.title.toLowerCase().replace("manage ", "")}…`}
            />
          </label>
          {cfg.filters?.map((f) => {
            const opts = typeof f.options === "function" ? f.options(rows) : f.options;
            return (
              <select
                key={f.key}
                value={filters[f.key] || ""}
                onChange={(e) => setFilters((s) => ({ ...s, [f.key]: e.target.value }))}
              >
                <option value="">{f.label}</option>
                {opts.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            );
          })}
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                {cfg.columns.map((c) => (
                  <th key={c.key} style={{ width: c.width }}>
                    {c.label}
                  </th>
                ))}
                <th className="ta-r">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={cfg.columns.length + 1} className="empty">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan={cfg.columns.length + 1} className="empty empty--err">
                    {error}
                  </td>
                </tr>
              )}
              {!loading && !error && slice.length === 0 && (
                <tr>
                  <td colSpan={cfg.columns.length + 1} className="empty">
                    {rows.length ? (
                      "Nothing matches your search."
                    ) : (
                      <>
                        No {plural} yet.
                        {cfg.addLabel && (
                          <>
                            {" "}
                            <button
                              className="linkbtn"
                              onClick={() => setEditing(cfg.defaults ? cfg.defaults() : {})}
                            >
                              {cfg.addLabel}
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              )}
              {slice.map((r) => (
                <tr key={r.id}>
                  {cfg.columns.map((c) => (
                    <td key={c.key}>{c.render ? c.render(r) : (r[c.key] ?? "—")}</td>
                  ))}
                  <td className="ta-r nowrap">
                    {cfg.quickStatus && (
                      <select
                        className="mini"
                        value={r[cfg.quickStatus.key] || ""}
                        onChange={(e) => quick(r, e.target.value)}
                        aria-label="Change status"
                      >
                        {cfg.quickStatus.options.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    )}
                    {cfg.rowActions?.(r)}
                    <button className="icon-btn" title="View" onClick={() => setViewing(r)}>
                      <Icon name="eye" size={16} />
                    </button>
                    <button
                      className="icon-btn"
                      title="Edit"
                      onClick={() => {
                        setFormErr("");
                        setEditing(r);
                      }}
                    >
                      <Icon name="edit" size={16} />
                    </button>
                    <button
                      className="icon-btn icon-btn--danger"
                      title="Delete"
                      onClick={() => remove(r)}
                    >
                      <Icon name="trash" size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pager">
          <span>
            Showing {shown.length ? (page - 1) * PAGE + 1 : 0}–{Math.min(page * PAGE, shown.length)}{" "}
            of {shown.length} {plural}
          </span>
          <div>
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              ‹
            </button>
            {Array.from({ length: pages }, (_, i) => (
              <button key={i} className={page === i + 1 ? "on" : ""} onClick={() => setPage(i + 1)}>
                {i + 1}
              </button>
            ))}
            <button disabled={page === pages} onClick={() => setPage(page + 1)}>
              ›
            </button>
          </div>
        </div>
      </div>

      {editing && (
        <div
          className="modal"
          onMouseDown={(e) => e.target === e.currentTarget && setEditing(null)}
        >
          <form className="modal__box" onSubmit={save}>
            <div className="modal__head">
              <h2>{editing.id ? `Edit ${cfg.singular}` : cfg.addLabel}</h2>
              <button type="button" className="icon-btn" onClick={() => setEditing(null)}>
                <Icon name="close" />
              </button>
            </div>
            <div className="form-grid">
              {cfg.fields.map((f) => (
                <FieldInput key={f.key} f={f} value={editing[f.key]} />
              ))}
            </div>
            {formErr && <p className="form-err">{formErr}</p>}
            <div className="modal__foot">
              <button type="button" className="abtn abtn--ghost" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button className="abtn" disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {viewing && (
        <div
          className="modal"
          onMouseDown={(e) => e.target === e.currentTarget && setViewing(null)}
        >
          <div className="modal__box">
            <div className="modal__head">
              <h2>{cfg.singular.charAt(0).toUpperCase() + cfg.singular.slice(1)} details</h2>
              <button className="icon-btn" onClick={() => setViewing(null)}>
                <Icon name="close" />
              </button>
            </div>
            {viewing.image && <img className="view-img" src={viewing.image} alt="" />}
            <dl className="view">
              {cfg.fields
                .filter((f) => f.type !== "image")
                .map((f) => (
                  <div key={f.key} className={f.type === "textarea" ? "full" : ""}>
                    <dt>{f.label}</dt>
                    <dd className={String(viewing[f.key] ?? "") ? undefined : "muted"}>
                      {String(viewing[f.key] ?? "") || f.emptyText || "—"}
                    </dd>
                  </div>
                ))}
              {viewing.createdAt && (
                <div>
                  <dt>Created</dt>
                  <dd>{new Date(viewing.createdAt).toLocaleString("en-IN")}</dd>
                </div>
              )}
            </dl>
            <div className="modal__foot">
              {cfg.rowActions?.(viewing)}
              <button
                className="abtn"
                onClick={() => {
                  setEditing(viewing);
                  setViewing(null);
                }}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const SITE_IMAGES = [
  "beach-pan.jpg",
  "yacht.jpg",
  "m-lake2.jpg",
  "m-valley.jpg",
  "m-horses.jpg",
  "lonavala.jpg",
  "daman.jpg",
  "g-daman.jpg",
  "kayak.jpg",
  "banana.jpg",
  "jetski.jpg",
  "parasail.jpg",
  "oldgoa.jpg",
  "palolem.jpg",
  "hotel-pool.jpg",
  "g-waterfall.jpg",
  "g-room.jpg",
  "m-bus.jpg",
].map((n) => `/assets/img/${n}`);

function FieldInput({ f, value }: { f: Field; value: unknown }) {
  const [img, setImg] = useState(String(value ?? ""));
  const common = {
    name: f.key,
    required: f.required,
    placeholder: f.placeholder,
    defaultValue: value == null ? "" : String(value),
  };
  return (
    <label className={f.full || f.type === "textarea" || f.type === "image" ? "full" : ""}>
      <span>
        {f.label}
        {f.required && <b> *</b>}
      </span>
      {f.type === "textarea" ? (
        <textarea rows={3} {...common} />
      ) : f.type === "select" ? (
        <select {...common}>
          {!f.required && <option value="">—</option>}
          {f.options!.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : f.type === "image" ? (
        <div className="img-field">
          {img && <img src={img} alt="" />}
          <input
            name={f.key}
            list="site-images"
            value={img}
            onChange={(e) => setImg(e.target.value)}
            placeholder="Pick a site photo or paste an image URL"
          />
          <datalist id="site-images">
            {SITE_IMAGES.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>
      ) : (
        <input type={f.type || "text"} step={f.type === "number" ? "any" : undefined} {...common} />
      )}
      {f.hint && <small className="field-hint">{f.hint}</small>}
    </label>
  );
}
