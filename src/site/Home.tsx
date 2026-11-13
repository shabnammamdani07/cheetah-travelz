import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import {
  CONTACT,
  WHATSAPP_BOOK,
  TRIP,
  DESTINATIONS,
  INCLUSIONS,
  ITINERARY,
  SPORTS,
  STAY,
  GALLERY,
  REVIEWS,
  PRICES,
  INCLUDED,
  NOT_INCLUDED,
  TERMS,
  img,
} from "./content";
// site.css is linked from the / route's head() (src/routes/index.tsx), so it only loads on the public site.

/* Contact details can be edited in the admin panel (Website Info); fall back to content.ts. */
function useSiteInfo() {
  useEffect(() => {
    fetch("/api/public/site")
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => {
        if (!s) return;
        if (s.phone) CONTACT.phone = s.phone;
        if (s.whatsapp) CONTACT.phoneRaw = String(s.whatsapp).replace(/\D/g, "");
        if (s.instagram) CONTACT.instagram = s.instagram;
        if (s.google) CONTACT.google = s.google;
        if (s.upi) CONTACT.upi = s.upi;
        document.querySelectorAll<HTMLAnchorElement>('a[href*="wa.me/"]').forEach((a) => {
          a.href = a.href.replace(/wa\.me\/\d+/, `wa.me/${CONTACT.phoneRaw}`);
        });
        document
          .querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]:not([data-static-contact])')
          .forEach((a) => {
            a.href = `tel:+${CONTACT.phoneRaw}`;
          });
        document.querySelectorAll<HTMLAnchorElement>('a[href*="instagram.com"]').forEach((a) => {
          a.href = CONTACT.instagram;
        });
        document.querySelectorAll<HTMLElement>('[data-site="phone"]').forEach((el) => {
          el.textContent = CONTACT.phone;
        });
        document.querySelectorAll<HTMLElement>('[data-site="upi"]').forEach((el) => {
          el.textContent = CONTACT.upi;
        });
      })
      .catch(() => {});
  }, []);
}

