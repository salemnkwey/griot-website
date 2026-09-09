/* Programme : bascule jour / moment et rendu du planning */
document.addEventListener("DOMContentLoaded", function () {
  const SCHEDULE = {
    "1-jour": [
      { time: "09h00", title: "Ouverture du Village du Griot", place: "Place centrale" },
      { time: "10h00", title: "Jeux traditionnels — billes, silikoti, awalé", place: "Allée des jeux" },
      { time: "11h30", title: "Atelier bracelets & peinture", place: "Atelier enfants" },
      { time: "13h00", title: "Contes pour enfants", place: "Arbre à palabres" },
      { time: "15h00", title: "Cercle de danse ouvert", place: "Scène village" },
      { time: "16h30", title: "Exposition d'œuvres & caricature", place: "Galerie" }
    ],
    "2-jour": [
      { time: "09h00", title: "Ouverture — marché des artisans", place: "Allée des stands" },
      { time: "10h30", title: "Lecture & kasala", place: "Coin lecture" },
      { time: "12h00", title: "Bouscule / baby-foot kinois", place: "Aire de jeux" },
      { time: "14h00", title: "Atelier percussions", place: "Scène village" },
      { time: "16h00", title: "Tir au lance-pierre & marelle", place: "Terrain nord" },
      { time: "17h00", title: "Rencontre avec les conteurs", place: "Arbre à palabres" }
    ],
    "1-soir": [
      { time: "18h30", title: "Musique & danse traditionnelle", place: "Grande scène" },
      { time: "19h15", title: "Défilé africain", place: "Podium" },
      { time: "20h00", title: "Contes africains", place: "Grande scène" },
      { time: "20h45", title: "Scénettes & narration", place: "Grande scène" },
      { time: "21h30", title: "PR3M — performance", place: "Grande scène" },
      { time: "22h15", title: "Drone Show — logo Griot Sambolé", place: "Ciel du village" }
    ],
    "2-soir": [
      { time: "18h30", title: "Ouverture musicale", place: "Grande scène" },
      { time: "19h00", title: "Chants et percussions collectives", place: "Grande scène" },
      { time: "20h00", title: "Contes & récits fondateurs", place: "Grande scène" },
      { time: "21h00", title: "Performances & scénettes", place: "Grande scène" },
      { time: "22h00", title: "Clôture — chant collectif", place: "Place centrale" }
    ]
  };

  const HINTS = {
    jour: "Village ouvert de 09h00 à 18h00 — entrée libre pour les détenteurs de billet du jour.",
    soir: "Soirée à partir de 18h00 sur la grande scène."
  };

  const state = { day: 1, moment: "jour" };

  const el = {
    day1: document.querySelector("[data-prog-day='1']"),
    day2: document.querySelector("[data-prog-day='2']"),
    momentJour: document.querySelector("[data-prog-moment='jour']"),
    momentSoir: document.querySelector("[data-prog-moment='soir']"),
    hint: document.querySelector("[data-prog-hint]"),
    list: document.querySelector("[data-prog-list]")
  };

  function render() {
    el.day1.classList.toggle("is-active", state.day === 1);
    el.day2.classList.toggle("is-active", state.day === 2);
    el.momentJour.classList.toggle("is-active", state.moment === "jour");
    el.momentSoir.classList.toggle("is-active", state.moment === "soir");
    el.hint.textContent = HINTS[state.moment];

    const rows = SCHEDULE[state.day + "-" + state.moment];
    el.list.innerHTML = rows.map(function (r, i) {
      return (
        '<div class="reveal prog-row" style="transition-delay:' + ((i % 3) * 80) + 'ms">' +
          '<div class="prog-row__time">' + r.time + '</div>' +
          '<div><div class="prog-row__title">' + r.title + '</div><div class="prog-row__place">' + r.place + '</div></div>' +
        '</div>'
      );
    }).join("");

    if (window.GriotReveal) window.GriotReveal.refresh();
  }

  el.day1.addEventListener("click", function () { state.day = 1; render(); });
  el.day2.addEventListener("click", function () { state.day = 2; render(); });
  el.momentJour.addEventListener("click", function () { state.moment = "jour"; render(); });
  el.momentSoir.addEventListener("click", function () { state.moment = "soir"; render(); });

  render();
});
