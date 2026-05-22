/**
 * Studio site — navigation unlock & shared behavior
 */
(function () {
  const INTRO_KEY = "thl_intro_complete";
  const nav = document.querySelector(".site-nav");
  const lockHint = document.querySelector(".nav-lock-hint");

  function isIntroComplete() {
    return sessionStorage.getItem(INTRO_KEY) === "true";
  }

  function setIntroComplete() {
    sessionStorage.setItem(INTRO_KEY, "true");
    unlockNavigation();
  }

  function unlockNavigation() {
    if (nav) {
      nav.classList.remove("is-locked");
      nav.classList.add("is-visible");
    }
    if (lockHint) lockHint.classList.add("is-hidden");
    document.querySelectorAll(".nav-link:not(.nav-link--home)").forEach((link) => {
      link.removeAttribute("aria-disabled");
    });
    document.body.classList.remove("intro-active");
  }

  function initNavState() {
    const onHome = document.body.dataset.page === "home";
    const complete = isIntroComplete();

    if (complete) {
      unlockNavigation();
      return;
    }

    if (nav) nav.classList.add("is-locked");

    document.querySelectorAll(".nav-link:not(.nav-link--home)").forEach((link) => {
      link.setAttribute("aria-disabled", "true");
      link.addEventListener("click", (e) => {
        if (!isIntroComplete()) {
          e.preventDefault();
        }
      });
    });

    if (!onHome && nav) {
      nav.classList.add("is-visible");
    }
  }

  function setActiveNavLink() {
    const page = document.body.dataset.page;
    if (!page) return;
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.toggle("is-active", link.dataset.nav === page);
    });
  }

  function initGameCards() {
    const cards = document.querySelectorAll(".game-card");
    if (!cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    cards.forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.15}s`;
      observer.observe(card);
    });

    cards.forEach((card) => {
      const go = () => {
        const href = card.dataset.href;
        if (href) window.location.href = href;
      };
      card.addEventListener("click", go);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          go();
        }
      });
    });
  }

  function initDevSections() {
    const sections = document.querySelectorAll(".dev-section");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.2 }
    );

    sections.forEach((section, i) => {
      section.style.transitionDelay = `${i * 0.12}s`;
      observer.observe(section);
    });
  }

  window.THLStudio = {
    INTRO_KEY,
    isIntroComplete,
    setIntroComplete,
    unlockNavigation,
  };

  document.addEventListener("DOMContentLoaded", () => {
    initNavState();
    setActiveNavLink();
    initGameCards();
    initDevSections();
  });
})();
