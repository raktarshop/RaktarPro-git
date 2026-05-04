/* eslint-disable no-alert */

// -------------------------
// Helpers
// -------------------------
function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizePrice(v) {
  if (v === null || v === undefined) return NaN;
  const n = Number(String(v).replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) ? Math.round(n) : NaN;
}

function setMsg(text) {
  const el = document.getElementById("adminMsg");
  if (!el) return;
  el.textContent = text || "";
}

// -------------------------
// State
// -------------------------
let categories = [];
let products = [];
let filtered = [];

// -------------------------
// Loaders
// -------------------------
async function loadCategories() {
  const res = await window.api.get("/categories");
  const list = Array.isArray(res?.data?.categories) ? res.data.categories
    : Array.isArray(res?.categories) ? res.categories
    : Array.isArray(res?.data) ? res.data
    : Array.isArray(res) ? res : [];
  categories = list.map(c => ({
    id: c.id,
    name: c.name,
    parent_id: c.parent_id ?? null
  }));
}

async function loadProducts() {
  const res = await window.api.get("/products");
  const list = Array.isArray(res?.data?.products) ? res.data.products
    : Array.isArray(res?.products) ? res.products
    : Array.isArray(res?.data) ? res.data
    : Array.isArray(res) ? res : [];
  products = list.map(p => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    unit_price: Number(p.unit_price ?? p.price ?? 0) || 0,
    stock: Number(p.stock ?? 0) || 0,
    category_id: p.category_id ?? null,
    image_url: p.image_url ?? ""
  }));
}

function categoryNameById(id) {
  const c = categories.find(x => String(x.id) === String(id));
  return c ? c.name : "-";
}

function isAdmin() {
  try {
    const u = JSON.parse(localStorage.getItem("rp_user") || "null");
    if (!u) return false;
    if (u.is_admin === true) return true;
    if (Number(u.is_admin) === 1) return true;
    if (Number(u.role_id) === 1) return true;
    if (typeof u.role === "string" && u.role.toLowerCase() === "admin") return true;
    return false;
  } catch {
    return false;
  }
}

