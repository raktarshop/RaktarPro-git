// admin.js – termékek kezelése + real-time broadcast + i18n

let all = [];
let categories = [];

function t(key, fallback) {
  try {
    const v = window.lang?.t ? window.lang.t(key) : null;
    return v || fallback || key;
  } catch { return fallback || key; }
}

function extractProductsList(res) {
  if (!res) return null;
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data?.products)) return res.data.products;
  if (Array.isArray(res?.products)) return res.products;
  const data = res.data ?? res.result ?? res.payload ?? res;
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    for (const c of [data.products, data.items, data.list, data.rows, data.data])
      if (Array.isArray(c)) return c;
  }
  return null;
}

function extractCategories(res) {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data?.categories)) return res.data.categories;
  if (Array.isArray(res?.categories)) return res.categories;
  if (Array.isArray(res?.data)) return res.data;
  return [];
}

function normalizePrice(v) {
  const n = Number(String(v ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

function setMsg(txt) {
  const el = document.getElementById("adminMsg");
  if (el) {
    el.textContent = txt || "";
    if (txt) {
      el.style.animation = "none";
      el.offsetHeight;
      el.style.animation = "rp-fade-in 0.3s ease";
    }
  }
}

function getCategoryNameById(id) {
  const c = categories.find(x => String(x.id) === String(id));
  return c?.name || "";
}

function broadcastProductChange() {
  try {
    localStorage.setItem('rp_products_updated', String(Date.now()));
    window.dispatchEvent(new Event('storage'));
  } catch {}
}

function flashSaveBtn(btn, success) {
  const icon = btn.querySelector("i");
  if (!icon) return;
  if (success) {
    icon.className = "bi bi-check-circle-fill text-success";
    btn.style.transform = "scale(1.2)";
    setTimeout(() => { icon.className = "bi bi-check2"; btn.style.transform = ""; }, 1200);
  } else {
    icon.className = "bi bi-x-circle-fill text-danger";
    btn.style.transform = "scale(1.1)";
    setTimeout(() => { icon.className = "bi bi-check2"; btn.style.transform = ""; }, 1200);
  }
}

function render(list) {
  const tbody = document.getElementById("adminTbody");
  tbody.innerHTML = "";

  for (const p of list) {
    const price = normalizePrice(p.unit_price ?? p.price ?? 0);
    const stock = (p.stock !== undefined && p.stock !== null) ? Number(p.stock) : 0;
    const imageUrl = p.image_url ?? p.imageUrl ?? "";
    const categoryId = p.category_id ?? p.categoryId ?? "";

    const tr = document.createElement("tr");
    tr.style.animation = "rp-fade-in 0.25s ease both";

    const options = [
      `<option value="">${escapeHtml(t('admin_categories_none','(nincs)'))}</option>`,
      ...categories.map(c => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.name)}</option>`)
    ].join("");

    tr.innerHTML = `
      <td class="small opacity-75">${escapeHtml(p.id)}</td>
      <td><strong>${escapeHtml(p.name || "")}</strong></td>
      <td style="min-width:160px;">
        <select class="form-select form-select-sm" data-field="category_id" data-id="${p.id}">${options}</select>
      </td>
      <td style="min-width:220px;">
        <input class="form-control form-control-sm" type="text" placeholder="https://..." value="${escapeHtml(imageUrl)}" data-field="image_url" data-id="${p.id}">
      </td>
      <td style="min-width:110px;">
        <input class="form-control form-control-sm" type="number" min="0" step="1" value="${price}" data-field="unit_price" data-id="${p.id}">
      </td>
      <td style="min-width:100px;">
        <input class="form-control form-control-sm" type="number" min="0" step="1" value="${stock}" data-field="stock" data-id="${p.id}">
      </td>
      <td style="min-width:100px;">
        <div class="d-flex gap-1">
          <button class="btn btn-sm rp-admin-btn rp-icon-btn" data-act="save" data-id="${p.id}" title="${escapeHtml(t('admin_orders_save','Mentés'))}" style="transition: all 200ms ease;">
            <i class="bi bi-check2"></i>
          </button>
          <button class="btn btn-sm rp-admin-btn-danger rp-icon-btn" data-act="del" data-id="${p.id}" title="Törlés" style="transition: all 200ms ease;">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);

    const sel = tr.querySelector(`select[data-field="category_id"][data-id="${p.id}"]`);
    if (sel) sel.value = categoryId === null ? "" : String(categoryId);
  }

  // Save
  tbody.querySelectorAll("button[data-act='save']").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const priceEl = tbody.querySelector(`input[data-field="unit_price"][data-id="${id}"]`);
      const stockEl = tbody.querySelector(`input[data-field="stock"][data-id="${id}"]`);
      const catEl = tbody.querySelector(`select[data-field="category_id"][data-id="${id}"]`);
      const imgEl = tbody.querySelector(`input[data-field="image_url"][data-id="${id}"]`);

      const unit_price = normalizePrice(priceEl?.value);
      const stock = Math.max(0, Number(stockEl?.value) || 0);
      const category_id = (catEl?.value ?? "").trim();
      const image_url = (imgEl?.value ?? "").trim();

      const payload = {
        unit_price, stock,
        category_id: category_id === "" ? null : Number(category_id),
        image_url: image_url === "" ? null : image_url
      };

      btn.disabled = true;
      setMsg(t('admin_orders_save','Mentés') + "...");
      try {
        await window.api.put(`/products/${id}`, payload);
        setMsg(`✓ Mentve: #${id}`);
        flashSaveBtn(btn, true);
        const idx = all.findIndex(x => String(x.id) === String(id));
        if (idx >= 0) {
          all[idx].unit_price = unit_price;
          all[idx].stock = stock;
          all[idx].category_id = payload.category_id;
          all[idx].category_name = getCategoryNameById(payload.category_id);
          all[idx].image_url = payload.image_url;
        }
        broadcastProductChange();
      } catch (e) {
        setMsg(`Hiba: ${e.message || e}`);
        flashSaveBtn(btn, false);
      } finally {
        btn.disabled = false;
      }
    });
  });

  // Delete
  tbody.querySelectorAll("button[data-act='del']").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const p = all.find(x => String(x.id) === String(id));
      const name = p?.name ? `"${p.name}"` : `#${id}`;
      if (!confirm(`Biztosan törlöd: ${name}?`)) return;

      btn.disabled = true;
      setMsg("Törlés...");
      try {
        await window.api.del(`/products/${id}`);
        all = all.filter(x => String(x.id) !== String(id));
        apply();
        setMsg(`✓ Törölve: #${id}`);
        broadcastProductChange();
      } catch (e) {
        btn.disabled = false;
        setMsg(`Hiba: ${e.message || e}`);
      }
    });
  });
}

