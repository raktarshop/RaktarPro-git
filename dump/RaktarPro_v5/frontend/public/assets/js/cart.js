function getCart() {
  try { return JSON.parse(localStorage.getItem("rp_cart") || "[]"); }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem("rp_cart", JSON.stringify(cart));
  if (typeof updateCartBadge === "function") updateCartBadge();
}

function formatFt(n) {
  const x = Math.round(Number(n) || 0);
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " Ft";
}

function calcTotal(cart) {
  return cart.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 0), 0);
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function extractProductsList(res) {
  if (!res) return null;
  if (Array.isArray(res)) return res;
  const data = res.data ?? res.result ?? res.payload ?? res;
  if (Array.isArray(data)) return data;

  if (data && typeof data === "object") {
    const candidates = [data.products, data.items, data.list, data.rows, data.data];
    for (const c of candidates) if (Array.isArray(c)) return c;
  }
  return null;
}

function pickPrice(p) {
  return p.price ?? p.unit_price ?? p.ar ?? p.price_huf ?? p.gross_price ?? p.net_price ?? 0;
}

function normalizePrice(v) {
  const n = Number(String(v ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

async function hydrateCartPricesIfNeeded() {
  const cart = getCart();
  if (!cart.length) return;

  const hasMissing = cart.some(it => !it.price || Number(it.price) === 0);
  if (!hasMissing) return;

  // products list betöltés
  const res = await window.api.get("/products");
  const list = extractProductsList(res) || [];
  const map = new Map(list.map(p => [String(p.id), normalizePrice(pickPrice(p))]));

  let changed = false;
  for (const it of cart) {
    const key = String(it.id);
    const p = map.get(key);
    if (p && (!it.price || Number(it.price) === 0)) {
      it.price = p;
      changed = true;
    }
  }
  if (changed) saveCart(cart);
}

function render() {
  const list = document.getElementById("cartList");
  const totalEl = document.getElementById("cartTotal");
  const cart = getCart();

  if (!cart.length) {
    list.innerHTML = `<div class="rp-empty">A kosarad üres.</div>`;
    totalEl.textContent = formatFt(0);
    return;
  }

  list.innerHTML = cart.map(it => `
    <div class="rp-row" data-id="${it.id}">
      <div>
        <div class="rp-name">${escapeHtml(it.name)}</div>
        <div class="rp-sub">${escapeHtml(it.category || "Kategória")}</div>
      </div>

      <div class="rp-qty">
        <button data-act="dec">−</button>
        <div style="min-width:28px; text-align:center; font-weight:900;">${it.qty}</div>
        <button data-act="inc">+</button>
      </div>

      <div class="rp-price">${formatFt((Number(it.price)||0) * (Number(it.qty)||0))}</div>
      <button class="rp-remove" title="Eltávolítás" data-act="remove">×</button>
    </div>
  `).join("");

  totalEl.textContent = formatFt(calcTotal(cart));

  list.querySelectorAll(".rp-row button").forEach(btn => {
    btn.addEventListener("click", () => {
      const row = btn.closest(".rp-row");
      const id = row.getAttribute("data-id");
      const act = btn.getAttribute("data-act");

      let cart = getCart();
      const idx = cart.findIndex(x => String(x.id) === String(id));
      if (idx < 0) return;

      if (act === "inc") cart[idx].qty += 1;
      if (act === "dec") cart[idx].qty = Math.max(1, cart[idx].qty - 1);
      if (act === "remove") cart.splice(idx, 1);

      saveCart(cart);
      render();
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  // nav.js-től jön a theme + badge
  try {
    // árak “rehydrate”
    await hydrateCartPricesIfNeeded();
  } catch (e) {
    console.log("Cart hydrate error:", e);
  }

  render();
});
