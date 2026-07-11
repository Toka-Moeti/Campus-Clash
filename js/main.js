document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const characterCard = document.querySelector(".character-card");
  const characterImage = document.querySelector(".character-image");

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition =
        target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });
  });

  if (characterCard && window.matchMedia("(pointer: fine)").matches) {
    const resetCard = () => {
      characterCard.style.transform = "";
    };

    characterCard.addEventListener("mousemove", (event) => {
      const bounds = characterCard.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;

      const rotateY = (x - 0.5) * 10;
      const rotateX = (0.5 - y) * 10;

      characterCard.style.transform = `
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-6px)
      `;
    });

    characterCard.addEventListener("mouseleave", resetCard);
  }

  if (characterImage) {
    characterImage.addEventListener(
      "error",
      () => {
        const fallback = document.createElement("div");

        fallback.className = "image-fallback";
        fallback.innerHTML = `
          <div>
            <strong>Campus<br />Clash</strong>
            <span>Student culture · events · community</span>
          </div>
        `;

        characterImage.replaceWith(fallback);
      },
      { once: true }
    );
  }
});
