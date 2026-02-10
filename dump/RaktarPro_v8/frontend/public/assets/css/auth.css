/* auth.css – Login/Register oldal */

/* Az auth oldal a common.css theme változóit használja, csak rp-* aliasokkal */
body.rp-auth{
  --rp-bg: var(--bg);
  --rp-text: var(--text);
  --rp-card: var(--card);
  --rp-border: var(--border);
  --rp-input: var(--input);
  --rp-input-border: var(--input-border);
}

.rp-auth {
  min-height: 100vh;
  background: radial-gradient(1200px 700px at 20% 0%, rgba(49,86,255,.18), transparent 60%),
              radial-gradient(900px 600px at 90% 30%, rgba(11,197,255,.10), transparent 55%),
              var(--rp-bg);
  color: var(--rp-text);
}

.rp-auth-topbar{
  display:flex;
  align-items:flex-end;
  justify-content:space-between;
  gap: 12px;
}

.rp-lang{
  flex:1;
  display:flex;
  flex-direction:column;
  gap: 6px;
}

.rp-lang-label{
  font-size: 12px;
  font-weight: 800;
  color: var(--muted);
  letter-spacing: .2px;
}

.rp-select{
  border-radius: 14px !important;
}

/* DARK MODE: a select legyen kékes, fehér betűkkel (és a lenyíló lista is) */
html[data-theme="dark"] body.rp-auth .rp-select{
  background: var(--primary) !important;
  color: var(--primary-text) !important;
  border: 1px solid rgba(255,255,255,.16) !important;
}

html[data-theme="dark"] body.rp-auth .rp-select:focus{
  border-color: rgba(255,255,255,.28) !important;
  box-shadow: 0 0 0 .2rem rgba(49, 86, 255, .25) !important;
}

html[data-theme="dark"] body.rp-auth .rp-select option{
  background: var(--primary);
  color: var(--primary-text);
}

.rp-theme-btn{
  height: 44px;
  width: 52px;
  display:grid;
  place-items:center;
  border-radius: 16px !important;
}

.rp-auth-wrap{
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 28px 16px;
}

.rp-auth-card{
  width: min(520px, 100%);
  padding: 26px;
  border-radius: 22px;
  background: var(--rp-card);
  border: 1px solid var(--rp-border);
  box-shadow: 0 24px 70px rgba(0,0,0,.45);
  backdrop-filter: blur(14px);
}

.rp-brand{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:12px;
}

.rp-logo{
  width:42px;height:42px;
  border-radius: 14px;
  display:grid;place-items:center;
  background: rgba(255,255,255,.08);
  border: 1px solid var(--rp-border);
  font-weight: 800;
}

.rp-title{ opacity:.9; font-weight:700; letter-spacing:.2px; }

.rp-h1{
  font-weight:800;
  font-size:38px;
  margin:0;
}

.rp-tabs{
  display:flex;
  background: var(--btn-ghost-bg);
  border: 1px solid var(--btn-ghost-border);
  border-radius: 14px;
  overflow:hidden;
}

.rp-tab-btn{
  flex:1;
  padding: 12px 14px;
  border:0;
  background: transparent;
  color: var(--muted-2);
  font-weight: 700;
  cursor: pointer;
}

.rp-tab-btn.active{
  background: var(--primary);
  color: var(--primary-text);
}

.rp-label{
  color: var(--muted);
  font-weight:700;
  margin-bottom: 6px;
  font-size: 13px;
}

.rp-input{
  background: var(--rp-input) !important;
  border: 1px solid var(--rp-input-border) !important;
  color: var(--rp-text) !important;
  border-radius: 14px !important;
}

.rp-input-sm{
  padding: 11px 14px !important;
  font-size: 14px;
}

/* Placeholder – theme alapján */
.rp-input::placeholder{ color: var(--placeholder) !important; opacity: 1; }

.rp-eye{
  border-radius: 14px !important;
  background: var(--btn-ghost-bg);
  border: 1px solid var(--btn-ghost-border);
  color: var(--muted);
}

.rp-eye-sm{
  padding: 10px 12px;
  font-size: 14px;
}

.rp-primary{
  border-radius: 16px;
  background: var(--primary);
  color: var(--primary-text);
  font-weight: 800;
  border: 0;
}

.rp-primary-sm{
  padding: 12px 14px;
}

.rp-guest{
  color: var(--text-dim);
  text-decoration: none;
  font-size: 14px;
}
.rp-guest:hover{ text-decoration: underline; }

.rp-tab-panel{ display:none; }
.rp-tab-panel.show{ display:block; }

.rp-error{
  background: rgba(255, 80, 80, .12);
  border: 1px solid rgba(255, 80, 80, .35);
  padding: 10px 12px;
  border-radius: 14px;
  color: #ffd3d3;
  font-size: 14px;
}

.rp-success{
  background: rgba(60, 255, 170, .12);
  border: 1px solid rgba(60, 255, 170, .35);
  padding: 10px 12px;
  border-radius: 14px;
  color: #ccffe8;
  font-size: 14px;
}

.rp-hint{
  opacity:.7;
  font-size: 12px;
}

/* Help link under password */
.rp-help-link{
  display: inline-block;
  font-size: 13px;
  text-decoration: none;
  font-weight: 700;
  opacity: .85;
}
.rp-help-link:hover{
  opacity: 1;
  text-decoration: underline;
}