function Enquire() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [savedCode, setSavedCode] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setState("sending");
    setError("");
    try {
      const r = await fetch("/api/public/enquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || "Something went wrong. Please WhatsApp us instead.");
      setSavedCode(j.referralCode || "");
      setState("done");
      form.reset();
    } catch (err) {
      setState("error");
      setError((err as Error).message);
    }
  }
  return (
    <section className="enquire" id="enquire">
      <div className="wrap enquire__grid">
        <div>
          <p className="eyebrow eyebrow--light">Book a seat · ask a question</p>
          <h2 className="h2 h2--light reveal-lines">
            Ask us
            <br />
            <span className="yellow">anything.</span>
          </h2>
          <p className="enquire__lede">
            Request your seat or ask us anything — our team will call or WhatsApp you back, usually
            within a few hours, to confirm dates, price and payment.
          </p>
        </div>
        {state === "done" ? (
          <div className="enquire__done" role="status">
            <img src={img("logo.png")} alt="" />
            <h3>Got it — thank you!</h3>
            <p>
              We'll reach out shortly. Can't wait?{" "}
              <a href={WHATSAPP_BOOK} target="_blank" rel="noopener">
                WhatsApp us now
              </a>
              .
            </p>
            {savedCode && (
              <p className="enquire__ref">
                We've noted your referral code <b>{savedCode}</b>. Our team will check it and
                confirm any offer before you pay — it isn't applied automatically.
              </p>
            )}
            <button className="btn btn--ghost" onClick={() => setState("idle")}>
              Send another
            </button>
          </div>
        ) : (
          <form className="enquire__form" onSubmit={submit}>
            <label>
              Your name
              <input name="name" required maxLength={80} placeholder="e.g. Riya Khan" />
            </label>
            <div className="enquire__row">
              <label>
                Phone / WhatsApp
                <input
                  name="phone"
                  required
                  inputMode="tel"
                  maxLength={20}
                  placeholder="+91 98765 43210"
                />
              </label>
              <label>
                Email <small>(optional)</small>
                <input name="email" type="email" maxLength={120} placeholder="you@email.com" />
              </label>
            </div>
            <label>
              Interested in
              <select name="trip" defaultValue="Goa Trip · 21–24 Nov">
                <option>Goa Trip · 21–24 Nov</option>
                <option>Upcoming trips</option>
                <option>Private group trip</option>
                <option>Car / bus rental</option>
                <option>Something else</option>
              </select>
            </label>
            <label htmlFor="referralCode">
              Do you have a referral code? <small>(optional)</small>
            </label>
            <input
              id="referralCode"
              className="enquire__refinput"
              name="referralCode"
              maxLength={30}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              placeholder="e.g. RIYA10"
              aria-describedby="referralHint"
            />
            <p id="referralHint" className="enquire__hint">
              Leave blank to skip. We'll verify the code and confirm any offer when we contact you —
              it isn't applied automatically.
            </p>
            <label>
              Message <small>(optional)</small>
              <textarea
                name="message"
                rows={3}
                maxLength={1000}
                placeholder="Travelling solo? Group of 5? Tell us…"
              />
            </label>
            <input
              name="company"
              tabIndex={-1}
              autoComplete="off"
              className="hp"
              aria-hidden="true"
            />
            {state === "error" && (
              <p className="enquire__err" role="alert">
                {error}
              </p>
            )}
            <button className="btn btn--orange" disabled={state === "sending"} data-magnetic>
              {state === "sending" ? "Sending…" : "Send enquiry →"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

const css = (o: Record<string, string>) => o as CSSProperties;

function Chrome() {
  return (
    <>
      <div className="loader" id="loader">
        <img src={img("logo.png")} alt="" className="loader__logo" />
        <div className="loader__count">
          <span id="loaderNum">0</span>%
        </div>
        <div className="loader__bar">
          <i id="loaderBar" />
        </div>
      </div>
      <div className="cursor" id="cursor">
        <span className="cursor__label" id="cursorLabel" />
      </div>
      <div className="cursor-dot" id="cursorDot" />
      <div className="paws" id="paws" aria-hidden="true" />
      <div className="progress">
        <i id="progressBar" />
      </div>

      <header className="nav" id="nav">
        <a href="#top" className="nav__brand" data-magnetic>
          <img src={img("logo.png")} alt="Cheetah Travelz logo" />
          <span>
            CHEETAH<b>TRAVELZ</b>
          </span>
        </a>
        <nav className="nav__links">
          <a href="#destinations">Destinations</a>
          <a href="#trips">Trips</a>
          <a href="#services">Services</a>
          <a href="#gallery">Gallery</a>
          <a href="#enquire">Contact</a>
        </nav>
        <a
          className="btn btn--orange nav__cta"
          href={WHATSAPP_BOOK}
          target="_blank"
          rel="noopener"
          data-magnetic
          data-cursor="Chat"
        >
          Book on WhatsApp
        </a>
        <button className="nav__burger" id="burger" aria-label="Menu">
          <i />
          <i />
        </button>
      </header>
      <div className="mnav" id="mnav">
        <a href="#destinations">Destinations</a>
        <a href="#trips">Upcoming Trips</a>
        <a href="#services">Services</a>
        <a href="#goa">Goa Trip</a>
        <a href="#gallery">Gallery</a>
        <a href="#enquire">Contact</a>
      </div>
    </>
  );
}

function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero__layer hero__sky" data-depth="0.05" />
      <div className="hero__layer hero__sun" data-depth="0.12">
        <i />
      </div>
      <div
        className="hero__layer hero__photo"
        id="heroPhoto"
        data-depth="0.18"
        style={{ backgroundImage: `url(${img("m-lake2.jpg")})` }}
      />
      <div className="hero__layer hero__title" data-depth="0.35">
        <h1 className="hero__goa" aria-label="Next stop: anywhere — we take you everywhere">
          <em className="split">Next stop</em>
          <span
            className="hero__dest"
            id="heroDest"
            style={css({ "--len": "8" })}
            data-words={JSON.stringify(DESTINATIONS.map((d) => [d.word, img(d.hero)]))}
          >
            ANYWHERE
          </span>
        </h1>
      </div>
      <div className="hero__layer hero__birds" data-depth="0.5">
        <svg viewBox="0 0 200 60">
          <path d="M10 30 q10 -12 20 0 q10 -12 20 0" />
          <path d="M70 14 q8 -9 16 0 q8 -9 16 0" />
          <path d="M130 36 q7 -8 14 0 q7 -8 14 0" />
        </svg>
      </div>
      <div className="hero__layer hero__palms" data-depth="0.7">
        <svg className="palm palm--l" viewBox="0 0 300 600" aria-hidden="true">
          <use href="#palm" />
        </svg>
        <svg className="palm palm--r" viewBox="0 0 300 600" aria-hidden="true">
          <use href="#palm" />
        </svg>
      </div>
      <div className="hero__layer hero__sign" data-depth="0.85">
        <div className="sign">
          {(
            [
              ["DAMAN", "#1a6f8c", "-4deg"],
              ["LONAVALA", "#2f7d4a", "3deg"],
              ["MAHABALESHWAR", "#c8402a", "-2deg"],
              ["GOA", "#e0702a", "4deg"],
              ["ANYWHERE →", "#1d5c7a", "-3deg"],
            ] as const
          ).map(([t, c, r]) => (
            <span key={t} style={css({ "--c": c, "--r": r })}>
              {t}
            </span>
          ))}
          <i />
        </div>
      </div>
      <div className="hero__content">
        <p className="hero__lede">
          <b>We take you everywhere.</b> Solo &amp; group trips from Mumbai to Goa, Daman,
          Mahabaleshwar, Lonavala and beyond — plus chauffeur-driven cars &amp; buses across India.
        </p>
        <div className="hero__ctas">
          <a href="#destinations" className="btn btn--orange" data-magnetic data-cursor="Go">
            Where to next? ↓
          </a>
          <a href="#enquire" className="btn btn--ghost" data-magnetic>
            Plan my trip
          </a>
        </div>
        <a className="chip" href="#goa">
          <svg viewBox="0 0 24 24">
            <path d="M7 2v3M17 2v3M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
          </svg>
          <span>
            Next departure: <b>Goa</b> · 21<sup>st</sup> – 24<sup>th</sup> NOV
          </span>
        </a>
      </div>
      <img className="hero__msme" src={img("msme.png")} alt="MSME Registered" />
      <div className="hero__scroll">
        <span>SCROLL</span>
        <i />
      </div>
      <svg className="hero__wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path d="M0 60 C 240 120 480 0 720 50 C 960 100 1200 10 1440 60 L1440 120 L0 120Z" />
      </svg>
    </section>
  );
}

function Marquee() {
  const words = [
    "DAMAN",
    "MAHABALESHWAR",
    "LONAVALA",
    "GOA",
    "GOOD VIBES",
    "NEW FRIENDS",
    "ANYWHERE IN INDIA",
  ];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[...words, ...words].map((w, i) => (
          <span key={i} style={{ display: "contents" }}>
            <span>{w}</span>
            <b>✺</b>
          </span>
        ))}
      </div>
    </div>
  );
}

