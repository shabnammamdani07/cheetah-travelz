import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/*
 * Playful motion layer for Cheetah Travelz.
 * - FartCursor: a little traveller follows the mouse and leaves gas puffs (desktop mouse only).
 * - ScrollFun: parallax hero, scroll reveals, a ship that sails along the header as you scroll.
 * - Voyage: a parallax seascape where a cruise ship sails past our destinations as you scroll.
 * Everything is decoration: pointer-events: none, aria-hidden, and switched off entirely
 * for prefers-reduced-motion. Content never waits for an animation to become usable.
 */

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------------- cursor ---------------- */

const PUFF_SOUNDS = ["pfft!", "prrt!", "toot!", "phew!", "brrap!"];

export function FartCursor() {
  const guy = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion() || !finePointer()) return;
    const el = guy.current;
    const puffs = layer.current;
    if (!el || !puffs) return;
    document.documentElement.classList.add("ct-fun-cursor");

    let x = -100,
      y = -100,
      tx = -100,
      ty = -100,
      facing = 1,
      lastPuff = 0,
      live = 0,
      raf = 0,
      shown = false;

    const puff = (px: number, py: number, big: boolean) => {
      if (live > 40) return;
      live++;
      const p = document.createElement("span");
      p.className = big ? "ct-puff ct-puff--big" : "ct-puff";
      const size = big ? 46 + Math.random() * 20 : 12 + Math.random() * 14;
      p.style.width = p.style.height = `${size}px`;
      p.style.left = `${px - size / 2}px`;
      p.style.top = `${py - size / 2}px`;
      p.style.setProperty("--dx", `${-facing * (14 + Math.random() * 26)}px`);
      p.style.setProperty("--dy", `${-(10 + Math.random() * 30)}px`);
      puffs.appendChild(p);
      if (big) {
        const word = document.createElement("span");
        word.className = "ct-puff-word";
        word.textContent = PUFF_SOUNDS[Math.floor(Math.random() * PUFF_SOUNDS.length)] ?? "pfft!";
        word.style.left = `${px - facing * 34}px`;
        word.style.top = `${py - 30}px`;
        puffs.appendChild(word);
        setTimeout(() => word.remove(), 900);
      }
      setTimeout(
        () => {
          p.remove();
          live--;
        },
        big ? 1100 : 800,
      );
    };

    const tick = (t: number) => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      const vx = tx - x;
      if (Math.abs(vx) > 1.5) facing = vx > 0 ? 1 : -1;
      const speed = Math.hypot(tx - x, ty - y);
      const tilt = Math.max(-14, Math.min(14, vx * 0.6));
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scaleX(${facing}) rotate(${tilt * facing}deg)`;
      el.classList.toggle("is-walking", speed > 2);
      // puffs come out of the back, more of them when moving fast
      if (speed > 3 && t - lastPuff > Math.max(45, 140 - speed * 4)) {
        lastPuff = t;
        puff(x - facing * 14, y + 18, false);
      }
      raf = requestAnimationFrame(tick);
    };

    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        x = tx;
        y = ty;
        shown = true;
        el.classList.add("is-on");
      }
      const t = e.target as Element | null;
      el.classList.toggle("is-pointing", !!t?.closest("a, button, summary, label, [role=button]"));
      el.classList.toggle("is-hidden", !!t?.closest("input, textarea, select, [contenteditable]"));
    };
    const down = (e: PointerEvent) => {
      el.classList.add("is-tooting");
      for (let i = 0; i < 4; i++) puff(e.clientX - facing * (16 + i * 6), e.clientY + 16, i === 0);
      setTimeout(() => el.classList.remove("is-tooting"), 260);
    };
    const leave = () => {
      el.classList.remove("is-on");
      shown = false;
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("ct-fun-cursor");
    };
  }, []);

  return (
    <div className="ct-fun" aria-hidden="true">
      <div ref={layer} className="ct-puffs" />
      <div ref={guy} className="ct-cursor-guy">
        <svg viewBox="0 0 48 64" width="40" height="54">
          {/* backpack */}
          <rect x="7" y="24" width="10" height="16" rx="3" fill="#F15A00" />
          {/* body */}
          <rect x="14" y="22" width="18" height="20" rx="7" fill="#012E69" />
          {/* head */}
          <circle cx="24" cy="13" r="10" fill="#F6C9A0" />
          {/* cap */}
          <path d="M14 11a10 10 0 0 1 20 0z" fill="#F15A00" />
          <rect x="30" y="9" width="9" height="3" rx="1.5" fill="#F15A00" />
          {/* face */}
          <circle cx="28" cy="14" r="1.6" fill="#1a1a1a" />
          <path
            className="ct-cursor-guy__mouth"
            d="M26 18q3 2 5 0"
            stroke="#1a1a1a"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="31" cy="17" r="1.8" fill="#f29b8a" opacity=".7" />
          {/* arm pointing forward */}
          <path
            className="ct-cursor-guy__arm"
            d="M28 28l10-4"
            stroke="#012E69"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* legs */}
          <path
            className="ct-cursor-guy__leg ct-cursor-guy__leg--a"
            d="M20 41l-2 13"
            stroke="#3b4a5e"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            className="ct-cursor-guy__leg ct-cursor-guy__leg--b"
            d="M27 41l2 13"
            stroke="#3b4a5e"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

/* ---------------- scroll effects for any page ---------------- */

export function ScrollFun() {
  useEffect(() => {
    if (reducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // ship riding a wave line under the header = reading progress
      gsap.to(".ct-progress-ship", {
        left: "calc(100% - 34px)",
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      });

      // hero / page-hero photo drifts slower than the page (parallax), clouds drift faster
      for (const hero of gsap.utils.toArray<HTMLElement>(".ct-hero, .ct-pagehero")) {
        const photo = hero.querySelector(".ct-hero__img, .ct-pagehero__img");
        const st = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
        if (photo)
          gsap.fromTo(
            photo,
            { yPercent: 0, scale: 1.08 },
            { yPercent: 18, scale: 1.18, ease: "none", scrollTrigger: st },
          );
        gsap.to(hero.querySelectorAll(".ct-cloud"), {
          yPercent: -160,
          ease: "none",
          scrollTrigger: st,
        });
      }

      // section headings and cards rise in as they enter (content is visible without JS)
      const items = gsap.utils.toArray<HTMLElement>(
        ".ct-section h2, .ct-section .ct-lead, .ct-service, .ct-trip, .ct-dest, .ct-vehicle, .ct-benefit, .ct-memory, .ct-review, .ct-final h2, .ct-pagehero ~ * h2",
      );
      // Reveal by position on every scroll frame, so nothing can stay hidden: anything at or
      // above 92% of the viewport (including sections jumped past via a link) is shown.
      const pending = new Set(
        items.filter((e) => e.getBoundingClientRect().top > innerHeight * 0.92),
      );
      gsap.set([...pending], { autoAlpha: 0, y: 46, rotate: () => gsap.utils.random(-2.5, 2.5) });
      const reveal = () => {
        const due = [...pending].filter((e) => e.getBoundingClientRect().top < innerHeight * 0.92);
        if (!due.length) return;
        due.forEach((e) => pending.delete(e));
        // already scrolled past (e.g. after a jump link): show at once, no waiting
        const past = due.filter((e) => e.getBoundingClientRect().bottom <= 0);
        gsap.set(past, { clearProps: "transform,opacity,visibility,rotate" });
        const onScreen = due.filter((e) => !past.includes(e));
        if (!onScreen.length) return;
        gsap.to(onScreen, {
          autoAlpha: 1,
          y: 0,
          rotate: 0,
          duration: 0.7,
          ease: "back.out(1.6)",
          stagger: { each: 0.08, amount: Math.min(0.5, onScreen.length * 0.08) },
          overwrite: true,
          clearProps: "transform,opacity,visibility,rotate",
        });
      };
      ScrollTrigger.create({ start: 0, end: "max", onUpdate: reveal, onRefresh: reveal });
      // positions shift as images load; re-measure once the page has finished loading
      if (document.readyState !== "complete")
        window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
    });

    // magnetic orange buttons (desktop mouse only)
    const cleanups: Array<() => void> = [];
    if (finePointer()) {
      for (const b of document.querySelectorAll<HTMLElement>(
        ".ct-btn--primary:not(.ct-btn--hero)",
      )) {
        const xTo = gsap.quickTo(b, "x", { duration: 0.35, ease: "power3" });
        const yTo = gsap.quickTo(b, "y", { duration: 0.35, ease: "power3" });
        const mm = (e: PointerEvent) => {
          const r = b.getBoundingClientRect();
          xTo((e.clientX - r.left - r.width / 2) * 0.25);
          yTo((e.clientY - r.top - r.height / 2) * 0.35);
        };
        const ml = () => {
          xTo(0);
          yTo(0);
        };
        b.addEventListener("pointermove", mm);
        b.addEventListener("pointerleave", ml);
        cleanups.push(() => {
          b.removeEventListener("pointermove", mm);
          b.removeEventListener("pointerleave", ml);
        });
      }
    }
    return () => {
      cleanups.forEach((f) => f());
      ctx.revert();
    };
  }, []);

  return (
    <div className="ct-progress" aria-hidden="true">
      <span className="ct-progress-ship">🚢</span>
    </div>
  );
}

/* ---------------- the cruise voyage ---------------- */

const STOPS = ["Goa", "Daman", "Lonavala", "Mahabaleshwar"];

export function Voyage() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reducedMotion() || !root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const st = { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6 };
      const tl = gsap.timeline({ scrollTrigger: st, defaults: { ease: "none" } });
      tl.fromTo(
        ".ct-voyage__ship",
        { xPercent: -10, left: "-30%" },
        { left: "105%", duration: 1 },
        0,
      )
        .to(".ct-voyage__sun", { yPercent: 120, backgroundColor: "#ff6b2b", duration: 1 }, 0)
        .to(".ct-voyage__sky", { backgroundPosition: "0% 100%", duration: 1 }, 0)
        .to(".ct-voyage__far", { xPercent: -18, duration: 1 }, 0)
        .to(".ct-voyage__mid", { xPercent: -40, duration: 1 }, 0)
        .to(".ct-voyage__near", { xPercent: -70, duration: 1 }, 0)
        .to(".ct-voyage__gull", { xPercent: 260, yPercent: -120, duration: 1 }, 0)
        .fromTo(
          ".ct-voyage__title",
          { autoAlpha: 1, y: 0 },
          { autoAlpha: 0, y: -60, duration: 0.18 },
          0.05,
        );
      // destination tags pop up one by one as the ship passes
      gsap.utils.toArray<HTMLElement>(".ct-voyage__stop").forEach((s, i) => {
        const at = 0.18 + i * 0.19;
        tl.fromTo(
          s,
          { autoAlpha: 0, y: 40, scale: 0.6 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.06, ease: "back.out(2)" },
          at,
        ).to(s, { autoAlpha: 0, y: -30, duration: 0.05 }, at + 0.14);
      });
      tl.fromTo(
        ".ct-voyage__end",
        { autoAlpha: 0, scale: 0.8 },
        { autoAlpha: 1, scale: 1, duration: 0.1, ease: "back.out(2)" },
        0.9,
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="ct-voyage" aria-label="Cruise through our destinations">
      <div className="ct-voyage__stage" aria-hidden="true">
        <div className="ct-voyage__sky" />
        <div className="ct-voyage__sun" />
        <div className="ct-voyage__sea" />
        <span className="ct-voyage__gull">🕊️</span>
        <svg className="ct-voyage__far" viewBox="0 0 2400 200" preserveAspectRatio="none">
          <path
            d="M0 200V120l180-60 160 50 220-90 200 80 240-70 180 60 260-80 200 90 220-50 200 60 140-40V200z"
            fill="#3c6e8f"
            opacity=".55"
          />
        </svg>
        <svg className="ct-voyage__mid" viewBox="0 0 2400 160" preserveAspectRatio="none">
          <path
            d="M0 160V60q150-50 300 0t300 0 300 0 300 0 300 0 300 0 300 0 300 0V160z"
            fill="#1f7fb5"
          />
        </svg>
        <div className="ct-voyage__ship">
          <svg viewBox="0 0 320 170" width="100%">
            <rect x="196" y="18" width="20" height="40" rx="3" fill="#F15A00" />
            <rect x="196" y="18" width="20" height="8" fill="#012E69" />
            <rect x="236" y="26" width="18" height="32" rx="3" fill="#F15A00" />
            <rect x="236" y="26" width="18" height="7" fill="#012E69" />
            <rect x="70" y="56" width="210" height="30" rx="6" fill="#fff" />
            <rect x="96" y="34" width="150" height="26" rx="6" fill="#f3f6fb" />
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <rect
                key={`w${i}`}
                x={84 + i * 21}
                y={64}
                width="12"
                height="10"
                rx="3"
                fill="#7fc4ec"
              />
            ))}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <circle key={`p${i}`} cx={112 + i * 22} cy={47} r="5" fill="#7fc4ec" />
            ))}
            <path d="M20 86h290l-30 54H60z" fill="#012E69" />
            <path d="M28 98h272" stroke="#F15A00" strokeWidth="6" />
            <text
              x="120"
              y="126"
              fill="#fff"
              fontFamily="Poppins, sans-serif"
              fontSize="17"
              fontWeight="700"
            >
              CHEETAH
            </text>
          </svg>
          <span className="ct-voyage__smoke" />
          <span className="ct-voyage__smoke ct-voyage__smoke--b" />
        </div>
        <svg className="ct-voyage__near" viewBox="0 0 2400 120" preserveAspectRatio="none">
          <path
            d="M0 120V40q100-40 200 0t200 0 200 0 200 0 200 0 200 0 200 0 200 0 200 0 200 0 200 0 200 0V120z"
            fill="#0b4f7c"
          />
        </svg>
        <div className="ct-voyage__title">
          <p className="ct-hero__eyebrow">All aboard</p>
          <h2>Scroll to set sail ⚓</h2>
        </div>
        {STOPS.map((s) => (
          <p key={s} className="ct-voyage__stop">
            📍 Next stop: <strong>{s}</strong>
          </p>
        ))}
        <p className="ct-voyage__end">Where to next? 🌴</p>
      </div>
    </section>
  );
}

/* Hero decorations: drifting clouds and a plane for the parallax layer. */
export function HeroClouds() {
  return (
    <div className="ct-clouds" aria-hidden="true">
      <span className="ct-cloud ct-cloud--a">☁️</span>
      <span className="ct-cloud ct-cloud--b">☁️</span>
      <span className="ct-cloud ct-cloud--c">✈️</span>
    </div>
  );
}
