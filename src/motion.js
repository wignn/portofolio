/* Portfolio motion. Lenis is bundled locally in vendor/. */

export function initMotion() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  let smoothScroll = null;
  let revealObserver = null;
  let navFrame = 0;
  const navLinks = [...document.querySelectorAll('nav a[href^="#"]')];
  const sections = navLinks
    .map((link) => ({
      link,
      section: document.getElementById(link.hash.slice(1)),
    }))
    .filter((item) => item.section);
  const revealItems = [
    ...document.querySelectorAll(
      ".intro > *, .profile-caption, .presence, .identity-strip, .section-heading, .featured, .repository-heading, .architecture-example, .about-copy, .activity-panel, .contact-heading, .contact-links",
    ),
  ];

  function updateNav() {
    navFrame = 0;
    let current = null;
    const line = Math.min(window.innerHeight * 0.32, 260);
    sections.forEach((item) => {
      if (item.section.getBoundingClientRect().top <= line) current = item;
    });
    sections.forEach((item) => {
      const active = item === current;
      item.link.classList.toggle("is-current", active);
      if (active) item.link.setAttribute("aria-current", "location");
      else item.link.removeAttribute("aria-current");
    });
  }
  function scheduleNav() {
    if (!navFrame) navFrame = window.requestAnimationFrame(updateNav);
  }
  window.addEventListener("scroll", scheduleNav, { passive: true });
  window.addEventListener("resize", scheduleNav, { passive: true });

  function revealAll() {
    revealObserver?.disconnect();
    revealObserver = null;
    revealItems.forEach((item) => {
      item.classList.remove("motion-reveal");
      item.classList.add("is-visible");
    });
  }
  function setupReveals() {
    if (reduced.matches || !("IntersectionObserver" in window)) {
      revealAll();
      return;
    }
    try {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -16px 0px" },
      );
      revealItems.forEach((item, index) => {
        item.style.setProperty(
          "--reveal-delay",
          (item.closest(".intro")
            ? Math.min(index, 5) * 55
            : item.classList.contains("featured")
              ? (index % 2) * 70
              : 0) + "ms",
        );
        item.classList.add("motion-reveal");
        revealObserver.observe(item);
      });
    } catch {
      revealAll();
    }
  }
  function setupScrolling() {
    smoothScroll?.destroy();
    smoothScroll = null;
    if (reduced.matches || typeof window.Lenis !== "function") return;
    try {
      smoothScroll = new window.Lenis({
        autoRaf: true,
        smoothWheel: true,
        syncTouch: false,
        lerp: 0.085,
        wheelMultiplier: 0.9,
        anchors: false,
      });
    } catch {
      smoothScroll = null;
    }
  }

  // Preserve native anchors if Lenis is unavailable, and preserve keyboard focus when it is used.
  document.addEventListener("click", (event) => {
    if (
      !smoothScroll ||
      reduced.matches ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const link = event.target.closest('a[href^="#"]');
    if (!link || link.hasAttribute("download") || link.target === "_blank")
      return;
    const hash = link.getAttribute("href");
    let id;
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch {
      return;
    }
    const target = id ? document.getElementById(id) : document.documentElement;
    if (!target) return;
    event.preventDefault();
    smoothScroll.scrollTo(target, {
      offset: id ? -28 : 0,
      onComplete: () => {
        if (id) {
          if (!target.hasAttribute("tabindex"))
            target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        }
        if (window.location.hash !== hash)
          window.history.pushState(null, "", hash);
        updateNav();
      },
    });
  });

  document.querySelectorAll(".featured:not(.featured-lead)").forEach((card) => {
    let pointerFrame = 0;
    let x = 0,
      y = 0;
    function reset() {
      if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
      pointerFrame = 0;
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
      card.style.setProperty("--art-shift", "0px");
    }
    card.addEventListener(
      "pointermove",
      (event) => {
        if (
          reduced.matches ||
          !finePointer.matches ||
          event.pointerType === "touch"
        )
          return;
        const rect = card.getBoundingClientRect();
        x = (event.clientX - rect.left) / rect.width - 0.5;
        y = (event.clientY - rect.top) / rect.height - 0.5;
        if (pointerFrame) return;
        pointerFrame = window.requestAnimationFrame(() => {
          pointerFrame = 0;
          card.style.setProperty("--tilt-x", (-y * 3).toFixed(2) + "deg");
          card.style.setProperty("--tilt-y", (x * 3).toFixed(2) + "deg");
          card.style.setProperty("--art-shift", (x * 4).toFixed(2) + "px");
        });
      },
      { passive: true },
    );
    card.addEventListener("pointerleave", reset);
    card.addEventListener("pointercancel", reset);
    reduced.addEventListener("change", reset);
    finePointer.addEventListener("change", reset);
  });

  reduced.addEventListener("change", () => {
    setupScrolling();
    if (reduced.matches) revealAll();
  });
  document.addEventListener("visibilitychange", () => {
    if (!smoothScroll) return;
    if (document.hidden) smoothScroll.stop();
    else {
      smoothScroll.start();
      smoothScroll.resize();
    }
  });
  window.addEventListener("pagehide", () => {
    smoothScroll?.destroy();
    smoothScroll = null;
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      setupScrolling();
      updateNav();
    }
  });
  setupScrolling();
  setupReveals();
  updateNav();
}
