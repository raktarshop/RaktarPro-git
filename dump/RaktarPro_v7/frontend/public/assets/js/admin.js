let all = [];
let categories = [];

function extractProductsList(res) {
  if (!res) return null;
  if (Array.isArray(res)) return res;

  // backend: { success:true, data:{ products:[...], pagination:{} } }
  if (Array.isArray(res?.data?.products)) return res.data.products;
  if (Array.isArray(res?.products)) return res.products;

  const data = res.data ?? res.result ?? res.payload ?? res;
  if (Array.isArray(data)) return data;

  if (data && typeof data === "object") {
    const candidates = [data.products, data.items, data.list, data.rows, data.data];
    for (const c of candidates) if (Array.isArray(c)) return c;
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
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setMsg(t) {
  const el = document.getElementById("adminMsg");
  if (el) el.textContent = t || "";
}

function getCategoryNameById(id) {
  const c = categories.find(x => String(x.id) === String(id));
  return c?.name || "";
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

    const options = [
      `<option value="">(nincs)</option>`,
      ...categories.map(c => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.name)}</option>`)
    ].join("");

    tr.innerHTML = `
      <td>${escapeHtml(p.id)}</td>
      <td>${escapeHtml(p.name || "")}</td>
      <td style="min-width:170px;">
        <select class="form-select form-select-sm rp-mini" data-field="category_id" data-id="${p.id}">
          ${options}
        </select>
      </td>
      <td style="min-width:240px;">
        <input class="form-control form-control-sm rp-mini" type="text"
               placeholder="https://..."
               value="${escapeHtml(imageUrl)}" data-field="image_url" data-id="${p.id}">
      </td>
      <td style="min-width:120px;">
        <input class="form-control form-control-sm rp-mini" type="text"
               value="${price}" data-field="unit_price" data-id="${p.id}">
      </td>
      <td style="min-width:110px;">
        <input class="form-control form-control-sm rp-mini" type="number" min="0"
               value="${stock}" data-field="stock" data-id="${p.id}">
      </td>
      <td style="min-width:110px;">
        <button class="btn btn-sm rp-admin-btn" data-act="save" data-id="${p.id}">Mentés</button>
      </td>
    `;

    tbody.appendChild(tr);

    // set selected category after insert
    const sel = tr.querySelector(`select[data-field="category_id"][data-id="${p.id}"]`);
    if (sel) sel.value = categoryId === null ? "" : String(categoryId);
  }

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
        unit_price,
        stock,
        category_id: category_id === "" ? null : Number(category_id),
        image_url: image_url === "" ? null : image_url
      };

      setMsg("Mentés folyamatban...");
      try {
        await window.api.put(`/products/${id}`, payload);
        setMsg(`Mentve: #${id}`);

        // Frissítsük a helyi listát is, hogy a keresés/szűrés maradjon konzisztens
        const idx = all.findIndex(x => String(x.id) === String(id));
        if (idx >= 0) {
          all[idx].unit_price = unit_price;
          all[idx].stock = stock;
          all[idx].category_id = payload.category_id;
          all[idx].category_name = getCategoryNameById(payload.category_id);
          all[idx].image_url = payload.image_url;
        }
      } catch (e) {
        setMsg(`Hiba mentéskor: ${e.message || e}`);
      }
    });
  });
}

async function loadCategories() {
  const res = await window.api.get("/categories");
  categories = extractCategories(res);
}

async function loadProducts() {
  setMsg("Termékek betöltése...");
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
  const q = (document.getElementById("adminSearch").value || "").trim().toLowerCase();
  const list = q ? all.filter(p => String(p.name || "").toLowerCase().includes(q)) : all;
  render(list);
}

function isAdminUser(user) {
  if (!user) return false;
  if (user.is_admin === true) return true;
  if (Number(user.is_admin) === 1) return true;
  if (Number(user.role_id) === 1) return true;
  const r = String(user.role || "").toLowerCase();
  if (r === "admin") return true;
  return false;
}

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("adminSearch")?.addEventListener("input", apply);
  document.getElementById("adminReload")?.addEventListener("click", async () => {
    try {
      await loadCategories();
      await loadProducts();
      apply();
    } catch (e) {
      setMsg(`Hiba: ${e.message || e}`);
    }
  });

  // Admin gate
  let user = null;
  try { user = JSON.parse(localStorage.getItem("rp_user") || "null"); } catch {}
  if (!isAdminUser(user)) {
    alert("Ehhez admin jogosultság kell.");
    window.location.href = "./products.html";
    return;
  }

  const pill = document.getElementById("adminNamePill");
  if (pill) {
    const n = user?.full_name || user?.name || user?.email || "Admin";
    pill.textContent = `Admin: ${n}`;
  }

  try {
    await loadCategories();
    await loadProducts();
    apply();
  } catch (e) {
    setMsg(`Hiba: ${e.message || e}`);
  }
});
