// products.js

let allProducts = [];

function pickPrice(p) {
  return p.price ?? p.unit_price ?? p.ar ?? p.price_huf ?? p.gross_price ?? p.net_price ?? 0;
}
function normalizePrice(v) {
  const n = Number(String(v ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}
function formatFt(n) {
  const x = Math.round(Number(n) || 0);
  const suffix = window.lang?.t('currency_suffix') || 'Ft';
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " " + suffix;
}
function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}
function extractProductsList(res) {
  const root = (res && typeof res === "object" && "data" in res) ? res.data : res;
  if (Array.isArray(root)) return root;
  if (root && Array.isArray(root.products)) return root.products;
  if (root && root.data && Array.isArray(root.data.products)) return root.data.products;
  if (root && Array.isArray(root.items)) return root.items;
  if (root && Array.isArray(root.rows)) return root.rows;
  if (root && Array.isArray(root.list)) return root.list;
  return null;
}

// Category-based Unsplash product images (curated, product-focused)
const CATEGORY_IMAGES = {
  // Electronics
  'elektronika': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
  'electronics': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
  'laptop': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
  'számítógép': 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=300&fit=crop',
  'computer': 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=300&fit=crop',
  'telefon': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
  'mobil': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
  'phone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
  'tablet': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
  'headphone': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
  'headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
  'fejhallgató': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
  'monitor': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop',
  'kamera': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
  'camera': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
  'tv': 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=400&h=300&fit=crop',
  'televízió': 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=400&h=300&fit=crop',
  'speaker': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop',
  'hangszóró': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop',
  'keyboard': 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop',
  'billentyűzet': 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop',
  'mouse': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
  'egér': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
  'nyomtató': 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop',
  'printer': 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop',
  // Tools & hardware
  'szerszám': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
  'tool': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
  'hardware': 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
  // Furniture
  'bútor': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
  'furniture': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
  'szék': 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=300&fit=crop',
  'chair': 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=300&fit=crop',
  'asztal': 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop',
  // Clothing
  'ruha': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop',
  'clothing': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop',
  // Food
  'étel': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
  'food': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
  // Sports
  'sport': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop',
  // Books
  'könyv': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
  'book': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
  // Office
  'iroda': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
  'office': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
};

// Product name keyword matching for images
const NAME_IMAGES = {
  'laptop': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
  'notebook': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
  'macbook': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
  'iphone': 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=300&fit=crop',
  'samsung': 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=300&fit=crop',
  'galaxy': 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=300&fit=crop',
  'ipad': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
  'airpod': 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=300&fit=crop',
  'watch': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
  'óra': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
  'headphone': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
  'fejhallgató': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
  'speaker': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop',
  'hangszóró': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop',
  'monitor': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop',
  'keyboard': 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop',
  'billentyűzet': 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop',
  'mouse': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
  'egér': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
  'kamera': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
  'camera': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
  'tv': 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=400&h=300&fit=crop',
  'telefon': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
  'phone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
  'tablet': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
  'nyomtató': 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop',
  'printer': 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop',
  'router': 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400&h=300&fit=crop',
  'szék': 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=300&fit=crop',
  'chair': 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=300&fit=crop',
  'asztal': 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop',
  'desk': 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop',
  'kabát': 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=300&fit=crop',
  'jacket': 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=300&fit=crop',
};

// Rotating beautiful generic product images for anything unmatched
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
];

function getProductImage(p) {
  // 1. Use product's own image_url if set
  const own = (p.image_url || p.imageUrl || '').trim();
  if (own) return own;

  const name = String(p.name || '').toLowerCase();
  const cat = String(p.category || p.category_name || p.categoryName || '').toLowerCase();

  // 2. Match by product name keywords
  for (const [kw, url] of Object.entries(NAME_IMAGES)) {
    if (name.includes(kw)) return url;
  }

  // 3. Match by category keywords
  for (const [kw, url] of Object.entries(CATEGORY_IMAGES)) {
    if (cat.includes(kw) || name.includes(kw)) return url;
  }

  // 4. Deterministic fallback based on product ID
  const idx = Math.abs(Number(p.id) || 0) % FALLBACK_IMAGES.length;
  return FALLBACK_IMAGES[idx];
}

// i18n-aware stock badge
function getStockBadge(stock) {
  const t = window.lang?.t || (k => k);
  if (stock === null || stock === undefined) {
    return `<span class="rp-stock-pill rp-stock--ok"><i class="bi bi-check-circle-fill"></i> ${escapeHtml(t('in_stock'))}</span>`;
  }
  const n = Number(stock);
  if (n <= 0) {
    return `<span class="rp-stock-pill rp-stock--out"><i class="bi bi-x-circle-fill"></i> ${escapeHtml(t('out_of_stock'))}</span>`;
  } else if (n <= 5) {
    // Low stock: show only the label (no piece count) so the pill fits next to category on mobile
    return `<span class="rp-stock-pill rp-stock--warn"><i class="bi bi-exclamation-circle-fill"></i> ${escapeHtml(t('low_stock'))}</span>`;
  } else {
    return `<span class="rp-stock-pill rp-stock--ok"><i class="bi bi-check-circle-fill"></i> ${escapeHtml(t('in_stock'))}</span>`;
  }
}

