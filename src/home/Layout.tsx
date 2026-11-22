import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";

import { CONTACT, ROUTES, WHATSAPP, img } from "./data";
import { Icon, WhatsAppIcon } from "./Icon";
import { track } from "./track";
import { FartCursor, HeroClouds, ScrollFun } from "./Fun";

/* Shared header (sticky, full-screen navy mobile menu) and footer for every public page. */

type NavItem = { label: string; to: string; service?: boolean; icon?: string };

const NAV: NavItem[] = [
  { label: "Home", to: ROUTES.home },
  { label: "Solo Group Trips", to: ROUTES.trips, service: true },
  { label: "Customized Holidays", to: ROUTES.holidays, service: true },
  { label: "Cars & Buses", to: ROUTES.transport, service: true },
  { label: "About Us", to: ROUTES.about },
  { label: "Contact Us", to: ROUTES.contact },
];
const MENU_EXTRA: NavItem[] = [
  { label: "Travel Guides", to: ROUTES.blog },
  { label: "Reviews", to: ROUTES.reviews },
  { label: "My Account", to: ROUTES.account, icon: "user" },
];

function Logo({ light }: { light?: boolean }) {
  return (
    <span className={`ct-logo ${light ? "ct-logo--light" : ""}`}>
      <img src={img("logo.png")} alt="" width={40} height={40} />
      <span>
        CHEETAH <b>TRAVELZ</b>
      </span>
    </span>
  );
}

export function SiteHeader() {
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
        <Link to="/" className="ct-logo-link" aria-label="Cheetah Travelz — home">
          <Logo />
        </Link>
        <nav className="ct-nav" aria-label="Main">
          {NAV.slice(1).map((n) => (
            <Link
              key={n.label}
              to={n.to}
              className={n.service ? "is-service" : undefined}
              activeProps={{ className: `${n.service ? "is-service " : ""}is-active` }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <Link to={ROUTES.account} className="ct-header__account" aria-label="My Account">
          <Icon name="user" size={20} />
          <span>My Account</span>
        </Link>
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
          <Logo light />
          <button
            className="ct-burger ct-burger--light"
            aria-label="Close menu"
            onClick={() => {
              setOpen(false);
              btn.current?.focus();
            }}
          >
            <Icon name="close" size={26} />
          </button>
        </div>
        <nav aria-label="Mobile">
          {[...NAV, ...MENU_EXTRA].map((n, i) => (
            <Link
              key={n.label}
              ref={i === 0 ? firstLink : undefined}
              to={n.to}
              className={n.service ? "is-service" : n.icon ? "is-account" : undefined}
              onClick={() => setOpen(false)}
            >
              <span>
                {n.icon && <Icon name={n.icon} size={20} />} {n.label}
              </span>
              <Icon name="chevron" size={20} />
            </Link>
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
      <ScrollFun />
      <FartCursor />
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer id="contact" className="ct-footer">
      <div className="ct-wrap ct-footer__grid">
        <div>
          <Logo light />
          <p className="ct-footer__tag">
            Making every journey memorable through group adventures, personalised holidays and
            private transportation.
          </p>
        </div>
        <div>
          <h3>Quick links</h3>
          <ul>
            {[
              ...NAV,
              { label: "Travel Guides", to: ROUTES.blog },
              { label: "Reviews", to: ROUTES.reviews },
            ].map((n) => (
              <li key={n.label}>
                <Link to={n.to}>{n.label}</Link>
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
              <Link to={ROUTES.terms}>Terms &amp; Conditions</Link>
            </li>
            <li>
              <Link to={ROUTES.refund}>Cancellation &amp; Refund Policy</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="ct-wrap ct-footer__bottom">
        <p>© {new Date().getFullYear()} Cheetah Travelz. All rights reserved. · MSME Registered</p>
        <p className="ct-credit">
          Website created by Shabnam Mamdani. To get in touch, contact Shabnam Mamdani: Phone:{" "}
          <a href="tel:+918452033656">8452033656</a> · Email:{" "}
          <a href="mailto:shabnammamdani07@gmail.com">shabnammamdani07@gmail.com</a>
        </p>
      </div>
    </footer>
  );
}

/* Page wrapper: header, an optional navy page hero, content, footer. */
export function PageShell({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  image?: string;
  imageAlt?: string;
  children: ReactNode;
}) {
  return (
    <div className="ct" id="top">
      <SiteHeader />
      <main>
        <section className={`ct-pagehero ${image ? "has-image" : ""}`} aria-labelledby="page-title">
          {image && <img className="ct-pagehero__img" src={img(image)} alt={imageAlt ?? ""} />}
          <div className="ct-pagehero__shade" />
          <HeroClouds />
          <div className="ct-wrap ct-pagehero__content">
            <span className="ct-hero__bar" />
            {eyebrow && <p className="ct-hero__eyebrow">{eyebrow}</p>}
            <h1 id="page-title">{title}</h1>
            {intro && <p className="ct-pagehero__intro">{intro}</p>}
          </div>
        </section>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
