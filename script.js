/* ============================================
   Owen Chen — portfolio interactions
   ============================================ */

// ---------- Footer year ----------
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// ---------- Live clock in Now panel ----------
const clock = document.getElementById("clock");
const tick = () => {
  if (!clock) return;
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  clock.textContent = `${hh}:${mm}`;
};
tick();
setInterval(tick, 1000 * 30);

// ---------- Rotating "Now" activity ----------
const rotator = document.getElementById("rotator");
const activities = [
  "sketching",
  "reading",
  "prototyping",
  "noticing things",
  "drinking coffee",
  "studying HCI",
  "annotating papers",
];
let actIdx = 0;
if (rotator) {
  setInterval(() => {
    rotator.style.opacity = "0";
    setTimeout(() => {
      actIdx = (actIdx + 1) % activities.length;
      rotator.textContent = activities[actIdx];
      rotator.style.opacity = "1";
    }, 300);
  }, 3500);
}

// ---------- Hero title in-view ----------
const heroTitle = document.querySelector(".hero__title");
if (heroTitle) {
  requestAnimationFrame(() => heroTitle.classList.add("is-in"));
}

// ---------- Reveal on scroll ----------
const revealTargets = document.querySelectorAll(
  ".hero__kicker, .hero__sub, .stats li, .section__head, .tile, .about__lede, .about__list, .contact__pre, .magnet, .contact__post"
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

// ---------- Squiggle + signature draw-in ----------
const drawTargets = document.querySelectorAll(".squiggle, .signature");
const drawIo = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-drawn");
        drawIo.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);
drawTargets.forEach((el) => drawIo.observe(el));

// ---------- Letter scramble on hover ----------
const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#abcdefghijklmnopqrstuvwxyz";
const scrambleEls = document.querySelectorAll(".scramble");

const scrambleText = (el) => {
  const target = el.dataset.text || el.textContent;
  const len = target.length;
  let frame = 0;
  const totalFrames = 18;

  const interval = setInterval(() => {
    let out = "";
    for (let i = 0; i < len; i++) {
      const settleAt = Math.floor((i / len) * totalFrames);
      if (frame >= settleAt) {
        out += target[i];
      } else {
        out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
    }
    el.textContent = out;
    frame++;
    if (frame > totalFrames) {
      clearInterval(interval);
      el.textContent = target;
    }
  }, 32);
};

scrambleEls.forEach((el) => {
  el.style.cursor = "default";
  el.addEventListener("mouseenter", () => scrambleText(el));
});

// ---------- Magnetic button ----------
const magnets = document.querySelectorAll("[data-magnet]");
magnets.forEach((m) => {
  const strength = 0.25;
  const reset = () => {
    m.style.transform = "translate(0, 0)";
  };
  m.addEventListener("mousemove", (e) => {
    const r = m.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    m.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  });
  m.addEventListener("mouseleave", reset);
});