function About() {
  return (
    <section className="about" id="trip">
      <div className="spots" data-speed="-0.2" />
      <div className="wrap about__grid">
        <div className="about__text">
          <p className="eyebrow">Who we are</p>
          <h2 className="h2 reveal-lines">
            Travel fast.
            <br />
            <span className="orange">Live wild.</span>
          </h2>
          <p className="reveal">
            Cheetah Travelz is an <b>MSME-registered</b> travel crew from Mumbai running{" "}
            <b>solo &amp; private group trips</b> and{" "}
            <b>chauffeur-driven cars &amp; buses all over India</b>. Come alone, leave with a gang —
            Goa, Mahabaleshwar, Daman and more.
          </p>
          <ul className="about__pills reveal">
            <li>🎖️ MSME Registered</li>
            <li>🧳 Solo &amp; Group Trips</li>
            <li>🚐 Cars &amp; Buses · All India</li>
            <li>👩‍✈️ Female Trip Captain</li>
          </ul>
        </div>
        <div className="about__stack">
          <figure className="tilt" data-speed="0.15" data-cursor="Wild">
            <img src={img("g-daman.jpg")} alt="Cheetah Travelz group on the Daman trip" />
          </figure>
          <figure className="tilt" data-speed="-0.1">
            <img src={img("m-lake.jpg")} alt="Mahabaleshwar valley and lake view" />
          </figure>
          <figure className="tilt" data-speed="0.3">
            <img src={img("g-busparty.jpg")} alt="Party on the Cheetah Travelz bus" />
          </figure>
        </div>
      </div>
    </section>
  );
}

