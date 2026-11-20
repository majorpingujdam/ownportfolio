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
  { href: "work/project-17.html", category: "product", title: "Procter & Gamble",
    desc: "Behavioral design for a household air-care product. Protected — NDA.",
    locked: true, img: "Photos/PG/pg-logo.png", alt: "Procter & Gamble",
    label: "Protected project", w: 600, h: 600,
    role: "Design researcher · sponsored studio · 2026",
    blurb: "Reframing a household air-care product around when people actually notice their home — moving use from reactive to proactive. Usage-journey mapping into concept prototypes." },
  { href: "work/project-2.html",  category: "internship", title: "AiWalker",
    desc: "Full-cycle healthcare service — hospital to home rehab.",
    video: "Photos/Ai-robotics/ai-new.mp4", label: "AiWalker exoskeleton rendering", w: 800, h: 550,
    role: "Product service design · Beijing Ai-Robotics · 2025",
    blurb: "Surveyed 103 rehabilitation patients expecting complaints about the hardware. The hardware was fine — what broke was the handoff home. Mapped the service and proposed four interventions at the break point." },
  { href: "work/project-3.html",  category: "internship", title: "Vignette",
    desc: "Kitchen room-set design at IKEA China.",
    img: "work-3.jpg", alt: "IKEA Visual Merchandising", w: 1440, h: 1080,
    role: "Visual merchandising · IKEA China · 2024",
    blurb: "Kitchen room-set design for vignette exhibitions: 15+ Nordic-style layouts modelled in SketchUp, built from 120+ pieces of reference material." },
  { href: "work/project-1.html",  category: "product", title: "Dosage-Pal",
    desc: "Elder care medication management app.",
    img: "work-1.jpg", alt: "Dosage-Pal", w: 2304, h: 1728, pos: "35% 50%",
    role: "Product design · Parsons",
    blurb: "A smart prescription cap that logs every dose. It started at my mother’s kitchen counter; 43% of the 96 people I surveyed forget a dose, and what they do next is the design problem." },
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
    // a protected project shows its client mark faintly, never the work itself
    if (p.locked && p.img) {
      return `<div class="card__locked">`
           + `<img class="card__logoimg" src="${esc(p.img)}" alt="${esc(p.alt || p.title)}" `
           + `width="${p.w}" height="${p.h}" loading="lazy" decoding="async" />`
           + `</div>`;
    }
    if (p.locked && !p.img && !p.video) {
      return `<div class="card__locked" aria-hidden="true">`
           + `<svg viewBox="0 0 24 24" width="34" height="34">`
           + `<path d="M7 10V7a5 5 0 0 1 10 0v3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`
           + `<rect x="4.5" y="10" width="15" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/>`
           + `</svg></div>`;
    }
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
  const badge = label => `<span class="card__lock" aria-hidden="true">`
    + `<svg viewBox="0 0 24 24" width="13" height="13"><path d="M7 10V7a5 5 0 0 1 10 0v3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><rect x="4.5" y="10" width="15" height="10" rx="2" fill="currentColor"/></svg>`
    + `${label}</span>`;
  const lockBadge = badge("in progress");

  const FEATURED = 4;   // first N projects get the spotlight treatment

  const panel = (p, i) =>
    `<div class="card__panel">${media(p)}`
    + (LOCKED ? lockBadge + `<span class="card__soon">in progress</span>`
              : (p.locked ? badge("passcode") : ""))
    + `</div>`;

  const openTag = p => LOCKED
    ? `<div class="card__link is-locked" role="link" aria-disabled="true" aria-label="${esc(p.title)} — in progress">`
    : `<a href="${esc(p.href)}" class="card__link">`;
  const closeTag = () => LOCKED ? `</div>` : `</a>`;

  const bigCard = (p, i) => `
    <li class="card card--big" data-category="${p.category}" style="--card-accent:${PALETTE[i % PALETTE.length]}">
      ${openTag(p)}
        <span class="card__shadow" aria-hidden="true"></span>
        <div class="card__inner">
          <div class="card__date">
            <span>${esc(CAT_LABEL[p.category] || p.category)}</span>
            ${p.role ? `<span class="card__role">${esc(p.role)}</span>` : ""}
          </div>
          <h3 class="card__title">${esc(p.title)}</h3>
          ${panel(p, i)}
          <div class="card__foot">
            <p class="card__blurb">${esc(p.blurb || p.desc)}</p>
            <span class="card__cta">${p.locked ? "request access" : "read the case study"} →</span>
          </div>
        </div>
      ${closeTag()}
    </li>`;

  const smallCard = (p, i) => `
    <li class="card" data-category="${p.category}" style="--card-accent:${PALETTE[i % PALETTE.length]}">
      ${openTag(p)}
        <span class="card__shadow" aria-hidden="true"></span>
        <div class="card__inner">
          <div class="card__date">${esc(CAT_LABEL[p.category] || p.category)}</div>
          <h3 class="card__title">${esc(p.title)}</h3>
          ${panel(p, i)}
          <div class="card__foot">${esc(p.desc)}</div>
        </div>
      ${closeTag()}
    </li>`;

  const featured = WORK_PROJECTS.slice(0, FEATURED);
  const rest     = WORK_PROJECTS.slice(FEATURED);

  const gridHtml = `
    <div class="work__featured" data-featured>
      <ol class="grid grid--featured">
        ${featured.map((p, i) => bigCard(p, i)).join("")}
      </ol>
    </div>
    <div class="work__rest" data-rest>
      <p class="work__more"><span>more projects</span></p>
      <ol class="grid">
        ${rest.map((p, i) => smallCard(p, i + FEATURED)).join("")}
      </ol>
    </div>`;

  mounts.forEach(m => { m.innerHTML = filterHtml + gridHtml; });
})();
