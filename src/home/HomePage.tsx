import { useEffect, useRef, useState } from "react";

import {
  ANCHOR,
  AUDIENCES,
  BENEFITS,
  CONTACT,
  DESTINATIONS,
  JOURNEYS,
  MEMORIES,
  REVIEWS,
  SERVICES,
  VEHICLES,
  WHATSAPP,
  img,
  upcomingTrips,
} from "./data";
import { HolidayForm, VehicleForm } from "./EnquiryForms";
import { Icon, VehicleArt, WhatsAppIcon } from "./Icon";
import { track } from "./track";

/*
 * Cheetah Travelz homepage — built from "Homepage Design & Mobile Wireframe" v1.0.
 * Section order is fixed by the design: Header › Hero › Services › Upcoming Group Trips ›
 * Customized Holidays › Cars & Buses › Why Cheetah › Memories › Reviews › About › Final CTA › Footer.
 */

const SERVICE_ICON: Record<string, string> = {
  trips: "users",
  holidays: "compass",
  transport: "car",
};
const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

function scrollToId(hash: string) {
  const el = document.querySelector(hash);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------------- 1 · Header + mobile menu ---------------- */
const NAV = [
  { label: "Home", href: "#top" },
  { label: "Solo Group Trips", href: ANCHOR.trips, service: true },
  { label: "Customized Holidays", href: ANCHOR.holidays, service: true },
  { label: "Cars & Buses", href: ANCHOR.transport, service: true },
  { label: "About Us", href: ANCHOR.about },
  { label: "Contact Us", href: ANCHOR.contact },
];

function Header() {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        btn.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="ct-header">
      <div className="ct-wrap ct-header__row">
        <a href="#top" className="ct-logo" aria-label="Cheetah Travelz — home">
          <img src={img("logo.png")} alt="" width={40} height={40} />
          <span>
            CHEETAH <b>TRAVELZ</b>
          </span>
        </a>
        <nav className="ct-nav" aria-label="Main">
          {NAV.slice(1).map((n) => (
            <a key={n.label} href={n.href} className={n.service ? "is-service" : undefined}>
              {n.label}
            </a>
          ))}
        </nav>
        <a
          className="ct-btn ct-btn--wa ct-header__wa"
          href={WHATSAPP}
          target="_blank"
          rel="noopener"
          onClick={() => track("whatsapp_click", { location: "header" })}
        >
          <WhatsAppIcon size={18} /> <span>WhatsApp</span>
        </a>
        <button
          ref={btn}
          className="ct-burger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="ct-menu"
          onClick={() => setOpen(!open)}
        >
          <Icon name={open ? "close" : "menu"} size={26} />
        </button>
      </div>

      <div id="ct-menu" className={`ct-menu ${open ? "is-open" : ""}`} hidden={!open}>
        <div className="ct-menu__head">
          <span className="ct-logo ct-logo--light">
            <img src={img("logo.png")} alt="" width={40} height={40} />
            <span>
              CHEETAH <b>TRAVELZ</b>
            </span>
          </span>
          <button
            className="ct-burger ct-burger--light"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <Icon name="close" size={26} />
          </button>
        </div>
        <nav aria-label="Mobile">
          {NAV.map((n, i) => (
            <a
              key={n.label}
              ref={i === 0 ? firstLink : undefined}
              href={n.href}
              className={n.service ? "is-service" : undefined}
              onClick={() => setOpen(false)}
            >
              {n.label}
              <Icon name="chevron" size={20} />
            </a>
          ))}
        </nav>
        <div className="ct-menu__foot">
          <a
            className="ct-btn ct-btn--white ct-btn--block"
            href={WHATSAPP}
            target="_blank"
            rel="noopener"
            onClick={() => track("whatsapp_click", { location: "menu" })}
          >
            <span className="ct-wa-dot">
              <WhatsAppIcon size={18} />
            </span>{" "}
            Enquire on WhatsApp
          </a>
          <a className="ct-menu__social" href={CONTACT.instagram} target="_blank" rel="noopener">
            <Icon name="instagram" size={18} /> Instagram
          </a>
        </div>
      </div>
    </header>
  );
}

