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

function getLang() {
  return window.lang?.getLang ? window.lang.getLang() : (localStorage.getItem("rp_lang") || "hu");
}

function t(key) {
  return window.lang?.t ? window.lang.t(key) : key;
}

function pickLocalizedText(product, baseKey) {
  const lang = getLang();

  const keyA = `${baseKey}_${lang}`; // pl. description_en
  if (typeof product?.[keyA] === "string" && product[keyA].trim()) return product[keyA].trim();

  const obj = product?.[baseKey];
  if (obj && typeof obj === "object") {
    const v = obj?.[lang];
    if (typeof v === "string" && v.trim()) return v.trim();
  }

  if (typeof product?.[baseKey] === "string" && product[baseKey].trim()) return product[baseKey].trim();
  return "";
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

  for (const p of products) {
    const price = normalizePrice(pickPrice(p));
    const category = p.category || p.category_name || p.categoryName || "Kategória";
    const desc = pickLocalizedText(p, "description") || p.description || p.short_description || p.shortDescription || "";
    const stock = (p.stock !== undefined && p.stock !== null) ? Number(p.stock) : null;

    const inStock = stock === null ? true : stock > 0; // ha nincs stock mező, tekintsük készletennek

    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-lg-4 col-xl-3";

    const img = (p.image_url || p.imageUrl || "").trim();
    const imgHtml = img
      ? `<img src="${escapeHtml(img)}" alt="${escapeHtml(p.name || "")}" loading="lazy" onerror="this.onerror=null;this.style.display='none';this.parentElement.classList.add('rp-img-fallback');this.parentElement.textContent='${escapeHtml(t("no_image"))}';">`
      : `${escapeHtml(t("no_image"))}`;

    col.innerHTML = `
      <div class="rp-card h-100 d-flex flex-column">
        <div class="rp-img">${imgHtml}</div>

        <div class="p-3 d-flex flex-column gap-2 flex-grow-1">
          <div class="d-flex align-items-center justify-content-between">
            <span class="rp-tag">${escapeHtml(category)}</span>
            <span class="rp-stock">
              ${inStock ? escapeHtml(t("in_stock")) : escapeHtml(t("out_of_stock"))}
              ${stock !== null ? ` (${stock} db)` : ""}
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
            <button class="btn rp-btn flex-grow-1" data-action="details" data-id="${p.id}">${escapeHtml(t("details_btn"))}</button>
            <button class="btn rp-btn-primary flex-grow-1"
                    data-action="add" data-id="${p.id}" ${inStock ? "" : "disabled"}>
              ${escapeHtml(t("add_to_cart"))}
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
    btn.addEventListener("click", () => alert(t('details_soon') || 'Részletek: hamarosan 🙂'));
  });
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

  window.addEventListener('rp_lang_changed', () => {
    // dynamic cards need re-render on language change
    applyFilters();
  });

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