// -------------------------
// Render
// -------------------------
function renderTable(list) {
  const tbody = document.getElementById("adminTbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  list.forEach(p => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${escapeHtml(p.id)}</td>
      <td>
        <input class="form-control form-control-sm rp-admin-input"
               data-field="name" data-id="${escapeHtml(p.id)}"
               value="${escapeHtml(p.name)}" />
      </td>
      <td>
        <select class="form-select form-select-sm rp-admin-input"
                data-field="category_id" data-id="${escapeHtml(p.id)}">
          ${categories.map(c => `
            <option value="${escapeHtml(c.id)}" ${String(c.id) === String(p.category_id) ? "selected" : ""}>
              ${escapeHtml(c.name)}
            </option>
          `).join("")}
        </select>
      </td>
      <td>
        <input class="form-control form-control-sm rp-admin-input"
               data-field="image_url" data-id="${escapeHtml(p.id)}"
               value="${escapeHtml(p.image_url)}" />
      </td>
      <td>
        <input class="form-control form-control-sm rp-admin-input rp-mini"
               data-field="unit_price" data-id="${escapeHtml(p.id)}"
               type="number" min="0" step="1"
               value="${escapeHtml(p.unit_price)}" />
      </td>
      <td>
        <input class="form-control form-control-sm rp-admin-input rp-mini"
               data-field="stock" data-id="${escapeHtml(p.id)}"
               type="number" min="0" step="1"
               value="${escapeHtml(p.stock)}" />
      </td>
      <td class="d-flex gap-2">
        <button class="btn btn-sm rp-admin-btn" data-action="save" data-id="${escapeHtml(p.id)}">Mentés</button>
        <button class="btn btn-sm rp-admin-btn" data-action="delete" data-id="${escapeHtml(p.id)}">Törlés</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function apply() {
  const q = (document.getElementById("adminSearch")?.value || "").trim().toLowerCase();
  filtered = products.filter(p => {
    if (!q) return true;
    return (
      String(p.id).toLowerCase().includes(q) ||
      String(p.name).toLowerCase().includes(q) ||
      String(p.sku).toLowerCase().includes(q) ||
      String(categoryNameById(p.category_id)).toLowerCase().includes(q)
    );
  });
  renderTable(filtered);
}

// -------------------------
// CRUD
// -------------------------
async function saveProduct(id) {
  const rowInputs = Array.from(document.querySelectorAll(`[data-id="${CSS.escape(String(id))}"]`));
  const payload = {};
  rowInputs.forEach(el => {
    const field = el.getAttribute("data-field");
    if (!field) return;
    payload[field] = el.value;
  });

  if (payload.unit_price !== undefined) payload.unit_price = normalizePrice(payload.unit_price);
  if (payload.stock !== undefined) payload.stock = Math.max(0, Number(payload.stock) || 0);
  if (payload.category_id !== undefined) payload.category_id = Number(payload.category_id);

  try {
    await window.api.put(`/products/${id}`, payload);
    setMsg("Mentve.");
    await loadProducts();
    apply();
  } catch (e) {
    setMsg(`Hiba: ${e.message || e}`);
  }
}

async function deleteProduct(id) {
  if (!confirm("Biztos törlöd?")) return;
  try {
    await window.api.delete(`/products/${id}`);
    setMsg("Törölve.");
    await loadProducts();
    apply();
  } catch (e) {
    setMsg(`Hiba: ${e.message || e}`);
  }
}

// -------------------------
// New product modal (régi)
// -------------------------
function fillNewProductCategories() {
  const sel = document.getElementById("newPCategory");
  if (!sel) return;
  sel.innerHTML = `<option value="" disabled selected>Válassz kategóriát...</option>` +
    categories.map(c => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.name)}</option>`).join("");
}

function setNewPMsg(text, isError = false) {
  const el = document.getElementById("newPMsg");
  if (!el) return;
  el.textContent = text || "";
  el.style.color = isError ? "#ffb3b3" : "";
}

async function createProductFromModal() {
  const name = (document.getElementById("newPName")?.value || "").trim();
  const sku = (document.getElementById("newPSku")?.value || "").trim();
  const unit_price = normalizePrice(document.getElementById("newPPrice")?.value);
  const stock = Math.max(0, Number(document.getElementById("newPStock")?.value) || 0);
  const category_id = (document.getElementById("newPCategory")?.value || "").trim();
  const image_url = (document.getElementById("newPImageUrl")?.value || "").trim();

  // UI-ban a user által kért kötelezők
  if (!name || !sku || !unit_price || !Number.isFinite(unit_price) || unit_price <= 0 || !category_id || !image_url) {
    setNewPMsg("Kérlek tölts ki minden kötelező mezőt (Név, SKU, Ár, Készlet, Kategória, Kép URL).", true);
    return;
  }

  const payload = {
    name,
    sku,
    unit_price,
    stock,
    category_id: Number(category_id),
    image_url
  };

  const btn = document.getElementById("newPSave");
  if (btn) btn.disabled = true;
  setNewPMsg("Mentés...", false);

  try {
    await window.api.post("/products", payload);
    setNewPMsg("Termék létrehozva!", false);

    // reload list
    await loadProducts();
    apply();

    // reset inputs
    ["newPName","newPSku","newPPrice","newPStock","newPImageUrl"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });

    // close modal
    const modalEl = document.getElementById("newProductModal");
    if (modalEl && window.bootstrap) {
      const m = window.bootstrap.Modal.getInstance(modalEl);
      if (m) m.hide();
    }
  } catch (e) {
    setNewPMsg(`Hiba: ${e.message || e}`, true);
  } finally {
    if (btn) btn.disabled = false;
  }
}

// ✅ Inline (dashboard) termék létrehozás – ugyanaz az elv, mint a kategóriáknál
function fillInlineProductCategories() {
  const sel = document.getElementById("inlinePCategory");
  if (!sel) return;
  sel.innerHTML = `<option value="" disabled selected>Válassz kategóriát...</option>` +
    categories.map(c => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.name)}</option>`).join("");
}

function setInlinePMsg(text, isError = false) {
  const el = document.getElementById("inlinePMsg");
  if (!el) return;
  el.textContent = text || "";
  el.style.color = isError ? "#ffb3b3" : "";
}

