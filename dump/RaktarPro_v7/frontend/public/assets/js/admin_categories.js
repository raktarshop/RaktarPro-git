let categories = [];

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setMsg(t) {
  const el = document.getElementById("catMsg");
  if (el) el.textContent = t || "";
}

function extractCategories(res) {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data?.categories)) return res.data.categories;
  if (Array.isArray(res?.categories)) return res.categories;
  if (Array.isArray(res?.data)) return res.data;
  return [];
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

function fillParentSelect() {
  const sel = document.getElementById("catParent");
  if (!sel) return;
  const current = sel.value;

  sel.innerHTML = `<option value="">(nincs)</option>` +
    categories
      .slice()
      .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "hu"))
      .map(c => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.name)}</option>`)
      .join("");

  sel.value = current || "";
}

function getCatNameById(id) {
  const c = categories.find(x => String(x.id) === String(id));
  return c?.name || "";
}

function renderTable() {
  const tbody = document.getElementById("catTbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const sorted = categories
    .slice()
    .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "hu"));

  for (const c of sorted) {
    const parentName = c.parent_id ? getCatNameById(c.parent_id) : "";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(c.id)}</td>
      <td>
        <input class="form-control form-control-sm rp-mini" type="text"
               value="${escapeHtml(c.name || "")}" data-field="name" data-id="${escapeHtml(c.id)}">
      </td>
      <td style="min-width:180px;">
        <select class="form-select form-select-sm rp-mini" data-field="parent_id" data-id="${escapeHtml(c.id)}">
          <option value="">(nincs)</option>
          ${categories
            .filter(x => String(x.id) !== String(c.id))
            .map(x => `<option value="${escapeHtml(x.id)}">${escapeHtml(x.name)}</option>`)
            .join("")}
        </select>
      </td>
      <td>
        <div class="d-flex gap-2">
          <button class="btn btn-sm rp-admin-btn" data-act="save" data-id="${escapeHtml(c.id)}">Mentés</button>
          <button class="btn btn-sm btn-outline-danger" data-act="del" data-id="${escapeHtml(c.id)}">Törlés</button>
        </div>
      </td>
    `;

    tbody.appendChild(tr);

    const sel = tr.querySelector(`select[data-field="parent_id"][data-id="${c.id}"]`);
    if (sel) sel.value = c.parent_id ? String(c.parent_id) : "";
  }

  tbody.querySelectorAll("button[data-act='save']").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const nameEl = tbody.querySelector(`input[data-field="name"][data-id="${id}"]`);
      const parentEl = tbody.querySelector(`select[data-field="parent_id"][data-id="${id}"]`);

      const name = (nameEl?.value || "").trim();
      const parent_id = (parentEl?.value || "").trim();

      if (!name) {
        setMsg("A kategória neve kötelező.");
        return;
      }

      setMsg("Mentés...");
      try {
        await window.api.put(`/categories/${id}`, {
          name,
          parent_id: parent_id === "" ? null : Number(parent_id)
        });
        await load();
        setMsg("Mentve.");
      } catch (e) {
        setMsg(`Hiba: ${e.message || e}`);
      }
    });
  });

  tbody.querySelectorAll("button[data-act='del']").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      if (!confirm(`Biztos törlöd? (ID: ${id})`)) return;
      setMsg("Törlés...");
      try {
        await window.api.del(`/categories/${id}`);
        await load();
        setMsg("Törölve.");
      } catch (e) {
        setMsg(`Hiba: ${e.message || e}`);
      }
    });
  });
}

async function load() {
  const res = await window.api.get("/categories");
  categories = extractCategories(res);
  fillParentSelect();
  renderTable();
}

document.addEventListener("DOMContentLoaded", async () => {
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

  document.getElementById("catReload")?.addEventListener("click", load);
  document.getElementById("catAdd")?.addEventListener("click", async () => {
    const name = (document.getElementById("catName")?.value || "").trim();
    const parent = (document.getElementById("catParent")?.value || "").trim();

    if (!name) {
      setMsg("A kategória neve kötelező.");
      return;
    }

    setMsg("Létrehozás...");
    try {
      await window.api.post("/categories", {
        name,
        parent_id: parent === "" ? null : Number(parent)
      });
      document.getElementById("catName").value = "";
      await load();
      setMsg("Kategória létrehozva.");
    } catch (e) {
      setMsg(`Hiba: ${e.message || e}`);
    }
  });

  try {
    await load();
    setMsg("");
  } catch (e) {
    setMsg(`Hiba: ${e.message || e}`);
  }
});
