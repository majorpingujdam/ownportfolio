// Owen Chen — portfolio

// ── Custom SVG cursor ──────────────────────────────────────────
const cursorEl = document.createElement("div");
cursorEl.className = "cursor-svg";
// Arrow pointer shape — hotspot tip at (5, 3) in SVG space
cursorEl.innerHTML = `<svg width="34" height="40" viewBox="0 0 34 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M5 3 L5 31 L13 24 L19 36 L24 34 L18 22 L28 22 Z"
        fill="white" stroke="#1a1a1a" stroke-width="3.2"
        stroke-linejoin="round" stroke-linecap="round"/>
</svg>`;
document.body.appendChild(cursorEl);

document.addEventListener("mousemove", e => {
  // offset so the tip (5px, 3px inside SVG) aligns with the actual pointer
  cursorEl.style.left = (e.clientX - 5) + "px";
  cursorEl.style.top  = (e.clientY - 3) + "px";
  document.body.classList.add("cursor-ready");
});
document.addEventListener("mouseleave", () => document.body.classList.remove("cursor-ready"));
document.addEventListener("mouseenter", () => document.body.classList.add("cursor-ready"));

function addCursorHover(selector) {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-active"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-active"));
  });
}
addCursorHover("a, button, [role='button'], .cs__toggle, .work__filter-item, .card__link");


// ── Projects filter dropdown (hover + 6s stay-open) ─────────────
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
    closeTimer = setTimeout(() => filterMenu.classList.remove("is-open"), 6000);
  });
}

if (filterItems.length) {
  filterItems.forEach(item => {
    item.addEventListener("click", () => {
      filterItems.forEach(i => i.classList.remove("is-selected"));
      item.classList.add("is-selected");
      const val = item.dataset.val;
      if (filterCurrent) {
        filterCurrent.textContent = val === "all" ? "Key Labels" : val;
      }
      document.querySelectorAll(".grid .card").forEach(card => {
        const match = val === "all" || card.dataset.category === val;
        card.style.display = match ? "" : "none";
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
revealTargets.forEach(el => io.observe(el));
