// rp-toast.js — Global notification system (replaces all inline alerts)
(function(){
  function getContainer(){
    let c=document.getElementById('rp-global-toast');
    if(!c){c=document.createElement('div');c.id='rp-global-toast';document.body.appendChild(c);}
    return c;
  }
  const ICONS={success:'✓',error:'✕',warning:'⚠',info:'ℹ'};

  window.rpToast=function(title,msg,type='info',duration=3000){
    const container=getContainer();
    const toast=document.createElement('div');
    toast.className=`rp-gtoast ${type}`;
    toast.innerHTML=`<span class="rp-gtoast-icon">${ICONS[type]||'ℹ'}</span><div class="rp-gtoast-body">${title?`<span class="rp-gtoast-title">${title}</span>`:''}${msg?`<span class="rp-gtoast-msg">${msg}</span>`:''}</div><button class="rp-gtoast-close">×</button>`;
    const close=()=>{toast.classList.add('rp-toast-out');setTimeout(()=>toast.remove(),300);};
    toast.querySelector('.rp-gtoast-close').addEventListener('click',close);
    container.appendChild(toast);
    setTimeout(close,duration);
  };

  window.rpConfirm=function(title,msg){
    return new Promise(resolve=>{
      const ov=document.createElement('div');
      ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:10000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);';
      ov.innerHTML=`<div style="background:var(--card);border:1px solid var(--glass-border);border-radius:18px;padding:28px 32px;max-width:360px;width:90%;box-shadow:var(--shadow);color:var(--text);animation:rp-fade-up .35s cubic-bezier(0.23,1,0.32,1) both;"><div style="font-weight:700;font-size:17px;margin-bottom:8px;">${title}</div><div style="color:var(--muted);font-size:13px;margin-bottom:22px;line-height:1.6;">${msg}</div><div style="display:flex;gap:10px;justify-content:flex-end;"><button id="_rc" style="padding:9px 20px;border-radius:10px;border:1px solid var(--btn-ghost-border);background:var(--btn-ghost-bg);color:var(--text);cursor:pointer;font-family:inherit;font-size:13px;font-weight:600;">Mégse</button><button id="_rok" style="padding:9px 22px;border-radius:10px;border:none;background:var(--primary);color:var(--primary-text);cursor:pointer;font-weight:700;font-family:inherit;font-size:13px;">OK</button></div></div>`;
      document.body.appendChild(ov);
      ov.querySelector('#_rok').onclick=()=>{ov.remove();resolve(true);};
      ov.querySelector('#_rc').onclick=()=>{ov.remove();resolve(false);};
      ov.onclick=e=>{if(e.target===ov){ov.remove();resolve(false);}};
    });
  };
})();
