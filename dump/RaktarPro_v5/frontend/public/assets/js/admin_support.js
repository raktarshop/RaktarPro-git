function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(s) {
  if (!s) return "";
  return String(s).replace("T", " ").replace(".000Z", "");
}

function isResolved(row) {
  // backend szerint lehet 1/0, true/false, "1"/"0"
  return Number(row?.resolved) === 1 || row?.resolved === true;
}

// ✅ itt tudod választani: "Kész" vagy "Megválaszolva"
const RESOLVED_LABEL = "Megválaszolva"; // vagy: "Kész"
  const tbody = document.getElementById("supportTbody");
  const msg = document.getElementById("supportMsg");
  if (!tbody) return;

  if (msg) msg.textContent = "Betöltés...";

  try {
    const res = await window.api.get("/admin/support");
    const list = res?.data?.tickets || res?.tickets || res?.data || res || [];

    tbody.innerHTML = "";

    for (const row of list) {
      const resolved = isResolved(row);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(row.id)}</td>
        <td>${escapeHtml(row.email)}</td>
        <td>${escapeHtml(row.message)}</td>
        <td>${escapeHtml(formatDate(row.created_at))}</td>
        <td>${resolved ? RESOLVED_LABEL : "Nyitott"}</td>
        <td>
          ${resolved
            ? "" /* ✅ Megoldottnál üresen marad a Művelet cella */
            : `<button class="btn btn-sm rp-admin-btn" data-act="resolve" data-id="${escapeHtml(row.id)}">Kész</button>`
          }
        </td>
      `;
      tbody.appendChild(tr);
    }

    // gombok
    tbody.querySelectorAll("button[data-act='resolve']").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        btn.disabled = true;
        btn.textContent = "Mentés...";

        try {
          await window.api.put(`/admin/support/${id}`, { resolved: 1 });
          await loadSupport();
        } catch (e) {
          alert(e?.message || String(e));
          btn.disabled = false;
          btn.textContent = "Kész";
        }
      });
    });

    if (msg) msg.textContent = "";
  } catch (e) {
    if (msg) msg.textContent = "Hiba: " + (e?.message || String(e));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const reload = document.getElementById("supportReload");
  if (reload) reload.addEventListener("click", loadSupport);
  loadSupport();
});
