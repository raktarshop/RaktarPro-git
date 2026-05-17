// admin_categories.js
const CAT_ICONS = {
  'Mobil':'bi-phone','Laptop':'bi-laptop','TV & Monitor':'bi-display',
  'Fejhallgató':'bi-headphones','Hangszóró':'bi-speaker','Fotózás':'bi-camera',
  'Okoseszközök':'bi-smartwatch','PC Kiegészítők':'bi-mouse2',
  'Gaming':'bi-controller','Hálózat':'bi-wifi',
};

function catIcon(name) {
  for (const [k,v] of Object.entries(CAT_ICONS)) {
    if (name.toLowerCase().includes(k.toLowerCase().split('/')[0].toLowerCase())) return v;
  }
  return 'bi-tag';
}

function setMsg(txt, color) {
  const el = document.getElementById('catsMsg');
  if (!el) return;
  el.textContent = txt || '';
  el.style.color = color || 'var(--text-dim)';
}

async function loadCategories() {
  const grid = document.getElementById('catGrid');
  try {
    const res = await window.api.get('/categories');
    const cats = Array.isArray(res) ? res
      : Array.isArray(res?.data?.categories) ? res.data.categories
      : Array.isArray(res?.categories) ? res.categories
      : Array.isArray(res?.data) ? res.data : [];

    if (!cats.length) {
      grid.innerHTML = '<div class="cat-empty"><i class="bi bi-tags" style="font-size:32px;opacity:.3;display:block;margin-bottom:10px;"></i>Még nincs kategória.</div>';
      return;
    }

    // update count badge
    const badge = document.getElementById('catCountBadge');
    if (badge) badge.textContent = cats.length;

    grid.innerHTML = cats.map(cat => `
      <div class="cat-card" data-cat-id="${cat.id}">
        <div class="cat-card-left">
          <div class="cat-icon"><i class="bi ${catIcon(cat.name)}"></i></div>
          <div class="cat-info">
            <div class="cat-name">${esc(cat.name)}</div>
            <div class="cat-id">#${cat.id}</div>
          </div>
        </div>
        <button class="cat-del-btn" title="Törlés" data-id="${cat.id}">
          <i class="bi bi-trash3"></i>
        </button>
      </div>
    `).join('');

    // Delete buttons
    grid.querySelectorAll('.cat-del-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id   = btn.dataset.id;
        const card = btn.closest('.cat-card');
        const name = card.querySelector('.cat-name').textContent;
        const ok = await window.rpConfirm('Kategória törlése', `Biztosan törlöd: "${name}"?\nAz ehhez rendelt termékek kategória nélkül maradnak.`);
        if (!ok) return;
        btn.disabled = true;
        try {
          await window.api.del(`/categories/${id}`);
          card.style.transition = 'opacity 120ms, transform 120ms';
          card.style.opacity = '0';
          card.style.transform = 'scale(.95)';
          setTimeout(() => { card.remove(); setMsg('✓ Törölve.', '#10b981'); }, 150);
        } catch(e) {
          setMsg('Hiba: ' + (e.message || e), '#ef4444');
          btn.disabled = false;
        }
      });
    });
  } catch(e) {
    // Show demo categories as fallback
    const demoCats = [
      {id:1,name:'Mobil'},{id:2,name:'Laptop'},{id:3,name:'TV & Monitor'},
      {id:4,name:'Fejhallgató'},{id:5,name:'Fotózás'},
      {id:6,name:'Okoseszközök'},{id:7,name:'PC Kiegészítők'},
      {id:8,name:'Gaming'},{id:9,name:'Hálózat'},{id:10,name:'Hangszóró'},
    ];
    const badge2 = document.getElementById('catCountBadge');
    if (badge2) badge2.textContent = demoCats.length;
    grid.innerHTML = demoCats.map(cat => `
      <div class="cat-card" data-cat-id="${cat.id}">
        <div class="cat-card-left">
          <div class="cat-icon"><i class="bi ${catIcon(cat.name)}"></i></div>
          <div class="cat-info">
            <div class="cat-name">${esc(cat.name)}</div>
            <div class="cat-id">#${cat.id}</div>
          </div>
        </div>
        <button class="cat-del-btn" title="Törlés (API nélkül nem aktív)" disabled>
          <i class="bi bi-trash3"></i>
        </button>
      </div>
    `).join('') + '<div style="grid-column:1/-1;font-size:12px;color:var(--text-dim);padding:8px 4px;background:var(--glass);border-radius:10px;padding:10px 14px;border:1px solid var(--glass-border);"><i class="bi bi-info-circle me-1"></i>API nem elérhető – demo adatok láthatók</div>';
    console.error(e);
  }
}

function esc(s) {
  return String(s||'').replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

document.addEventListener('DOMContentLoaded', async () => {
  // Auth check
  let user = null;
  try { user = JSON.parse(localStorage.getItem('rp_user')||'null'); } catch {}
  const isAdmin = u => u && (u.is_admin===true||Number(u.is_admin)===1||Number(u.role_id)===1);
  if (!isAdmin(user)) { window.rpToast?.('Hozzáférés megtagadva', 'Admin jogosultság szükséges.', 'error'); setTimeout(()=>{ window.location.href='./products.html'; }, 1500); return; }

  await loadCategories();

  // Add category
  const addBtn   = document.getElementById('catAdd');
  const nameInput = document.getElementById('catName');

  const doAdd = async () => {
    const name = nameInput.value.trim();
    if (!name) { setMsg('Add meg a kategória nevét.', '#f59e0b'); return; }
    addBtn.disabled = true;
    setMsg('Mentés…');
    try {
      await window.api.post('/categories', { name });
      nameInput.value = '';
      setMsg('✓ Kategória hozzáadva!', '#10b981');
      await loadCategories();
      setTimeout(() => setMsg(''), 2500);
    } catch(e) {
      setMsg('Hiba: ' + (e.message || e), '#ef4444');
    } finally {
      addBtn.disabled = false;
    }
  };

  addBtn.addEventListener('click', doAdd);
  nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') doAdd(); });
});
