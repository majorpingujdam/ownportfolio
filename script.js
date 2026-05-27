// Portfolio — small, dependency-free interactions

// ---------- Custom cursor ----------
const cursor = document.querySelector(".cursor");
if (cursor && window.matchMedia("(hover: hover)").matches) {
  let x = window.innerWidth / 2, y = window.innerHeight / 2;
  let tx = x, ty = y;

  window.addEventListener("mousemove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });

  const render = () => {
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;
    cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    requestAnimationFrame(render);
  };
  render();

  const hoverables = document.querySelectorAll("a, button, .project");
  hoverables.forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
  });
}

// ---------- Clock in nav ----------
const clock = document.getElementById("clock");
if (clock) {
  const tick = () => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    clock.textContent = `${hh}:${mm} · Local`;
  };
  tick();
  setInterval(tick, 1000 * 30);
}

// ---------- Year ----------
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// ---------- Reveal on scroll ----------
const revealTargets = document.querySelectorAll(
  ".hero__title .line, .hero__intro, .hero__scroll, .section-head, .project, .about__lede, .about__list, .contact__big, .contact__links"
);
revealTargets.forEach((el) => el.classList.add("reveal"));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("is-visible"), i * 60);
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
);
revealTargets.forEach((el) => io.observe(el));

// ---------- Per-project hover color ----------
document.querySelectorAll(".project").forEach((p) => {
  const c = p.getAttribute("data-color");
  if (c) p.style.setProperty("--bg-2", c);
});