/* ---------------- 2 · Hero ---------------- */
function Hero() {
  const buttons = [
    {
      label: "Explore Group Trips",
      href: ANCHOR.trips,
      icon: "users",
      event: "cta_group_trips_click",
    },
    {
      label: "Plan Your Holiday",
      href: ANCHOR.holidays,
      icon: "compass",
      event: "cta_holiday_click",
    },
    {
      label: "Explore Transport",
      href: ANCHOR.transport,
      icon: "car",
      event: "cta_transport_click",
    },
  ];
  return (
    <section className="ct-hero" aria-labelledby="hero-title">
      <img
        className="ct-hero__img"
        src={img("hero-travel.jpg")}
        alt="Travellers on a green mountain meadow below snow-capped peaks"
        fetchPriority="high"
      />
      <div className="ct-hero__shade" />
      <div className="ct-wrap ct-hero__content">
        <span className="ct-hero__bar" />
        <p className="ct-hero__eyebrow">Group Trips · Custom Holidays · Cars &amp; Buses</p>
        <h1 id="hero-title">
          Your Journey.
          <br />
          Your Way.
        </h1>
        <p className="ct-hero__copy">
          From unforgettable group adventures to personalised holidays and private travel
          experiences – we make every journey special.
        </p>
        <div className="ct-hero__ctas">
          {buttons.map((b) => (
            <a
              key={b.label}
              href={b.href}
              className="ct-btn ct-btn--primary ct-btn--hero"
              onClick={(e) => {
                e.preventDefault();
                track(b.event, { location: "hero" });
                scrollToId(b.href);
              }}
            >
              <Icon name={b.icon} size={20} />
              <span>{b.label}</span>
              <Icon name="chevron" size={18} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- 3 · Explore Our Services ---------------- */
function Services() {
  return (
    <section className="ct-section" aria-labelledby="services-title">
      <div className="ct-wrap">
        <p className="ct-eyebrow">Explore our services</p>
        <h2 id="services-title" className="ct-h2">
          Travel, Your Way.
        </h2>
        <p className="ct-lead">Whatever the journey looks like, we have a way to make it happen.</p>
        <div className="ct-services">
          {SERVICES.map((s) => (
            <article key={s.key} className="ct-card ct-service">
              <a
                href={s.href}
                className="ct-card__hit"
                aria-label={`${s.title} — ${s.cta}`}
                onClick={() => track(s.event, { location: "service_card" })}
              />
              <div className="ct-service__img">
                <img src={img(s.image)} alt={s.alt} loading="lazy" />
                <span className="ct-service__n">{s.n}</span>
              </div>
              <div className="ct-service__body">
                <h3 className="ct-h3">
                  <Icon name={SERVICE_ICON[s.key] ?? "users"} size={18} /> {s.title}
                </h3>
                <p>{s.text}</p>
                <span className="ct-btn ct-btn--primary ct-btn--block ct-btn--sm">{s.cta}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- 4 · Upcoming Group Trips ---------------- */
function UpcomingTrips() {
  const trips = upcomingTrips();
  return (
    <section id="group-trips" className="ct-section ct-section--grey" aria-labelledby="trips-title">
      <div className="ct-wrap">
        <p className="ct-eyebrow">Upcoming group trips</p>
        <h2 id="trips-title" className="ct-h2">
          Find Your Next Adventure.
        </h2>
        <p className="ct-lead">
          Join a group of like-minded travellers and turn a new destination into a shared memory.
        </p>
        {trips.length === 0 ? (
          <div className="ct-empty">
            <p>New departures are being planned. Ask us what's coming up next.</p>
            <a className="ct-btn ct-btn--secondary" href={WHATSAPP} target="_blank" rel="noopener">
              Ask on WhatsApp
            </a>
          </div>
        ) : (
          <div className="ct-trips" data-count={trips.length}>
            {trips.map((t) => (
              <article key={t.slug} className="ct-card ct-trip">
                <div className="ct-trip__img">
                  <img src={img(t.image)} alt={t.alt} loading="lazy" />
                  <span className="ct-chip ct-chip--navy">{t.chip}</span>
                </div>
                <div className="ct-trip__body">
                  <h3 className="ct-h3">{t.name}</h3>
                  <p className="ct-trip__meta">
                    <Icon name="calendar" size={15} /> {t.dateLabel}{" "}
                    <span aria-hidden="true">|</span> {t.duration}
                  </p>
                  <p className="ct-trip__price">Starting from {inr(t.priceFrom)}</p>
                  <p className="ct-trip__note">{t.priceNote}</p>
                  <div className="ct-trip__row">
                    <span>
                      <Icon name="pin" size={15} /> {t.departure}
                    </span>
                    {t.ageGroup && <span>Age group: {t.ageGroup}</span>}
                    {t.seats !== undefined && <span>{t.seats} seats left</span>}
                  </div>
                  <a
                    href={t.href}
                    className="ct-btn ct-btn--outline ct-btn--block"
                    onClick={() => track("trip_detail_click", { trip: t.slug })}
                  >
                    View Details
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------- 5 · Customized Holidays ---------------- */
function Holidays() {
  const [destination, setDestination] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const focusForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(
      () =>
        formRef.current
          ?.querySelector<HTMLInputElement>("input[name=name]")
          ?.focus({ preventScroll: true }),
      500,
    );
  };
  return (
    <section id="holidays" className="ct-section" aria-labelledby="holidays-title">
      <div className="ct-wrap ct-split">
        <div>
          <div className="ct-banner">
            <img
              src={img("g-boat.jpg")}
              alt="Friends enjoying a private boat ride on holiday"
              loading="lazy"
            />
            <span className="ct-chip ct-chip--orange">Customized Holidays</span>
          </div>
          <h2 id="holidays-title" className="ct-h2 ct-mt">
            Your Dates. Your Destination. Your Kind of Holiday.
          </h2>
          <p className="ct-lead">
            From romantic escapes to family vacations and private group getaways, we create holidays
            around your preferences.
          </p>
          <ul className="ct-chips" aria-label="Who it's for">
            {AUDIENCES.map((a) => (
              <li key={a} className="ct-chip">
                {a}
              </li>
            ))}
          </ul>
          <p className="ct-eyebrow ct-mt">Destination inspiration</p>
          <div className="ct-dests">
            {DESTINATIONS.map((d) => (
              <button
                key={d.name}
                type="button"
                className="ct-dest"
                onClick={() => {
                  setDestination(d.name);
                  track("holiday_destination_click", { destination: d.name });
                  focusForm();
                }}
                aria-label={`Plan a holiday to ${d.name}`}
              >
                <img src={img(d.image)} alt={d.alt} loading="lazy" />
                <span>{d.name}</span>
              </button>
            ))}
          </div>
          <p className="ct-note">Destinations are inspiration, not fixed packages.</p>
          <button
            type="button"
            className="ct-btn ct-btn--primary ct-btn--block ct-mt"
            onClick={() => {
              track("cta_holiday_click", { location: "holidays_section" });
              focusForm();
            }}
          >
            Get Your Customised Package <Icon name="chevron" size={18} />
          </button>
        </div>
        <div className="ct-formpanel">
          <HolidayForm
            destination={destination}
            setDestination={setDestination}
            formRef={formRef}
          />
        </div>
      </div>
    </section>
  );
}

/* ---------------- 6 · Cars & Buses ---------------- */
function Transport() {
  const [vehicle, setVehicle] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const focusForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(
      () =>
        formRef.current
          ?.querySelector<HTMLInputElement>("input[name=name]")
          ?.focus({ preventScroll: true }),
      500,
    );
  };
  return (
    <section
      id="transport"
      className="ct-section ct-section--navy"
      aria-labelledby="transport-title"
    >
      <div className="ct-wrap ct-split">
        <div>
          <p className="ct-eyebrow">Cars &amp; Buses</p>
          <h2 id="transport-title" className="ct-h2 ct-h2--light">
            Your Journey Deserves a Comfortable Ride.
          </h2>
          <p className="ct-lead ct-lead--light">
            From private city transfers to outstation journeys and group transportation, travel
            comfortably with our chauffeur-driven vehicles.
          </p>
          <div className="ct-vehicles">
            {VEHICLES.map((v) => (
              <button
                key={v}
                type="button"
                className={`ct-vehicle ${vehicle === v ? "is-selected" : ""}`}
                onClick={() => {
                  setVehicle(v);
                  track("vehicle_category_click", { vehicle: v });
                  focusForm();
                }}
                aria-label={`Get a quote for ${v}`}
              >
                <VehicleArt kind={v} />
                <span>
                  {v} <Icon name="chevron" size={16} />
                </span>
              </button>
            ))}
          </div>
          <p className="ct-eyebrow ct-eyebrow--light ct-mt">Journeys we cover</p>
          <ul className="ct-journeys">
            {JOURNEYS.map((j) => (
              <li key={j}>{j}</li>
            ))}
          </ul>
          <button
            type="button"
            className="ct-btn ct-btn--primary ct-btn--block ct-mt"
            onClick={() => {
              track("cta_transport_click", { location: "transport_section" });
              focusForm();
            }}
          >
            Get a Vehicle Quote <Icon name="chevron" size={18} />
          </button>
        </div>
        <div className="ct-formpanel">
          <VehicleForm vehicle={vehicle} setVehicle={setVehicle} formRef={formRef} />
        </div>
      </div>
    </section>
  );
}

/* ---------------- 7 · Why Cheetah ---------------- */
function Why() {
  return (
    <section className="ct-section ct-section--grey" aria-labelledby="why-title">
      <div className="ct-wrap">
        <p className="ct-eyebrow">Why Cheetah Travelz</p>
        <h2 id="why-title" className="ct-h2">
          Why Travel With Cheetah?
        </h2>
        <p className="ct-lead">
          Every journey deserves thoughtful planning, reliable support and experiences worth
          remembering.
        </p>
        <ul className="ct-benefits">
          {BENEFITS.map((b) => (
            <li key={b.title} className="ct-card ct-benefit">
              <span className="ct-benefit__icon">
                <Icon name={b.icon} size={22} />
              </span>
              <div>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- 8 · Our Travel Memories ---------------- */
function Memories() {
  return (
    <section className="ct-section" aria-labelledby="memories-title">
      <div className="ct-wrap">
        <p className="ct-eyebrow">Our travel memories</p>
        <h2 id="memories-title" className="ct-h2">
          Moments That Make the Journey.
        </h2>
        <p className="ct-lead">
          Every destination has a story. Here are a few moments from journeys we've been part of.
        </p>
        <div className="ct-memories">
          {MEMORIES.map((m) => (
            <figure key={m.image} className="ct-memory">
              <img src={img(m.image)} alt={m.alt} loading="lazy" />
              <figcaption>{m.label}</figcaption>
            </figure>
          ))}
        </div>
        <div className="ct-center">
          <a
            className="ct-btn ct-btn--outline"
            href={CONTACT.instagram}
            target="_blank"
            rel="noopener"
            onClick={() => track("memories_click")}
          >
            Explore More Memories
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 9 · Traveller Reviews ---------------- */
function Reviews() {
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const onScroll = () => {
    const el = rail.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const w = card ? card.offsetWidth + 16 : el.clientWidth;
    setActive(Math.round(el.scrollLeft / w));
  };
  const goTo = (i: number) => {
    const el = rail.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };
  return (
    <section className="ct-section ct-section--grey" aria-labelledby="reviews-title">
      <div className="ct-wrap">
        <p className="ct-eyebrow">Traveller reviews</p>
        <h2 id="reviews-title" className="ct-h2">
          Real Journeys. Real Experiences.
        </h2>
        <p className="ct-lead">
          The best part of every journey is hearing what our travellers take back with them.
        </p>
        <div
          className="ct-reviews"
          ref={rail}
          onScroll={onScroll}
          tabIndex={0}
          aria-label="Google reviews — swipe for more"
        >
          {REVIEWS.map((r) => (
            <figure key={r.name} className="ct-card ct-review">
              <div className="ct-review__stars" aria-label="Rated 5 out of 5 on Google">
                {Array.from({ length: 5 }, (_, i) => (
                  <Icon key={i} name="star" size={16} />
                ))}
              </div>
              <blockquote>{r.text}</blockquote>
              <figcaption>
                <strong>{r.name}</strong>
                <span>Source: Google</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="ct-dots" role="tablist" aria-label="Choose review">
          {REVIEWS.map((r, i) => (
            <button
              key={r.name}
              role="tab"
              aria-selected={active === i}
              aria-label={`Review ${i + 1} of ${REVIEWS.length}`}
              className={active === i ? "is-active" : undefined}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <div className="ct-center">
          <a
            className="ct-btn ct-btn--secondary"
            href={CONTACT.google}
            target="_blank"
            rel="noopener"
            onClick={() => track("reviews_click")}
          >
            <Icon name="star" size={18} /> Read Google Reviews
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 10 · About ---------------- */
function About() {
  return (
    <section id="about" className="ct-section" aria-labelledby="about-title">
      <div className="ct-wrap ct-split ct-split--center">
        <div className="ct-banner">
          <img
            src={img("g-daman.jpg")}
            alt="Cheetah Travelz travellers together on the Daman trip"
            loading="lazy"
          />
        </div>
        <div>
          <p className="ct-eyebrow">About Cheetah Travelz</p>
          <h2 id="about-title" className="ct-h2">
            More Than Just Getting There.
          </h2>
          <p className="ct-lead">
            Whether you meet new people on a group adventure, enjoy a customised holiday with loved
            ones or arrange a private ride, we make travel easier and more memorable.
          </p>
          <div className="ct-trio">
            {SERVICES.map((s) => (
              <a key={s.key} href={s.href} className="ct-trio__tile">
                <Icon name={SERVICE_ICON[s.key] ?? "users"} size={22} />
                <span>
                  {s.key === "trips"
                    ? "Group trips"
                    : s.key === "holidays"
                      ? "Custom holidays"
                      : "Cars & buses"}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 11 · Final CTA ---------------- */
function FinalCta() {
  const buttons = [
    {
      label: "Explore Group Trips",
      href: ANCHOR.trips,
      icon: "users",
      event: "final_cta_group_trips",
    },
    {
      label: "Plan a Custom Holiday",
      href: ANCHOR.holidays,
      icon: "compass",
      event: "final_cta_holiday",
    },
    {
      label: "Get a Vehicle Quote",
      href: ANCHOR.transport,
      icon: "car",
      event: "final_cta_transport",
    },
  ];
  return (
    <section className="ct-final" aria-labelledby="final-title">
      <div className="ct-wrap">
        <span className="ct-hero__bar" />
        <h2 id="final-title" className="ct-h2 ct-h2--light">
          Where Would You Like to Go Next?
        </h2>
        <p className="ct-lead ct-lead--light">
          Whatever your travel plans look like, let's make them happen.
        </p>
        <div className="ct-final__ctas">
          {buttons.map((b) => (
            <a
              key={b.label}
              href={b.href}
              className="ct-btn ct-btn--primary ct-btn--hero"
              onClick={() => track(b.event)}
            >
              <Icon name={b.icon} size={20} />
              <span>{b.label}</span>
              <Icon name="chevron" size={18} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- 12 · Footer ---------------- */
function Footer() {
  return (
    <footer id="contact" className="ct-footer">
      <div className="ct-wrap ct-footer__grid">
        <div>
          <span className="ct-logo ct-logo--light">
            <img src={img("logo.png")} alt="" width={44} height={44} />
            <span>
              CHEETAH <b>TRAVELZ</b>
            </span>
          </span>
          <p className="ct-footer__tag">
            Making every journey memorable through group adventures, personalised holidays and
            private transportation.
          </p>
        </div>
        <div>
          <h3>Quick links</h3>
          <ul>
            {NAV.map((n) => (
              <li key={n.label}>
                <a href={n.href}>{n.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Contact</h3>
          <ul>
            <li>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener"
                onClick={() => track("whatsapp_click", { location: "footer" })}
              >
                <WhatsAppIcon size={16} /> WhatsApp
              </a>
            </li>
            <li>
              <a href={`tel:+${CONTACT.phoneRaw}`}>
                <Icon name="phone" size={16} /> {CONTACT.phone}
              </a>
            </li>
            <li>
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener"
                onClick={() => track("social_click", { network: "instagram" })}
              >
                <Icon name="instagram" size={16} /> Instagram
              </a>
            </li>
            <li>
              <a
                href={CONTACT.google}
                target="_blank"
                rel="noopener"
                onClick={() => track("social_click", { network: "google" })}
              >
                <Icon name="star" size={16} /> Google Reviews
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3>Policies</h3>
          <ul>
            <li>
              <a href="/goa-trip#terms">Terms &amp; Conditions</a>
            </li>
            <li>
              <a href="/goa-trip#terms">Cancellation &amp; Refund Policy</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="ct-wrap ct-footer__bottom">
        <p>© {new Date().getFullYear()} Cheetah Travelz. All rights reserved. · MSME Registered</p>
        <p className="ct-credit">
          Website created by Shabnam Mamdani. To get in touch, contact Shabnam Mamdani: Phone:{" "}
          <a href="tel:84452033656">84452033656</a> · Email:{" "}
          <a href="mailto:shabnammamdani07@gmail.com">shabnammamdani07@gmail.com</a>
        </p>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <div className="ct" id="top">
      <Header />
      <main>
        <Hero />
        <Services />
        <UpcomingTrips />
        <Holidays />
        <Transport />
        <Why />
        <Memories />
        <Reviews />
        <About />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
