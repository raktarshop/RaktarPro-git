function setMsg(id, text, ok) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text || '';
  el.style.color = ok === false ? 'var(--stock-out-text,#f87171)' : ok === true ? 'var(--stock-ok-text,#4ade80)' : 'var(--text-dim)';
}

function safeJson(s) {
  try { return JSON.parse(s); } catch { return null; }
}
function loadUser() { return safeJson(localStorage.getItem('rp_user') || 'null'); }
function saveUser(u) { localStorage.setItem('rp_user', JSON.stringify(u)); }

function parseAddressString(addr) {
  const s = String(addr || '').trim();
  if (!s) return { zip:'', city:'', street:'', house:'', extra:'' };
  const parts = s.split(',').map(x => x.trim()).filter(Boolean);
  const first = parts[0] || '';
  let zip = '', city = '';
  const m = first.match(/^(\d{4})\s+(.*)$/);
  if (m) { zip = m[1]; city = m[2]; } else { city = first; }
  const second = parts[1] || '';
  let street = '', house = '';
  if (second) {
    const tokens = second.split(/\s+/).filter(Boolean);
    if (tokens.length >= 2) {
      const last = tokens[tokens.length - 1];
      if (/[0-9]/.test(last)) { house = last; street = tokens.slice(0, -1).join(' '); }
      else { street = second; }
    } else { street = second; }
  }
  const extra = parts.slice(2).join(', ').trim();
  return { zip, city, street, house, extra };
}

function buildAddressString({ zip, city, street, house, extra }) {
  let base = `${zip} ${city}, ${street} ${house}`.trim().replace(/\s+/g, ' ');
  if (extra) base += `, ${extra}`;
  return base;
}

