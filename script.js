// Owen Chen — portfolio interactions (minimal)

// Reveal on scroll
const revealTargets = document.querySelectorAll(
  ".hero__kicker, .hero__title, .hero__meta, .work__head, .card, .bio__image, .bio__text > *, .contact__big, .contact__links, .symbols, .foot__label"
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

// Nav active-link spy — highlights current section in blue
const navLinks = document.querySelectorAll(".nav__links a");
const sections = ["work", "bio", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const setActive = () => {
  const y = window.scrollY + window.innerHeight * 0.35;
  let current = null;
  sections.forEach((s) => {
    if (s.offsetTop <= y) current = s.id;
  });
  navLinks.forEach((a) => {
    const matches = current && a.getAttribute("href") === "#" + current;
    a.classList.toggle("is-active", !!matches);
  });
};
window.addEventListener("scroll", setActive, { passive: true });
setActive();
