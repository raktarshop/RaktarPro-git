// rp-toast.js — Global notification + modal system
(function () {

  // ── TOAST CSS INJECT ────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #rp-global-toast {
      position: fixed; bottom: 28px; right: 28px;
      z-index: 10100; display: flex; flex-direction: column; gap: 10px;
      pointer-events: none;
    }
    .rp-gtoast {
      display: flex; align-items: flex-start; gap: 12px;
      background: var(--card, #1a2540);
      border: 1px solid var(--glass-border, rgba(255,255,255,.12));
      border-radius: 16px;
      padding: 14px 16px 14px 14px;
      min-width: 260px; max-width: 340px;
      box-shadow: 0 12px 40px rgba(0,0,0,.35);
      backdrop-filter: blur(20px);
      pointer-events: auto;
      opacity: 0;
      transform: translateX(24px) scale(.96);
      transition: opacity 280ms ease, transform 280ms cubic-bezier(.22,.68,0,1.2);
      position: relative;
    }
    .rp-gtoast.show { opacity: 1; transform: translateX(0) scale(1); }
    .rp-toast-out   { opacity: 0 !important; transform: translateX(24px) scale(.96) !important; }
    .rp-gtoast-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
    .rp-gtoast.success .rp-gtoast-icon { color: #10b981; }
    .rp-gtoast.error   .rp-gtoast-icon { color: #ef4444; }
    .rp-gtoast.warning .rp-gtoast-icon { color: #f59e0b; }
    .rp-gtoast.info    .rp-gtoast-icon { color: #0bc5ff; }
    .rp-gtoast-body { flex: 1; min-width: 0; }
    .rp-gtoast-title { display: block; font-size: 13px; font-weight: 700; color: var(--text, #e8f1ff); line-height: 1.3; }
    .rp-gtoast-msg   { display: block; font-size: 12px; color: var(--text-dim, rgba(232,241,255,.6)); margin-top: 2px; line-height: 1.5; }
    .rp-gtoast-close { position: absolute; top: 10px; right: 10px; background: none; border: none; color: var(--text-dim, rgba(232,241,255,.5)); cursor: pointer; font-size: 16px; line-height: 1; padding: 0; width: 20px; height: 20px; display: grid; place-items: center; border-radius: 6px; transition: background 140ms; }
    .rp-gtoast-close:hover { background: rgba(255,255,255,.1); }
    .rp-gtoast-progress {
      position: absolute; bottom: 0; left: 0; height: 3px; border-radius: 0 0 16px 16px;
      background: currentColor; opacity: .35;
      animation: rp-progress-shrink linear forwards;
    }
    .rp-gtoast.success .rp-gtoast-progress { color: #10b981; }
    .rp-gtoast.error   .rp-gtoast-progress { color: #ef4444; }
    .rp-gtoast.warning .rp-gtoast-progress { color: #f59e0b; }
    .rp-gtoast.info    .rp-gtoast-progress { color: #0bc5ff; }
    @keyframes rp-progress-shrink { from { width: 100%; } to { width: 0%; } }
    @media (max-width: 480px) {
      #rp-global-toast { bottom: 16px; right: 12px; left: 12px; }
      .rp-gtoast { min-width: unset; max-width: unset; }
    }

    /* ── WELCOME MODAL ── */
    .rp-welcome-overlay {
      position: fixed; inset: 0; z-index: 10200;
      background: rgba(0,0,0,.6);
      backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center;
      padding: 16px;
      opacity: 0; transition: opacity 300ms ease;
    }
    .rp-welcome-overlay.show { opacity: 1; }
    .rp-welcome-card {
      background: var(--card, #111e38);
      border: 1px solid var(--glass-border, rgba(255,255,255,.12));
      border-radius: 24px;
      padding: 36px 32px 28px;
      max-width: 400px; width: 100%;
      text-align: center;
      box-shadow: 0 24px 80px rgba(0,0,0,.5);
      transform: scale(.9) translateY(20px);
      transition: transform 350ms cubic-bezier(.22,.68,0,1.2);
      position: relative;
      overflow: hidden;
    }
    .rp-welcome-overlay.show .rp-welcome-card { transform: scale(1) translateY(0); }
    .rp-welcome-card::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 3px;
      background: linear-gradient(90deg, #3b5cff, #0bc5ff);
    }
    .rp-welcome-avatar {
      width: 72px; height: 72px; border-radius: 50%;
      background: linear-gradient(135deg, rgba(59,92,255,.3), rgba(11,197,255,.2));
      border: 2px solid rgba(59,92,255,.4);
      display: grid; place-items: center;
      margin: 0 auto 16px;
      font-size: 30px;
      animation: rp-pop-in .4s cubic-bezier(.22,.68,0,1.4) both;
    }
    @keyframes rp-pop-in { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .rp-welcome-title {
      font-family: var(--font-display, 'Syne', sans-serif);
      font-size: 22px; font-weight: 900;
      color: var(--text, #e8f1ff);
      margin-bottom: 8px;
    }
    .rp-welcome-sub {
      font-size: 14px; color: var(--text-dim, rgba(232,241,255,.6));
      margin-bottom: 24px; line-height: 1.6;
    }
    .rp-welcome-btn {
      width: 100%; padding: 13px;
      border-radius: 12px;
      background: linear-gradient(135deg, #3b5cff, #0bc5ff);
      color: #fff; font-weight: 800; font-size: 15px;
      border: none; cursor: pointer;
      transition: all 160ms ease;
      font-family: var(--font-body, 'DM Sans', sans-serif);
    }
    .rp-welcome-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(59,92,255,.4); }

    /* ── CONFIRM MODAL ── */
    .rp-confirm-overlay {
      position: fixed; inset: 0; z-index: 10200;
      background: rgba(0,0,0,.55);
      backdrop-filter: blur(5px);
      display: flex; align-items: center; justify-content: center;
      padding: 16px;
      opacity: 0; transition: opacity 250ms ease;
    }
    .rp-confirm-overlay.show { opacity: 1; }
    .rp-confirm-card {
      background: var(--card, #111e38);
      border: 1px solid var(--glass-border, rgba(255,255,255,.12));
      border-radius: 20px;
      padding: 28px 28px 22px;
      max-width: 360px; width: 100%;
      box-shadow: 0 20px 60px rgba(0,0,0,.45);
      transform: scale(.92) translateY(12px);
      transition: transform 300ms cubic-bezier(.22,.68,0,1.2);
    }
    .rp-confirm-overlay.show .rp-confirm-card { transform: scale(1) translateY(0); }
    .rp-confirm-title { font-weight: 800; font-size: 17px; color: var(--text, #e8f1ff); margin-bottom: 10px; }
    .rp-confirm-msg   { font-size: 13.5px; color: var(--text-dim, rgba(232,241,255,.6)); margin-bottom: 22px; line-height: 1.6; white-space: pre-line; }
    .rp-confirm-btns  { display: flex; gap: 10px; justify-content: flex-end; }
    .rp-confirm-cancel {
      padding: 9px 20px; border-radius: 10px;
      border: 1px solid var(--glass-border, rgba(255,255,255,.12));
      background: transparent; color: var(--text, #e8f1ff);
      cursor: pointer; font-weight: 600; font-size: 13px;
      font-family: inherit; transition: background 140ms;
    }
    .rp-confirm-cancel:hover { background: rgba(255,255,255,.06); }
    .rp-confirm-ok {
      padding: 9px 22px; border-radius: 10px;
      border: none;
      background: linear-gradient(135deg, #3b5cff, #0bc5ff);
      color: #fff; cursor: pointer; font-weight: 700; font-size: 13px;
      font-family: inherit; transition: all 140ms;
    }
    .rp-confirm-ok:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(59,92,255,.4); }
  `;
  document.head.appendChild(style);

  // ── TOAST ───────────────────────────────────────────────────────────────
  function getContainer() {
    let c = document.getElementById('rp-global-toast');
    if (!c) {
      c = document.createElement('div');
      c.id = 'rp-global-toast';
      document.body.appendChild(c);
    }
    return c;
  }

  const ICONS = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };

  window.rpToast = function (title, msg, type = 'info', duration = 3500) {
    const container = getContainer();
    const toast = document.createElement('div');
    toast.className = `rp-gtoast ${type}`;
    toast.innerHTML = `
      <span class="rp-gtoast-icon">${ICONS[type] || 'ℹ'}</span>
      <div class="rp-gtoast-body">
        ${title ? `<span class="rp-gtoast-title">${title}</span>` : ''}
        ${msg ? `<span class="rp-gtoast-msg">${msg}</span>` : ''}
      </div>
      <button class="rp-gtoast-close" aria-label="Bezár">×</button>
      <div class="rp-gtoast-progress" style="animation-duration:${duration}ms"></div>
    `;

    const close = () => {
      toast.classList.add('rp-toast-out');
      setTimeout(() => toast.remove(), 320);
    };
    toast.querySelector('.rp-gtoast-close').addEventListener('click', close);
    container.appendChild(toast);
    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
    setTimeout(close, duration);
  };

  // ── CONFIRM ─────────────────────────────────────────────────────────────
  window.rpConfirm = function (title, msg) {
    return new Promise(resolve => {
      const ov = document.createElement('div');
      ov.className = 'rp-confirm-overlay';
      ov.innerHTML = `
        <div class="rp-confirm-card">
          <div class="rp-confirm-title">${title}</div>
          <div class="rp-confirm-msg">${msg}</div>
          <div class="rp-confirm-btns">
            <button class="rp-confirm-cancel">Mégse</button>
            <button class="rp-confirm-ok">Igen, leadom →</button>
          </div>
        </div>`;
      document.body.appendChild(ov);
      requestAnimationFrame(() => requestAnimationFrame(() => ov.classList.add('show')));

      const close = (result) => {
        ov.classList.remove('show');
        setTimeout(() => { ov.remove(); resolve(result); }, 280);
      };
      ov.querySelector('.rp-confirm-ok').onclick     = () => close(true);
      ov.querySelector('.rp-confirm-cancel').onclick = () => close(false);
      ov.addEventListener('click', e => { if (e.target === ov) close(false); });
    });
  };

  // ── WELCOME MODAL (bejelentkezés után) ──────────────────────────────────
  window.rpShowWelcome = function (name) {
    const initial = (name || 'V').charAt(0).toUpperCase();
    const short   = (name || 'Felhasználó').split(' ')[0];

    const ov = document.createElement('div');
    ov.className = 'rp-welcome-overlay';
    ov.innerHTML = `
      <div class="rp-welcome-card">
        <div class="rp-welcome-avatar">${initial}</div>
        <div class="rp-welcome-title">Üdvözöllek, ${short}! 👋</div>
        <div class="rp-welcome-sub">Bejelentkeztél a Raktár Pro fiókodba.<br>Jó vásárlást kívánunk!</div>
        <button class="rp-welcome-btn">Böngéssz tovább →</button>
      </div>`;
    document.body.appendChild(ov);
    requestAnimationFrame(() => requestAnimationFrame(() => ov.classList.add('show')));

    const close = () => {
      ov.classList.remove('show');
      setTimeout(() => ov.remove(), 320);
    };
    ov.querySelector('.rp-welcome-btn').onclick = close;
    ov.addEventListener('click', e => { if (e.target === ov) close(); });
    setTimeout(close, 5000);
  };

})();
