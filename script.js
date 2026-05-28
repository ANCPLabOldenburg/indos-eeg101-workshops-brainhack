// =====================================================================
// INDoS x EEG101 at OHBM BrainHack 2026
// Three single-page tabs (Home, Programme, Links) with a sticky page-TOC
// on the Programme view, clickable schedule cells that scroll to session
// descriptions, a theme toggle, an image-gallery modal, and the workflow
// SVG animation.
// =====================================================================

// ---------- Page switching ----------
const pageViews = document.querySelectorAll("[data-page-view]");
const pageTabs = document.querySelectorAll(".page-tab");

function activatePage(pageName, opts = {}) {
  const { scrollTo: scrollTarget, scrollTop = false } = opts;
  let matched = false;
  pageViews.forEach((view) => {
    const isActive = view.dataset.pageView === pageName;
    view.hidden = !isActive;
    if (isActive) matched = true;
  });
  pageTabs.forEach((tab) => {
    if (tab.dataset.page === pageName) tab.setAttribute("aria-current", "page");
    else tab.removeAttribute("aria-current");
  });
  if (!matched && pageViews.length) pageViews[0].hidden = false;
  document.body.dataset.activePage = pageName;

  if (scrollTarget) {
    const node = document.getElementById(scrollTarget);
    if (node) {
      requestAnimationFrame(() => node.scrollIntoView({ behavior: "smooth", block: "start" }));
      return;
    }
  }
  if (scrollTop) window.scrollTo({ top: 0, behavior: "smooth" });
}

function pageFromHash() {
  const hash = (window.location.hash || "").replace(/^#/, "");
  if (!hash) return { page: null, anchor: null };
  const directView = document.querySelector(`[data-page-view="${CSS.escape(hash)}"]`);
  if (directView) return { page: hash, anchor: null };
  const owningEl = document.getElementById(hash);
  if (!owningEl) return { page: null, anchor: null };
  const owningView = owningEl.closest("[data-page-view]");
  return owningView ? { page: owningView.dataset.pageView, anchor: hash } : { page: null, anchor: null };
}

const initial = pageFromHash();
activatePage(initial.page || "home", { scrollTo: initial.anchor });

pageTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.page;
    if (!target) return;
    activatePage(target, { scrollTop: true });
    history.replaceState(null, "", `#${target}`);
  });
});

document.querySelectorAll("[data-page-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = link.dataset.pageLink;
    if (!target) return;
    event.preventDefault();
    activatePage(target, { scrollTop: true });
    history.replaceState(null, "", `#${target}`);
  });
});

// In-page cross-tab anchor link (e.g. schedule cell -> programme card)
document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  if (link.matches("[data-page-link]")) return;
  if (link.closest(".page-toc")) return;
  const href = link.getAttribute("href") || "";
  const anchorId = href.replace(/^#/, "");
  if (!anchorId) return;
  const node = document.getElementById(anchorId);
  if (!node) return;
  const view = node.closest("[data-page-view]");
  if (!view) return;
  const currentPage = document.body.dataset.activePage;
  if (view.dataset.pageView !== currentPage) {
    event.preventDefault();
    activatePage(view.dataset.pageView, { scrollTo: anchorId });
    history.replaceState(null, "", `#${anchorId}`);
  }
});

window.addEventListener("hashchange", () => {
  const next = pageFromHash();
  if (next.page) activatePage(next.page, { scrollTo: next.anchor });
});

// ---------- Theme toggle ----------
const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const storedTheme = (() => {
  try { return window.localStorage.getItem("indos-theme"); } catch { return null; }
})();
const prefersLight = window.matchMedia ? window.matchMedia("(prefers-color-scheme: light)").matches : false;
const initialTheme = storedTheme || (prefersLight ? "light" : "dark");

