// Owen Chen — shared work grid
// Single source of truth for the project grid used on index.html and
// projects.html. Each page only needs <section class="work" data-work></section>
// and must load this file before script.js.

const WORK_FILTERS = [
  { val: "all",        label: "All" },
  { val: "internship", label: "Internship" },
  { val: "product",    label: "Product" },
  { val: "ai",         label: "AI / ML / NLP" },
  { val: "generative", label: "Generative Art" },
  { val: "gaming",     label: "Gaming" },
];

// w / h are the media's intrinsic pixel size — they reserve space so lazy
// images don't shift the masonry layout while loading.
const WORK_PROJECTS = [
  { href: "work/project-2.html",  category: "internship", title: "AiWalker",
    desc: "Clinic-to-home rehab service design.",
    video: "Photos/Ai-robotics/ai-new.mp4", label: "AiWalker exoskeleton rendering", w: 800, h: 550 },
  { href: "work/project-3.html",  category: "internship", title: "Vignette",
    desc: "Kitchen room-set design at IKEA China.",
    img: "work-3.jpg", alt: "IKEA Visual Merchandising", w: 1440, h: 1080 },
  { href: "work/project-1.html",  category: "product", title: "Dosage-Pal",
    desc: "Elder care medication management app.",
    img: "work-1.jpg", alt: "Dosage-Pal", w: 2304, h: 1728, pos: "35% 50%" },
  { href: "work/project-4.html",  category: "product", title: "Sky Harvest",
    desc: "Rooftop farm + drone delivery shortening farm to table.",
    img: "work-4.jpg", alt: "Sky Harvest", w: 1440, h: 1080 },
  { href: "work/project-5.html",  category: "product", title: "BioColor Tag",
    desc: "Anthocyanin label that detects food spoilage through color change.",
    img: "work-5.jpg", alt: "BioColor Tag", w: 1440, h: 1080 },
  { href: "work/project-16.html", category: "product", title: "Glossy Island",
    desc: "Interactive light installation — fluorescent acrylic that reveals itself as you approach.",
    video: "Photos/Glossy%20Island/glossy.mp4", poster: "Photos/Glossy%20Island/front.jpg",
    label: "Glossy Island installation reacting to a viewer", w: 763, h: 772 },
  { href: "work/project-6.html",  category: "product", title: "Scan-Verse",
    desc: "3D scanning platform turning objects into interactive AR memories.",
    img: "work-6.jpg", alt: "Scan-Verse", w: 1440, h: 1080 },
  { href: "work/project-9.html",  category: "ai", title: "Bio-Fracta Stamp",
    desc: "GAN-generated fractal transdermal patch for pediatric drug delivery.",
    img: "Photos/AI%20ML/Bio%20fracta%20Stamp/Profile.png", alt: "Bio-Fracta Stamp", w: 1920, h: 1080 },
  { href: "work/project-12.html", category: "ai", title: "Dialogue Guardian",
    desc: "NLP sentiment analyzer for ethical android police communication.",
    img: "Photos/AI%20ML/Dialogue%20Guardian/Profile.png", alt: "Dialogue Guardian", w: 1920, h: 1080 },
  { href: "work/project-7.html",  category: "generative", title: "P5.js Series",
    desc: "Creative coding experiments built with P5.js.",
    img: "Photos/GenArt/p5.js%20series/front%20page.gif", alt: "P5.js Series", w: 540, h: 358 },
  { href: "work/project-10.html", category: "generative", title: "Identity Consent Camera",
    desc: "Exploring identity and consent through generative visuals.",
    img: "Photos/GenArt/consent%20camera/Consent%20Camera%20-%20front%20page.gif", alt: "Identity Consent Camera", w: 632, h: 554 },
  { href: "work/project-11.html", category: "generative", title: "Deterministic Chaos",
    desc: "Exploring order and chaos through generative systems.",
    img: "Photos/GenArt/Deterministic%20Chaos/chaos.gif", alt: "Deterministic Chaos", w: 470, h: 636 },
  { href: "work/project-15.html", category: "gaming", title: "Netsphere",
    desc: "Cyberpunk terminal narrative game — infiltrate the system as KAEL.",
    video: "Photos/Games/Netsphere/Profile-web.mp4", label: "Netsphere gameplay preview", w: 720, h: 378 },
  { href: "work/project-8.html",  category: "gaming", title: "Rube Goldberg Machine",
    desc: "A chain-reaction contraption built for delightful over-engineering.",
    img: "Photos/Games/Rube%20Goldberg%20Machine/Profile.png", alt: "Rube Goldberg Machine", w: 1521, h: 934 },
  { href: "work/project-13.html", category: "gaming", title: "Oliver!",
    desc: "Game design and development project.",
    img: "Photos/Games/Oliver/Profile.gif", alt: "Oliver!", w: 598, h: 398 },
  { href: "work/project-14.html", category: "gaming", title: "Where Is My Data",
    desc: "Game design and development project.",
    img: "Photos/Games/Where%20Is%20My%20Data/Profile.gif", alt: "Where Is My Data", w: 990, h: 988 },
];