document.addEventListener('DOMContentLoaded', async () => {
  const user = loadUser();
  if (!user?.email) { window.location.href = './auth.html'; return; }

  const userLine   = document.getElementById('accUserLine');
  const firstEl    = document.getElementById('accFirstName');
  const lastEl     = document.getElementById('accLastName');
  const emailEl    = document.getElementById('accEmail');
  const zipEl      = document.getElementById('accZip');
  const cityEl     = document.getElementById('accCity');
  const streetEl   = document.getElementById('accStreet');
  const houseEl    = document.getElementById('accHouse');
  const extraEl    = document.getElementById('accExtra');

  if (userLine) userLine.textContent = user.email;
  if (emailEl)  emailEl.value = user.email || '';

  // Prefill from localStorage
  if (firstEl) firstEl.value = user.first_name || '';
  if (lastEl)  lastEl.value  = user.last_name  || '';

  // Load from backend (SQL)
  try {
    const res  = await window.api.get('/account');
    const data = res?.data ?? res;

    if (firstEl) firstEl.value = data.first_name || user.first_name || '';
    if (lastEl)  lastEl.value  = data.last_name  || user.last_name  || '';

    if (data?.address) {
      const p = parseAddressString(data.address);
      if (zipEl)    zipEl.value    = p.zip;
      if (cityEl)   cityEl.value   = p.city;
      if (streetEl) streetEl.value = p.street;
      if (houseEl)  houseEl.value  = p.house;
      if (extraEl)  extraEl.value  = p.extra;
      // cache for checkout
      try {
        const cached = safeJson(localStorage.getItem('rp_account_cached') || 'null') || {};
        cached.address_parts = p;
        localStorage.setItem('rp_account_cached', JSON.stringify(cached));
      } catch {}
    }
  } catch (e) {
    console.log('Account load:', e.message);
  }

  // ── Profil mentés ──────────────────────────────────────────
  document.getElementById('accSaveProfile')?.addEventListener('click', async () => {
    const first = (firstEl?.value || '').trim();
    const last  = (lastEl?.value  || '').trim();
    if (!first && !last) { setMsg('accMsgProfile', 'Add meg a neved.', false); return; }

    setMsg('accMsgProfile', 'Mentés...');
    try {
      const res  = await window.api.put('/account/profile', { first_name: first, last_name: last });
      const data = res?.data ?? res;
      const u = loadUser() || {};
      u.first_name = data.first_name || first;
      u.last_name  = data.last_name  || last;
      u.full_name  = data.full_name  || `${last} ${first}`.trim();
      u.name       = u.full_name;
      saveUser(u);
      setMsg('accMsgProfile', '✓ Profil mentve!', true);
    } catch (e) {
      setMsg('accMsgProfile', `Hiba: ${e?.message || e}`, false);
    }
  });

  // ── Cím mentés ─────────────────────────────────────────────
  document.getElementById('accSaveAddress')?.addEventListener('click', async () => {
    const zip    = (zipEl?.value    || '').trim();
    const city   = (cityEl?.value   || '').trim();
    const street = (streetEl?.value || '').trim();
    const house  = (houseEl?.value  || '').trim();
    const extra  = (extraEl?.value  || '').trim();

    if (!zip || !city || !street || !house) {
      setMsg('accMsgAddress', 'Irányítószám, város, utca és házszám kötelező.', false);
      return;
    }

    const address = buildAddressString({ zip, city, street, house, extra });
    setMsg('accMsgAddress', 'Mentés...');
    try {
      await window.api.put('/account/address', { address });
      // Cache for checkout prefill
      try {
        const cached = safeJson(localStorage.getItem('rp_account_cached') || 'null') || {};
        cached.address_parts = { zip, city, street, house, extra };
        cached.address = address;
        localStorage.setItem('rp_account_cached', JSON.stringify(cached));
      } catch {}
      window.rpToast?.('✓ Cím mentve', 'Szállítási adatok frissítve.', 'success');
      setMsg('accMsgAddress', '✓ Cím mentve!', true);
    } catch (e) {
      setMsg('accMsgAddress', `Hiba: ${e?.message || e}`, false);
    }
  });

  // ── Jelszó csere ───────────────────────────────────────────
  document.getElementById('accSavePw')?.addEventListener('click', async () => {
    const oldPw  = (document.getElementById('accPwOld')?.value  || '').trim();
    const newPw  = (document.getElementById('accPwNew')?.value  || '').trim();
    const newPw2 = (document.getElementById('accPwNew2')?.value || '').trim();

    if (!oldPw) { setMsg('accMsgPw', 'Add meg a jelenlegi jelszót.', false); return; }
    if (newPw.length < 6) { setMsg('accMsgPw', 'Az új jelszó min. 6 karakter.', false); return; }
    if (newPw2 && newPw !== newPw2) { setMsg('accMsgPw', 'A két jelszó nem egyezik.', false); return; }

    setMsg('accMsgPw', 'Mentés...');
    try {
      await window.api.put('/account/password', { old_password: oldPw, new_password: newPw });
      window.rpToast?.('✓ Jelszó megváltoztatva', '', 'success');
      setMsg('accMsgPw', '✓ Jelszó sikeresen megváltoztatva!', true);
      ['accPwOld','accPwNew','accPwNew2'].forEach(id => {
        const el = document.getElementById(id); if (el) el.value = '';
      });
    } catch (e) {
      setMsg('accMsgPw', `Hiba: ${e?.message || e}`, false);
    }
  });

  // ── Kijelentkezés ─────────────────────────────────────────
  document.getElementById('accLogoutAll')?.addEventListener('click', async () => {
    setMsg('accMsgSec', 'Kiléptetés...');
    try { await window.api.post('/logout', {}); } catch {}
    localStorage.removeItem('rp_token');
    localStorage.removeItem('rp_user');
    setTimeout(() => window.location.href = './auth.html', 300);
  });
});

window.addEventListener('storage', e => {
  if (!e?.key || e.key === 'rp_lang') { if (window.lang?.apply) window.lang.apply(); }
});
