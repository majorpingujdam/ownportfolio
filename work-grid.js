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
    img: "work-2.jpg", alt: "AiWalker", w: 1400, h: 1050 },
  { href: "work/project-3.html",  category: "internship", title: "Vignette",
    desc: "Kitchen room-set design at IKEA China.",
    img: "work-3.jpg", alt: "IKEA Visual Merchandising", w: 1440, h: 1080 },
  { href: "work/project-1.html",  category: "product", title: "Dosage-Pal",
    desc: "Elder care medication management app.",
    img: "work-1.jpg", alt: "Dosage-Pal", w: 2304, h: 1728 },
  { href: "work/project-4.html",  category: "product", title: "Sky Harvest",
    desc: "Rooftop farm + drone delivery shortening farm to table.",
    img: "work-4.jpg", alt: "Sky Harvest", w: 1440, h: 1080 },
  { href: "work/project-5.html",  category: "product", title: "BioColor Tag",
    desc: "Anthocyanin label that detects food spoilage through color change.",
    img: "work-5.jpg", alt: "BioColor Tag", w: 1440, h: 1080 },
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

  const media = p => p.video
    ? `<video src="${esc(p.video)}" width="${p.w}" height="${p.h}"${reduceMotion ? ' preload="metadata"' : " autoplay"} muted loop playsinline aria-label="${esc(p.label)}"></video>`
    : `<img src="${esc(p.img)}" alt="${esc(p.alt)}" width="${p.w}" height="${p.h}" loading="lazy" decoding="async" />`;

  const filterHtml = `
    <header class="work__head">
      <div class="work__filter">
        <button class="work__filter-btn" aria-haspopup="listbox">
          <span class="work__filter-current">Key Labels</span>
          <span class="work__filter-icon">↓</span>
        </button>
        <ul class="work__filter-menu" role="listbox">
          ${WORK_FILTERS.map((f, i) =>
            `<li class="work__filter-item${i === 0 ? " is-selected" : ""}" data-val="${f.val}">${esc(f.label)}</li>`
          ).join("")}
        </ul>
      </div>
    </header>`;

  const gridHtml = `
    <ol class="grid">
      ${WORK_PROJECTS.map(p => `
        <li class="card" data-category="${p.category}">
          <a href="${esc(p.href)}" class="card__link">
            <div class="card__panel">${media(p)}</div>
            <div class="card__foot">
              <h3 class="card__title">${esc(p.title)}</h3>
              <p class="card__desc">${esc(p.desc)}</p>
            </div>
          </a>
        </li>`).join("")}
    </ol>`;

  mounts.forEach(m => { m.innerHTML = filterHtml + gridHtml; });
})();