function getCart() {
  try { return JSON.parse(localStorage.getItem("rp_cart") || "[]"); } catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem("rp_cart", JSON.stringify(cart));
  if (typeof updateCartBadge === "function") updateCartBadge();
}
function addToCartById(productId) {
  const cart = getCart();
  const idx = cart.findIndex(it => String(it.id) === String(productId));
  if (idx >= 0) cart[idx].qty = (Number(cart[idx].qty) || 1) + 1;
  else cart.push({ id: productId, qty: 1 });
  saveCart(cart);
}

function render(products) {
  const grid = document.getElementById("productsGrid");
  const empty = document.getElementById("productsEmpty");
  grid.innerHTML = "";
  if (!products.length) { empty.style.display = "block"; return; }
  empty.style.display = "none";

  const t = window.lang?.t || (k => k);

  for (const p of products) {
    const price = normalizePrice(pickPrice(p));
    const category = p.category || p.category_name || p.categoryName || t('category_default');
    const stock = (p.stock !== undefined && p.stock !== null) ? Number(p.stock) : null;
    const inStock = stock === null ? true : stock > 0;

    const imgSrc = getProductImage(p);

    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-lg-4 col-xl-3";
    col.innerHTML = `
      <div class="rp-card h-100 d-flex flex-column">
        <div class="rp-img">
          <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(p.name || '')}" loading="lazy"
               onerror="this.onerror=null;this.style.opacity='.3';this.src='https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop';">
        </div>
        <div class="p-3 d-flex flex-column gap-2 flex-grow-1">
          <div class="rp-top-pills">
            <span class="rp-tag">${escapeHtml(category)}</span>
            ${getStockBadge(stock)}
          </div>
          <div class="fw-bold fs-6 mt-1">${escapeHtml(p.name || t('empty_no_results'))}</div>
          <div class="mt-auto d-flex align-items-center justify-content-between pt-2">
            <div class="rp-price">${formatFt(price)}</div>
          </div>
          <div class="d-flex gap-2 pt-1">
            <a class="btn rp-btn flex-grow-1" href="./product_details.html?id=${encodeURIComponent(p.id)}">
              <i class="bi bi-info-circle me-2"></i><span>${escapeHtml(t('details_btn'))}</span>
            </a>
            <button class="btn rp-btn-primary flex-grow-1"
                    data-action="add" data-id="${p.id}" ${inStock ? "" : "disabled"}>
              <i class="bi bi-cart-plus me-2"></i><span>${escapeHtml(t('add_to_cart'))}</span>
            </button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(col);
  }

  grid.querySelectorAll("button[data-action='add']").forEach(btn => {
    btn.addEventListener("click", () => addToCartById(btn.getAttribute("data-id")));
  });
}

function applyFilters() {
  const q = (document.getElementById("searchInput")?.value || "").trim().toLowerCase();
  const sort = document.getElementById("sortSelect")?.value;
  let list = [...allProducts];
  if (q) list = list.filter(p => {
    const name = String(p.name || "").toLowerCase();
    const cat = String(p.category || p.category_name || p.categoryName || "").toLowerCase();
    return name.includes(q) || cat.includes(q);
  });
  if (sort === "price_asc") list.sort((a,b) => normalizePrice(pickPrice(a)) - normalizePrice(pickPrice(b)));
  if (sort === "price_desc") list.sort((a,b) => normalizePrice(pickPrice(b)) - normalizePrice(pickPrice(a)));
  if (sort === "name_asc") list.sort((a,b) => String(a.name||"").localeCompare(String(b.name||""), "hu"));
  render(list);
}

async function loadProducts() {
  const res = await window.api.get("/products?limit=200");
  const list = extractProductsList(res);
  if (!Array.isArray(list)) throw new Error("A /products nem listát adott.");
  allProducts = list;
  applyFilters();
}

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("searchInput")?.addEventListener("input", applyFilters);
  document.getElementById("sortSelect")?.addEventListener("change", applyFilters);
  window.addEventListener("storage", async (e) => {
    if (e.key === "rp_lang") applyFilters();
    if (e.key === "rp_products_updated") {
      try { await loadProducts(); } catch {}
    }
  });
  try {
    await loadProducts();
  } catch (e) {
    console.error(e);
    const empty = document.getElementById("productsEmpty");
    if (empty) { empty.style.display = "block"; empty.textContent = "Hiba a termékek betöltésekor."; }
  }
});