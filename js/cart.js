/* Panier partagé (header + billetterie) — persistance localStorage */
(function (global) {
  const KEY = "gs26-cart";

  function getCart() {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (!raw) return { qty: {}, day: 1 };
      const parsed = JSON.parse(raw);
      return { qty: Object.assign({ enfant: 0, adulte: 0, famille: 0, vip: 0 }, parsed.qty), day: parsed.day || 1 };
    } catch (e) {
      return { qty: {}, day: 1 };
    }
  }

  function setCart(qty, day) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ qty, day }));
      window.dispatchEvent(new Event("gs26-cart-change"));
    } catch (e) {}
  }

  function getCartCount(cart) {
    cart = cart || getCart();
    return Object.keys(cart.qty || {}).reduce((a, k) => a + (cart.qty[k] || 0), 0);
  }

  global.GriotCart = { getCart, setCart, getCartCount };
})(window);
