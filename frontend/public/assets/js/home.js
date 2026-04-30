// home.js – RaktárPro Home Page Script

// ── ADATOK (szinkron a products_new.js demo()-val) ──
const PRODUCTS = (function(){
const CAT_RULES=[
  {cat:'Mobil',keys:['iphone','samsung galaxy','xiaomi','pixel','redmi','galaxy s']},
  {cat:'Laptop',keys:['laptop','macbook','thinkpad','xps','pavilion','inspiron','envy']},
  {cat:'TV & Monitor',keys:['oled tv','qled tv','smart tv','55"','65"','monitor','odyssey']},
  {cat:'Fejhallgató',keys:['airpods','wh-1000','jbl charge','jbl flip','hangszóró','fejhallgató']},
  {cat:'Fotózás',keys:['eos r10','alpha a6400','gopro','nikon','canon']},
  {cat:'Okoseszközök',keys:['apple watch','echo dot','smart band','okosóra']},
  {cat:'PC Kiegészítők',keys:['mx master','keychron','990 pro','archer','tp-link','ssd','nvme']},
  {cat:'Gaming',keys:['playstation','xbox','nintendo switch']},
  {cat:'Hálózat',keys:['router','wifi 6','archer ax','mesh']},
];
const BRANDS=['Apple','Samsung','Google','Xiaomi','Sony','LG','Dell','HP','Lenovo','ASUS','Canon','Nikon','JBL','Bose','Logitech','Keychron','Anker','TP-Link','Amazon','GoPro'];
function dCat(p){const tx=((p.name||'')+(p.description||'')).toLowerCase();for(const r of CAT_RULES){if(r.keys.some(k=>tx.includes(k)))return r.cat;}return 'Elektronika';}
function dBrand(p){const tx=((p.name||'')+(p.description||'')).toLowerCase();for(const b of BRANDS){if(tx.includes(b.toLowerCase()))return b;}return null;}

const raw=[
  {id:1,name:'iPhone 15 Pro',price:160000,cat:'Mobil',img:'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop'},
  {id:2,name:'Samsung Galaxy S24 Ultra',price:170000,cat:'Mobil',img:'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop'},
  {id:3,name:'ASUS ROG Strix G16',price:180000,cat:'Gaming',img:'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop'},
  {id:4,name:'MacBook Air M2',price:190000,cat:'Laptop',img:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop'},
  {id:5,name:'Dell XPS 13 Plus',price:200000,cat:'Laptop',img:'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop'},
  {id:6,name:'HP Pavilion 15',price:210000,cat:'Laptop',img:'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop'},
  {id:7,name:'Lenovo ThinkPad X1 Carbon',price:220000,cat:'Laptop',img:'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=400&h=400&fit=crop'},
  {id:8,name:'Sony WH-1000XM5',price:230000,cat:'Fejhallgató',img:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'},
  {id:9,name:'Apple AirPods Pro 2',price:240000,cat:'Fejhallgató',img:'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=400&h=400&fit=crop'},
  {id:10,name:'JBL Charge 5',price:250000,cat:'Fejhallgató',img:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop'},
  {id:11,name:'Samsung QLED 55" QN90C',price:260000,cat:'TV & Monitor',img:'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400&h=400&fit=crop'},
  {id:12,name:'LG OLED C3 65"',price:270000,cat:'TV & Monitor',img:'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=400&h=400&fit=crop'},
  {id:13,name:'iPhone 15',price:429999,cat:'Mobil',img:'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop'},
  {id:14,name:'Samsung Galaxy S24',price:389999,cat:'Mobil',img:'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop'},
  {id:15,name:'Xiaomi Redmi Note 13 Pro',price:119999,cat:'Mobil',img:'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop'},
  {id:16,name:'Google Pixel 8',price:349999,cat:'Mobil',img:'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop'},
  {id:17,name:'MacBook Air M2',price:549999,cat:'Laptop',img:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop'},
  {id:18,name:'Dell XPS 13',price:499999,cat:'Laptop',img:'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop'},
  {id:19,name:'Lenovo ThinkPad E14 Gen 5',price:329999,cat:'Laptop',img:'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=400&h=400&fit=crop'},
  {id:20,name:'HP Envy 15',price:459999,cat:'Laptop',img:'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop'},
  {id:21,name:'Samsung 55" QLED 4K TV',price:299999,cat:'TV & Monitor',img:'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400&h=400&fit=crop'},
  {id:22,name:'LG 65" OLED TV',price:699999,cat:'TV & Monitor',img:'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=400&h=400&fit=crop'},
  {id:23,name:'Sony WH-1000XM5',price:149999,cat:'Fejhallgató',img:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'},
  {id:24,name:'Apple AirPods Pro 2',price:119999,cat:'Fejhallgató',img:'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=400&h=400&fit=crop'},
  {id:25,name:'JBL Charge 5',price:69999,cat:'Fejhallgató',img:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop'},
  {id:26,name:'Logitech MX Master 3S',price:44999,cat:'PC Kiegészítők',img:'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop'},
  {id:27,name:'Keychron K8 Pro TKL',price:59999,cat:'PC Kiegészítők',img:'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop'},
  {id:28,name:'ASUS TUF Gaming VG27AQL1A 27"',price:179999,cat:'TV & Monitor',img:'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=400&h=400&fit=crop'},
  {id:29,name:'Samsung Odyssey G5 27"',price:159999,cat:'TV & Monitor',img:'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=400&fit=crop'},
  {id:30,name:'Canon EOS R10',price:349999,cat:'Fotózás',img:'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop'},
  {id:31,name:'Sony Alpha A6400',price:329999,cat:'Fotózás',img:'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop'},
  {id:32,name:'GoPro Hero 12 Black',price:199999,cat:'Fotózás',img:'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=400&h=400&fit=crop'},
  {id:33,name:'Anker PowerCore 20000',price:24999,cat:'PC Kiegészítők',img:'https://images.unsplash.com/photo-1609592806596-b9e6c2e90e98?w=400&h=400&fit=crop'},
  {id:34,name:'Samsung 990 Pro 1TB NVMe SSD',price:49999,cat:'PC Kiegészítők',img:'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=400&h=400&fit=crop'},
  {id:35,name:'TP-Link Archer AX55',price:39999,cat:'Hálózat',img:'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400&h=400&fit=crop'},
  {id:36,name:'Apple Watch Series 9',price:189999,cat:'Okoseszközök',img:'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=400&fit=crop'},
  {id:37,name:'Amazon Echo Dot 5.',price:19999,cat:'Okoseszközök',img:'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400&h=400&fit=crop'},
  {id:38,name:'iPhone 14',price:399999,cat:'Mobil',img:'https://images.unsplash.com/photo-1664478546384-d57bbe74a6ce?w=400&h=400&fit=crop'},
  {id:39,name:'Samsung Galaxy S23',price:299999,cat:'Mobil',img:'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop'},
  {id:40,name:'Dell Inspiron 15',price:249999,cat:'Laptop',img:'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop'},
  {id:41,name:'HP Pavilion 14',price:239999,cat:'Laptop',img:'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop'},
];
raw.forEach(p=>{p._cat=p.cat||dCat(p); p._brand=dBrand(p);});
return {products:raw, dBrand};
})();

const CAT_ICONS_HP={'Mobil':'bi-phone','Laptop':'bi-laptop','TV & Monitor':'bi-display','Fejhallgató':'bi-headphones','Fotózás':'bi-camera','Okoseszközök':'bi-smartwatch','PC Kiegészítők':'bi-mouse','Gaming':'bi-controller','Hálózat':'bi-wifi','Elektronika':'bi-lightning'};
const CAT_DESCS={'Mobil':'iPhone, Samsung, Xiaomi…','Laptop':'MacBook, ThinkPad, HP…','TV & Monitor':'OLED, QLED, Gaming…','Fejhallgató':'Sony, Bose, JBL…','Fotózás':'Canon, Sony, GoPro…','Okoseszközök':'Apple Watch, Echo…','PC Kiegészítők':'SSD, Egér, Router…','Gaming':'PS5, Xbox, Switch…','Hálózat':'WiFi 6, Mesh…','Elektronika':'Egyéb eszközök…'};

// Dinamikus kategória grid
function buildHomeCats() {
  const cats = {};
  PRODUCTS.products.forEach(p => { cats[p._cat] = (cats[p._cat]||0)+1; });
  const el = document.getElementById('homeCatGrid'); if(!el) return;
  el.innerHTML = Object.entries(cats).sort((a,b)=>b[1]-a[1]).map(([cat,cnt])=>{
    const icon = CAT_ICONS_HP[cat]||'bi-tag';
    const desc = CAT_DESCS[cat]||'';
    return `<a href="./products.html?cat=${encodeURIComponent(cat)}" class="hp-cat-item">
      <i class="bi ${icon}"></i>
      <div class="hp-cat-item-name">${cat}</div>
      <div class="hp-cat-item-count">${cnt} termék · ${desc}</div>
    </a>`;
  }).join('');
}

// Dinamikus márka grid
function buildHomeBrands() {
  const brands = {};
  PRODUCTS.products.forEach(p => { if(p._brand) brands[p._brand]=(brands[p._brand]||0)+1; });
  const el = document.getElementById('homeBrandGrid'); if(!el) return;
  el.innerHTML = Object.entries(brands).sort((a,b)=>b[1]-a[1]).map(([b])=>
    `<a href="./products.html?brand=${encodeURIComponent(b)}" class="hp-brand-pill">${b}</a>`
  ).join('');
}

// Kiemelt termékek (random 8 a listából)
function buildFeatured() {
  const shuffled = [...PRODUCTS.products].sort(()=>Math.random()-.5).slice(0,8);
  const grid = document.getElementById('featuredGrid'); if(!grid) return;
  function fmt(n){return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' Ft';}
  grid.innerHTML = shuffled.map((p,i)=>`
    <a href="./products.html" class="hp-prod-card reveal" style="animation-delay:${i*50}ms;text-decoration:none;">
      <div class="hp-prod-img-placeholder"><img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.innerHTML='📦'"></div>
      <div class="hp-prod-body">
        <div class="hp-prod-brand">${p._brand||p._cat}</div>
        <div class="hp-prod-name">${p.name}</div>
        <div class="hp-prod-bottom">
          <div class="hp-prod-price">${fmt(p.price)} Ft</div>
          <button class="hp-prod-add" onclick="event.preventDefault()"><i class="bi bi-plus-lg"></i></button>
        </div>
      </div>
    </a>`).join('');
  // re-observe reveals
  document.querySelectorAll('.reveal:not(.visible)').forEach(el=>obs.observe(el));
}

// Theme toggle
const themeBtn = document.getElementById('themeBtn');
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('rp_theme', t);
  themeBtn.innerHTML = t === 'dark' ? '<i class="bi bi-moon-stars"></i>' : '<i class="bi bi-sun"></i>';
}
themeBtn.addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(cur === 'dark' ? 'light' : 'dark');
});
applyTheme(localStorage.getItem('rp_theme') || 'dark');

// Cart badge
function updateHomeCartBadge() {
  const cart = JSON.parse(localStorage.getItem('rp_cart') || '[]');
  const total = cart.reduce((s,i) => s + (i.qty||1), 0);
  const badge = document.getElementById('cartBadge');
  if (badge) { badge.textContent = total; badge.style.display = total > 0 ? 'inline-block' : 'none'; }
  const cnt = document.getElementById('cartCount');
  if (cnt && total > 0) { cnt.textContent = total; cnt.style.display = ''; }
}
updateHomeCartBadge();

// Fav badge
function updateHomeFavBadge() {
  try {
    const ws = JSON.parse(localStorage.getItem('rp_wishlist') || '[]');
    const badge = document.getElementById('favBadge');
    if (badge) { badge.textContent = ws.length; badge.style.display = ws.length > 0 ? 'inline-block' : 'none'; }
  } catch {}
}
updateHomeFavBadge();

// Auth nav btn
const user = localStorage.getItem('rp_token');
// auth button always goes to auth.html

// Scroll reveal
const obs = new IntersectionObserver(es => {
  es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }});
}, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Init all dynamic sections
buildHomeCats();
buildHomeBrands();
buildFeatured();

// Handle ?brand= and ?cat= URL params from brand pills linking to products page
// (products_new.js handles these on the products page)

// Auth button label
// auth button is always fixed: Bejelentkezés / Regisztráció → auth.html

// Footer auth guard
function rpFooterGuard(url) {
  const token = localStorage.getItem('rp_token');
  if (token) {
    window.location.href = url;
  } else {
    alert('Ehhez előbb jelentkezz be!');
    window.location.href = './auth.html';
  }
}
