/* Comportement commun à toutes les pages : header, drawer mobile, badge panier, reveal-on-scroll */
document.addEventListener("DOMContentLoaded", function () {
  const activePage = document.body.getAttribute("data-page") || "";

  document.querySelectorAll("[data-page-link]").forEach(function (el) {
    if (el.getAttribute("data-page-link") === activePage) el.classList.add("is-active");
  });

  const burger = document.querySelector("[data-burger]");
  const drawer = document.querySelector("[data-drawer]");
  if (burger && drawer) {
    burger.addEventListener("click", function () {
      drawer.classList.toggle("is-open");
    });
  }

  function refreshCartBadge() {
    const count = window.GriotCart ? window.GriotCart.getCartCount() : 0;
    document.querySelectorAll("[data-cart-badge]").forEach(function (el) {
      el.textContent = String(count);
    });
  }
  refreshCartBadge();
  window.addEventListener("storage", refreshCartBadge);
  window.addEventListener("gs26-cart-change", refreshCartBadge);

  if ("IntersectionObserver" in window) {
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    function observeReveals() {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) {
        if (reduced) { el.classList.add("is-visible"); return; }
        if (!el.__gs26Observed) { el.__gs26Observed = true; io.observe(el); }
      });
    }
    observeReveals();
    window.GriotReveal = { refresh: observeReveals };
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
  }
});
