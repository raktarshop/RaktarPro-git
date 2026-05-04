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

function formatMoney(v) {
  const n = Number(v || 0);
  const suffix = t("currency_suffix", "Ft");
  return Number.isFinite(n) ? n.toLocaleString(getLocale()) + " " + suffix : "0 " + suffix;
}
function formatDate(s) {
  if (!s) return "";
  return String(s).replace("T", " ").replace(".000Z", "");
}

function setMsg(text) {
  const el = document.getElementById("ordersMsg");
  if (el) el.textContent = text || "";
}

function extractOrders(res) {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data?.orders)) return res.data.orders;
  if (Array.isArray(res?.orders)) return res.orders;
  if (Array.isArray(res?.data)) return res.data;
  return [];
}

async function loadOrders() {
  setMsg(t("orders_loading","Betöltés..."));
  const tbody = document.getElementById("ordersTbody");
  if (!tbody) return;

  try {
    const res = await window.api.get("/orders?limit=200");
    const list = extractOrders(res);

    const q = (document.getElementById("ordersSearch")?.value || "").trim().toLowerCase();
    const filtered = q
      ? list.filter(o =>
          String(o.status || "").toLowerCase().includes(q)
        )
      : list;

    tbody.innerHTML = "";

    for (const o of filtered) {
      const tr = document.createElement("tr");
      tr.innerHTML = `        <td>${escapeHtml(formatDate(o.created_at || o.createdAt))}</td>
        <td>${escapeHtml(t("order_status_" + String(o.status||""), String(o.status||"")))}</td>
        <td>${escapeHtml(formatMoney(o.total_amount ?? o.total ?? 0))}</td>
        <td>${escapeHtml((String(o.payment_method||"").toLowerCase().includes("cod") || String(o.payment_method||"").toLowerCase().includes("utan")) ? t("payment_cod","Utánvét") : (o.payment_method || ""))}</td>
        <td>
          <button class="btn btn-sm rp-admin-btn" data-act="details" data-id="${escapeHtml(o.id)}">${escapeHtml(t("orders_details","Részletek"))}</button>
        </td>
      `;
      tbody.appendChild(tr);
    }

    tbody.querySelectorAll("button[data-act='details']").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        btn.disabled = true;
        try {
          const detail = await window.api.get(`/orders/${id}`);
          const body = document.getElementById("orderDetailsBody");

          // normalize
          const data = detail?.data || detail;
          const items = data?.items || data?.order_items || data?.orderItems || [];

          if (body) {
            body.innerHTML = `
              <div class="mb-2"><b>${escapeHtml(t("order_details_title","Rendelés részletei"))}</b></div>
              <div class="mb-1">${escapeHtml(t("order_details_status","Státusz"))}: ${escapeHtml(data?.status || "")}</div>
              <div class="mb-1">${escapeHtml(t("order_details_payment","Fizetés"))}: ${escapeHtml(data?.payment_method || t("payment_cod","Utánvét"))}</div>
              <div class="mb-3">${escapeHtml(t("order_details_total","Összeg"))}: ${escapeHtml(formatMoney(data?.total_amount ?? data?.total ?? 0))}</div>
              <div class="fw-bold mb-2">${escapeHtml(t("order_details_items","Tételek"))}</div>
              <div class="table-responsive">
                <table class="table table-sm align-middle mb-0 rp-admin-table">
                  <thead>
                    <tr>
                      <th>${escapeHtml(t("order_details_name","Név"))}</th>
                      <th>${escapeHtml(t("order_details_qty","Mennyiség"))}</th>
                      <th>${escapeHtml(t("order_details_price","Ár"))}</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${items.map(it => `
                      <tr>
                        <td>${escapeHtml(it.product_name || it.name || it.product?.name || "")}</td>
                        <td>${escapeHtml(it.quantity ?? it.qty ?? 1)}</td>
                        <td>${escapeHtml(formatMoney(it.unit_price ?? it.price ?? 0))}</td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            `;
          }

          const modalEl = document.getElementById("orderDetailsModal");
          if (modalEl && window.bootstrap?.Modal) {
            const m = new window.bootstrap.Modal(modalEl);
            m.show();
          }
        } catch (e) {
          alert(e?.message || String(e));
        } finally {
          btn.disabled = false;
        }
      });
    });

    setMsg(filtered.length ? "" : "Nincs rendelés.");
  } catch (e) {
    setMsg(t("orders_error_prefix","Hiba: ") + (e?.message || String(e)));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // auth guard
  const token = localStorage.getItem("rp_token") || "";
  if (!token) {
    alert("Bejelentkezés szükséges.");
    window.location.href = "./auth.html";
    return;
  }

  document.getElementById("ordersReload")?.addEventListener("click", loadOrders);
  document.getElementById("ordersSearch")?.addEventListener("input", loadOrders);
  loadOrders();
});