async function createProductFromInline() {
  const name = (document.getElementById("inlinePName")?.value || "").trim();
  const sku = (document.getElementById("inlinePSku")?.value || "").trim();
  const unit_price = normalizePrice(document.getElementById("inlinePPrice")?.value);
  const stock = Math.max(0, Number(document.getElementById("inlinePStock")?.value) || 0);
  const category_id = (document.getElementById("inlinePCategory")?.value || "").trim();
  const image_url = (document.getElementById("inlinePImageUrl")?.value || "").trim();

  if (!name || !sku || !unit_price || !Number.isFinite(unit_price) || unit_price <= 0 || !category_id || !image_url) {
    setInlinePMsg("Kérlek tölts ki minden kötelező mezőt (Név, SKU, Ár, Készlet, Kategória, Kép URL).", true);
    return;
  }

  const payload = {
    name,
    sku,
    unit_price,
    stock,
    category_id: Number(category_id),
    image_url
  };

  const btn = document.getElementById("inlinePCreate");
  if (btn) btn.disabled = true;
  setInlinePMsg("Mentés...", false);

  try {
    await window.api.post("/products", payload);
    setInlinePMsg("Termék létrehozva!", false);

    // reload
    await loadProducts();
    apply();

    // reset
    ["inlinePName","inlinePSku","inlinePPrice","inlinePStock","inlinePImageUrl"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });

    // keep category selection
    const sel = document.getElementById("inlinePCategory");
    if (sel) sel.selectedIndex = 0;
  } catch (e) {
    setInlinePMsg(`Hiba: ${e.message || e}`, true);
  } finally {
    if (btn) btn.disabled = false;
  }
}

// -------------------------
// Init
// -------------------------
document.addEventListener("DOMContentLoaded", async () => {
  if (!window.api) {
    alert("API nincs inicializálva.");
    return;
  }

  if (!isAdmin()) {
    alert("Nincs admin jogosultság.");
    window.location.href = "./products.html";
    return;
  }

  try {
    await loadCategories();
    await loadProducts();
    apply();
    fillNewProductCategories();
    fillInlineProductCategories();
  } catch (e) {
    setMsg(`Hiba: ${e.message || e}`);
  }

  document.getElementById("adminSearch")?.addEventListener("input", apply);
  document.getElementById("adminReload")?.addEventListener("click", async () => {
    try {
      await loadCategories();
      await loadProducts();
      fillNewProductCategories();
      fillInlineProductCategories();
      apply();
    } catch (e) {
      setMsg(`Hiba: ${e.message || e}`);
    }
  });

  // ✅ Inline termék létrehozás események
  const inlineCreate = document.getElementById("inlinePCreate");
  const inlineRefresh = document.getElementById("inlinePRefresh");
  inlineCreate?.addEventListener("click", async () => {
    try {
      if (!categories.length) await loadCategories();
      fillInlineProductCategories();
      await createProductFromInline();
    } catch (e) {
      setInlinePMsg(`Hiba: ${e.message || e}`, true);
    }
  });
  inlineRefresh?.addEventListener("click", async () => {
    try {
      await loadCategories();
      await loadProducts();
      fillInlineProductCategories();
      apply();
      setInlinePMsg("Frissítve.", false);
    } catch (e) {
      setInlinePMsg(`Hiba: ${e.message || e}`, true);
    }
  });

  // row buttons
  document.getElementById("adminTbody")?.addEventListener("click", async (e) => {
    const btn = e.target?.closest("button");
    if (!btn) return;
    const action = btn.getAttribute("data-action");
    const id = btn.getAttribute("data-id");
    if (!action || !id) return;

    if (action === "save") await saveProduct(id);
    if (action === "delete") await deleteProduct(id);
  });

  // Modal open (régi)
  const addBtn = document.getElementById("adminAddProduct");
  const modalEl = document.getElementById("addProductModal");
  const newPSave = document.getElementById("newPSave");

  let bsModal = null;
  if (modalEl && window.bootstrap?.Modal) bsModal = new window.bootstrap.Modal(modalEl);

  addBtn?.addEventListener("click", async () => {
    try {
      if (!categories.length) await loadCategories();
      fillNewProductCategories();
      setNewPMsg("");
      if (bsModal) bsModal.show();
    } catch (e) {
      alert(e?.message || String(e));
    }
  });

  newPSave?.addEventListener("click", createProductFromModal);
});
