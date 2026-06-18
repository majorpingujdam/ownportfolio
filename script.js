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
            : val.charAt(0).toUpperCase() + val.slice(1);
      }

      const cards = [...document.querySelectorAll(".grid .card")];
      const matching    = cards.filter(c => val === "all" || c.dataset.category === val);
      const nonMatching = cards.filter(c => !(val === "all" || c.dataset.category === val));

      // fade out cards that don't match, then hide them
      nonMatching.forEach(c => {
        c.classList.remove("is-visible");
        setTimeout(() => { c.style.display = "none"; }, 350);
      });

      // fade in matching cards with stagger
      matching.forEach((c, i) => {
        c.style.display = "";
        c.classList.remove("is-visible");
        setTimeout(() => c.classList.add("is-visible"), 60 + i * 80);
      });
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
  ".intro__image, .intro__text > *, .work__head, .card, .contact__big, .contact__links, .contact-page > *, .resume__head, .resume__section"
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
  { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
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
