/* Partenaires : sélection de palier et formulaire de demande (envoi simulé côté client) */
document.addEventListener("DOMContentLoaded", function () {
  const TIERS = {
    platine: { key: "platine", name: "PLATINE", price: "50 000 $", accent: "#0AA0E0", stand: "Stand 20 m² prioritaire",
      benefits: ["Stand 20 m² — emplacement prioritaire", "Logo sur tous supports digitaux", "Logo affiches & flyers (premium)", "Logo backdrop principal", "Mention officielle en discours", "Présence médiatique dédiée", "Logo sur drone show", "15 invitations VIP", "Distribution goodies", "10 min de temps de parole", "Interview médias", "Diffusion spot pendant l'événement", "Co-branding institutionnel", "Visibilité réseaux sociaux maximale"] },
    diamant: { key: "diamant", name: "DIAMANT", price: "40 000 $", accent: "#4A2410", stand: "Stand 10 m² prioritaire",
      benefits: ["Stand 10 m² — emplacement prioritaire", "Logo sur tous supports digitaux", "Logo affiches & flyers (fort)", "Logo backdrop", "Présence médiatique", "Logo sur drone show", "10 invitations VIP", "Distribution goodies", "7 min de temps de parole", "Interview médias", "Diffusion spot pendant l'événement", "Visibilité réseaux sociaux forte"] },
    or: { key: "or", name: "OR", price: "20 000 $", accent: "#F2A02D", stand: "Stand 5 m²",
      benefits: ["Stand 5 m²", "Logo sur supports digitaux", "Logo affiches & flyers (fort)", "Logo backdrop", "5 invitations VIP", "Distribution goodies", "5 min de temps de parole", "Diffusion spot pendant l'événement", "Visibilité réseaux sociaux"] },
    argent: { key: "argent", name: "ARGENT", price: "10 000 $", accent: "#1E8B4A", stand: "Stand 2 m²",
      benefits: ["Stand 2 m²", "Logo sur supports digitaux (basique)", "Logo backdrop", "2 invitations VIP", "1min20 de temps de parole", "Visibilité réseaux sociaux"] },
    bronze: { key: "bronze", name: "BRONZE", price: "7 000 $", accent: "#C0281F", stand: "Sans stand dédié",
      benefits: ["Logo sur supports digitaux (basique)", "Logo backdrop", "1 invitation VIP", "1 min de temps de parole", "Visibilité réseaux sociaux"] }
  };
  const ORDER = ["platine", "diamant", "or", "argent", "bronze"];

  let active = "or";

  const el = {
    tabs: document.querySelectorAll("[data-tier-tab]"),
    cards: document.querySelector("[data-tier-cards]"),
    detail: document.querySelector("[data-tier-detail]"),
    form: document.querySelector("[data-partner-form]"),
    orgName: document.querySelector("[data-org-name]"),
    orgTier: document.querySelector("[data-org-tier]"),
    confirm: document.querySelector("[data-partner-confirm]")
  };

  function renderCards() {
    el.cards.innerHTML = ORDER.map(function (key, i) {
      const t = TIERS[key];
      const isActive = key === active;
      return (
        '<button type="button" class="reveal pt-card' + (isActive ? " is-active" : "") + '" data-tier="' + key + '" style="transition-delay:' + (i * 80) + 'ms">' +
          '<div class="pt-card__label" style="color:' + t.accent + '">' + t.name + '</div>' +
          '<div class="pt-card__price" style="color:' + t.accent + '">' + t.price + '</div>' +
          '<div class="pt-card__stand">' + t.stand + '</div>' +
        '</button>'
      );
    }).join("");
    el.cards.querySelectorAll("[data-tier]").forEach(function (card) {
      card.addEventListener("click", function () {
        active = card.getAttribute("data-tier");
        render();
      });
    });
    if (window.GriotReveal) window.GriotReveal.refresh();
  }

  function renderTabs() {
    el.tabs.forEach(function (tab) {
      tab.classList.toggle("is-active", tab.getAttribute("data-tier-tab") === active);
    });
  }

  function renderDetail() {
    const t = TIERS[active];
    el.detail.innerHTML =
      '<div style="display:flex; flex-wrap:wrap; align-items:baseline; justify-content:space-between; gap:16px;">' +
        '<div class="pt-detail__title" style="color:' + t.accent + '">' + t.name + ' — ' + t.price + '</div>' +
      '</div>' +
      '<div class="pt-detail__grid">' +
        t.benefits.map(function (b) {
          return '<div class="pt-check"><span class="pt-check__mark">✓</span><span class="pt-check__label">' + b + '</span></div>';
        }).join("") +
      '</div>';
  }

  function render() {
    renderTabs();
    renderCards();
    renderDetail();
  }

  el.tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      active = tab.getAttribute("data-tier-tab");
      render();
    });
  });

  el.orgName.addEventListener("input", function () { el.confirm.classList.remove("is-visible"); });
  el.orgTier.addEventListener("change", function () { el.confirm.classList.remove("is-visible"); });

  el.form.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = el.orgName.value.trim() || "vous";
    const tier = el.orgTier.value;
    el.confirm.textContent = "Demande envoyée pour le palier " + tier + ". Merci, " + name + " — nous revenons vers vous sous 48h.";
    el.confirm.classList.add("is-visible");
  });

  render();
});
