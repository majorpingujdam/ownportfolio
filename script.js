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


// ── Projects filter dropdown (hover + 3s stay-open) ─────────────
const filterItems   = document.querySelectorAll(".work__filter-item");
const filterCurrent = document.querySelector(".work__filter-current");
const filterWrapper = document.querySelector(".work__filter");
const filterMenu    = document.querySelector(".work__filter-menu");

if (filterWrapper && filterMenu) {
  let closeTimer;
  filterWrapper.addEventListener("mouseenter", () => {
    clearTimeout(closeTimer);
    filterMenu.classList.add("is-open");
  });
  filterWrapper.addEventListener("mouseleave", () => {
    closeTimer = setTimeout(() => filterMenu.classList.remove("is-open"), 3000);
  });
}

if (filterItems.length) {
  filterItems.forEach(item => {
    item.addEventListener("click", () => {
      filterItems.forEach(i => i.classList.remove("is-selected"));
      item.classList.add("is-selected");
      const val = item.dataset.val;
      if (filterCurrent) {
        filterCurrent.textContent = val === "all"
            ? "Key Labels"
            : item.textContent.trim();
      }

      if (filterMenu) filterMenu.classList.remove("is-open");

      // masonry has no per-category sections to scroll to, so filter in place
      document.querySelectorAll(".grid .card").forEach(card => {
        card.hidden = val !== "all" && card.dataset.category !== val;
      });

      // if the grid top has scrolled away, bring it back into view
      const grid = document.querySelector(".grid");
      if (grid && grid.getBoundingClientRect().top < 0) {
        const y = grid.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    });
  });
}


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


// ── Reveal on scroll (fade-in as elements enter the viewport) ──
// Reduced motion: skip the effect entirely so content is simply there.
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const revealTargets = document.querySelectorAll(
    ".intro__image, .intro__text > *, .home-intro, .work__head, .card, .contact__big, .contact__links, .contact-page > *, .resume__head, .resume__section, .project__head, .project__hero, .cs"
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


// ── Card videos: play only while on screen ─────────────────────
const cardVideos = document.querySelectorAll(".card__panel video");
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
  cardVideos.forEach(v => videoIO.observe(v));
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
