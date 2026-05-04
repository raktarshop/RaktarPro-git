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
  const root = (res && typeof res === "object" && "data" in res) ? res.data : res;

  if (Array.isArray(root)) return root;
  if (root && Array.isArray(root.products)) return root.products;
  if (root && root.data && Array.isArray(root.data.products)) return root.data.products;
  if (root && root.success && root.data && Array.isArray(root.data.products)) return root.data.products;

  if (root && Array.isArray(root.items)) return root.items;
  if (root && Array.isArray(root.rows)) return root.rows;
  if (root && Array.isArray(root.list)) return root.list;

  return null;
}

// kosár id+qty
function getCart() {
  try { return JSON.parse(localStorage.getItem("rp_cart") || "[]"); }
  catch { return []; }
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

  if (!products.length) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  for (const p of products) {
    const price = normalizePrice(pickPrice(p));
    const category = p.category || p.category_name || p.categoryName || "Kategória";
    const stock = (p.stock !== undefined && p.stock !== null) ? Number(p.stock) : null;
    const inStock = stock === null ? true : stock > 0;

    const img = (p.image_url || p.imageUrl || "").trim();
    const imgHtml = img
      ? `<img src="${escapeHtml(img)}" alt="${escapeHtml(p.name || "")}" loading="lazy"
              onerror="this.onerror=null;this.style.display='none';this.parentElement.classList.add('rp-img-fallback');this.parentElement.textContent='No image';">`
      : `No image`;

    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-lg-4 col-xl-3";
    col.innerHTML = `
      <div class="rp-card h-100 d-flex flex-column">
        <div class="rp-img">${imgHtml}</div>

        <div class="p-3 d-flex flex-column gap-2 flex-grow-1">
          <div class="d-flex align-items-center justify-content-between">
            <span class="rp-tag">${escapeHtml(category)}</span>
            <span class="rp-stock">
              ${inStock ? "In stock" : "Out of stock"}
              ${stock !== null ? ` (${stock} db)` : ""}
            </span>
          </div>

          <div class="fw-bold fs-5">${escapeHtml(p.name || "Névtelen termék")}</div>

          <div class="mt-auto d-flex align-items-center justify-content-between pt-2">
            <div class="rp-price">${formatFt(price)}</div>
          </div>

          <div class="d-flex gap-2 pt-1">
            <a class="btn rp-btn flex-grow-1" href="./product_details.html?id=${encodeURIComponent(p.id)}">
              <i class="bi bi-info-circle me-2"></i>Részletek
            </a>
            <button class="btn rp-btn-primary flex-grow-1"
                    data-action="add" data-id="${p.id}" ${inStock ? "" : "disabled"}>
              <i class="bi bi-cart-plus me-2"></i>Kosárba
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
      addToCartById(id);
    });
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
  const res = await window.api.get("/products?limit=200");
  const list = extractProductsList(res);

  if (!Array.isArray(list)) {
    console.log("DEBUG /products raw response:", res);
    throw new Error("A /products válaszát nem tudtam listává alakítani.");
  }

  allProducts = list;
  applyFilters();
}

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("searchInput")?.addEventListener("input", applyFilters);
  document.getElementById("sortSelect")?.addEventListener("change", applyFilters);

  try {
    await loadProducts();
  } catch (e) {
    console.error(e);
    const empty = document.getElementById("productsEmpty");
    if (empty) {
      empty.style.display = "block";
      empty.textContent = "Hiba a termékek betöltésekor (nézd a Console-t).";
    }
  }
});