function setTheme(theme) {
  root.dataset.theme = theme;
  const darkTheme = theme !== "light";
  const brainSuffix = darkTheme ? "-white" : "";
  document.querySelector(".brain-start")?.setAttribute("href", `assets/workflow/brain-start${brainSuffix}.png`);
  document.querySelector(".brain-final")?.setAttribute("href", `assets/workflow/brain-final${brainSuffix}.png`);
  if (!themeToggle) return;
  const isLight = theme === "light";
  themeToggle.textContent = isLight ? "Dark theme" : "Light theme";
  themeToggle.setAttribute("aria-pressed", String(isLight));
}
setTheme(initialTheme);
themeToggle?.addEventListener("click", () => {
  const next = root.dataset.theme === "light" ? "dark" : "light";
  try { window.localStorage.setItem("indos-theme", next); } catch {}
  setTheme(next);
});

// ---------- Sticky page TOC ----------
function initPageToc() {
  const toc = document.querySelector(".page-toc");
  if (!toc) return;
  const toggle = toc.querySelector(".page-toc-toggle");
  const panel = toc.querySelector(".page-toc-panel");
  if (!toggle || !panel) return;

  function setOpen(open) {
    toc.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  }
  setOpen(window.matchMedia("(min-width: 1024px)").matches);

  toggle.addEventListener("click", () => setOpen(!toc.classList.contains("is-open")));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toc.classList.contains("is-open")
        && !window.matchMedia("(min-width: 1024px)").matches) {
      setOpen(false);
    }
  });

  const links = Array.from(panel.querySelectorAll(".page-toc-link"));
  const idToLink = new Map();
  const sections = [];
  links.forEach((a) => {
    const id = (a.getAttribute("href") || "").replace(/^#/, "");
    if (!id) return;
    const sec = document.getElementById(id);
    if (!sec) return;
    idToLink.set(id, a);
    sections.push(sec);
  });
  if (!sections.length) return;

  function setActive(id) {
    links.forEach((a) => a.classList.remove("is-active"));
    idToLink.get(id)?.classList.add("is-active");
  }

  const visible = new Set();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      });
      if (!visible.size) return;
      const top = Array.from(visible).sort(
        (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top
      )[0];
      if (top) setActive(top.id);
    },
    { rootMargin: "-100px 0px -55% 0px", threshold: 0 }
  );
  sections.forEach((s) => io.observe(s));

  // Close panel on link click (mobile only)
  links.forEach((a) => {
    a.addEventListener("click", () => {
      if (!window.matchMedia("(min-width: 1024px)").matches) setOpen(false);
    });
  });
}
initPageToc();

// ---------- Reveal on scroll (small chrome only) ----------
const revealTargets = document.querySelectorAll(
  ".action-card, .format-card, .resource-link"
);
revealTargets.forEach((el) => el.classList.add("reveal"));
if ("IntersectionObserver" in window) {
  const ro = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        ro.unobserve(e.target);
      }
    }),
    { threshold: 0, rootMargin: "120px 0px 120px 0px" }
  );
  revealTargets.forEach((el) => ro.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add("is-visible"));
}

// ---------- Modal gallery (kept for any future <figure> usage) ----------
const modal = document.querySelector("#gallery-modal");
const modalImage = document.querySelector("#modal-image");
const modalTitle = document.querySelector("#modal-title");
const modalDescription = document.querySelector("#modal-description");
const modalClose = document.querySelector(".modal-close");
const galleryItems = document.querySelectorAll(".media-frame, .media-strip figure");

function openModal(figure) {
  const image = figure.querySelector("img");
  const caption = figure.querySelector("figcaption");
  if (!modal || !modalImage || !modalTitle || !modalDescription || !image) return;
  modalImage.src = image.currentSrc || image.src;
  modalImage.alt = image.alt;
  modalTitle.textContent = figure.dataset.title || caption?.textContent || image.alt;
  modalDescription.textContent = figure.dataset.detail || caption?.textContent || "";
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modalClose?.focus();
}
function closeModal() {
  if (!modal || !modalImage) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  modalImage.removeAttribute("src");
}
galleryItems.forEach((figure) => {
  figure.tabIndex = 0;
  figure.setAttribute("role", "button");
  figure.setAttribute("aria-label", `Open ${figure.querySelector("figcaption")?.textContent || "feature image"}`);
  figure.addEventListener("click", () => openModal(figure));
  figure.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(figure); }
  });
});
modalClose?.addEventListener("click", closeModal);
modal?.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal?.classList.contains("is-open")) closeModal();
});

