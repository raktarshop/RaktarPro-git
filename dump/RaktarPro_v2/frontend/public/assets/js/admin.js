let all = [];

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
  // backend új mező: unit_price
  return p.unit_price ?? p.price ?? p.unit_price_huf ?? p.ar ?? 0;
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

function render(list) {
  const tbody = document.getElementById("adminTbody");
  tbody.innerHTML = "";

  for (const p of list) {
    const price = normalizePrice(pickPrice(p));
    const stock = (p.stock !== undefined && p.stock !== null) ? Number(p.stock) : 0;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(p.id)}</td>
      <td>${escapeHtml(p.name || "")}</td>
      <td>
        <input class="form-control form-control-sm rp-mini" type="text"
               value="${price}" data-field="price" data-id="${p.id}">
      </td>
      <td>
        <input class="form-control form-control-sm rp-mini" type="number" min="0"
               value="${stock}" data-field="stock" data-id="${p.id}">
      </td>
      <td>
        <div class="d-flex flex-wrap gap-2">
          <button class="btn btn-sm rp-admin-btn" data-act="save" data-id="${p.id}">Mentés</button>
          <button class="btn btn-sm rp-act" data-act="edit" data-id="${p.id}">✏️ Szerk.</button>
          <button class="btn btn-sm rp-act" data-act="img" data-id="${p.id}">🖼️ Kép</button>
          <a class="btn btn-sm rp-act" href="./products.html" title="Bolt nézet">👁️ Bolt</a>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  }

  tbody.querySelectorAll("button[data-act='save']").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const priceEl = tbody.querySelector(`input[data-field="price"][data-id="${id}"]`);
      const stockEl = tbody.querySelector(`input[data-field="stock"][data-id="${id}"]`);

      const unit_price = normalizePrice(priceEl.value);
      const stock = Math.max(0, Number(stockEl.value) || 0);

      setMsg("Mentés folyamatban...");
      try {
        // ✅ backend új mező: unit_price
        await window.api.put(`/products/${id}`, { unit_price, stock });
        setMsg(`Mentve: #${id}`);
      } catch (e) {
        setMsg(`Hiba mentéskor: ${e.message || e}`);
      }
    });
  });

  // Placeholder action handlers
  tbody.querySelectorAll("button[data-act='edit']").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      alert(`Szerkesztés (#${id}) – hamarosan.`);
    });
  });

  tbody.querySelectorAll("button[data-act='img']").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      alert(`Kép kezelés (#${id}) – hamarosan.`);
    });
  });
}

async function load() {
  setMsg("Termékek betöltése...");
  const res = await window.api.get("/products");
  const list = extractProductsList(res);

  if (!Array.isArray(list)) {
    console.log("DEBUG /products response:", res);
    throw new Error("A /products nem listát adott (nézd meg a Console debug logot).");
  }

  all = list;
  setMsg("");
  apply();
}

function apply() {
  const q = (document.getElementById("adminSearch")?.value || "").trim().toLowerCase();
  const list = q ? all.filter(p => String(p.name||"").toLowerCase().includes(q)) : all;
  render(list);
}

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("adminSearch")?.addEventListener("input", apply);
  document.getElementById("adminSearchBtn")?.addEventListener("click", apply);
  document.getElementById("adminReload")?.addEventListener("click", load);

  document.getElementById("adminCategoriesBtn")?.addEventListener("click", () => {
    alert("Kategóriák – hamarosan.");
  });

  // Admin pill
  let user = null;
  try { user = JSON.parse(localStorage.getItem("rp_user") || "null"); } catch {}

  const pill = document.getElementById("adminNamePill");
  if (pill) {
    const n = user?.full_name || user?.name || user?.email || "Admin";
    pill.textContent = `Admin: ${n}`;
  }

  const isAdmin = user && (user.is_admin === true || user.role === "admin" || user.role === "ADMIN");
  if (!isAdmin) {
    alert("Ehhez admin jogosultság kell.");
    window.location.href = "./products.html";
    return;
  }

  try { await load(); }
  catch (e) { setMsg(`Hiba: ${e.message || e}`); }
});
