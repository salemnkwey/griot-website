/* Tunnel de billetterie Griot Sambolé 2026 : sélection, informations, paiement, confirmation */
document.addEventListener("DOMContentLoaded", function () {
  const CATALOG = [
    { key: "enfant", name: "Standard enfant", desc: "6 à 17 ans — accès complet au Village du Griot.", p1: 5, p2: 5 },
    { key: "adulte", name: "Standard adulte", desc: "Village du Griot en journée + soirée.", p1: 10, p2: 15 },
    { key: "famille", name: "Pack famille", desc: "2 adultes + 2 enfants, entrée groupée.", p1: 30, p2: 40 },
    { key: "vip", name: "VIP adulte", desc: "Carré VIP, accueil dédié, rencontres artistes.", p1: 80, p2: 100 }
  ];

  const cart0 = window.GriotCart.getCart();
  const state = {
    step: 1,
    day: cart0.day || 1,
    qty: cart0.qty,
    buyerName: "",
    buyerPhone: "",
    buyerMail: "",
    payMethod: "Mobile money"
  };

  const el = {
    steps: document.querySelectorAll("[data-step-pill]"),
    wizardSteps: document.querySelectorAll("[data-wizard-step]"),
    day1: document.querySelector("[data-day='1']"),
    day2: document.querySelector("[data-day='2']"),
    ticketList: document.querySelector("[data-ticket-list]"),
    cartTitle: document.querySelector("[data-cart-title]"),
    cartLines: document.querySelector("[data-cart-lines]"),
    cartEmpty: document.querySelector("[data-cart-empty]"),
    subtotal: document.querySelector("[data-subtotal]"),
    fees: document.querySelector("[data-fees]"),
    total: document.querySelectorAll("[data-total]"),
    continueBtn: document.querySelector("[data-continue]"),
    recapLines: document.querySelector("[data-recap-lines]"),
    buyerName: document.querySelector("[data-buyer-name]"),
    buyerPhone: document.querySelector("[data-buyer-phone]"),
    buyerMail: document.querySelector("[data-buyer-mail]"),
    payMethod: document.querySelector("[data-pay-method]"),
    payLine: document.querySelector("[data-pay-line]"),
    mailLine: document.querySelector("[data-mail-line]"),
    ticketName: document.querySelector("[data-ticket-name]"),
    ticketCategory: document.querySelector("[data-ticket-category]"),
    ticketRef: document.querySelector("[data-ticket-ref]"),
    ticketQr: document.querySelector("[data-ticket-qr]"),
    ticketVisual: document.querySelector("[data-ticket-visual]"),
    downloadBtn: document.querySelector("[data-download-ticket]")
  };

  let qrCanvas = null;

  function updateQr(text) {
    if (!el.ticketQr || !window.qrcode) return;
    const qr = window.qrcode(0, "M");
    qr.addData(text);
    qr.make();

    const count = qr.getModuleCount();
    const size = 320;
    const cell = size / count;

    if (!qrCanvas) {
      qrCanvas = document.createElement("canvas");
      qrCanvas.width = size;
      qrCanvas.height = size;
      el.ticketQr.innerHTML = "";
      el.ticketQr.appendChild(qrCanvas);
    }

    const ctx = qrCanvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#14161C";
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (qr.isDark(r, c)) {
          ctx.fillRect(Math.round(c * cell), Math.round(r * cell), Math.ceil(cell), Math.ceil(cell));
        }
      }
    }
  }

  function persist() {
    window.GriotCart.setCart(state.qty, state.day);
  }

  function bump(key, delta) {
    state.qty[key] = Math.max(0, (state.qty[key] || 0) + delta);
    persist();
    render();
  }

  function setDay(day) {
    state.day = day;
    persist();
    render();
  }

  function computeItems() {
    return CATALOG.map(function (t) {
      const price = state.day === 1 ? t.p1 : t.p2;
      const q = state.qty[t.key] || 0;
      return { key: t.key, name: t.name, desc: t.desc, price: price, qty: q, amount: q * price };
    });
  }

  function goToStep(step) {
    if (step === 2 && computeItems().reduce(function (a, i) { return a + i.qty; }, 0) === 0) return;
    state.step = step;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderSteps() {
    el.steps.forEach(function (pill) {
      const n = Number(pill.getAttribute("data-step-pill"));
      pill.classList.toggle("is-active", state.step === n);
      pill.classList.toggle("is-done", state.step > n);
    });
    el.wizardSteps.forEach(function (sec) {
      sec.classList.toggle("is-active", Number(sec.getAttribute("data-wizard-step")) === state.step);
    });
  }

  function renderStep1(items, cartLines, sub, fees, total, count) {
    el.day1.classList.toggle("is-active", state.day === 1);
    el.day2.classList.toggle("is-active", state.day === 2);
    const dayLabel = state.day === 1 ? "JOUR 1 · 17 OCT." : "JOUR 2 · 18 OCT.";

    el.ticketList.innerHTML = items.map(function (t, i) {
      return (
        '<div class="ticket-card reveal" style="transition-delay:' + (i * 80) + 'ms">' +
          '<div class="ticket-card__price">' +
            '<div class="ticket-card__price-val">' + t.price + ' $</div>' +
            '<div class="ticket-card__day">' + dayLabel + '</div>' +
          '</div>' +
          '<div class="ticket-card__info">' +
            '<div class="ticket-card__name">' + t.name + '</div>' +
            '<div class="ticket-card__desc">' + t.desc + '</div>' +
          '</div>' +
          '<div class="ticket-card__qty">' +
            '<button type="button" class="qty-btn" data-dec="' + t.key + '" aria-label="Retirer un billet ' + t.name + '">−</button>' +
            '<div class="qty-val">' + t.qty + '</div>' +
            '<button type="button" class="qty-btn qty-btn--inc" data-inc="' + t.key + '" aria-label="Ajouter un billet ' + t.name + '">+</button>' +
          '</div>' +
        '</div>'
      );
    }).join("");

    el.ticketList.querySelectorAll("[data-inc]").forEach(function (b) {
      b.addEventListener("click", function () { bump(b.getAttribute("data-inc"), 1); });
    });
    el.ticketList.querySelectorAll("[data-dec]").forEach(function (b) {
      b.addEventListener("click", function () { bump(b.getAttribute("data-dec"), -1); });
    });

    el.cartTitle.textContent = state.day === 1 ? "Jour 1 — 17 oct." : "Jour 2 — 18 oct.";
    el.cartLines.innerHTML = cartLines.map(function (l) {
      return '<div class="cart-line"><div class="cart-line__label">' + l.label + '</div><div class="cart-line__amount">' + l.amount + ' $</div></div>';
    }).join("");
    el.cartEmpty.style.display = cartLines.length === 0 ? "block" : "none";
    el.subtotal.textContent = sub + " $";
    el.fees.textContent = fees + " $";

    el.continueBtn.classList.toggle("btn-red", count > 0);
    el.continueBtn.classList.toggle("btn-disabled", count === 0);
    el.continueBtn.disabled = count === 0;

    if (window.GriotReveal) window.GriotReveal.refresh();
  }

  function renderStep2(cartLines) {
    el.recapLines.innerHTML = cartLines.map(function (l) {
      return '<div class="cart-line"><div class="cart-line__label">' + l.label + '</div><div class="cart-line__amount">' + l.amount + ' $</div></div>';
    }).join("");
  }

  function renderStep3(total) {
    el.payLine.textContent = state.payMethod + (state.buyerPhone ? " — " + state.buyerPhone : "");
    el.mailLine.textContent = state.buyerMail
      ? "Un code de confirmation sera envoyé à " + state.buyerMail + "."
      : "Un code de confirmation sera envoyé par e-mail.";
  }

  function renderStep4(items, cartLines, total, count) {
    const name = state.buyerName || "Invité·e";
    const firstLabel = cartLines[0] ? cartLines[0].label.replace(/^\d+\s*×\s*/, "") : "Standard";
    const category = firstLabel + (cartLines.length > 1 ? " +" + (cartLines.length - 1) : "");
    const ref = "GS26-" + (state.day === 1 ? "J1" : "J2") + "-00" + (4000 + count * 7);
    const dayLabel = state.day === 1 ? "17 octobre 2026" : "18 octobre 2026";

    el.ticketName.textContent = name;
    el.ticketCategory.textContent = category;
    el.ticketRef.textContent = ref;

    const qrText = [
      "GRIOT SAMBOLÉ 2026",
      "Billet : " + ref,
      "Nom : " + name,
      "Catégorie : " + category,
      "Montant : " + total + " $",
      "Jour : " + dayLabel,
      "Centre Culturel Congolais — Le Zoo, Kinshasa"
    ].join("\n");
    updateQr(qrText);
  }

  function render() {
    const items = computeItems();
    const cartLines = items.filter(function (i) { return i.qty > 0; }).map(function (i) {
      return { label: i.qty + " × " + i.name, amount: i.amount };
    });
    const sub = items.reduce(function (a, i) { return a + i.amount; }, 0);
    const fees = sub > 0 ? 3 : 0;
    const total = sub + fees;
    const count = items.reduce(function (a, i) { return a + i.qty; }, 0);

    renderSteps();
    renderStep1(items, cartLines, sub, fees, total, count);
    renderStep2(cartLines);
    renderStep3(total);
    renderStep4(items, cartLines, total, count);
    el.total.forEach(function (n) { n.textContent = total + " $"; });
  }

  el.day1.addEventListener("click", function () { setDay(1); });
  el.day2.addEventListener("click", function () { setDay(2); });
  el.continueBtn.addEventListener("click", function () { goToStep(2); });

  document.querySelectorAll("[data-goto]").forEach(function (b) {
    b.addEventListener("click", function () { goToStep(Number(b.getAttribute("data-goto"))); });
  });

  el.buyerName.addEventListener("input", function (e) { state.buyerName = e.target.value; });
  el.buyerPhone.addEventListener("input", function (e) { state.buyerPhone = e.target.value; });
  el.buyerMail.addEventListener("input", function (e) { state.buyerMail = e.target.value; });
  el.payMethod.addEventListener("change", function (e) { state.payMethod = e.target.value; render(); });

  el.downloadBtn.addEventListener("click", function () {
    if (!window.html2canvas || !window.jspdf || !el.ticketVisual) { window.print(); return; }

    const originalLabel = el.downloadBtn.textContent;
    el.downloadBtn.disabled = true;
    el.downloadBtn.textContent = "Génération du PDF…";

    const scale = 2;
    window.html2canvas(el.ticketVisual, { scale: scale, useCORS: true, backgroundColor: "#ffffff" })
      .then(function (canvas) {
        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        const footerH = Math.round(60 * scale);
        const pageW = canvas.width;
        const pageH = canvas.height + footerH;
        const jsPDF = window.jspdf.jsPDF;
        const doc = new jsPDF({ orientation: pageH >= pageW ? "portrait" : "landscape", unit: "px", format: [pageW, pageH] });

        doc.addImage(imgData, "JPEG", 0, 0, pageW, canvas.height);
        doc.setFillColor(74, 36, 16);
        doc.rect(0, canvas.height, pageW, footerH, "F");
        doc.setTextColor(251, 235, 200);
        doc.setFontSize(15);
        doc.text("N° " + el.ticketRef.textContent + " — QR unique à scanner à l'entrée", pageW / 2, canvas.height + footerH / 2 + 5, { align: "center" });

        doc.save("billet-griot-sambole-" + el.ticketRef.textContent + ".pdf");
      })
      .catch(function (err) {
        console.error("Échec de la génération du PDF :", err);
        window.print();
      })
      .finally(function () {
        el.downloadBtn.disabled = false;
        el.downloadBtn.textContent = originalLabel;
      });
  });

  render();
});
