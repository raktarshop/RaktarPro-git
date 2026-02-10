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
  return Number(row?.resolved) === 1 || row?.resolved === true;
}

// ✅ választható szöveg a státuszhoz:
const RESOLVED_LABEL = "Megválaszolva";

// ✅ gomb felirat (ha nyitott):
const RESOLVE_BUTTON_LABEL = "Kész";

function findTbody() {
  // 1) ha van konkrét ID-d, ezt preferálja
  let tb = document.getElementById("supportTbody");
  if (tb) return tb;

  // 2) ha a táblának van ID-ja (pl. supportTable), akkor azt
  const supportTable = document.getElementById("supportTable");
  if (supportTable) {
    tb = supportTable.querySelector("tbody");
    if (tb) return tb;
  }

  // 3) fallback: első táblázat tbody-ja
  tb = document.querySelector("table tbody");
  if (tb) return tb;

  // 4) végső fallback: bármilyen tbody
  return document.querySelector("tbody");
}

function findMsgBox() {
  return document.getElementById("supportMsg") || document.getElementById("msg") || null;
}

function findReloadBtn() {
  return document.getElementById("supportReload") || document.getElementById("reloadBtn") || null;
}

function extractTickets(res) {
  // Próbáljuk ki a tipikus formátumokat
  // - { success:true, data:[...] }
  // - { success:true, data:{ tickets:[...] } }
  // - { tickets:[...] }
  // - { data:{ tickets:[...] } }
  // - [...] (direkt tömb)
  if (Array.isArray(res)) return res;

  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.tickets)) return res.tickets;

  if (Array.isArray(res?.data?.tickets)) return res.data.tickets;
  if (Array.isArray(res?.data?.data)) return res.data.data; // ha data.data egy lista
  if (Array.isArray(res?.data?.data?.tickets)) return res.data.data.tickets;

  // ha egyetlen objektumot ad vissza (ritka), csináljunk belőle listát
  if (res && typeof res === "object" && res.id && res.email) return [res];

  return [];
}

async function loadSupport() {
  const tbody = findTbody();
  const msg = findMsgBox();

  if (!tbody) {
    console.error("Support: nem találok <tbody>-t a táblázathoz.");
    if (msg) msg.textContent = "Hiba: nem található a táblázat törzse (tbody).";
    return;
  }

  if (msg) msg.textContent = "Betöltés...";

  try {
    const res = await window.api.get("/admin/support");
    const list = extractTickets(res);

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
          ${
            resolved
              ? "" // ✅ megoldottnál üres
              : `<button class="btn btn-sm btn-outline-light" data-act="resolve" data-id="${escapeHtml(row.id)}">${escapeHtml(RESOLVE_BUTTON_LABEL)}</button>`
          }
        </td>
      `;
      tbody.appendChild(tr);
    }

    // gombok (delegáció helyett egyszerű binding)
    tbody.querySelectorAll("button[data-act='resolve']").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        btn.disabled = true;
        const old = btn.textContent;
        btn.textContent = "Mentés...";

        try {
          await window.api.put(`/admin/support/${id}`, { resolved: 1 });
          await loadSupport();
        } catch (e) {
          alert(e?.message || String(e));
          btn.disabled = false;
          btn.textContent = old;
        }
      });
    });

    if (msg) msg.textContent = list.length ? "" : "Nincs üzenet.";
  } catch (e) {
    console.error("Support load error:", e);
    if (msg) msg.textContent = "Hiba: " + (e?.message || String(e));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const reload = findReloadBtn();
  if (reload) reload.addEventListener("click", loadSupport);
  loadSupport();
});