async function loadCategories() {
  const res = await window.api.get("/categories");
  categories = extractCategories(res);
}

async function loadProducts() {
  setMsg("Betöltés...");
  const res = await window.api.get("/products?limit=200");
  const list = extractProductsList(res);
  if (!Array.isArray(list)) {
    console.log("DEBUG /products response:", res);
    throw new Error("A /products nem listát adott.");
  }
  all = list;
  setMsg("");
}

function apply() {
  const q = (document.getElementById("adminSearch")?.value || "").trim().toLowerCase();
  const list = q ? all.filter(p => String(p.name || "").toLowerCase().includes(q)) : all;
  render(list);
}

function isAdminUser(user) {
  if (!user) return false;
  if (user.is_admin === true) return true;
  if (Number(user.is_admin) === 1) return true;
  if (Number(user.role_id) === 1) return true;
  if (typeof user.role === 'string' && user.role.toLowerCase() === 'admin') return true;
  return false;
}

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("adminSearch")?.addEventListener("input", apply);
  document.getElementById("adminReload")?.addEventListener("click", async () => {
    try { await loadCategories(); await loadProducts(); apply(); }
    catch (e) { setMsg(`Hiba: ${e.message || e}`); }
  });

  // Re-render table on language change
  window.addEventListener("storage", (e) => {
    if (!e?.key || e.key === "rp_lang") {
      apply();
    }
  });

  // New product modal
  const modalEl = document.getElementById("newProductModal");
  const newPMsg = document.getElementById("newPMsg");
  const newPSave = document.getElementById("newPSave");
  const newPCategory = document.getElementById("newPCategory");
  let bsModal = null;
  if (modalEl && window.bootstrap?.Modal) bsModal = new window.bootstrap.Modal(modalEl);

  function setNewMsg(txt) { if (newPMsg) newPMsg.textContent = txt || ""; }

  function fillNewCategorySelect() {
    if (!newPCategory) return;
    newPCategory.innerHTML = categories.map(c => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.name)}</option>`).join("") || "";
  }

  function resetNewForm() {
    ["newPName","newPSku","newPPrice","newPStock","newPImageUrl"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
    fillNewCategorySelect();
    setNewMsg("");
  }

  document.getElementById("adminAddProduct")?.addEventListener("click", async () => {
    try {
      if (!categories.length) await loadCategories();
      fillNewCategorySelect();
      resetNewForm();
      if (bsModal) bsModal.show();
    } catch (e) { alert(e?.message || String(e)); }
  });

  newPSave?.addEventListener("click", async () => {
    const name = (document.getElementById("newPName")?.value || "").trim();
    const sku = (document.getElementById("newPSku")?.value || "").trim();
    const unit_price = normalizePrice(document.getElementById("newPPrice")?.value);
    const stock = Math.max(0, Number(document.getElementById("newPStock")?.value) || 0);
    const category_id = (newPCategory?.value || "").trim();
    const image_url = (document.getElementById("newPImageUrl")?.value || "").trim();

    if (!name || !sku || unit_price <= 0 || !category_id) {
      setNewMsg("Kérlek töltsd ki: Név, SKU, Ár (>0), Kategória.");
      return;
    }

    newPSave.disabled = true;
    setNewMsg("Mentés...");
    try {
      await window.api.post("/products", {
        name, sku, unit_price, stock,
        category_id: Number(category_id),
        image_url: image_url || null
      });
      await loadProducts();
      apply();
      broadcastProductChange();
      setNewMsg("✓ Sikeres létrehozás!");
      setTimeout(() => { if (bsModal) bsModal.hide(); }, 800);
    } catch (e) {
      setNewMsg(`Hiba: ${e?.message || String(e)}`);
    } finally {
      newPSave.disabled = false;
    }
  });

  // Auth check
  let user = null;
  try { user = JSON.parse(localStorage.getItem("rp_user") || "null"); } catch {}
  if (!isAdminUser(user)) {
    alert("Ehhez admin jogosultság kell.");
    window.location.href = "./products.html";
    return;
  }

  try {
    await loadCategories();
    await loadProducts();
    apply();
  } catch (e) {
    setMsg(`Hiba: ${e.message || e}`);
  }
});
