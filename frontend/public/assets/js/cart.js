function getCart() {
  try { return JSON.parse(localStorage.getItem("rp_cart") || "[]"); }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem("rp_cart", JSON.stringify(cart));
  if (typeof updateCartBadge === "function") updateCartBadge();
}

function t(key, fallback) {
  return fallback || key;
}

function formatFt(n) {
  const x = Math.round(Number(n) || 0);
  return x.toLocaleString('hu-HU') + " Ft";
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
    for (const c of [data.products, data.items, data.list, data.rows, data.data])
      if (Array.isArray(c)) return c;
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

async function hydrateCartFromBackend() {
  let cart = getCart();
  if (!cart.length) return;

  // Preserve all existing fields (name, price, etc.) and add id+qty
  const normalized = cart.map(it => ({
    ...it,
    id: Number(it.id),
    qty: Math.max(1, Number(it.qty) || 1),
  })).filter(it => Number.isFinite(it.id) && it.id > 0);

  if (!window.api) {
    // No API - use cart as-is (demo products already have name/price)
    saveCart(normalized);
    return;
  }

  try {
    const ids = normalized.map(it => it.id);
    const res = await window.api.post('/products/by-ids', { ids });
    const list = extractProductsList(res) || (res?.data?.products ?? res?.products) || [];
    const map = new Map(list.map(p => [String(p.id), p]));

    for (const it of normalized) {
      const p = map.get(String(it.id));
      if (p) {
        it.name = p.name || it.name;
        it.category = p.category_name || p.category || it.category || '';
        it.price = normalizePrice(pickPrice(p));
        it.image = (p.image_url || (Array.isArray(p.images) ? p.images[0] : '') || '').trim();
        it.stock = p.stock;
      }
    }
    saveCart(normalized);
  } catch (e) {
    // API unavailable - keep existing cart data (may already have name/price from products page)
    saveCart(normalized);
    console.log('Cart hydrate skipped (API unavailable):', e.message);
  }
}

function render() {
  const list = document.getElementById("cartList");
  const totalEl = document.getElementById("cartTotal");
  const cart = getCart();

  if (!cart.length) {
    list.innerHTML = `<div class="rp-empty">${escapeHtml(t("cart_empty", "A kosarad üres."))}</div>`;
    if (totalEl) totalEl.textContent = formatFt(0);
    return;
  }

  list.innerHTML = cart.map(it => `
    <div class="rp-row" data-id="${it.id}">
      <div>
        <div class="rp-name">${escapeHtml(it.name || "")}</div>
        <div class="rp-sub">${escapeHtml(it.category || t("category_default", "Kategória"))}</div>
      </div>
      <div class="rp-qty">
        <button data-act="dec">−</button>
        <div style="min-width:28px; text-align:center; font-weight:900;">${it.qty}</div>
        <button data-act="inc">+</button>
      </div>
      <div class="rp-price">${formatFt((Number(it.price)||0) * (Number(it.qty)||0))}</div>
      <button class="rp-remove" title="${escapeHtml(t("cart_remove","Eltávolítás"))}" data-act="remove">
        <i class="bi bi-x-lg" aria-hidden="true"></i>
      </button>
    </div>
  `).join("");

  if (totalEl) totalEl.textContent = formatFt(calcTotal(cart));

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

// Re-render on language change
window.addEventListener("storage", (e) => {
  if (!e?.key || e.key === "rp_cart" || e.key === "rp_lang") render();
});

function getToken() {
  return localStorage.getItem('rp_token') || '';
}

function getUser() {
  try { return JSON.parse(localStorage.getItem('rp_user') || 'null'); }
  catch { return null; }
}

function mapCartToOrderItems(cart) {
  return cart.map(it => ({
    product_id: Number(it.id),
    quantity: Number(it.qty) || 1
  })).filter(x => Number.isFinite(x.product_id) && x.product_id > 0);
}

async function openCheckoutModal() {
  const cart = getCart();
  if (!cart.length) {
    window.rpToast(t("cart_empty", "A kosár üres.", '', 'info'));
    return;
  }
  // Vendég rendelés is engedélyezett — nincs auth check

  const user = getUser();
  const nameEl = document.getElementById('checkoutName');
  const emailEl = document.getElementById('checkoutEmail');
  if (user) {
    if (nameEl && user.full_name) nameEl.value = user.full_name;
    if (emailEl && user.email) emailEl.value = user.email;
  }

  try {
    // Try rp_user first, then rp_account_cached
    let addrParts = null;
    try { addrParts = JSON.parse(localStorage.getItem("rp_user")||'null')?.address_parts; } catch {}
    if (!addrParts) {
      try { addrParts = JSON.parse(localStorage.getItem("rp_account_cached")||'null')?.address_parts; } catch {}
    }
    const acc = { address_parts: addrParts };
    if (acc?.address_parts) {
      document.getElementById("checkoutZip").value = acc.address_parts.zip || "";
      document.getElementById("checkoutCity").value = acc.address_parts.city || "";
      document.getElementById("checkoutStreet").value = acc.address_parts.street || "";
      document.getElementById("checkoutHouse").value = acc.address_parts.house || "";
      document.getElementById("checkoutAddressExtra").value = acc.address_parts.extra || "";
    }
  } catch {}

  const total = calcTotal(cart);
  const totalEl = document.getElementById('checkoutTotal');
  if (totalEl) totalEl.textContent = formatFt(total);

  const modalEl = document.getElementById('checkoutModal');
  if (!modalEl || !window.bootstrap?.Modal) {
    const ok = await window.rpConfirm?.("Rendelés megerősítése", `${t("checkout_total_label","Fizetendő:")} ${formatFt(total)}\n${t("checkout_payment_label","Fizetés:")} ${t("checkout_payment_cod","Utánvét")}\n\n${t("checkout_place_order","Leadod a rendelést?")}`);
    if (ok) placeOrder();
    return;
  }

  window.bootstrap.Modal.getOrCreateInstance(modalEl).show();
}

function buildAddressString({ zip, city, street, house, extra }) {
  let base = `${String(zip||"").trim()} ${String(city||"").trim()}, ${String(street||"").trim()} ${String(house||"").trim()}`.trim();
  base = base.replace(/\s+/g, " ");
  if (extra) base += `, ${String(extra).trim()}`;
  return base;
}

async function placeOrder() {
  const cart = getCart();
  if (!cart.length) return;

  const name = (document.getElementById('checkoutName')?.value || '').trim();
  const email = (document.getElementById('checkoutEmail')?.value || '').trim();
  const zip = (document.getElementById('checkoutZip')?.value || '').trim();
  const city = (document.getElementById('checkoutCity')?.value || '').trim();
  const street = (document.getElementById('checkoutStreet')?.value || '').trim();
  const house = (document.getElementById('checkoutHouse')?.value || '').trim();
  const extra = (document.getElementById('checkoutAddressExtra')?.value || '').trim();

  if (!name || !email || !zip || !city || !street || !house) {
    window.rpToast(t("checkout_fill_required", "Kérlek töltsd ki a nevet, e-mailt és a címet.", '', 'info'));
    return;
  }

  const address = buildAddressString({ zip, city, street, house, extra });

  try {
    const cached = JSON.parse(localStorage.getItem("rp_account_cached") || "null") || {};
    cached.address_parts = { zip, city, street, house, extra };
    localStorage.setItem("rp_account_cached", JSON.stringify(cached));
  } catch {}

  const payload = {
    name, email, address,
    payment_method: 'utanvet',
    items: mapCartToOrderItems(cart)
  };

  const btn = document.getElementById('placeOrderBtn');
  const oldText = btn ? btn.textContent : '';
  if (btn) { btn.disabled = true; btn.textContent = t("checkout_processing", "Feldolgozás..."); }

  try {
    const res = await window.api.post('/orders', payload);
    saveCart([]);
    render();

    const modalEl = document.getElementById('checkoutModal');
    const modal = modalEl && window.bootstrap?.Modal ? window.bootstrap.Modal.getInstance(modalEl) : null;
    if (modal) modal.hide();

    const orderId = res?.data?.order_id || res?.order_id || res?.data?.data?.order_id;
    window.rpToast(orderId
      ? `${t("order_thanks","Köszönjük!", '', 'info')} ${t("order_id_prefix","Rendelés azonosító:")} ${orderId}`
      : t("order_thanks","Köszönjük! A rendelésed rögzítettük."));
  } catch (e) {
    window.rpToast(e?.message || String(e, '', 'info'));
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = oldText; }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // Render immediately with localStorage data so user sees cart right away
  render();
  // Then hydrate from backend (may update prices/names)
  try { await hydrateCartFromBackend(); render(); } catch (e) { console.log("Cart hydrate error:", e); }
  document.getElementById('checkoutBtn')?.addEventListener('click', openCheckoutModal);
  document.getElementById('placeOrderBtn')?.addEventListener('click', placeOrder);
});
