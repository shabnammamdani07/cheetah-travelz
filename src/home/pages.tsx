import { Link } from "@tanstack/react-router";

import { getPost, POSTS } from "./blog";
import {
  AUDIENCES,
  CONTACT,
  MEMORIES,
  REVIEWS,
  ROUTES,
  SERVICES,
  WHATSAPP,
  img,
  upcomingTrips,
  type Departure,
} from "./data";
import { Holidays, Transport } from "./HomePage";
import { Icon, WhatsAppIcon } from "./Icon";
import { PageShell } from "./Layout";
import { ContactForm, TripBookingForm } from "./MoreForms";
import { canBookOnline, getTrip, isPast, PLANNED_TRIPS } from "./trips";
import { track } from "./track";
import { TERMS } from "@/site/content";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
const wa = (text: string) => `https://wa.me/${CONTACT.phoneRaw}?text=${encodeURIComponent(text)}`;
const fmtDate = (s: string) =>
  new Date(s + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/* ---------- shared trip card ---------- */
export function TripCard({ t }: { t: Departure }) {
  return (
    <article className="ct-card ct-trip">
      <div className="ct-trip__img">
        <img src={img(t.image)} alt={t.alt} loading="lazy" />
        <span className="ct-chip ct-chip--navy">{t.chip}</span>
      </div>
      <div className="ct-trip__body">
        <h3 className="ct-h3">{t.name}</h3>
        <p className="ct-trip__meta">
          <Icon name="calendar" size={15} /> {t.dateLabel} <span aria-hidden="true">|</span>{" "}
          {t.duration}
        </p>
        <p className="ct-trip__price">{t.priceFrom === null ? "Enquire for price" : `Starting from ${inr(t.priceFrom)}`}</p>
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
  );
}

/* The trip whose full day-by-day plan is shown on the Explore Group Trips page. */
export const FEATURED_TRIP_SLUG = "goa-girls-dec-2026";

/* ---------- 2 · Solo Group Trips listing ---------- */
export function TripsPage() {
  const trips = upcomingTrips(undefined, Infinity);
  const featuredTrips = [FEATURED_TRIP_SLUG, "goa-christmas-dec-2026", "goa-new-year-2027"].flatMap((slug) => {
    const trip = getTrip(slug);
    return trip ? [trip] : [];
  });
  return (
    <PageShell
      eyebrow="Solo Group Trips"
      title="Find Your Next Adventure."
      intro="Join a group of like-minded travellers and turn a new destination into a shared memory."
      image="g-waterfall.jpg"
      imageAlt="Cheetah Travelz group at a waterfall"
    >
      <section className="ct-section ct-section--grey" aria-labelledby="upcoming-title">
        <div className="ct-wrap">
          <p className="ct-eyebrow">Upcoming departures</p>
          <h2 id="upcoming-title" className="ct-h2">
            Confirmed Trips
          </h2>
          {trips.length ? (
            <div className="ct-trips" data-count={trips.length}>
              {trips.map((t) => (
                <TripCard key={t.slug} t={t} />
              ))}
            </div>
          ) : (
            <div className="ct-empty">
              <p>New departures are being planned. Ask us what's coming up next.</p>
              <a
                className="ct-btn ct-btn--secondary"
                href={WHATSAPP}
                target="_blank"
                rel="noopener"
              >
                Ask on WhatsApp
              </a>
            </div>
          )}
        </div>
      </section>

      {featuredTrips.map((featured) => (
        <section key={featured.departure.slug} className="ct-section" aria-labelledby={`featured-${featured.departure.slug}`}>
          <div className="ct-wrap">
            <p className="ct-eyebrow">Featured itinerary</p>
            <h2 id={`featured-${featured.departure.slug}`} className="ct-h2">
              {featured.departure.name} · {featured.departure.dateLabel}
            </h2>
            <p className="ct-lead">
              {featured.departure.chip} · {featured.departure.duration} ·{" "}
              {featured.departure.departure} · {featured.departure.priceFrom === null ? "Enquire for price" : `Starting from ${inr(featured.departure.priceFrom)}`}
            </p>
            <ol className="ct-days">
              {featured.detail.itinerary.map((day) => (
                <li key={day.num} className="ct-day">
                  <div className="ct-day__head">
                    <span className="ct-day__num">{day.num}</span>
                    <span className="ct-day__date">{day.date}</span>
                  </div>
                  <ul className="ct-stops">
                    {day.stops.map((s) => (
                      <li key={s.time + s.title}>
                        <time>{s.time}</time>
                        <div>
                          <b>{s.title}</b>
                          {s.note && (
                            <span>
                              {s.note}
                              {s.selfPaid && <em> (self paid)</em>}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
            <div className="ct-center">
              <Link
                to="/trips/$slug"
                params={{ slug: featured.departure.slug }}
                className="ct-btn ct-btn--primary"
                onClick={() => track("trip_detail_click", { trip: featured.departure.slug })}
              >
                See Full Trip Details
              </Link>
            </div>
          </div>
        </section>
      ))}

      <section className="ct-section" aria-labelledby="planned-title">
        <div className="ct-wrap">
          <p className="ct-eyebrow">Coming up</p>
          <h2 id="planned-title" className="ct-h2">
            Dates Coming Soon
          </h2>
          <p className="ct-lead">
            We've run these trips before. New dates and prices will be listed here once they're
            confirmed — ask us to be the first to know.
          </p>
          <div className="ct-planned">
            {PLANNED_TRIPS.map((p) => (
              <article key={p.name} className="ct-card ct-planned__card">
                <img src={img(p.image)} alt={p.alt} loading="lazy" />
                <div>
                  <span className="ct-chip">Dates coming soon</span>
                  <h3 className="ct-h3">{p.name} Group Trip</h3>
                  <p>{p.text}</p>
                  <a
                    className="ct-btn ct-btn--outline"
                    href={wa(
                      `Hi Cheetah Travelz! Please let me know when the next ${p.name} group trip is confirmed.`,
                    )}
                    target="_blank"
                    rel="noopener"
                    onClick={() => track("whatsapp_click", { location: `planned_${p.name}` })}
                  >
                    Notify Me on WhatsApp
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

/* ---------- 3 · Individual trip page (template) ---------- */
export function TripPage({ slug }: { slug: string }) {
  const trip = getTrip(slug);
  if (!trip) return <NotFoundTrip />;
  const { departure: d, detail } = trip;
  const past = isPast(d);
  const onlineBooking = canBookOnline(detail);
  const bookWa = wa(`Hi Cheetah Travelz! I want to book the ${d.name} (${d.dateLabel}).`);
  return (
    <PageShell
      eyebrow={`Solo Group Trip · ${d.chip}`}
      title={d.name}
      intro={`${d.dateLabel} · ${d.duration} · ${d.departure}`}
      image={d.image}
      imageAlt={d.alt}
    >
      <section className="ct-section" aria-label="Trip details">
        <div className="ct-wrap">
          {past && (
            <p className="ct-alert" role="status">
              This departure has already taken place. See our upcoming group trips for the next
              dates.
            </p>
          )}
          <dl className="ct-facts">
            <div>
              <dt>Dates</dt>
              <dd>{d.dateLabel}</dd>
            </div>
            <div>
              <dt>Duration</dt>
              <dd>{d.duration}</dd>
            </div>
            <div>
              <dt>Departure</dt>
              <dd>{d.departure}</dd>
            </div>
            <div>
              <dt>Price</dt>
              <dd>{d.priceFrom === null ? "Enquire for price" : `From ${inr(d.priceFrom)}`}</dd>
            </div>
          </dl>

          <div className="ct-trip-main">
              <section aria-labelledby="it-title" className="ct-block">
                <h2 id="it-title" className="ct-h2 ct-h2--sm">
                  Day-by-Day Itinerary
                </h2>
                <ol className="ct-days">
                  {detail.itinerary.map((day) => (
                    <li key={day.num} className="ct-day">
                      <div className="ct-day__head">
                        <span className="ct-day__num">{day.num}</span>
                        <span className="ct-day__date">{day.date}</span>
                      </div>
                      <ul className="ct-stops">
                        {day.stops.map((s) => (
                          <li key={s.time + s.title}>
                            <time>{s.time}</time>
                            <div>
                              <b>{s.title}</b>
                              {s.note && (
                                <span>
                                  {s.note}
                                  {s.selfPaid && <em> (self paid)</em>}
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </section>

              <section aria-labelledby="act-title" className="ct-block">
                <h2 id="act-title" className="ct-h2 ct-h2--sm">
                  Activities
                </h2>
                <div className="ct-acts">
                  {detail.activities.map((a) => (
                    <figure key={a.title} className="ct-act">
                      <img src={img(a.img)} alt={a.title} loading="lazy" />
                      <figcaption>
                        <b>{a.title}</b>
                        <span>{a.text}</span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>

              <section aria-labelledby="stay-title" className="ct-block">
                <h2 id="stay-title" className="ct-h2 ct-h2--sm">
                  Stay, Meals &amp; Transport
                </h2>
                {detail.stayImages.length > 0 && <div className="ct-stay">
                  {detail.stayImages.slice(0, 4).map((s) => (
                    <img key={s.src} src={img(s.src)} alt={s.alt} loading="lazy" />
                  ))}
                </div>}
                <ul className="ct-ticks">
                  <li>
                    <b>Stay:</b> {detail.stayText}
                  </li>
                  <li>
                    <b>Meals:</b> {detail.meals}
                  </li>
                  <li>
                    <b>Transport:</b> {detail.transport}
                  </li>
                </ul>
              </section>

              <section aria-labelledby="inc-title" className="ct-block">
                <h2 id="inc-title" className="ct-h2 ct-h2--sm">
                  Inclusions &amp; Exclusions
                </h2>
                <div className="ct-incl">
                  <div>
                    <h3 className="ct-h3">Included</h3>
                    <ul className="ct-ticks">
                      {detail.included.map(([b, t]) => (
                        <li key={b}>
                          <b>{b}</b> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="ct-h3">Not included</h3>
                    {detail.excluded.length === 0 && <p>Contact us for confirmed exclusions and any additional charges.</p>}
                    <ul className="ct-crosses">
                      {detail.excluded.map(([b, t]) => (
                        <li key={b}>
                          <b>{b}</b> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              <section aria-labelledby="price-title" className="ct-block">
                <h2 id="price-title" className="ct-h2 ct-h2--sm">
                  Trip Price
                </h2>
                {detail.priceOptions.length > 0 && <ul className="ct-prices ct-prices--wide">
                  {detail.priceOptions.map((o) => (
                    <li key={o.title + o.sub}>
                      <span>
                        <b>{o.title}</b>
                        <small>{o.sub}</small>
                      </span>
                      <strong>{inr(o.amount)}</strong>
                    </li>
                  ))}
                </ul>}
                <p className="ct-hint">
                  {detail.reserveLine ?? (<>Reserve with <b>{detail.reserveAmount}</b> per person · balance at departure</>)}
                </p>
              </section>

            <section aria-label="Book this trip" className="ct-block">
              <div className="ct-card ct-bookcard">
                <p className="ct-eyebrow">Book this trip</p>
                <p className="ct-bookcard__reserve">
                  {detail.reserveLine ?? (<>Reserve with <b>{detail.reserveAmount}</b> per person · balance at departure</>)}
                </p>
                {!past && (
                  <div className="ct-bookcard__actions">
                    {onlineBooking && <a
                      href="#book"
                      className="ct-btn ct-btn--primary"
                      onClick={() => track("trip_book_click", { trip: d.slug })}
                    >
                      Book Now
                    </a>}
                    <a
                      href={bookWa}
                      target="_blank"
                      rel="noopener"
                      className="ct-btn ct-btn--outline"
                      onClick={() =>
                        track("whatsapp_click", { location: "trip_page", trip: d.slug })
                      }
                    >
                      <WhatsAppIcon size={18} /> {onlineBooking ? "Book on WhatsApp" : "Enquire on WhatsApp"}
                    </a>
                  </div>
                )}
                <p className="ct-hint">{detail.paymentNote}</p>
              </div>
            </section>

            <section aria-labelledby="terms-title" className="ct-block">
                <h2 id="terms-title" className="ct-h2 ct-h2--sm">
                  Terms, Cancellation &amp; Refunds
                </h2>
                <div className="ct-acc">
                  {detail.terms.map(([title, paras]) => (
                    <details key={title}>
                      <summary>{title}</summary>
                      {paras.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </details>
                  ))}
                </div>
              </section>
          </div>

          {!past && onlineBooking && (
            <section
              id="book"
              className="ct-block ct-formpanel ct-bookform"
              aria-label="Booking request"
            >
              <TripBookingForm
                slug={d.slug}
                reservePerPerson={detail.reservePerPerson}
                tripName={`${d.name} (${d.dateLabel})`}
                options={detail.priceOptions}
              />
            </section>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function NotFoundTrip() {
  return (
    <PageShell title="Trip Not Found" intro="This trip isn't listed any more.">
      <section className="ct-section">
        <div className="ct-wrap ct-center">
          <Link to={ROUTES.trips} className="ct-btn ct-btn--primary">
            See Upcoming Group Trips
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

/* ---------- 4 · Customized Holidays ---------- */
export function HolidaysPage() {
  const steps = [
    {
      t: "Share your plans",
      d: "Tell us where, when, who's travelling and your budget — through the form or WhatsApp.",
    },
    {
      t: "Get your quotation",
      d: "We plan a holiday around your preferences and send you a customised quotation.",
    },
    { t: "Travel your way", d: "Confirm, pack, and leave the planning to us." },
  ];
  return (
    <PageShell
      eyebrow="Customized Holidays"
      title="Your Dates. Your Destination. Your Kind of Holiday."
      intro="From romantic escapes to family vacations and private group getaways, we create holidays around your preferences."
      image="kerala.jpg"
      imageAlt="Houseboat on the Kerala backwaters"
    >
      <section className="ct-section ct-section--grey" aria-labelledby="who-title">
        <div className="ct-wrap">
          <p className="ct-eyebrow">Who it's for</p>
          <h2 id="who-title" className="ct-h2">
            Planned Around Your People
          </h2>
          <ul className="ct-chips">
            {AUDIENCES.map((a) => (
              <li key={a} className="ct-chip">
                {a}
              </li>
            ))}
          </ul>
          <ol className="ct-steps">
            {steps.map((s, i) => (
              <li key={s.t} className="ct-card">
                <span className="ct-steps__n">{i + 1}</span>
                <h3 className="ct-h3">{s.t}</h3>
                <p>{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <Holidays compact />
    </PageShell>
  );
}

/* ---------- 5 · Cars & Buses ---------- */
export function TransportPage() {
  return (
    <PageShell
      eyebrow="Cars & Buses"
      title="Your Journey Deserves a Comfortable Ride."
      intro="Chauffeur-driven cars, tempo travellers and buses for city transfers, outstation journeys and group travel — all over India."
      image="g-bus.jpg"
      imageAlt="Travellers on board a Cheetah Travelz AC bus"
    >
      <Transport compact />
    </PageShell>
  );
}

/* ---------- 6 · About Us ---------- */
export function AboutPage() {
  return (
    <PageShell
      eyebrow="About Cheetah Travelz"
      title="More Than Just Getting There."
      intro="Whether you meet new people on a group adventure, enjoy a customised holiday with loved ones or arrange a private ride, we make travel easier and more memorable."
      image="g-daman.jpg"
      imageAlt="Cheetah Travelz travellers on the Daman trip"
    >
      <section className="ct-section" aria-labelledby="story-title">
        <div className="ct-wrap ct-split ct-split--center">
          <div>
            <p className="ct-eyebrow">Our story</p>
            <h2 id="story-title" className="ct-h2">
              One Travel Company. Three Ways to Travel.
            </h2>
            <p className="ct-lead">
              Cheetah Travelz is an MSME-registered travel company from Mumbai. We run solo and
              private group trips, plan customised holidays, and provide chauffeur-driven cars and
              buses all over India.
            </p>
            <p className="ct-lead">
              On our group trips, people who arrive as strangers leave as friends — with a female
              trip captain travelling with the group and a relaxed pace that lets everyone enjoy the
              trip their way.
            </p>
          </div>
          <div className="ct-banner">
            <img src={img("g-room.jpg")} alt="Cheetah Travelz group photo" loading="lazy" />
          </div>
        </div>
      </section>
      <section className="ct-section ct-section--grey" aria-labelledby="three-title">
        <div className="ct-wrap">
          <h2 id="three-title" className="ct-h2">
            What We Do
          </h2>
          <div className="ct-services">
            {SERVICES.map((s) => (
              <article key={s.key} className="ct-card ct-service">
                <Link to={s.href} className="ct-card__hit" aria-label={s.title} />
                <div className="ct-service__img">
                  <img src={img(s.image)} alt={s.alt} loading="lazy" />
                </div>
                <div className="ct-service__body">
                  <h3 className="ct-h3">{s.title}</h3>
                  <p>{s.text}</p>
                  <span className="ct-btn ct-btn--primary ct-btn--block ct-btn--sm">{s.cta}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="ct-section" aria-labelledby="moments-title">
        <div className="ct-wrap">
          <h2 id="moments-title" className="ct-h2">
            Moments From Our Trips
          </h2>
          <div className="ct-memories">
            {MEMORIES.map((m) => (
              <figure key={m.image} className="ct-memory">
                <img src={img(m.image)} alt={m.alt} loading="lazy" />
                <figcaption>{m.label}</figcaption>
              </figure>
            ))}
          </div>
          <div className="ct-center">
            <Link to={ROUTES.contact} className="ct-btn ct-btn--primary">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

/* ---------- 7 · Contact Us ---------- */
export function ContactPage() {
  return (
    <PageShell
      eyebrow="Contact Us"
      title="Let's Plan Your Next Journey."
      intro="Call, WhatsApp or send us a message — we'll get back to you shortly."
    >
      <section className="ct-section" aria-label="Contact details and form">
        <div className="ct-wrap ct-split">
          <div>
            <h2 className="ct-h2 ct-h2--sm">Reach Us</h2>
            <ul className="ct-contact">
              <li>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener"
                  onClick={() => track("whatsapp_click", { location: "contact_page" })}
                >
                  <span className="ct-contact__icon ct-contact__icon--wa">
                    <WhatsAppIcon size={20} />
                  </span>
                  <span>
                    <b>WhatsApp</b>
                    <small>{CONTACT.phone}</small>
                  </span>
                </a>
              </li>
              <li>
                <a href={`tel:+${CONTACT.phoneRaw}`}>
                  <span className="ct-contact__icon">
                    <Icon name="phone" size={20} />
                  </span>
                  <span>
                    <b>Call us</b>
                    <small>{CONTACT.phone}</small>
                  </span>
                </a>
              </li>
              <li>
                <a href={CONTACT.instagram} target="_blank" rel="noopener">
                  <span className="ct-contact__icon">
                    <Icon name="instagram" size={20} />
                  </span>
                  <span>
                    <b>Instagram</b>
                    <small>@cheetahtravelz</small>
                  </span>
                </a>
              </li>
              <li>
                <a href={CONTACT.google} target="_blank" rel="noopener">
                  <span className="ct-contact__icon">
                    <Icon name="star" size={20} />
                  </span>
                  <span>
                    <b>Google reviews</b>
                    <small>Read what travellers say</small>
                  </span>
                </a>
              </li>
            </ul>
          </div>
          <div className="ct-formpanel">
            <ContactForm />
          </div>
        </div>
      </section>
    </PageShell>
  );
}

/* ---------- 8 · Travel Blog / Guides ---------- */
export function BlogIndexPage() {
  const posts = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <PageShell
      eyebrow="Travel Blog"
      title="Guides & Stories"
      intro="Practical tips and trip guides from the Cheetah Travelz team."
    >
      <section className="ct-section ct-section--grey">
        <div className="ct-wrap">
          {posts.length ? (
            <div className="ct-posts">
              {posts.map((p) => (
                <article key={p.slug} className="ct-card ct-post">
                  <img src={img(p.image)} alt={p.imageAlt} loading="lazy" />
                  <div>
                    <time dateTime={p.date}>{fmtDate(p.date)}</time>
                    <h2 className="ct-h3">{p.title}</h2>
                    <p>{p.excerpt}</p>
                    <Link
                      to="/blog/$slug"
                      params={{ slug: p.slug }}
                      className="ct-btn ct-btn--outline"
                    >
                      Read Guide
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="ct-empty">
              <p>New guides are on the way.</p>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

export function BlogPostPage({ slug }: { slug: string }) {
  const post = getPost(slug);
  if (!post)
    return (
      <PageShell title="Guide Not Found" intro="This guide isn't available.">
        <section className="ct-section">
          <div className="ct-wrap ct-center">
            <Link to={ROUTES.blog} className="ct-btn ct-btn--primary">
              All Guides
            </Link>
          </div>
        </section>
      </PageShell>
    );
  return (
    <PageShell
      eyebrow="Travel Guide"
      title={post.title}
      intro={fmtDate(post.date)}
      image={post.image}
      imageAlt={post.imageAlt}
    >
      <article className="ct-section">
        <div className="ct-wrap ct-prose">
          <p className="ct-lead">{post.excerpt}</p>
          {post.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="ct-h2 ct-h2--sm">{s.heading}</h2>
              {s.paragraphs.map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </section>
          ))}
          <div className="ct-prose__cta">
            <Link to={ROUTES.trips} className="ct-btn ct-btn--primary">
              Explore Group Trips
            </Link>
            <Link to={ROUTES.blog} className="ct-btn ct-btn--outline">
              More Guides
            </Link>
          </div>
        </div>
      </article>
    </PageShell>
  );
}

/* ---------- 9 · All Reviews ---------- */
export function ReviewsPage() {
  return (
    <PageShell
      eyebrow="Traveller Reviews"
      title="Real Journeys. Real Experiences."
      intro="Genuine Google reviews from Cheetah Travelz travellers."
    >
      <section className="ct-section ct-section--grey" aria-labelledby="google-title">
        <div className="ct-wrap ct-reviewlist">
          <h2 id="google-title" className="ct-h2 ct-h2--sm">
            From Google
          </h2>
          {REVIEWS.map((r) => (
            <figure key={r.name} className="ct-card ct-review ct-review--full">
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
          <div className="ct-center">
            <a
              className="ct-btn ct-btn--secondary"
              href={CONTACT.google}
              target="_blank"
              rel="noopener"
              onClick={() => track("reviews_click", { target: "google" })}
            >
              <Icon name="star" size={18} /> Read All Google Reviews
            </a>
          </div>
        </div>
      </section>
      <section className="ct-section" aria-labelledby="feedback-title">
        <div className="ct-wrap ct-reviewlist">
          <h2 id="feedback-title" className="ct-h2 ct-h2--sm">
            Group Trip Feedback
          </h2>
          <div className="ct-empty">
            <p>
              Messages from our travellers' trip groups will appear here, shared with their
              permission.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

/* ---------- Policies ---------- */
export function TermsPage() {
  return (
    <PageShell
      eyebrow="Policies"
      title="Terms & Conditions"
      intro="These terms apply to bookings made with Cheetah Travelz."
    >
      <section className="ct-section">
        <div className="ct-wrap ct-prose">
          {TERMS.map(([title, paras]) => (
            <section key={title}>
              <h2 className="ct-h2 ct-h2--sm">{title}</h2>
              {paras.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </section>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

export function RefundPage() {
  const cancellation = TERMS.find(([t]) => /cancellation/i.test(t));
  const booking = TERMS.find(([t]) => /booking/i.test(t));
  return (
    <PageShell eyebrow="Policies" title="Cancellation & Refund Policy">
      <section className="ct-section">
        <div className="ct-wrap ct-prose">
          {[booking, cancellation].filter(Boolean).map((entry) => {
            const [title, paras] = entry!;
            return (
              <section key={title}>
                <h2 className="ct-h2 ct-h2--sm">{title}</h2>
                {paras.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </section>
            );
          })}
          <p>
            Questions about a cancellation? <a href={WHATSAPP}>WhatsApp us</a> or see the full{" "}
            <Link to={ROUTES.terms}>Terms &amp; Conditions</Link>.
          </p>
        </div>
      </section>
    </PageShell>
  );
}

/* ---------- 10 · My Account ---------- */
export function AccountPage() {
  return (
    <PageShell
      eyebrow="My Account"
      title="Your Trips, In One Place."
      intro="Bookings, payment status and reward points for Cheetah Travelz travellers."
    >
      <section className="ct-section">
        <div className="ct-wrap ct-account">
          <div className="ct-card ct-account__card">
            <span className="ct-account__icon">
              <Icon name="lock" size={26} />
            </span>
            <h2 className="ct-h3">Customer accounts are being set up</h2>
            <p>
              Soon you'll be able to sign in securely to see your booking references, trip dates,
              payment and booking status, your completed trips and your reward points.
            </p>
            <p>Until then, our team can share your booking details on WhatsApp.</p>
            <a
              className="ct-btn ct-btn--primary ct-btn--block"
              href={wa("Hi Cheetah Travelz! Could you share my booking details?")}
              target="_blank"
              rel="noopener"
            >
              <WhatsAppIcon size={18} /> Ask About My Booking
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
