// Owen Chen — portfolio (minimal, multi-page)

// Footer year
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// IKEA insight toggle (project-3)
const toggle = document.getElementById("insight-toggle");
if (toggle) {
  const intent = toggle.querySelector(".cs__toggle-face--intent");
  const gap    = toggle.querySelector(".cs__toggle-face--gap");
  const flip = () => {
    intent.hidden = !intent.hidden;
    gap.hidden    = !gap.hidden;
  };
  toggle.addEventListener("click", flip);
  toggle.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
  });
}

// Work page category filter
const workFilter = document.getElementById("work-filter");
if (workFilter) {
  workFilter.addEventListener("change", () => {
    const val = workFilter.value;
    document.querySelectorAll(".grid .card").forEach((card) => {
      const match = val === "all" || card.dataset.category === val;
      card.style.opacity = match ? "" : "0";
      card.style.pointerEvents = match ? "" : "none";
      card.style.display = match ? "" : "none";
    });
  });
}


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
