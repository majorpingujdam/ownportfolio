// Owen Chen — portfolio

// ── Cursor: inverting dot ──────────────────────────────────────
const blob = document.createElement("div");
blob.className = "cursor-blob";
document.body.appendChild(blob);

let curX = -100, curY = -100;      // real mouse position
let blobX = -100, blobY = -100;    // lagging blob position

document.addEventListener("mousemove", e => {
  curX = e.clientX;
  curY = e.clientY;
  document.body.classList.add("cursor-ready");
});
document.addEventListener("mouseleave", () => document.body.classList.remove("cursor-ready"));
document.addEventListener("mouseenter", () => document.body.classList.add("cursor-ready"));

if (window.matchMedia("(hover: hover)").matches) {
  (function cursorLoop() {
    // dot glides toward the pointer with easing
    blobX += (curX - blobX) * 0.22;
    blobY += (curY - blobY) * 0.22;
    blob.style.left = blobX + "px";
    blob.style.top  = blobY + "px";
    requestAnimationFrame(cursorLoop);
  })();
}

["a", "button", "[role='button']", ".cs__toggle", ".work__filter-item", ".card__link"].forEach(sel => {
  document.querySelectorAll(sel).forEach(el => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-active"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-active"));
  });
});


// ── Nav clock: live Chicago time, e.g. "2:00:02 pm" ─────────────
const navEl = document.querySelector(".nav");
if (navEl) {
  const clock = document.createElement("span");
  clock.className = "nav__clock";
  clock.setAttribute("aria-label", "Local time in Chicago");
  clock.innerHTML = '<span class="nav__clock-city">chicago</span> <time class="nav__clock-time"></time>';
  navEl.insertBefore(clock, navEl.querySelector(".nav__links"));

  const timeEl = clock.querySelector("time");
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true,
  });
  const tick = () => {
    const now = new Date();
    const p = Object.fromEntries(fmt.formatToParts(now).map(x => [x.type, x.value]));
    timeEl.textContent = `${p.hour}:${p.minute}:${p.second} ${p.dayPeriod.toLowerCase()}`;
    timeEl.dateTime = now.toISOString();
    // re-align to the next whole second so the display never skips
    setTimeout(tick, 1000 - (now.getTime() % 1000));
  };
  tick();
}


// ── Work filter: clickable category labels ─────────────────────
// "work" shows everything; each label filters to its category (click the
// active one again to clear). Matching cards reflow to the top of the grid
// and the work section scrolls up under the fixed nav.
let currentFilter = "all";
const applyFilter = val => {
  document.querySelectorAll(".grid .card").forEach(card => {
    card.hidden = val !== "all" && card.dataset.category !== val;
  });
  document.querySelectorAll(".work__cat").forEach(b =>
    b.classList.toggle("is-active", b.dataset.val === val));
  document.querySelector(".work__head-title")
    ?.classList.toggle("is-active", val === "all");
};

document.addEventListener("click", e => {
  const btn = e.target.closest(".work__cat, .work__head-title");
  if (!btn) return;
  const val = btn.dataset.val;
  // clicking the active category again clears back to all
  currentFilter = (val !== "all" && val === currentFilter) ? "all" : val;
  applyFilter(currentFilter);

  // bring the work section to the top, just under the fixed nav
  const work = document.getElementById("work");
  if (work) {
    const navH = (document.querySelector(".nav")?.offsetHeight || 0) + 8;
    const y = work.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
});


// ── IKEA insight toggle ─────────────────────────────────────────
const toggle = document.getElementById("insight-toggle");
if (toggle) {
  const intent = toggle.querySelector(".cs__toggle-face--intent");
  const gap    = toggle.querySelector(".cs__toggle-face--gap");
  const flip = () => {
    intent.hidden = !intent.hidden;
    gap.hidden    = !gap.hidden;
  };
  toggle.addEventListener("click", flip);
  toggle.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
  });
}


// ── Nav: translucent blur + lift once the page is scrolled ─────
const navScrollEl = document.querySelector(".nav");
if (navScrollEl) {
  let ticking = false;
  const update = () => {
    navScrollEl.classList.toggle("is-scrolled", window.scrollY > 8);
    ticking = false;
  };
  update();
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
}


