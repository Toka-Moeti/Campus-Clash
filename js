const header = document.getElementById("siteHeader");
const card = document.getElementById("characterCard");
const image = document.getElementById("characterImage");
const year = document.getElementById("year");

year.textContent = new Date().getFullYear();

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
}

updateHeader();

window.addEventListener("scroll", updateHeader, { passive: true });

window.addEventListener(
  "scroll",
  () => {
    const scrollAmount = Math.min(window.scrollY, 700);

    const rotateY = scrollAmount * 0.018;
    const rotateX = -scrollAmount * 0.008;
    const translateY = scrollAmount * -0.035;

    card.style.transform =
      `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${translateY}px)`;
  },
  { passive: true }
);

image.addEventListener("error", () => {
  image.style.display = "none";
  card.insertAdjacentHTML(
    "afterbegin",
    `
      <div class="image-fallback">
        <strong>Campus Clash</strong>
        <span>Add an image at assets/images/logo.png</span>
      </div>
    `
  );
});
