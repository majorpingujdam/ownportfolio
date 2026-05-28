/* Owen Chen — portfolio interactions (minimal) */

// Footer year
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Reveal on scroll
const revealTargets = document.querySelectorAll(
  ".hero__title, .hero__note, .work__head, .index__item, .about__lede, .about__meta, .contact__big, .contact__links"
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

/* ---- Signature interaction: floating color preview on the work index ---- */
const preview = document.querySelector(".preview");
const items = document.querySelectorAll(".index__item");

if (preview && window.matchMedia("(hover: hover)").matches) {
  let px = 0, py = 0, tx = 0, ty = 0, raf = null;

  const loop = () => {
    px += (tx - px) * 0.14;
    py += (ty - py) * 0.14;
    preview.style.left = px + "px";
    preview.style.top = py + "px";
    raf = requestAnimationFrame(loop);
  };

  items.forEach((item) => {
    const color = item.dataset.color || "#888";
    const title = item.querySelector(".index__title")?.textContent || "";

    item.addEventListener("mouseenter", (e) => {
      preview.style.background = color;
      preview.innerHTML =
        `<span style="position:absolute;left:14px;bottom:12px;color:rgba(255,255,255,.92);` +
        `font-family:Georgia,serif;font-style:italic;font-size:20px;">${title}</span>`;
      preview.classList.add("is-visible");
      tx = px = e.clientX;
      ty = py = e.clientY;
      if (!raf) loop();
    });

    item.addEventListener("mousemove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
    });

    item.addEventListener("mouseleave", () => {
      preview.classList.remove("is-visible");
      cancelAnimationFrame(raf);
      raf = null;
    });
  });
}