// ---------- Workflow SVG animation (kept verbatim) ----------
const workflowGraph = document.querySelector(".workflow-graph");

function initWorkflowGraph() {
  if (!workflowGraph || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  const paths = [
    { path: workflowGraph.querySelector("#workflow-main-path"),  dot: workflowGraph.querySelector(".dot-main"),  duration: 7200, offset: 0,    main: true },
    { path: workflowGraph.querySelector("#workflow-audit-path"), dot: workflowGraph.querySelector(".dot-audit"), duration: 5200, offset: 0.28 },
    { path: workflowGraph.querySelector("#workflow-qc-path"),    dot: workflowGraph.querySelector(".dot-qc"),    duration: 5600, offset: 0.56 },
  ].filter(({ path, dot }) => path && dot);

  if (!paths.length) return;
  const lengths = new Map(paths.map(({ path }) => [path, path.getTotalLength()]));

  const spotlight = workflowGraph.querySelector(".workflow-spotlight");
  const nodes = [
    { selector: ".acquire-node",   x: 71,  y: 122 },
    { selector: ".artemis-node",   x: 246, y: 76 },
    { selector: ".bids-node",      x: 355, y: 122 },
    { selector: ".meegqc-node",    x: 525, y: 122 },
    { selector: ".fair-node",      x: 664, y: 76 },
    { selector: ".community-node", x: 816, y: 122 },
  ].map((n) => ({ ...n, element: workflowGraph.querySelector(n.selector) }));

  function highlightNearestNode(point) {
    if (workflowGraph.classList.contains("is-stepping")) return;
    let closest = null, closestDistance = Infinity;
    nodes.forEach((node) => {
      const d = Math.hypot(point.x - node.x, point.y - node.y);
      if (d < closestDistance) { closestDistance = d; closest = node; }
    });
    nodes.forEach(({ element }) => {
      element?.classList.remove("is-path-active");
      element?.removeAttribute("filter");
    });
    if (closest && closestDistance < 46) {
      closest.element?.classList.add("is-path-active");
      closest.element?.setAttribute("filter", "url(#workflow-node-glow)");
    }
  }

  function moveDot(path, dot, progress, isMain = false) {
    const length = lengths.get(path);
    const p = path.getPointAtLength(length * progress);
    dot.setAttribute("cx", p.x.toFixed(2));
    dot.setAttribute("cy", p.y.toFixed(2));
    if (isMain) highlightNearestNode(p);
  }

  function animateDots(ts) {
    paths.forEach(({ path, dot, duration, offset, main }) => {
      const progress = ((ts / duration + offset) % 1);
      moveDot(path, dot, progress, Boolean(main));
    });
    window.requestAnimationFrame(animateDots);
  }
  window.requestAnimationFrame(animateDots);

  const clickBrain = workflowGraph.querySelector(".click-brain");
  const flash = workflowGraph.querySelector(".workflow-flash");
  const brainHackText = workflowGraph.querySelector(".brainhack-pop");
  const flashColors = ["#b8f46d", "#4de3ff", "#ff8b6b", "#bda6ff", "#fff06a", "#52ffa8"];
  let clickAnimationFrame, cleanupTimer;

  function setClickBrainStage(stage) {
    if (!clickBrain) return;
    clickBrain.classList.remove("stage-0","stage-1","stage-2","stage-3","stage-4","stage-5");
    clickBrain.classList.add(`stage-${stage}`);
  }
  function clearNodeFocus() {
    window.cancelAnimationFrame(clickAnimationFrame);
    window.clearTimeout(cleanupTimer);
    workflowGraph.classList.remove("is-stepping");
    spotlight?.classList.remove("is-visible");
    clickBrain?.classList.remove("is-visible");
    brainHackText?.classList.remove("is-visible");
    nodes.forEach(({ element }) => {
      element?.classList.remove("is-active","is-path-active");
      element?.removeAttribute("filter");
    });
  }
  function easeInOut(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function randomFlashColor() { return flashColors[Math.floor(Math.random() * flashColors.length)]; }

  function flashNode(node, stage) {
    nodes.forEach(({ element }) => {
      element?.classList.remove("is-active","is-path-active");
      element?.removeAttribute("filter");
    });
    node.element?.classList.add("is-active");
    node.element?.setAttribute("filter", "url(#workflow-node-glow)");
    const color = randomFlashColor();
    if (spotlight) {
      spotlight.style.color = color;
      spotlight.style.fill = color;
      spotlight.setAttribute("fill", color);
      spotlight.setAttribute("cx", String(node.x));
      spotlight.setAttribute("cy", String(node.y));
      spotlight.setAttribute("r", String(20 + stage * 2.2));
      spotlight.classList.add("is-visible");
    }
    if (flash) {
      flash.style.color = color;
      flash.style.stroke = color;
      flash.setAttribute("stroke", color);
      flash.setAttribute("cx", String(node.x));
      flash.setAttribute("cy", String(node.y));
      flash.classList.remove("is-flashing");
      void flash.getBoundingClientRect();
      flash.classList.add("is-flashing");
    }
  }
  function positionBrain(x, y, stage, extraScale = 1) {
    if (!clickBrain) return;
    const scale = (0.92 + stage * 0.095) * extraScale;
    clickBrain.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${scale.toFixed(2)})`);
    setClickBrainStage(stage);
    clickBrain.classList.add("is-visible");
  }
  function animateBetween(from, to, stage, duration, onDone) {
    const start = performance.now();
    function frame(now) {
      const raw = Math.min(1, (now - start) / duration);
      const p = easeInOut(raw);
      const x = from.x + (to.x - from.x) * p;
      const y = from.y + (to.y - from.y) * p;
      positionBrain(x, y, stage);
      if (raw < 1) clickAnimationFrame = window.requestAnimationFrame(frame);
      else onDone?.();
    }
    clickAnimationFrame = window.requestAnimationFrame(frame);
  }
  function showBrainHackFinale(from) {
    const exitPoint = { x: 808, y: -10 };
    animateBetween(from, exitPoint, 5, 680, () => {
      positionBrain(exitPoint.x, exitPoint.y, 5, 1.72);
      brainHackText?.classList.remove("is-visible");
      void brainHackText?.getBoundingClientRect();
      brainHackText?.classList.add("is-visible");
      cleanupTimer = window.setTimeout(clearNodeFocus, 5000);
    });
  }
  function runNodeSpotlight() {
    clearNodeFocus();
    workflowGraph.classList.add("is-stepping");
    let index = 0;
    positionBrain(nodes[0].x, nodes[0].y, 0);
    flashNode(nodes[0], 0);
    function nextSegment() {
      if (index >= nodes.length - 1) { showBrainHackFinale(nodes[nodes.length - 1]); return; }
      const from = nodes[index], to = nodes[index + 1];
      const nextStage = Math.min(5, index + 1);
      index += 1;
      animateBetween(from, to, nextStage, 680, () => {
        flashNode(to, nextStage);
        cleanupTimer = window.setTimeout(nextSegment, 190);
      });
    }
    cleanupTimer = window.setTimeout(nextSegment, 260);
  }
  workflowGraph.addEventListener("click", runNodeSpotlight);
  workflowGraph.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); runNodeSpotlight(); }
  });
}
initWorkflowGraph();