function Destinations() {
  return (
    <section className="dest" id="destinations">
      <div className="wrap">
        <p className="eyebrow">Where to next?</p>
        <h2 className="h2 reveal-lines">
          We take you
          <br />
          <span className="orange">everywhere.</span>
        </h2>
        <div className="dest__grid">
          {DESTINATIONS.map((d) => (
            <a
              key={d.name}
              href={d.next ? "#goa" : "#enquire"}
              className={"dcard" + (d.next ? " dcard--next" : "")}
              data-tilt
              data-cursor={d.next ? "Next up" : "Ask us"}
            >
              <img src={img(d.card)} alt={d.name} />
              {d.next && <span className="dcard__badge">Next trip · {d.next}</span>}
              <div className="dcard__body">
                <small>{d.tag}</small>
                <h3>{d.name}</h3>
                <p>{d.blurb}</p>
                <span className="dcard__cta">
                  {d.next ? "See the Goa plan →" : "Ask about dates →"}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

const SERVICES = [
  {
    title: "Group Trips",
    text: "Fixed-departure trips for solo travellers — come alone, leave with a gang.",
    icon: '<circle cx="22" cy="22" r="8"/><circle cx="44" cy="24" r="6"/><path d="M8 52c0-9 6-15 14-15s14 6 14 15M38 52c0-7 3-12 8-13 6 0 10 5 10 13"/>',
  },
  {
    title: "Private & Custom Trips",
    text: "Friends, family or office crew — your dates, your destination, planned end to end.",
    icon: '<path d="M32 56s-18-15-18-28a18 18 0 0 1 36 0c0 13-18 28-18 28z"/><circle cx="32" cy="28" r="6"/>',
  },
  {
    title: "Cars & Buses",
    text: "Chauffeur-driven cars, tempo travellers and AC buses for any trip across India.",
    icon: '<rect x="6" y="16" width="52" height="28" rx="6"/><path d="M6 30h52M18 16v14M32 16v14M46 16v14"/><circle cx="18" cy="48" r="5"/><circle cx="46" cy="48" r="5"/>',
  },
  {
    title: "Weekend Getaways",
    text: "Quick escapes from Mumbai — Lonavala, Mahabaleshwar, Daman and more.",
    icon: '<circle cx="32" cy="24" r="10"/><path d="M32 6v4M32 38v4M14 24h4M46 24h4M19 11l3 3M42 34l3 3M45 11l-3 3M22 34l-3 3M6 54c8-6 16-6 26 0s18 6 26 0"/>',
  },
];

function Services() {
  return (
    <section className="services" id="services">
      <div className="wrap">
        <p className="eyebrow">What we do</p>
        <h2 className="h2 reveal-lines">
          Trips, rides
          <br />
          <span className="orange">&amp; good company.</span>
        </h2>
        <div className="services__grid">
          {SERVICES.map((s) => (
            <div className="scard2" key={s.title} data-tilt>
              <svg viewBox="0 0 64 64" dangerouslySetInnerHTML={{ __html: s.icon }} />
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
        <div className="stats-band">
          <div>
            <b>MSME</b>
            <span>Registered agency</span>
          </div>
          <div>
            <b>All India</b>
            <span>Cars &amp; buses</span>
          </div>
          <div>
            <b>Real</b>
            <span>Reviews on Google</span>
          </div>
          <div>
            <b>Female</b>
            <span>Trip captain on group trips</span>
          </div>
        </div>
      </div>
    </section>
  );
}

type PublicTrip = {
  id: string;
  name: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
  price?: number;
  seats?: number;
  image?: string;
  description?: string;
};
const FALLBACK_TRIPS: PublicTrip[] = [
  {
    id: "goa",
    name: "Goa Trip",
    destination: "North & South Goa",
    startDate: "2026-11-21",
    endDate: "2026-11-25",
    price: 10900,
    image: img("beach-pan.jpg"),
    description: "Yacht party, water sports, sunset kayaking & North + South Goa sightseeing.",
  },
];
const dshort = (s?: string) =>
  s
    ? new Date(s + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    : "";

function UpcomingTrips() {
  const [trips, setTrips] = useState<PublicTrip[]>(FALLBACK_TRIPS);
  useEffect(() => {
    fetch("/api/public/trips")
      .then((r) => (r.ok ? r.json() : null))
      .then((t) => {
        if (Array.isArray(t) && t.length) setTrips(t);
      })
      .catch(() => {});
  }, []);
  return (
    <section className="trips" id="trips">
      <div className="wrap">
        <div className="trips__head">
          <div>
            <p className="eyebrow">Upcoming trips</p>
            <h2 className="h2 reveal-lines">
              Pick a date.
              <br />
              <span className="orange">Pack a bag.</span>
            </h2>
          </div>
          <a href="#enquire" className="btn btn--ghost-dark" data-magnetic>
            Request a custom trip
          </a>
        </div>
        <div className="trips__grid">
          {trips.map((t) => {
            const isGoa = /goa/i.test(t.name);
            return (
              <article className="tcard" key={t.id} data-tilt>
                <div className="tcard__img">
                  <img src={t.image || img("m-valley.jpg")} alt={t.name} loading="lazy" />
                  <span className="tcard__date">
                    {dshort(t.startDate)}
                    {t.endDate && ` – ${dshort(t.endDate)}`}
                  </span>
                </div>
                <div className="tcard__body">
                  <small>{t.destination}</small>
                  <h3>{t.name}</h3>
                  {t.description && <p>{t.description}</p>}
                  <div className="tcard__foot">
                    {t.price ? (
                      <span className="tcard__price">
                        <small>from</small> ₹{Number(t.price).toLocaleString("en-IN")}
                      </span>
                    ) : (
                      <span />
                    )}
                    <a
                      className="btn btn--orange"
                      href={
                        isGoa
                          ? "#goa"
                          : WHATSAPP_BOOK.replace(
                              /text=[^&]*/,
                              `text=${encodeURIComponent(`Hi Cheetah Travelz! I'm interested in ${t.name}`)}`,
                            )
                      }
                      target={isGoa ? undefined : "_blank"}
                      rel="noopener"
                    >
                      {isGoa ? "View trip" : "Book seat"}
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
          <a className="tcard tcard--custom" href="#enquire">
            <h3>Don't see your dates?</h3>
            <p>
              Tell us where and when — we'll plan a private trip for your group, with transport
              sorted.
            </p>
            <span className="btn btn--yellow">Plan my trip →</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function UpNext() {
  return (
    <div className="upnext" id="goa">
      <div className="wrap upnext__inner">
        <span className="upnext__label">Up next</span>
        <h2 className="upnext__title">
          GOA <em>TRIP</em>
        </h2>
        <span className="upnext__chip">
          21<sup>st</sup> – 24<sup>th</sup> NOV · {TRIP.length}
        </span>
        <a href="#book" className="btn btn--orange" data-magnetic data-cursor="Go">
          Reserve for {TRIP.reserve}
        </a>
      </div>
    </div>
  );
}

function Inclusions() {
  return (
    <section className="incl">
      <div className="wrap">
        <p className="eyebrow eyebrow--light">The Goa Trip includes</p>
        <h2 className="h2 h2--light reveal-lines">
          Nine reasons to
          <br />
          pack tonight.
        </h2>
        <div className="incl__grid">
          {INCLUSIONS.map((x) => (
            <div className="icard" data-tilt key={x.title}>
              <svg viewBox="0 0 64 64" dangerouslySetInnerHTML={{ __html: x.icon }} />
              <h3>{x.title}</h3>
              <p>{x.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Itinerary() {
  return (
    <section className="itin" id="itinerary">
      <div className="itin__intro wrap">
        <p className="eyebrow">The plan</p>
        <h2 className="h2 reveal-lines">
          Five days.
          <br />
          <span className="orange">Zero dull moments.</span>
        </h2>
      </div>
      <div className="itin__pin">
        <div className="itin__track" id="itinTrack">
          {ITINERARY.map((d) => (
            <article className={"day" + (d.end ? " day--end" : "")} key={d.num}>
              {d.images.length > 0 && (
                <div className={"day__media" + (d.images.length > 1 ? " day__media--stack" : "")}>
                  {d.images.map((m) => (
                    <img key={m.src} src={img(m.src)} alt={m.alt} />
                  ))}
                </div>
              )}
              <div className="day__body">
                <div className="day__num">{d.num}</div>
                <div className="day__date">{d.date}</div>
                <ul className="tl">
                  {d.stops.map((s) => (
                    <li key={s.time + s.title} className={s.hot ? "hot" : undefined}>
                      <time>{s.time}</time>
                      <b>{s.title}</b>
                      {s.note && (
                        <span>
                          {s.note}
                          {s.selfPaid && (
                            <>
                              {" "}
                              <i>(self paid)</i>
                            </>
                          )}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                {d.end && (
                  <a href="#book" className="btn btn--orange" data-magnetic>
                    I'm in — book my seat
                  </a>
                )}
              </div>
              {d.end && <img className="day__cheetah" src={img("logo.png")} alt="" />}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Sports() {
  return (
    <section className="sports">
      <div className="sports__head wrap">
        <p className="eyebrow eyebrow--light">Day 3 · Adrenaline</p>
        <h2 className="h2 h2--light reveal-lines">
          Hold on <span className="yellow">tight.</span>
        </h2>
      </div>
      <div className="sports__cards">
        {SPORTS.map((s) => (
          <div className="scard" key={s.title} style={css({ "--bg": `url(${img(s.img)})` })}>
            <div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Stay() {
  return (
    <section className="stay" id="stay">
      <div className="wrap">
        <p className="eyebrow">Stay</p>
        <h2 className="h2 reveal-lines">
          Premium 3★
          <br />
          <span className="orange">hotel / resort.</span>
        </h2>
        <p className="stay__note reveal">
          Clean, comfortable triple-sharing rooms grouped by gender — one double bed plus a
          sofa-cum-bed / mattress. Pool included. Bad decisions not.
        </p>
        <div className="stay__grid">
          {STAY.map((s) => (
            <figure
              key={s.src}
              className={"clipreveal" + (s.big ? " stay__big" : "")}
              data-cursor={s.big ? "Dive" : undefined}
            >
              <img src={img(s.src)} alt={s.alt} />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section className="gallery" id="gallery">
      <div className="wrap gallery__head">
        <p className="eyebrow eyebrow--light">Real trips · real people</p>
        <h2 className="h2 h2--light reveal-lines">
          Strangers on day one.
          <br />
          <span className="yellow">Gang by day two.</span>
        </h2>
      </div>
      <div className="gallery__cols">
        {GALLERY.map((col, i) => (
          <div className="gcol" data-gspeed={col.speed} key={i}>
            {col.imgs.map(([src, alt]) => (
              <img key={src} src={img(src)} alt={alt} />
            ))}
          </div>
        ))}
      </div>
      <a
        className="btn btn--yellow gallery__ig"
        href={CONTACT.instagram}
        target="_blank"
        rel="noopener"
        data-magnetic
        data-cursor="IG"
      >
        Check our IG highlights →
      </a>
    </section>
  );
}

function Reel() {
  return (
    <section className="reel" id="reel" hidden>
      <div className="wrap">
        <p className="eyebrow">The reel</p>
        <h2 className="h2 reveal-lines">
          Goa in <span className="orange">30 seconds.</span>
        </h2>
        <div className="reel__frame">
          <video
            id="reelVideo"
            src="/assets/video/promo.mp4"
            poster="/assets/video/promo-poster.jpg"
            muted
            loop
            playsInline
            preload="metadata"
            data-cursor="Play"
          />
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section className="reviews">
      <div className="wrap">
        <p className="eyebrow">Testimonials</p>
        <h2 className="h2 reveal-lines">
          Don't take <span className="orange">our</span> word for it.
        </h2>
      </div>
      <div className="reviews__rail" id="reviewsRail" data-cursor="Drag">
        {REVIEWS.map((r) => (
          <blockquote key={r.who} className={"rcard" + (r.tone ? ` rcard--${r.tone}` : "")}>
            <div className="stars">{r.chat ? "💬" : "★★★★★"}</div>
            <p>{r.text}</p>
            <cite>{r.who}</cite>
          </blockquote>
        ))}
      </div>
      <div className="wrap">
        <a className="link" href={CONTACT.google} target="_blank" rel="noopener">
          Check our Google profile for more →
        </a>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="pricing" id="pricing">
      <div className="wrap">
        <p className="eyebrow eyebrow--light">Trip price</p>
        <h2 className="h2 h2--light reveal-lines">Pick your ride.</h2>
        <div className="prices">
          {PRICES.map((p) => (
            <div className={"pcard" + (p.hot ? " pcard--hot" : "")} data-tilt key={p.amount}>
              {p.hot && <div className="pcard__tag">Most popular</div>}
              <h3>{p.title}</h3>
              <div className="pcard__amt">
                <small>₹</small>
                <span className="count" data-to={p.amount}>
                  {p.amount.toLocaleString("en-IN")}
                </span>
              </div>
              <p>{p.sub}</p>
            </div>
          ))}
        </div>
        <div className="inc">
          <div className="inc__col">
            <h4>What's included</h4>
            <ul className="ticks">
              {INCLUDED.map(([b, t]) => (
                <li key={b}>
                  <b>{b}</b> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="inc__col inc__col--no">
            <h4>Not included</h4>
            <ul className="crosses">
              {NOT_INCLUDED.map(([b, t]) => (
                <li key={b}>
                  <b>{b}</b> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Book() {
  return (
    <section className="book" id="book">
      <div className="wrap book__grid">
        <div>
          <p className="eyebrow">How to book</p>
          <h2 className="h2 reveal-lines">
            Two steps.
            <br />
            <span className="orange">One seat.</span>
          </h2>
          <ol className="steps">
            <li>
              <span>01</span>
              <div>
                <h4>Reserve your seat</h4>
                <p>
                  <b className="big">{TRIP.reserve}</b> per person. Balance payable at departure.
                </p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h4>Pay &amp; send the screenshot</h4>
                <p>
                  Pay via UPI <b data-site="upi">{CONTACT.upi}</b> (or ask us for bank-transfer
                  details), then WhatsApp the payment screenshot to{" "}
                  <b data-site="phone">{CONTACT.phone}</b> for your booking confirmation.
                </p>
              </div>
            </li>
          </ol>
          <div className="book__ctas">
            <a
              className="btn btn--orange"
              href={WHATSAPP_BOOK}
              target="_blank"
              rel="noopener"
              data-magnetic
              data-cursor="Chat"
            >
              WhatsApp {CONTACT.phone}
            </a>
            <a className="btn btn--ghost-dark" href={`tel:+${CONTACT.phoneRaw}`} data-magnetic>
              Call us
            </a>
          </div>
          <p className="book__alt">
            Prefer a form? <a href="#enquire">Request your seat online</a> — you can add a referral
            code there.
          </p>
        </div>
        <div className="book__card" data-tilt>
          <img src={img("logo.png")} alt="" />
          <div className="book__amt">
            {TRIP.reserve}
            <small>/person</small>
          </div>
          <p>confirms your seat</p>
          <div className="book__upi">UPI · 7208578110</div>
          <p className="book__fine">Seats allotted first-come, first-served.</p>
        </div>
      </div>
    </section>
  );
}

function Terms() {
  return (
    <section className="terms">
      <div className="wrap">
        <p className="eyebrow">The fine print</p>
        <h2 className="h2 h2--sm">Terms &amp; conditions</h2>
        <div className="acc">
          {TERMS.map(([title, paras]) => (
            <details key={title}>
              <summary>{title}</summary>
              {paras.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <>
      <footer className="foot">
        <div className="foot__big" aria-hidden="true">
          CHEETAH TRAVELZ
        </div>
        <div className="wrap foot__cols">
          <div className="foot__brand">
            <img src={img("logo.png")} alt="" />
            <p>
              MSME-registered travel agency from Mumbai. Solo &amp; private group trips, weekend
              getaways and chauffeur-driven cars &amp; buses across India.
            </p>
          </div>
          <div>
            <h4>Destinations</h4>
            <ul>
              {DESTINATIONS.map((d) => (
                <li key={d.name}>
                  <a href={d.next ? "#goa" : "#enquire"}>{d.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li>
                <a href="#services">Services</a>
              </li>
              <li>
                <a href="#trips">Upcoming trips</a>
              </li>
              <li>
                <a href="#gallery">Gallery</a>
              </li>
              <li>
                <a href="#enquire">Contact us</a>
              </li>
              <li>
                <a href={CONTACT.google} target="_blank" rel="noopener">
                  Google reviews
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Get in touch</h4>
            <ul>
              <li>
                <a href={`tel:+${CONTACT.phoneRaw}`} data-site="phone">
                  {CONTACT.phone}
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${CONTACT.phoneRaw}`} target="_blank" rel="noopener">
                  WhatsApp us
                </a>
              </li>
              <li>
                <a href={CONTACT.instagram} target="_blank" rel="noopener">
                  @cheetahtravelz
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="wrap foot__row">
          <div className="foot__links">
            <a href={CONTACT.instagram} target="_blank" rel="noopener" data-magnetic>
              Instagram
            </a>
            <a
              href={`https://wa.me/${CONTACT.phoneRaw}`}
              target="_blank"
              rel="noopener"
              data-magnetic
            >
              WhatsApp
            </a>
            <a href={CONTACT.google} target="_blank" rel="noopener" data-magnetic>
              Google
            </a>
            <a href={`tel:+${CONTACT.phoneRaw}`} data-magnetic data-site="phone">
              {CONTACT.phone}
            </a>
          </div>
        </div>
        <p className="foot__fine wrap">
          © {new Date().getFullYear()} Cheetah Travelz · MSME Registered
        </p>
        <div className="foot__credit wrap">
          <p>Website created by Shabnam Mamdani.</p>
          <p>To get in touch, contact Shabnam Mamdani:</p>
          <ul>
            <li>
              Phone:{" "}
              <a href="tel:84452033656" data-static-contact>
                84452033656
              </a>
            </li>
            <li>
              Email:{" "}
              <a href="mailto:shabnammamdani07@gmail.com" data-static-contact>
                shabnammamdani07@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </footer>
      <a
        className="wa-float"
        href={`https://wa.me/${CONTACT.phoneRaw}`}
        target="_blank"
        rel="noopener"
        aria-label="Chat on WhatsApp"
        data-magnetic
      >
        <svg viewBox="0 0 32 32">
          <path d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.6a10.6 10.6 0 0 1-5.4-1.5l-.4-.2-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1 1 16 26.6zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7 6.3 6.3 0 0 0 1.3 3.3 14.3 14.3 0 0 0 5.5 4.9c2 .9 2.8.9 3.8.8a3.2 3.2 0 0 0 2.1-1.5 2.6 2.6 0 0 0 .2-1.5c-.1-.2-.3-.3-.6-.4z" />
        </svg>
      </a>
    </>
  );
}

function PalmSymbol() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }}>
      <symbol id="palm" viewBox="0 0 300 600">
        <path
          d="M150 600 C 148 470 140 330 160 190"
          fill="none"
          stroke="currentColor"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path d="M160 190 C 110 150 50 160 0 210 C 60 180 110 185 160 200Z" />
        <path d="M160 190 C 120 120 60 100 10 110 C 70 120 120 150 160 200Z" />
        <path d="M160 190 C 170 120 210 80 270 70 C 220 100 190 140 162 200Z" />
        <path d="M160 190 C 210 160 260 170 300 220 C 250 195 205 190 160 200Z" />
        <path d="M160 190 C 150 130 160 70 200 20 C 180 80 172 140 162 200Z" />
        <path d="M160 195 C 130 210 100 260 95 310 C 115 260 140 225 162 205Z" />
        <path d="M162 195 C 200 215 225 260 225 310 C 210 265 190 230 160 205Z" />
      </symbol>
    </svg>
  );
}

export default function SiteHome() {
  // GSAP/Lenis touch window, so load them only in the browser (this page is also server-rendered).
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let dead = false;
    import("./siteEffects").then((m) => {
      if (!dead) cleanup = m.initSite();
    });
    return () => {
      dead = true;
      cleanup?.();
    };
  }, []);
  useSiteInfo();
  return (
    <>
      <Chrome />
      <main id="top">
        <Hero />
        <Marquee />
        <Services />
        <Destinations />
        <UpcomingTrips />
        <About />
        {/* Featured trip: Goa */}
        <UpNext />
        <Inclusions />
        <Itinerary />
        <Sports />
        <Stay />
        <Pricing />
        <Book />
        {/* Agency-wide */}
        <Gallery />
        <Reel />
        <Reviews />
        <Enquire />
        <Terms />
      </main>
      <Footer />
      <PalmSymbol />
    </>
  );
}
