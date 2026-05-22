/**
 * Game detail page — lightbox & scroll reveals
 */
(function () {
  const expandBtn = document.querySelector("[data-lightbox]");
  const lightbox = document.getElementById("lightbox");
  if (!expandBtn || !lightbox) return;

  const lightboxImg = lightbox.querySelector(".lightbox-img");
  const closeBtn = lightbox.querySelector(".lightbox-close");
  const sourceImg = expandBtn.querySelector("img");

  function openLightbox() {
    if (!sourceImg) return;
    lightboxImg.src = sourceImg.src;
    lightboxImg.alt = sourceImg.alt;
    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lightboxImg.src = "";
  }

  expandBtn.addEventListener("click", openLightbox);
  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
  });

  const blocks = document.querySelectorAll(".game-block, .game-feature-card, .game-timeline-step");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
  );

  blocks.forEach((el, i) => {
    el.style.setProperty("--reveal-delay", `${(i % 6) * 0.08}s`);
    observer.observe(el);
  });
})();
