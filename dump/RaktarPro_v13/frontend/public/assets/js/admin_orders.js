function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function t(key, fallback) {
  try {
    const v = window.lang?.t ? window.lang.t(key) : null;
    return v || fallback || key;
  } catch {
    return fallback || key;
  }
}

function getLocale() {
  const l = window.lang?.getLang ? window.lang.getLang() : "hu";
  if (l === "de") return "de-DE";
  if (l === "en") return "en-GB";
  return "hu-HU";
}

function formatDate(s) {
  if (!s) return "";
  return String(s).replace("T", " ").replace(".000Z", "");
}

function formatMoney(v) {
  const n = Number(v || 0);
  const suffix = t("currency_suffix", "Ft");
  return Number.isFinite(n) ? n.toLocaleString(getLocale()) + " " + suffix : "0 " + suffix;
}

function extractList(res) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data?.orders)) return res.data.orders;
  if (Array.isArray(res?.orders)) return res.orders;
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

let allOrders = [];

function setMsg(text) {
  const el = document.getElementById("adminOrdersMsg");
  if (el) el.textContent = text || "";
}

function getOrderTotal(o) {
  return Number(
    o.display_total ??
    o.items_total ??
    o.gross_total ??
    o.total_amount ??
    o.total ??
    0
  ) || 0;
}


// ✅ BACKEND státuszok (OrderService): uj, feldolgozas, kiszallitva, teljesitve, torolve
function buildStatusOptions(currentStatus) {
  const statuses = ["uj", "feldolgozas", "kiszallitva", "teljesitve", "torolve"];
  const labels = {
    uj: "Függő",
    feldolgozas: "Feldolgozás",
    kiszallitva: "Kiszállítva",
    teljesitve: "Teljesítve",
    torolve: "Törölve"
  };

  const current = String(currentStatus || "").trim();
  const list = statuses.includes(current) ? statuses : [current, ...statuses].filter(Boolean);

  return list.map(s => {
    const label = labels[s] || s;
    return `<option value="${escapeHtml(s)}" ${s === current ? "selected" : ""}>${escapeHtml(label)}</option>`;
  }).join("");
}

function render(list) {
  const tbody = document.getElementById("adminOrdersTbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  for (const o of list) {
    const tr = document.createElement("tr");
    const id = o.id ?? o.order_id;

    const status = String(o.status || "");
    const total = getOrderTotal(o);

    const paymentRaw = o.payment_method || o.payment || "utanvet";
    const payment = String(paymentRaw).toLowerCase().includes("utan")
      ? "Utánvét"
      : String(paymentRaw);

    const statusOptions = buildStatusOptions(status);

    tr.innerHTML = `
      <td>${escapeHtml(id)}</td>
      <td>${escapeHtml(o.name || o.customer_name || "")}</td>
      <td>${escapeHtml(o.email || o.customer_email || "")}</td>
      <td>${escapeHtml(formatDate(o.created_at || o.createdAt))}</td>
      <td>${escapeHtml(formatMoney(total))}</td>
      <td>${escapeHtml(payment)}</td>
      <td style="min-width:170px;">
        <select class="form-select form-select-sm" data-act="status" data-id="${escapeHtml(id)}">
          ${statusOptions}
        </select>
      </td>
      <td style="min-width:110px;">
        <button class="btn btn-sm rp-admin-btn" data-act="save" data-id="${escapeHtml(id)}">
          ${escapeHtml(t("admin_orders_save","Mentés"))}
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  }

  tbody.querySelectorAll("button[data-act='save']").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const sel = tbody.querySelector(`select[data-act="status"][data-id="${id}"]`);
      const status = (sel?.value || "").trim();
      if (!status) return;

      btn.disabled = true;
      const old = btn.textContent;
      btn.textContent = "Mentés...";
      setMsg("Státusz mentése...");

      try {
        await window.api.put(`/admin/orders/${id}/status`, { status });

        const idx = allOrders.findIndex(x => String((x.id ?? x.order_id)) === String(id));
        if (idx >= 0) allOrders[idx].status = status;

        setMsg(`Mentve: #${id}`);
      } catch (e) {
        setMsg(`Hiba: ${e?.message || String(e)}`);
      } finally {
        btn.disabled = false;
        btn.textContent = old;
      }
    });
  });
}

function applyFilter() {
  const q = (document.getElementById("adminOrdersSearch")?.value || "").trim().toLowerCase();
  const list = q
    ? allOrders.filter(o => {
        const id = String(o.id ?? o.order_id ?? "").toLowerCase();
        const status = String(o.status ?? "").toLowerCase();
        const email = String(o.email || o.customer_email || "").toLowerCase();
        return id.includes(q) || status.includes(q) || email.includes(q);
      })
    : allOrders;
  render(list);
}

async function loadOrders() {
  setMsg("Rendelések betöltése...");
  const res = await window.api.get("/admin/orders");
  allOrders = extractList(res);
  setMsg(allOrders.length ? "" : "Nincs rendelés.");
}

document.addEventListener("DOMContentLoaded", async () => {
  let user = null;
  try { user = JSON.parse(localStorage.getItem("rp_user") || "null"); } catch {}
  if (!isAdminUser(user)) {
    alert("Ehhez admin jogosultság kell.");
    window.location.href = "./products.html";
    return;
  }

  document.getElementById("adminOrdersSearch")?.addEventListener("input", applyFilter);
  document.getElementById("adminOrdersReload")?.addEventListener("click", async () => {
    try {
      await loadOrders();
      applyFilter();
    } catch (e) {
      setMsg(`Hiba: ${e?.message || String(e)}`);
    }
  });

  try {
    await loadOrders();
    applyFilter();
  } catch (e) {
    setMsg(`Hiba: ${e?.message || String(e)}`);
  }
});
