/* Cheetah Travelz — scroll, parallax and cursor effects.
   initSite() wires everything up and returns a cleanup function (safe for React re-mounts). */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector(s) as T;
const $$ = <T extends Element = HTMLElement>(s: string) =>
  Array.from(document.querySelectorAll(s)) as T[];

export function initSite(): () => void {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const ac = new AbortController();
  const on = <K extends keyof WindowEventMap>(
    t: EventTarget,
    type: K | string,
    fn: (e: any) => void,
    opts: AddEventListenerOptions = {},
  ) => t.addEventListener(type, fn, { ...opts, signal: ac.signal });
  let alive = true;
  const raf = (fn: () => void) => {
    const loop = () => {
      if (!alive) return;
      fn();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  };
  const ctx = gsap.context(() => {});

  /* ---------- smooth scroll ---------- */
  let lenis: Lenis | null = null;
  const lenisTick = (t: number) => lenis?.raf(t * 1000);
  if (!reduce) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(lenisTick);
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------- menu + anchor links ---------- */
  const burger = $("#burger"),
    mnav = $("#mnav");
  const closeMenu = () => {
    burger.classList.remove("open");
    mnav.classList.remove("open");
  };
  on(burger, "click", () => {
    burger.classList.toggle("open");
    mnav.classList.toggle("open");
  });
  $$<HTMLAnchorElement>('a[href^="#"]').forEach((a) =>
    on(a, "click", (e: Event) => {
      const id = a.getAttribute("href")!;
      if (id.length < 2) return;
      const el = document.querySelector(id) as HTMLElement | null;
      if (!el) return;
      e.preventDefault();
      closeMenu();
      lenis ? lenis.scrollTo(el, { offset: -10 }) : el.scrollIntoView({ behavior: "smooth" });
    }),
  );

  /* ---------- nav hide/show + progress ---------- */
  const nav = $("#nav"),
    bar = $("#progressBar");
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY,
      h = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle("is-solid", y > 60);
    nav.classList.toggle("is-hidden", y > lastY && y > 400 && !mnav.classList.contains("open"));
    lastY = y;
    bar.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
  };
  on(window, "scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- custom cursor, paw trail, magnetic buttons, tilt, hero mouse parallax ---------- */
  if (fine) {
    const cur = $("#cursor"),
      dot = $("#cursorDot"),
      label = $("#cursorLabel"),
      paws = $("#paws");
    let mx = innerWidth / 2,
      my = innerHeight / 2,
      cx = mx,
      cy = my,
      last = { x: 0, y: 0 },
      side = 1;
    on(window, "mousemove", (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px)`;
      const dx = mx - last.x,
        dy = my - last.y,
        dist = Math.hypot(dx, dy);
      if (!reduce && dist > 90) {
        const ang = (Math.atan2(dy, dx) * 180) / Math.PI + 90,
          off = 10 * side;
        side *= -1;
        const p = document.createElement("div");
        p.className = "paw";
        p.innerHTML =
          '<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="15" rx="5" ry="4.5"/><circle cx="6" cy="9" r="2.2"/><circle cx="10" cy="5.5" r="2.2"/><circle cx="14" cy="5.5" r="2.2"/><circle cx="18" cy="9" r="2.2"/></svg>';
        p.style.left = mx - (dy / dist) * off - 9 + "px";
        p.style.top = my + (dx / dist) * off - 9 + "px";
        paws.appendChild(p);
        p.animate(
          [
            { opacity: 0.55, transform: `rotate(${ang}deg) scale(1)` },
            { opacity: 0, transform: `rotate(${ang}deg) scale(.6)` },
          ],
          { duration: 1400, easing: "ease-out" },
        ).onfinish = () => p.remove();
        last = { x: mx, y: my };
      }
    });
    raf(() => {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cur.style.transform = `translate(${cx}px,${cy}px)`;
    });

    $$("a,button,summary,[data-cursor]").forEach((el) => {
      on(el, "mouseenter", () => {
        const t = el.getAttribute("data-cursor");
        if (t) {
          label.textContent = t;
          cur.classList.add("is-label");
        } else cur.classList.add("is-hover");
      });
      on(el, "mouseleave", () => cur.classList.remove("is-hover", "is-label"));
    });

    const springBack = (el: HTMLElement, ms: number) => {
      el.style.transition = `transform ${ms}ms cubic-bezier(.22,1,.36,1)`;
      el.style.transform = "";
      setTimeout(() => (el.style.transition = ""), ms);
    };
    $$("[data-magnetic]").forEach((el) => {
      on(el, "mousemove", (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.35}px,${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      });
      on(el, "mouseleave", () => springBack(el, 500));
    });
    $$("[data-tilt]").forEach((el) => {
      on(el, "mousemove", (e: MouseEvent) => {
        const r = el.getBoundingClientRect(),
          px = (e.clientX - r.left) / r.width - 0.5,
          py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `rotateY(${px * 14}deg) rotateX(${-py * 14}deg) translateZ(0)`;
      });
      on(el, "mouseleave", () => springBack(el, 600));
    });

    const hero = $("#hero"),
      layers = Array.from(hero.querySelectorAll<HTMLElement>("[data-depth]"));
    let hx = 0,
      hy = 0,
      tx = 0,
      ty = 0;
    on(hero, "mousemove", (e: MouseEvent) => {
      tx = e.clientX / innerWidth - 0.5;
      ty = e.clientY / innerHeight - 0.5;
    });
    on(hero, "mouseleave", () => {
      tx = 0;
      ty = 0;
    });
    raf(() => {
      hx += (tx - hx) * 0.06;
      hy += (ty - hy) * 0.06;
      layers.forEach((l) => {
        const d = +l.dataset["depth"]!;
        l.style.translate = `${-hx * d * 80}px ${-hy * d * 50}px`;
      });
    });
  }

  /* ---------- drag-to-scroll reviews ---------- */
  const rail = $("#reviewsRail");
  let down = false,
    sx = 0,
    sl = 0;
  on(rail, "pointerdown", (e: PointerEvent) => {
    down = true;
    sx = e.clientX;
    sl = rail.scrollLeft;
    rail.setPointerCapture(e.pointerId);
  });
  on(rail, "pointermove", (e: PointerEvent) => {
    if (down) rail.scrollLeft = sl - (e.clientX - sx);
  });
  on(rail, "pointerup", () => (down = false));
  on(rail, "pointercancel", () => (down = false));

  /* ---------- reel: show only once the video file is available ---------- */
  const reel = $("#reel"),
    vid = $<HTMLVideoElement>("#reelVideo");
  const showReel = () => {
    if (!reel.hidden) return;
    reel.hidden = false;
    ScrollTrigger.refresh();
  };
  if (vid.readyState >= 1) showReel();
  else on(vid, "loadedmetadata", showReel, { once: true });
  const io = new IntersectionObserver(
    ([en]) => {
      en?.isIntersecting ? vid.play().catch(() => {}) : vid.pause();
    },
    { threshold: 0.3 },
  );
  io.observe(vid);

  /* ---------- loader ---------- */
  const loader = $("#loader"),
    num = $("#loaderNum"),
    lbar = $("#loaderBar");
  const imgs = Array.from(document.images);
  let loaded = 0;
  const tick = () => {
    loaded++;
    const p = Math.min(100, Math.round((loaded / Math.max(1, imgs.length)) * 100));
    num.textContent = String(p);
    lbar.style.width = p + "%";
  };
  imgs.forEach((i) =>
    i.complete
      ? tick()
      : (on(i, "load", tick, { once: true }), on(i, "error", tick, { once: true })),
  );
  let started = false;
  const start = () => {
    if (started || !alive) return;
    started = true;
    num.textContent = "100";
    lbar.style.width = "100%";
    ctx.add(intro);
  };
  if (document.readyState === "complete") setTimeout(start, 300);
  else on(window, "load", start);
  const fallback = setTimeout(start, 4500);

  /* ---------- text splitting (idempotent) ---------- */
  const splitChars = (el: HTMLElement) => {
    if (el.dataset["split"]) return;
    el.dataset["split"] = "1";
    const t = el.textContent || "";
    el.textContent = "";
    [...t].forEach((c) => {
      const s = document.createElement("span");
      s.className = "ch";
      s.textContent = c;
      el.appendChild(s);
    });
  };
  const splitLines = (el: HTMLElement) => {
    if (el.dataset["split"]) return;
    el.dataset["split"] = "1";
    el.innerHTML = el.innerHTML
      .split(/<br\s*\/?>/i)
      .map((p) => `<span class="line"><span>${p}</span></span>`)
      .join("");
  };

  /* Hero destination rotator: DAMAN → MAHABALESHWAR → LONAVALA → GOA → ANYWHERE, photo crossfades with it. */
  const dest = $("#heroDest"),
    heroPhoto = $("#heroPhoto");
  const words: [string, string][] = JSON.parse(dest?.dataset["words"] || "[]");
  words.forEach(([, src]) => {
    const i = new Image();
    i.src = src;
  });
  const setWord = (w: string) => {
    dest.textContent = "";
    [...w].forEach((c) => {
      const s = document.createElement("span");
      s.className = "ch";
      s.textContent = c;
      dest.appendChild(s);
    });
  };
  let wi = words.length - 1; // starts on ANYWHERE
  function rotate() {
    if (!alive || !words.length) return;
    gsap.to(dest.querySelectorAll(".ch"), {
      yPercent: -110,
      opacity: 0,
      stagger: 0.025,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => {
        if (!alive) return;
        wi = (wi + 1) % words.length;
        const pick = words[wi];
        if (!pick) return;
        const [w, src] = pick;
        setWord(w);
        heroPhoto.style.backgroundImage = `url(${src})`;
        gsap.from(dest.querySelectorAll(".ch"), {
          yPercent: 110,
          opacity: 0,
          rotate: 6,
          stagger: 0.035,
          duration: 0.6,
          ease: "back.out(1.8)",
        });
        gsap.delayedCall(w === "ANYWHERE" ? 3.2 : 2.1, rotate);
      },
    });
  }

  function intro() {
    if (reduce) {
      loader.style.display = "none";
      return;
    }
    $$(".hero__goa .split").forEach(splitChars);
    if (dest) setWord(dest.textContent || "ANYWHERE");
    $$(".reveal-lines").forEach(splitLines);
    gsap.delayedCall(3.6, rotate);

    gsap
      .timeline()
      .to(loader, { yPercent: -100, duration: 1, ease: "expo.inOut", delay: 0.2 })
      .set(loader, { display: "none" })
      .from(".hero__photo", { scale: 1.35, duration: 1.8, ease: "expo.out" }, "-=.6")
      .from(
        ".hero__goa > span .ch",
        {
          yPercent: 110,
          rotate: 8,
          opacity: 0,
          stagger: 0.08,
          duration: 1.1,
          ease: "back.out(1.6)",
        },
        "-=1.4",
      )
      .from(
        ".hero__goa em .ch",
        { y: 60, opacity: 0, scale: 0.4, stagger: 0.05, duration: 0.8, ease: "back.out(2.5)" },
        "-=.7",
      )
      .from(".palm--l", { xPercent: -40, opacity: 0, duration: 1.3, ease: "expo.out" }, "-=1")
      .from(".palm--r", { xPercent: 40, opacity: 0, duration: 1.3, ease: "expo.out" }, "<")
      .from(
        ".sign span",
        { x: 120, opacity: 0, stagger: 0.08, duration: 0.7, ease: "back.out(1.7)" },
        "-=1",
      )
      .from(
        ".hero__content > *",
        { y: 40, opacity: 0, stagger: 0.12, duration: 0.8, ease: "power3.out" },
        "-=.8",
      )
      .from(".hero__msme", { scale: 0, rotate: -40, duration: 0.8, ease: "back.out(2)" }, "-=.6");

    const heroST = { trigger: ".hero", start: "top top", end: "bottom top", scrub: true };
    gsap.to(".hero__photo", { yPercent: 25, scale: 1.12, ease: "none", scrollTrigger: heroST });
    gsap.to(".hero__sun", { yPercent: 40, ease: "none", scrollTrigger: heroST });
    gsap.to(".hero__title", { yPercent: 55, opacity: 0.2, ease: "none", scrollTrigger: heroST });
    gsap.to(".hero__palms", { yPercent: -12, scale: 1.15, ease: "none", scrollTrigger: heroST });
    gsap.to(".hero__sign", { yPercent: -30, ease: "none", scrollTrigger: heroST });
    gsap.to(".hero__content", {
      yPercent: -60,
      opacity: 0,
      ease: "none",
      scrollTrigger: { ...heroST, end: "60% top" },
    });

    const mq = gsap.to(".marquee__track", {
      xPercent: -50,
      duration: 22,
      ease: "none",
      repeat: -1,
    });
    ScrollTrigger.create({
      onUpdate: (s) => {
        const v = s.getVelocity() / 300;
        gsap.to(mq, {
          timeScale: s.direction * Math.max(1, Math.abs(v)),
          duration: 0.3,
          overwrite: true,
        });
      },
    });

    $$(".reveal-lines").forEach((el) =>
      gsap.from(el.querySelectorAll(".line > span"), {
        yPercent: 110,
        rotate: 3,
        duration: 1.1,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      }),
    );
    $$(".reveal").forEach((el) =>
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      }),
    );
    $$("[data-speed]").forEach((el) =>
      gsap.to(el, {
        yPercent: parseFloat(el.dataset["speed"]!) * -100,
        ease: "none",
        scrollTrigger: {
          trigger: el.closest("section"),
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }),
    );

    gsap.from(".scard2", {
      y: 70,
      opacity: 0,
      stagger: 0.1,
      duration: 0.9,
      ease: "back.out(1.4)",
      scrollTrigger: { trigger: ".services__grid", start: "top 82%" },
    });
    gsap.from(".stats-band > div", {
      y: 30,
      opacity: 0,
      stagger: 0.08,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: { trigger: ".stats-band", start: "top 88%" },
    });
    gsap.from(".trips__grid", {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: ".trips__grid", start: "top 85%" },
    });
    gsap.from(".dcard", {
      y: 90,
      opacity: 0,
      rotate: (i: number) => (i % 2 ? 4 : -4),
      duration: 1,
      stagger: 0.1,
      ease: "back.out(1.3)",
      scrollTrigger: { trigger: ".dest__grid", start: "top 82%" },
    });
    gsap.from(".upnext__inner > *", {
      x: -60,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: ".upnext", start: "top 85%" },
    });
    gsap.from(".icard", {
      y: 80,
      opacity: 0,
      rotate: () => gsap.utils.random(-8, 8),
      duration: 0.9,
      stagger: { each: 0.07, from: "random" },
      ease: "back.out(1.4)",
      scrollTrigger: { trigger: ".incl__grid", start: "top 80%" },
    });

    const track = $("#itinTrack");
    const dist = () => track.scrollWidth - innerWidth;
    const horiz = gsap.to(track, {
      x: () => -dist(),
      ease: "none",
      scrollTrigger: {
        trigger: ".itin__pin",
        start: "top top",
        end: () => "+=" + dist(),
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });
    $$(".day__media img").forEach((im) =>
      gsap.fromTo(
        im,
        { scale: 1.3, xPercent: -6 },
        {
          scale: 1.05,
          xPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: im.closest(".day"),
            containerAnimation: horiz,
            start: "left right",
            end: "right left",
            scrub: true,
          },
        },
      ),
    );
    $$(".day .tl li").forEach((li) =>
      gsap.from(li, {
        x: 40,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: li.closest(".day"),
          containerAnimation: horiz,
          start: "left 75%",
        },
      }),
    );

    $$(".scard").forEach((c) => {
      gsap.fromTo(
        c,
        { "--z": 1.3, "--py": "-8%" },
        {
          "--z": 1,
          "--py": "8%",
          ease: "none",
          scrollTrigger: { trigger: c, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
      gsap.from(c.querySelector("h3"), {
        yPercent: 60,
        opacity: 0,
        skewY: 6,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: c, start: "top 45%" },
      });
      gsap.from(c.querySelector("p"), {
        y: 30,
        opacity: 0,
        duration: 0.9,
        delay: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: c, start: "top 45%" },
      });
    });

    $$(".clipreveal").forEach((f, i) => {
      gsap.fromTo(
        f,
        { clipPath: "inset(100% 0 0 0 round 20px)" },
        {
          clipPath: "inset(0% 0 0 0 round 20px)",
          duration: 1.3,
          delay: i * 0.08,
          ease: "expo.inOut",
          scrollTrigger: { trigger: ".stay__grid", start: "top 80%" },
        },
      );
      gsap.fromTo(
        f.querySelector("img"),
        { scale: 1.4 },
        {
          scale: 1,
          duration: 1.6,
          delay: i * 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: ".stay__grid", start: "top 80%" },
        },
      );
    });

    $$(".gcol").forEach((col) => {
      const s = +col.dataset["gspeed"]!;
      gsap.fromTo(
        col,
        { y: -s },
        {
          y: s * 1.6,
          ease: "none",
          scrollTrigger: {
            trigger: ".gallery",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });

    gsap.from(".rcard", {
      y: 100,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: "expo.out",
      scrollTrigger: { trigger: ".reviews__rail", start: "top 85%" },
    });

    $$(".count").forEach((el) => {
      const to = +el.dataset["to"]!,
        o = { v: 0 };
      gsap.to(o, {
        v: to,
        duration: 1.6,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
        onUpdate: () => {
          el.textContent = Math.round(o.v).toLocaleString("en-IN");
        },
        onComplete: () => {
          el.textContent = to.toLocaleString("en-IN");
        },
      });
    });
    gsap.from(".pcard", {
      y: 80,
      rotateX: -30,
      opacity: 0,
      stagger: 0.12,
      duration: 1,
      ease: "back.out(1.3)",
      scrollTrigger: { trigger: ".prices", start: "top 80%" },
    });
    gsap.from(".book__card", {
      rotate: 10,
      y: 80,
      opacity: 0,
      duration: 1.2,
      ease: "back.out(1.5)",
      scrollTrigger: { trigger: ".book", start: "top 70%" },
    });
    gsap.from(".foot__big", {
      xPercent: -20,
      ease: "none",
      scrollTrigger: { trigger: ".foot", start: "top bottom", end: "bottom bottom", scrub: true },
    });

    on(window, "load", () => ScrollTrigger.refresh());
    setTimeout(() => ScrollTrigger.refresh(), 800);
  }

  return () => {
    alive = false;
    clearTimeout(fallback);
    ac.abort();
    io.disconnect();
    ctx.revert();
    gsap.ticker.remove(lenisTick);
    lenis?.destroy();
  };
}
