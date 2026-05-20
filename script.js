const revealTargets = document.querySelectorAll(
  ".programme-section, .timeline-item, .programme-group-heading, .programme-card, .tool-section, .workflow-section, .links-section, .feature-item, .workflow-step, .resource-link, .capability-grid article"
);

revealTargets.forEach((element) => element.classList.add("reveal"));

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((element) => observer.observe(element));
} else {
  revealTargets.forEach((element) => element.classList.add("is-visible"));
}

const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const storedTheme = (() => {
  try {
    return window.localStorage.getItem("indos-theme");
  } catch {
    return null;
  }
})();
const prefersLight = window.matchMedia ? window.matchMedia("(prefers-color-scheme: light)").matches : false;
const initialTheme = storedTheme || (prefersLight ? "light" : "dark");

function setTheme(theme) {
  root.dataset.theme = theme;
  const darkTheme = theme !== "light";
  const brainAssetSuffix = darkTheme ? "-white" : "";
  document
    .querySelector(".brain-start")
    ?.setAttribute("href", `assets/workflow/brain-start${brainAssetSuffix}.png`);
  document
    .querySelector(".brain-final")
    ?.setAttribute("href", `assets/workflow/brain-final${brainAssetSuffix}.png`);
  if (!themeToggle) return;
  const isLight = theme === "light";
  themeToggle.textContent = isLight ? "Dark theme" : "Light theme";
  themeToggle.setAttribute("aria-pressed", String(isLight));
}

setTheme(initialTheme);

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
  try {
    window.localStorage.setItem("indos-theme", nextTheme);
  } catch {
    // Theme still changes for this session if browser storage is unavailable.
  }
  setTheme(nextTheme);
});

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
  figure.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openModal(figure);
    }
  });
});

modalClose?.addEventListener("click", closeModal);

modal?.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal?.classList.contains("is-open")) {
    closeModal();
  }
});

const workflowGraph = document.querySelector(".workflow-graph");

function initWorkflowGraph() {
  if (!workflowGraph || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  const paths = [
    {
      path: workflowGraph.querySelector("#workflow-main-path"),
      dot: workflowGraph.querySelector(".dot-main"),
      duration: 7200,
      offset: 0,
      main: true,
    },
    {
      path: workflowGraph.querySelector("#workflow-audit-path"),
      dot: workflowGraph.querySelector(".dot-audit"),
      duration: 5200,
      offset: 0.28,
    },
    {
      path: workflowGraph.querySelector("#workflow-qc-path"),
      dot: workflowGraph.querySelector(".dot-qc"),
      duration: 5600,
      offset: 0.56,
    },
  ].filter(({ path, dot }) => path && dot);

  if (!paths.length) return;

  const lengths = new Map(paths.map(({ path }) => [path, path.getTotalLength()]));

  const spotlight = workflowGraph.querySelector(".workflow-spotlight");
  const nodes = [
    { selector: ".raw-node", x: 71, y: 122 },
    { selector: ".scan-node", x: 246, y: 76 },
    { selector: ".bids-node", x: 355, y: 122 },
    { selector: ".assess-node", x: 525, y: 122 },
    { selector: ".control-node", x: 664, y: 184 },
    { selector: ".report-node", x: 816, y: 122 },
  ].map((node) => ({ ...node, element: workflowGraph.querySelector(node.selector) }));

  function highlightNearestNode(point) {
    if (workflowGraph.classList.contains("is-stepping")) return;

    let closest = null;
    let closestDistance = Infinity;

    nodes.forEach((node) => {
      const distance = Math.hypot(point.x - node.x, point.y - node.y);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = node;
      }
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
    const point = path.getPointAtLength(length * progress);
    dot.setAttribute("cx", point.x.toFixed(2));
    dot.setAttribute("cy", point.y.toFixed(2));

    if (isMain) {
      highlightNearestNode(point);
    }
  }

  function animateDots(timestamp) {
    paths.forEach(({ path, dot, duration, offset, main }) => {
      const progress = ((timestamp / duration + offset) % 1);
      moveDot(path, dot, progress, Boolean(main));
    });
    window.requestAnimationFrame(animateDots);
  }

  window.requestAnimationFrame(animateDots);

  const clickBrain = workflowGraph.querySelector(".click-brain");
  const flash = workflowGraph.querySelector(".workflow-flash");
  const brainHackText = workflowGraph.querySelector(".brainhack-pop");
  const flashColors = ["#b8f46d", "#4de3ff", "#ff8b6b", "#bda6ff", "#fff06a", "#52ffa8"];
  let clickAnimationFrame;
  let cleanupTimer;

  function setClickBrainStage(stage) {
    if (!clickBrain) return;
    clickBrain.classList.remove("stage-0", "stage-1", "stage-2", "stage-3", "stage-4", "stage-5");
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
      element?.classList.remove("is-active", "is-path-active");
      element?.removeAttribute("filter");
    });
  }

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function randomFlashColor() {
    return flashColors[Math.floor(Math.random() * flashColors.length)];
  }

  function flashNode(node, stage) {
    nodes.forEach(({ element }) => {
      element?.classList.remove("is-active", "is-path-active");
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
      const rawProgress = Math.min(1, (now - start) / duration);
      const progress = easeInOut(rawProgress);
      const x = from.x + (to.x - from.x) * progress;
      const y = from.y + (to.y - from.y) * progress;
      positionBrain(x, y, stage);

      if (rawProgress < 1) {
        clickAnimationFrame = window.requestAnimationFrame(frame);
      } else {
        onDone?.();
      }
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
      if (index >= nodes.length - 1) {
        showBrainHackFinale(nodes[nodes.length - 1]);
        return;
      }

      const from = nodes[index];
      const to = nodes[index + 1];
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
  workflowGraph.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      runNodeSpotlight();
    }
  });
}

initWorkflowGraph();