(function renderWorkGrid() {
  const mounts = document.querySelectorAll("[data-work]");
  if (!mounts.length) return;

  const esc = s => String(s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // reduced motion: render videos paused (first frame) instead of autoplaying
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const media = p => {
    if (p.video) {
      const poster = p.poster ? ` poster="${esc(p.poster)}"` : "";
      return `<video src="${esc(p.video)}"${poster} width="${p.w}" height="${p.h}"${reduceMotion ? ' preload="metadata"' : " autoplay"} muted loop playsinline aria-label="${esc(p.label || p.title)}"></video>`;
    }
    const pos = p.pos ? ` style="object-position:${esc(p.pos)}"` : "";
    return `<img src="${esc(p.img)}" alt="${esc(p.alt)}" width="${p.w}" height="${p.h}"${pos} loading="lazy" decoding="async" />`;
  };

  // category value → human label, shown on each card's top row
  const CAT_LABEL = Object.fromEntries(WORK_FILTERS.map(f => [f.val, f.label]));
  // offset "paper" block colors, cycled per card
  const PALETTE = ["#a7b53f", "#4b63e0", "#b79cf0", "#ff9d7e", "#2fb6a0", "#6cc24a", "#f2b134", "#5d6cf0"];

  // clickable category labels (friendly words → WORK_PROJECTS categories)
  const CATS = [
    { val: "internship", label: "internships" },
    { val: "product",    label: "products" },
    { val: "ai",         label: "ai" },
    { val: "generative", label: "art" },
    { val: "gaming",     label: "games" },
  ];
  const filterHtml = `
    <header class="work__head">
      <button type="button" class="work__head-title is-active" data-val="all" aria-label="Show all work">work</button>
      <div class="work__cats" role="group" aria-label="Filter work by type">
        ${CATS.map(c => `<button type="button" class="work__cat" data-val="${c.val}">${esc(c.label)}</button>`)
              .join('<span class="work__cat-sep" aria-hidden="true">·</span>')}
      </div>
    </header>`;

  // projects aren't public yet — lock the cards so clicks don't open them
  const LOCKED = false;
  const lockBadge = `<span class="card__lock" aria-hidden="true">`
    + `<svg viewBox="0 0 24 24" width="13" height="13"><path d="M7 10V7a5 5 0 0 1 10 0v3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><rect x="4.5" y="10" width="15" height="10" rx="2" fill="currentColor"/></svg>`
    + `in progress</span>`;

  const gridHtml = `
    <ol class="grid">
      ${WORK_PROJECTS.map((p, i) => `
        <li class="card" data-category="${p.category}" style="--card-accent:${PALETTE[i % PALETTE.length]}">
          ${LOCKED
            ? `<div class="card__link is-locked" role="link" aria-disabled="true" aria-label="${esc(p.title)} — in progress">`
            : `<a href="${esc(p.href)}" class="card__link">`}
            <span class="card__shadow" aria-hidden="true"></span>
            <div class="card__inner">
              <div class="card__date">${esc(CAT_LABEL[p.category] || p.category)}</div>
              <h3 class="card__title">${esc(p.title)}</h3>
              <div class="card__panel">${media(p)}${LOCKED ? lockBadge + `<span class="card__soon">in progress</span>` : ""}</div>
              <div class="card__foot">${esc(p.desc)}</div>
            </div>
          ${LOCKED ? `</div>` : `</a>`}
        </li>`).join("")}
    </ol>`;

  mounts.forEach(m => { m.innerHTML = filterHtml + gridHtml; });
})();
