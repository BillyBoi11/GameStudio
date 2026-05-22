/**
 * Cinematic homepage scroll intro gate
 */
(function () {
  const scrollContainer = document.querySelector(".intro-scroll");
  if (!scrollContainer) return;

  const sections = [...scrollContainer.querySelectorAll(".intro-section")];
  const totalSections = sections.length;
  const lockHint = document.querySelector(".nav-lock-hint");
  let currentIndex = 0;

  document.body.classList.add("intro-active");

  if (window.THLStudio?.isIntroComplete()) {
    window.THLStudio.unlockNavigation();
    revealAllSections();
    if (lockHint) lockHint.classList.add("is-hidden");
    return;
  }

  function revealSection(index) {
    sections.forEach((section, i) => {
      section.classList.toggle("is-visible", i <= index);
    });
  }

  function revealAllSections() {
    sections.forEach((s) => s.classList.add("is-visible"));
  }

  function handleParallax() {
    const scrollTop = scrollContainer.scrollTop;
    const vh = window.innerHeight;

    sections.forEach((section, i) => {
      const parallax = section.querySelector(".intro-parallax");
      if (!parallax) return;
      const offset = (scrollTop - i * vh) * 0.08;
      parallax.style.transform = `translateY(${offset}px)`;
    });
  }

  function getVisibleIndex() {
    const scrollTop = scrollContainer.scrollTop;
    const vh = window.innerHeight;
    return Math.min(Math.round(scrollTop / vh), totalSections - 1);
  }

  function onScroll() {
    handleParallax();
    const index = getVisibleIndex();

    if (index !== currentIndex) {
      currentIndex = index;
      revealSection(index);
    }

    if (index >= totalSections - 1) {
      completeIntro();
    }
  }

  let introCompleted = false;

  function completeIntro() {
    if (introCompleted) return;
    introCompleted = true;

    setTimeout(() => {
      window.THLStudio?.setIntroComplete();
      document.body.classList.remove("intro-active");
    }, 800);
  }

  scrollContainer.addEventListener("scroll", onScroll, { passive: true });

  revealSection(0);
  handleParallax();

  sections.forEach((section) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { root: scrollContainer, threshold: 0.55 }
    );
    observer.observe(section);
  });
})();
