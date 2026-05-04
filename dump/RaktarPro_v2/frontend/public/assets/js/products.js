let allProducts = [];

function pickPrice(p) {
  // Több lehetséges mezőnév
  return p.price ?? p.unit_price ?? p.ar ?? p.price_huf ?? p.gross_price ?? p.net_price ?? 0;
}

function normalizePrice(v) {
  const n = Number(String(v ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function formatFt(n) {
  const x = Math.round(Number(n) || 0);
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " Ft";
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
    const candidates = [
      data.products, data.items, data.list, data.rows, data.data,
      res.products, res.items, res.list
    ];
    for (const c of candidates) if (Array.isArray(c)) return c;
  }
  return null;
}

function getCart() {
  try { return JSON.parse(localStorage.getItem("rp_cart") || "[]"); }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem("rp_cart", JSON.stringify(cart));
  if (typeof updateCartBadge === "function") updateCartBadge();
}

function addToCart(product) {
  const cart = getCart();
  const idx = cart.findIndex(it => String(it.id) === String(product.id));

  const price = normalizePrice(pickPrice(product));
  const category = product.category || product.category_name || product.categoryName || "";

  if (idx >= 0) {
    cart[idx].qty += 1;
    // Ha korábban 0 volt elmentve, javítsuk felül
    if (!cart[idx].price || Number(cart[idx].price) === 0) cart[idx].price = price;
  } else {
    cart.push({
      id: product.id,
      name: product.name || "Termék",
      price,
      qty: 1,
      category,
    });
  }

  saveCart(cart);
}

function render(products) {
  const grid = document.getElementById("productsGrid");
  const empty = document.getElementById("productsEmpty");
  grid.innerHTML = "";

  if (!products.length) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  const t = (k, fallback) => (window.lang?.t ? window.lang.t(k) : (fallback ?? k));
  const lang = (window.lang?.getLang ? window.lang.getLang() : "hu");

  function pickLocalized(obj, baseKeys) {
    // Tries keys like description_en / short_description_de etc.
    for (const base of baseKeys) {
      const k1 = `${base}_${lang}`;
      if (obj && obj[k1]) return obj[k1];
      const k2 = `${base}${lang.toUpperCase()}`;
      if (obj && obj[k2]) return obj[k2];
    }
    // Tries nested maps: description: { hu: "", en: "" }
    for (const base of baseKeys) {
      const v = obj?.[base];
      if (v && typeof v === "object" && v[lang]) return v[lang];
    }
    // Fallback to first plain base key
    for (const base of baseKeys) {
      const v = obj?.[base];
      if (typeof v === "string" && v.trim()) return v;
    }
    return "";
  }

  for (const p of products) {
    const price = normalizePrice(pickPrice(p));
    const category = pickLocalized(p, ["category", "category_name", "categoryName"]) || t("category_default", "Kategória");
    const desc = pickLocalized(p, ["short_description", "shortDescription", "description"]);
    const stock = (p.stock !== undefined && p.stock !== null) ? Number(p.stock) : null;

    const inStock = stock === null ? true : stock > 0; // ha nincs stock mező, tekintsük készletennek

    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-lg-4 col-xl-3";

    col.innerHTML = `
      <div class="rp-card h-100 d-flex flex-column">
        <div class="rp-img">${escapeHtml(t("no_image", "Nincs kép"))}</div>

        <div class="p-3 d-flex flex-column gap-2 flex-grow-1">
          <div class="d-flex align-items-center justify-content-between">
            <span class="rp-tag">${escapeHtml(category)}</span>
            <span class="rp-stock">
              ${inStock ? escapeHtml(t("in_stock", "Készleten")) : escapeHtml(t("out_of_stock", "Nincs készleten"))}
              ${stock !== null ? ` (${stock} ${escapeHtml(t("pcs", "db"))})` : ""}
            </span>
          </div>

          <div class="fw-bold fs-5">${escapeHtml(p.name || "Névtelen termék")}</div>

          <div class="rp-desc" style="font-size:13px; min-height: 34px;">
            ${escapeHtml(desc).slice(0, 70)}
          </div>

          <div class="mt-auto d-flex align-items-center justify-content-between pt-2">
            <div class="rp-price">${formatFt(price)}</div>
          </div>

          <div class="d-flex gap-2 pt-1">
            <button class="btn rp-btn flex-grow-1" data-action="details" data-id="${p.id}">${escapeHtml(t("details", "Részletek"))}</button>
            <button class="btn rp-btn-primary flex-grow-1"
                    data-action="add" data-id="${p.id}" ${inStock ? "" : "disabled"}>
              ${escapeHtml(t("add_to_cart", "Kosárba"))}
            </button>
          </div>
        </div>
      </div>
    `;

    grid.appendChild(col);
  }

  grid.querySelectorAll("button[data-action='add']").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const product = allProducts.find(x => String(x.id) === String(id));
      if (!product) return;
      addToCart(product);
    });
  });

  grid.querySelectorAll("button[data-action='details']").forEach(btn => {
    btn.addEventListener("click", () => alert("Részletek: hamarosan 🙂"));
  });

  // If language was switched before render finished, ensure static bits are refreshed
  window.lang?.apply?.();
}

function applyFilters() {
  const q = (document.getElementById("searchInput").value || "").trim().toLowerCase();
  const sort = document.getElementById("sortSelect").value;

  let list = [...allProducts];

  if (q) {
    list = list.filter(p => {
      const name = String(p.name || "").toLowerCase();
      const cat = String(p.category || p.category_name || p.categoryName || "").toLowerCase();
      return name.includes(q) || cat.includes(q);
    });
  }

  if (sort === "price_asc") list.sort((a,b) => normalizePrice(pickPrice(a)) - normalizePrice(pickPrice(b)));
  if (sort === "price_desc") list.sort((a,b) => normalizePrice(pickPrice(b)) - normalizePrice(pickPrice(a)));
  if (sort === "name_asc") list.sort((a,b) => String(a.name||"").localeCompare(String(b.name||""), "hu"));

  render(list);
}

async function loadProducts() {
  const res = await window.api.get("/products");
  const list = extractProductsList(res);

  if (!Array.isArray(list)) {
    console.log("DEBUG /products response:", res);
    throw new Error("A /products válasza nem lista. Nézd meg a Console-ban a DEBUG logot.");
  }

  allProducts = list;
  applyFilters();
}

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("searchInput").addEventListener("input", applyFilters);
  document.getElementById("sortSelect").addEventListener("change", applyFilters);

  try {
    await loadProducts();
  } catch (e) {
    const grid = document.getElementById("productsGrid");
    grid.innerHTML = `
      <div class="col-12">
        <div class="rp-empty">
          Nem sikerült betölteni a termékeket.<br>
          <small style="opacity:.8;">${escapeHtml(e.message || String(e))}</small>
        </div>
      </div>
    `;
  }
});