// ── Reveal on scroll (fade-in as elements enter the viewport) ──
// Reduced motion: skip the effect entirely so content is simply there.
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const revealTargets = document.querySelectorAll(
    ".hero__media, .hero__hello, .hero__intro, .page-band, .intro__image, .intro__text > *, .home-intro, .work__head, .card, .skills__group, .contact__big, .contact__links, .contact-page > *, .resume__head, .resume__section, .project__head, .project__hero, .cs"
  );
  revealTargets.forEach(el => el.classList.add("reveal"));

  const io = new IntersectionObserver(
    (entries) => {
      // stagger only the elements that arrive together in one batch
      entries.filter(e => e.isIntersecting).forEach((entry, i) => {
        setTimeout(() => entry.target.classList.add("is-visible"), i * 70);
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.05, rootMargin: "0px 0px -6% 0px" }
  );
  revealTargets.forEach(el => io.observe(el));
}


// ── Card & hero videos ─────────────────────────────────────────
// Clips play while on screen and pause off (reduced-motion shows the poster).
const cardVideos = document.querySelectorAll(".card__panel video, .project__hero video");
if (cardVideos.length && "IntersectionObserver" in window) {
  const videoIO = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting && !prefersReducedMotion) {
        target.play().catch(() => {}); // autoplay can be refused; ignore
      } else {
        target.pause();
      }
    });
  }, { threshold: 0.2 });

  cardVideos.forEach(v => videoIO.observe(v)); // autoplay while on screen
}


// ── Landing greeting: cycles Hello / 你好 / こんにちは ──────────
const greeting = document.getElementById("greeting");
if (greeting) {
  const GREETINGS = ["Hello", "你好", "こんにちは"];
  const STAGGER = 60;   // per-character delay
  const HOLD    = 1500; // pause while fully shown
  const wait    = ms => new Promise(res => setTimeout(res, ms));
  const reduce  = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderWord = word => {
    greeting.textContent = "";
    greeting.setAttribute("aria-label", word);
    return Array.from(word).map(ch => {
      const s = document.createElement("span");
      s.className = "landing__gchar";
      s.textContent = ch;
      greeting.appendChild(s);
      return s;
    });
  };

  if (reduce) {
    let gi = 0;
    renderWord(GREETINGS[0]).forEach(c => c.classList.add("is-in"));
    setInterval(() => {
      gi = (gi + 1) % GREETINGS.length;
      renderWord(GREETINGS[gi]).forEach(c => c.classList.add("is-in"));
    }, 2800);
  } else {
    (async function loop() {
      let gi = 0;
      let chars = renderWord(GREETINGS[0]);
      while (true) {
        // reveal left → right
        chars.forEach((c, i) => setTimeout(() => c.classList.add("is-in"), i * STAGGER));
        await wait((chars.length - 1) * STAGGER + 420 + HOLD);

        // clear right → left
        const n = chars.length;
        chars.forEach((c, i) => setTimeout(() => c.classList.add("is-out"), (n - 1 - i) * STAGGER));
        await wait((n - 1) * STAGGER + 420);

        gi = (gi + 1) % GREETINGS.length;
        chars = renderWord(GREETINGS[gi]);
        await wait(60);
      }
    })();
  }
}


// ── Reading progress bar ───────────────────────────────────────
const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
document.body.appendChild(progressBar);

// use the project's accent colour on case-study pages
const projectArticle = document.querySelector("article.project");
if (projectArticle) {
  const accent = getComputedStyle(projectArticle).getPropertyValue("--red").trim();
  if (accent) progressBar.style.background = accent;
}

let progressTick = false;
window.addEventListener("scroll", () => {
  if (progressTick) return;
  progressTick = true;
  requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    progressTick = false;
  });
}, { passive: true });


// ── Animated stat counters (case-study pages) ──────────────────
const statHeads = document.querySelectorAll(".cs__phase h3");
if (statHeads.length) {
  const NUM_RE = /[\d][\d,]*(?:\.\d+)?/;

  const animateCount = (el, match) => {
    const raw      = match[0];
    const target   = parseFloat(raw.replace(/,/g, ""));
    const decimals = (raw.split(".")[1] || "").length;
    const useComma = raw.includes(",");
    const before   = el.textContent.slice(0, match.index);
    const after    = el.textContent.slice(match.index + raw.length);
    const start    = performance.now();
    const DUR      = 1100;

    const step = now => {
      const t     = Math.min((now - start) / DUR, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      let val     = (target * eased).toFixed(decimals);
      if (useComma) val = Number(val).toLocaleString("en-US", {
        minimumFractionDigits: decimals, maximumFractionDigits: decimals
      });
      el.textContent = before + val + after;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const counterIO = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      counterIO.unobserve(entry.target);
      const match = entry.target.textContent.match(NUM_RE);
      if (match) animateCount(entry.target, match);
    });
  }, { threshold: 0.6 });

  statHeads.forEach(el => counterIO.observe(el));
}


