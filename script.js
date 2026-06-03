// Owen Chen — portfolio

// ── Custom cursor (thin ring + dot) ────────────────────────────
const cursorOuter = document.createElement("div");
cursorOuter.className = "cursor-outer";
const cursorInner = document.createElement("div");
cursorInner.className = "cursor-inner";
document.body.append(cursorOuter, cursorInner);

document.addEventListener("mousemove", e => {
  cursorOuter.style.left = e.clientX + "px";
  cursorOuter.style.top  = e.clientY + "px";
  cursorInner.style.left = e.clientX + "px";
  cursorInner.style.top  = e.clientY + "px";
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


// ── Projects filter dropdown ────────────────────────────────────
const filterItems   = document.querySelectorAll(".work__filter-item");
const filterCurrent = document.querySelector(".work__filter-current");

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
