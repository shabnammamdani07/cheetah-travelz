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
  ROUTES,
  SERVICES,
  VEHICLES,
  WHATSAPP,
  img,
  upcomingTrips,
} from "./data";
import { Link } from "@tanstack/react-router";

import { HolidayForm, VehicleForm } from "./EnquiryForms";
import { SiteFooter, SiteHeader } from "./Layout";
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
  if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
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
              <Link
                to={s.href}
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
                  <Link
                    to="/trips/$slug"
                    params={{ slug: t.slug }}
                    className="ct-btn ct-btn--outline ct-btn--block"
                    onClick={() => track("trip_detail_click", { trip: t.slug })}
                  >
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
        <div className="ct-center">
          <Link
            to="/group-trips"
            className="ct-link ct-link--caps"
            onClick={() => track("cta_group_trips_click", { location: "view_all" })}
          >
            View All Group Trips
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 5 · Customized Holidays ---------------- */
export function Holidays({ compact = false }: { compact?: boolean } = {}) {
  const [destination, setDestination] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const focusForm = () => {
    formRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
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
      id="holidays"
      className="ct-section"
      aria-labelledby={compact ? undefined : "holidays-title"}
      aria-label={compact ? "Destination inspiration and holiday enquiry" : undefined}
    >
      <div className="ct-wrap ct-split">
        <div>
          {!compact && (
            <>
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
                From romantic escapes to family vacations and private group getaways, we create
                holidays around your preferences.
              </p>
              <ul className="ct-chips" aria-label="Who it's for">
                {AUDIENCES.map((a) => (
                  <li key={a} className="ct-chip">
                    {a}
                  </li>
                ))}
              </ul>
            </>
          )}
          <p className={compact ? "ct-eyebrow" : "ct-eyebrow ct-mt"}>Destination inspiration</p>
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
export function Transport({ compact = false }: { compact?: boolean } = {}) {
  const [vehicle, setVehicle] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const focusForm = () => {
    formRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
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
      aria-labelledby={compact ? undefined : "transport-title"}
      aria-label={compact ? "Vehicles and quote form" : undefined}
    >
      <div className="ct-wrap ct-split">
        <div>
          {compact ? (
            <p className="ct-eyebrow">Choose a vehicle</p>
          ) : (
            <>
              <p className="ct-eyebrow">Cars &amp; Buses</p>
              <h2 id="transport-title" className="ct-h2 ct-h2--light">
                Your Journey Deserves a Comfortable Ride.
              </h2>
              <p className="ct-lead ct-lead--light">
                From private city transfers to outstation journeys and group transportation, travel
                comfortably with our chauffeur-driven vehicles.
              </p>
            </>
          )}
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
export function Memories() {
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
    if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "auto" });
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
          <Link
            to="/reviews"
            className="ct-btn ct-btn--outline"
            onClick={() => track("reviews_click", { target: "all_reviews" })}
          >
            View All Reviews
          </Link>
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
              <Link key={s.key} to={s.href} className="ct-trio__tile">
                <Icon name={SERVICE_ICON[s.key] ?? "users"} size={22} />
                <span>
                  {s.key === "trips"
                    ? "Group trips"
                    : s.key === "holidays"
                      ? "Custom holidays"
                      : "Cars & buses"}
                </span>
              </Link>
            ))}
          </div>
          <Link
            to="/about"
            className="ct-btn ct-btn--outline ct-btn--block ct-mt"
            onClick={() => track("about_click")}
          >
            Get to Know Us
          </Link>
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
      href: ROUTES.trips,
      icon: "users",
      event: "final_cta_group_trips",
    },
    {
      label: "Plan a Custom Holiday",
      href: ROUTES.holidays,
      icon: "compass",
      event: "final_cta_holiday",
    },
    {
      label: "Get a Vehicle Quote",
      href: ROUTES.transport,
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
            <Link
              key={b.label}
              to={b.href}
              className="ct-btn ct-btn--primary ct-btn--hero"
              onClick={() => track(b.event)}
            >
              <Icon name={b.icon} size={20} />
              <span>{b.label}</span>
              <Icon name="chevron" size={18} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="ct" id="top">
      <SiteHeader />
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
      <SiteFooter />
    </div>
  );
}
