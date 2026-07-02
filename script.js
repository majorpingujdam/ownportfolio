// Owen Chen — portfolio

// ── Minimal dot cursor ─────────────────────────────────────────
const dot = document.createElement("div");
dot.className = "cursor-dot";
document.body.appendChild(dot);

document.addEventListener("mousemove", e => {
  dot.style.left = e.clientX + "px";
  dot.style.top  = e.clientY + "px";
  document.body.classList.add("cursor-ready");
});
document.addEventListener("mouseleave", () => document.body.classList.remove("cursor-ready"));
document.addEventListener("mouseenter", () => document.body.classList.add("cursor-ready"));

["a", "button", "[role='button']", ".cs__toggle", ".work__filter-item", ".card__link"].forEach(sel => {
  document.querySelectorAll(sel).forEach(el => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-active"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-active"));
  });
});


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

      if (val === "all") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const target = document.querySelector(`.grid .card[data-category="${val}"]`);
        if (target) {
          const y = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
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


// ── Reveal on scroll ───────────────────────────────────────────
const isWorkPage = document.body.dataset.page === "work";

const revealTargets = document.querySelectorAll(
  ".intro__image, .intro__text > *, .work__head, .card, .contact__big, .contact__links, .contact-page > *, .resume__head, .resume__section, .project__head, .project__hero, .cs"
);
revealTargets.forEach(el => el.classList.add("reveal"));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("is-visible"), i * 40);
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.05, rootMargin: "0px 0px -8% 0px" }
);

revealTargets.forEach(el => {
  // cards on the work page are handled by the stagger below — skip IO for them
  if (isWorkPage && el.classList.contains("card")) return;
  io.observe(el);
});

// work page: stagger all cards in on load
if (isWorkPage) {
  const workCards = [...document.querySelectorAll(".grid .card")];
  setTimeout(() => {
    workCards.forEach((c, i) => {
      setTimeout(() => c.classList.add("is-visible"), i * 80);
    });
  }, 80);
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


// ── Trailing cursor ring ───────────────────────────────────────
if (window.matchMedia("(hover: hover)").matches) {
  const ring = document.createElement("div");
  ring.className = "cursor-ring";
  document.body.appendChild(ring);

  let ringX = -100, ringY = -100, targetX = -100, targetY = -100;
  document.addEventListener("mousemove", e => {
    targetX = e.clientX;
    targetY = e.clientY;
  });
  (function trail() {
    ringX += (targetX - ringX) * 0.16;
    ringY += (targetY - ringY) * 0.16;
    ring.style.left = ringX + "px";
    ring.style.top  = ringY + "px";
    requestAnimationFrame(trail);
  })();
}


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
