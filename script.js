// Owen Chen — portfolio (minimal, multi-page)

// Footer year
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Profile photo show/hide toggle (bio page)
(() => {
  const btn = document.querySelector(".photo-toggle");
  const imgWrap = document.querySelector(".intro__image");
  if (!btn || !imgWrap) return;

  const KEY = "owen.photo.hidden";
  const apply = (hidden) => {
    imgWrap.classList.toggle("is-hidden", hidden);
    btn.textContent = hidden ? "show photo" : "hide photo";
    btn.setAttribute("aria-pressed", String(hidden));
  };

  apply(localStorage.getItem(KEY) === "1");

  btn.addEventListener("click", () => {
    const next = !imgWrap.classList.contains("is-hidden");
    apply(next);
    try { localStorage.setItem(KEY, next ? "1" : "0"); } catch {}
  });
})();

// Reveal on scroll
const revealTargets = document.querySelectorAll(
  ".intro__image, .intro__text > *, .work__head, .card, .contact__big, .contact__links, .contact-page > *, .resume__head, .resume__section"
);
revealTargets.forEach((el) => el.classList.add("reveal"));

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
revealTargets.forEach((el) => io.observe(el));
