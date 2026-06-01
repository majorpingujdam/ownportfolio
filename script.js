// Owen Chen — portfolio (minimal)

// Footer year
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Nav border on scroll
const nav = document.querySelector(".nav");
const onScroll = () => {
  if (window.scrollY > 12) nav.classList.add("is-scrolled");
  else nav.classList.remove("is-scrolled");
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Reveal on scroll
const revealTargets = document.querySelectorAll(
  ".hero__kicker, .hero__title, .hero__meta, .work__head, .card, .contact__big, .contact__links"
);
revealTargets.forEach((el) => el.classList.add("reveal"));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("is-visible"), i * 45);
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
);
revealTargets.forEach((el) => io.observe(el));