// ── Hero image parallax (case-study pages) ─────────────────────
const heroImgs = document.querySelectorAll(".project__hero img");
if (heroImgs.length && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
  let parallaxTick = false;
  const applyParallax = () => {
    heroImgs.forEach(img => {
      const rect = img.parentElement.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      img.style.transform = `translateY(${offset * -16}px) scale(1.05)`;
    });
    parallaxTick = false;
  };
  window.addEventListener("scroll", () => {
    if (parallaxTick) return;
    parallaxTick = true;
    requestAnimationFrame(applyParallax);
  }, { passive: true });
  applyParallax();
}


// ── Section index (table of contents) for case-study pages ────
if (document.body.dataset.page === "project") {
  const article = document.querySelector("article.project");
  const labelOf = s => s.querySelector(".cs__label, .cs__eyebrow, .cs__display");
  const sections = article
    ? [...article.querySelectorAll(".cs")].filter(labelOf)
    : [];

  if (article && sections.length >= 2) {
    const used = new Set();
    const slug = text => {
      const base = text.toLowerCase().replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
      let s = base, i = 2;
      while (used.has(s)) s = `${base}-${i++}`;
      used.add(s);
      return s;
    };

    const toc = document.createElement("nav");
    toc.className = "toc";
    toc.setAttribute("aria-label", "Sections");
    const ol = document.createElement("ol");

    const links = sections.map(sec => {
      const label = labelOf(sec).textContent.trim();
      if (!sec.id) sec.id = slug(label);
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#" + sec.id;
      a.textContent = label;
      li.appendChild(a);
      ol.appendChild(li);
      return { sec, a };
    });

    toc.appendChild(ol);
    article.appendChild(toc); // inside .project so it inherits the accent (--red)

    const setActive = id =>
      links.forEach(({ sec, a }) => a.classList.toggle("is-active", sec.id === id));

    if ("IntersectionObserver" in window) {
      const spy = new IntersectionObserver(entries => {
        const vis = entries.filter(e => e.isIntersecting);
        if (vis.length) {
          setActive(vis.sort((a, b) => a.target.offsetTop - b.target.offsetTop)[0].target.id);
        }
      }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
      links.forEach(({ sec }) => spy.observe(sec));
    }
    setActive(links[0].sec.id);
  }
}


// ── Hero logo: scrub the hand-drawn frames by cursor travel distance ──
// advance one frame only after the mouse has moved a good distance, so it
// takes a long drag across the screen to cycle through the drawing.
const logoAnim = document.querySelector(".hero__logoanim");
if (logoAnim) {
  const frames = [...logoAnim.querySelectorAll(".hero__frame")];
  const STEP_DIST = 400; // px of cursor travel per frame change
  let idx = 0, travel = 0, lastX = null, lastY = null;
  window.addEventListener("mousemove", e => {
    if (lastX !== null) travel += Math.hypot(e.clientX - lastX, e.clientY - lastY);
    lastX = e.clientX; lastY = e.clientY;
    if (travel < STEP_DIST) return;
    travel = 0;
    frames[idx].classList.remove("is-shown");
    idx = (idx + 1) % frames.length;
    frames[idx].classList.add("is-shown");
  }, { passive: true });
}


// ── Nav scroll-spy (single page: light up the current section) ──
const spySections = document.querySelectorAll("main > section[id]");
const spyLinks = new Map(
  [...document.querySelectorAll('.nav__links a[href^="#"]')]
    .map(a => [a.getAttribute("href").slice(1), a])
);
if (spySections.length && spyLinks.size && "IntersectionObserver" in window) {
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      spyLinks.forEach(a => a.classList.remove("is-active"));
      const link = spyLinks.get(e.target.id);
      if (link) link.classList.add("is-active");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  spySections.forEach(s => spy.observe(s));
}


// ── Page fade transitions (internal links) ─────────────────────
document.addEventListener("click", e => {
  const a = e.target.closest("a[href]");
  if (!a || a.target === "_blank") return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const href = a.getAttribute("href");
  if (!href || href.startsWith("#") || /^(https?:|mailto:|tel:)/.test(href)) return;
  e.preventDefault();
  document.body.classList.add("is-exiting");
  setTimeout(() => { window.location.href = href; }, 220);
});
// restore state when returning via back/forward cache
window.addEventListener("pageshow", () => document.body.classList.remove("is-exiting"));
