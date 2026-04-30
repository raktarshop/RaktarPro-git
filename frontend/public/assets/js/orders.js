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

function t(key, fallback) {
  try {
    const v = window.lang?.t ? window.lang.t(key) : null;
    return v || fallback || key;
  } catch { return fallback || key; }
}

function getLang() {
  return window.lang?.getLang ? window.lang.getLang() : "hu";
}

function formatFt(n) {
  const x = Math.round(Number(n) || 0);
  const suffix = t("currency_suffix", "Ft");
  const lang = getLang();
  const locale = lang === "de" ? "de-DE" : lang === "en" ? "en-GB" : "hu-HU";
  return x.toLocaleString(locale) + " " + suffix;
}

function formatDate(s) {
  if (!s) return "";
  return String(s).replace("T", " ").replace(".000Z", "");
}

function setMsg(text) {
  const el = document.getElementById("ordersMsg");
  if (el) el.textContent = text || "";
}

function setEmpty(show) {
  const el = document.getElementById("ordersEmpty");
  if (el) el.style.display = show ? "block" : "none";
}

function mapStatus(status) {
  const s = String(status || "").toLowerCase().trim();
  const lang = getLang();

  const labels = {
    hu: { uj:"Függő", feldolgozas:"Feldolgozás", kiszallitva:"Kiszállítva", teljesitve:"Teljesítve", torolve:"Törölve" },
    en: { uj:"Pending", feldolgozas:"Processing", kiszallitva:"Shipped", teljesitve:"Completed", torolve:"Cancelled" },
    de: { uj:"Ausstehend", feldolgozas:"In Bearbeitung", kiszallitva:"Versendet", teljesitve:"Abgeschlossen", torolve:"Storniert" },
  };

  const map = labels[lang] || labels.hu;
  if (s.startsWith("order_status_")) return mapStatus(s.replace("order_status_", ""));
  return map[s] || (s ? status : "-");
}

function mapPayment(payment) {
  const p = String(payment || "").toLowerCase().trim();
  if (!p) return "-";
  if (p.includes("utan") || p.includes("cod")) return t("payment_cod", "Utánvétel");
  if (p.includes("card")) return t("payment_card", "Bankkártya");
  if (p.includes("online")) return t("payment_online", "Online fizetés");
  return payment;
}

function getOrderTotal(o) {
  return Number(o.display_total ?? o.items_total ?? o.gross_total ?? o.grossTotal ?? o.total_amount ?? o.total ?? 0) || 0;
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
  if (!tbody) return;
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
          <i class="bi bi-receipt me-2"></i>${escapeHtml(t("orders_details","Részletek"))}
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  }

  tbody.querySelectorAll("button[data-act='details']").forEach(btn => {
    btn.addEventListener("click", async () => await openDetails(btn.getAttribute("data-id")));
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

  odSet("odMeta", `${t("order_details_title","Rendelés")} #${orderId}`);
  const loading = t("orders_loading","Betöltés...");
  odSet("odStatus", loading);
  odSet("odPayment", loading);
  odSet("odTotal", loading);
  odSet("odAddress", loading);
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
      const name = it.product_name || it.name || t("product","Termék");
      const qty = Number(it.quantity || it.qty || 1);
      const price = Number(it.total_amount ?? it.total ?? it.unit_price ?? it.price ?? 0) || 0;
      return `<tr><td>${escapeHtml(name)}</td><td>${escapeHtml(qty)}</td><td>${escapeHtml(formatFt(price))}</td></tr>`;
    }).join("");

    odHtml("odItems", rows || `<tr><td colspan="3" class="opacity-75">${escapeHtml(t("orders_empty","Nincs tétel."))}</td></tr>`);
  } catch (e) {
    odErr(`${t("orders_error_prefix","Hiba:")} ${e?.message || String(e)}`);
    odSet("odStatus", "-");
    odSet("odPayment", "-");
    odSet("odTotal", formatFt(0));
    odSet("odAddress", "-");
  }
}

async function loadOrders() {
  setMsg(t("orders_loading","Rendelések betöltése..."));
  const res = await window.api.get("/orders");
  allOrders = extractList(res);
  setMsg(allOrders.length ? "" : t("orders_empty","Nincs rendelés."));
}

// Re-render on language change
window.addEventListener("storage", (e) => {
  if (!e?.key || e.key === "rp_lang") applyFilter();
});
window.addEventListener("rp:langchange", () => applyFilter());

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("ordersSearch")?.addEventListener("input", applyFilter);
  document.getElementById("ordersReload")?.addEventListener("click", async () => {
    try { await loadOrders(); applyFilter(); }
    catch (e) { setMsg(`${t("orders_error_prefix","Hiba:")} ${e?.message || String(e)}`); }
  });

  try { await loadOrders(); applyFilter(); }
  catch (e) { setMsg(`${t("orders_error_prefix","Hiba:")} ${e?.message || String(e)}`); }
});
