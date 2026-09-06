/* Page d'accueil : ouverture/fermeture des récits */
document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll("[data-story-card]");
  const detail = document.querySelector("[data-story-detail]");
  if (!cards.length || !detail) return;

  const numEl = detail.querySelector("[data-story-num]");
  const titleEl = detail.querySelector("[data-story-title]");
  const textEl = detail.querySelector("[data-story-text]");
  const metaEl = detail.querySelector("[data-story-meta]");
  const closeBtn = detail.querySelector("[data-story-close]");

  let openIndex = null;

  function render() {
    cards.forEach(function (card) {
      const i = Number(card.getAttribute("data-story-card"));
      const isOpen = i === openIndex;
      card.classList.toggle("is-open", isOpen);
      card.querySelector("[data-story-cta]").textContent = isOpen ? "Récit ouvert ↓" : "Lire le conte →";
    });

    if (openIndex === null) {
      detail.classList.remove("is-open");
      return;
    }

    const card = Array.prototype.find.call(cards, function (c) {
      return Number(c.getAttribute("data-story-card")) === openIndex;
    });
    numEl.textContent = card.getAttribute("data-num");
    titleEl.textContent = card.getAttribute("data-title");
    textEl.textContent = card.getAttribute("data-text");
    metaEl.textContent = card.getAttribute("data-meta");
    detail.classList.add("is-open");
    detail.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  cards.forEach(function (card) {
    card.addEventListener("click", function () {
      const i = Number(card.getAttribute("data-story-card"));
      openIndex = openIndex === i ? null : i;
      render();
    });
  });

  closeBtn.addEventListener("click", function () {
    openIndex = null;
    render();
  });
});
