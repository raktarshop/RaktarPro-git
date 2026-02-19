let allOrders = [];
let bsModal = null;

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatFt(n) {
  const x = Math.round(Number(n) || 0);
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " Ft";
}

function formatDate(s) {
  if (!s) return "";
  return String(s).replace("T", " ").replace(".000Z", "");
}

function setMsg(t) {
  const el = document.getElementById("ordersMsg");
  if (el) el.textContent = t || "";
}

function setEmpty(show) {
  const el = document.getElementById("ordersEmpty");
  if (el) el.style.display = show ? "block" : "none";
}

function mapStatus(status) {
  const s = String(status || "").toLowerCase().trim();

  if (s === "uj") return "Függő";
  if (s === "feldolgozas") return "Feldolgozás";
  if (s === "kiszallitva") return "Kiszállítva";
  if (s === "teljesitve") return "Teljesítve";
  if (s === "torolve") return "Törölve";

  if (s.startsWith("order_status_")) {
    const k = s.replace("order_status_", "");
    return mapStatus(k);
  }

  if (!s) return "-";
  return status;
}

function mapPayment(payment) {
  const p = String(payment || "").toLowerCase().trim();

  if (!p) return "-";
  if (p.includes("utan")) return "Utánvétel";
  if (p.includes("cod")) return "Utánvétel";
  if (p.includes("card")) return "Bankkártya";
  if (p.includes("online")) return "Online fizetés";

  return payment;
}

function getOrderTotal(o) {
  return Number(
    o.display_total ??
    o.items_total ??
    o.gross_total ??
    o.grossTotal ??
    o.total_amount ??
    o.total ??
    0
  ) || 0;
}

function extractList(res) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data?.orders)) return res.data.orders;
  if (Array.isArray(res?.orders)) return res.orders;
  if (Array.isArray(res?.data)) return res.data;
  return [];
}

function render(list) {
  const tbody = document.getElementById("ordersTbody");
  tbody.innerHTML = "";

  setEmpty(!list.length);

  for (const o of list) {
    const tr = document.createElement("tr");
    const total = getOrderTotal(o);

    tr.innerHTML = `
      <td>${escapeHtml(formatDate(o.created_at || o.createdAt))}</td>
      <td><span class="fw-semibold">${escapeHtml(mapStatus(o.status))}</span></td>
      <td>${escapeHtml(formatFt(total))}</td>
      <td>${escapeHtml(mapPayment(o.payment_method || o.payment))}</td>
      <td>
        <button class="btn btn-sm rp-admin-btn" data-act="details" data-id="${escapeHtml(o.id)}">
          <i class="bi bi-receipt me-2"></i>Részletek
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  }

  tbody.querySelectorAll("button[data-act='details']").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      await openDetails(id);
    });
  });
}

function applyFilter() {
  const q = (document.getElementById("ordersSearch")?.value || "").trim().toLowerCase();

  const list = q
    ? allOrders.filter(o => {
        const d = String(o.created_at || o.createdAt || "").toLowerCase();
        const s = String(mapStatus(o.status) || "").toLowerCase();
        const p = String(mapPayment(o.payment_method || o.payment) || "").toLowerCase();
        return d.includes(q) || s.includes(q) || p.includes(q);
      })
    : allOrders;

  render(list);
}

function odSet(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text ?? "";
}

function odHtml(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

function odErr(msg) {
  const el = document.getElementById("odErr");
  if (!el) return;
  el.style.display = msg ? "block" : "none";
  el.textContent = msg || "";
}

async function openDetails(orderId) {
  odErr("");

  const modalEl = document.getElementById("orderDetailsModal");
  if (modalEl && window.bootstrap?.Modal && !bsModal) bsModal = new window.bootstrap.Modal(modalEl);

  odSet("odMeta", `Rendelés #${orderId}`);
  odSet("odStatus", "Betöltés...");
  odSet("odPayment", "Betöltés...");
  odSet("odTotal", "Betöltés...");
  odSet("odAddress", "Betöltés...");
  odHtml("odItems", "");

  if (bsModal) bsModal.show();

  try {
    const res = await window.api.get(`/orders/${orderId}`);
    const data = res?.data?.data ?? res?.data ?? res;

    const order = data?.order ?? data;
    const items = data?.items ?? order?.items ?? [];

    const total = getOrderTotal(order);
    const address = order?.address || order?.shipping_address || "-";

    odSet("odStatus", mapStatus(order?.status));
    odSet("odPayment", mapPayment(order?.payment_method || order?.payment));
    odSet("odTotal", formatFt(total));
    odSet("odAddress", address);

    const rows = (Array.isArray(items) ? items : []).map(it => {
      const name = it.product_name || it.name || "Termék";
      const qty = Number(it.quantity || it.qty || 1);
      const price = Number(it.total_amount ?? it.total ?? it.unit_price ?? it.price ?? 0) || 0;

      return `
        <tr>
          <td>${escapeHtml(name)}</td>
          <td>${escapeHtml(qty)}</td>
          <td>${escapeHtml(formatFt(price))}</td>
        </tr>
      `;
    }).join("");

    odHtml("odItems", rows || `<tr><td colspan="3" class="opacity-75">Nincs tétel.</td></tr>`);
  } catch (e) {
    odErr(`Hiba: ${e?.message || String(e)}`);
    odSet("odStatus", "-");
    odSet("odPayment", "-");
    odSet("odTotal", "0 Ft");
    odSet("odAddress", "-");
  }
}

async function loadOrders() {
  setMsg("Rendelések betöltése...");
  const res = await window.api.get("/orders");
  allOrders = extractList(res);
  setMsg(allOrders.length ? "" : "Nincs rendelés.");
}

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("ordersSearch")?.addEventListener("input", applyFilter);
  document.getElementById("ordersReload")?.addEventListener("click", async () => {
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
