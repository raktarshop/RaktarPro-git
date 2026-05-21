// product_details_new.js — RaktárPro final
(function(){
function qs(s){return document.querySelector(s);}
function getParam(n){return new URL(location.href).searchParams.get(n);}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]||m));}
function pickPrice(p){return p.unit_price??p.price??0;}
function fmt(n){return Math.round(Number(n)||0).toString().replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' Ft';}
function getUser(){try{return JSON.parse(localStorage.getItem('rp_user')||'null');}catch{return null;}}
function isAdmin(u){if(!u)return false;return u.is_admin===true||Number(u.is_admin)===1||Number(u.role_id)===1||(u.role||'').toLowerCase()==='admin';}
function t(k,fb){return fb||k;}

// Scroll progress
window.addEventListener('scroll',()=>{const b=document.getElementById('progressBar');if(b){const p=window.scrollY/(document.documentElement.scrollHeight-window.innerHeight)*100;b.style.width=Math.min(p,100)+'%';}},{passive:true});

// Real photos matching products_new.js



function getPhoto(p){return p.image_url||'';}

function getExtraPhotos(p){
  const main=getPhoto(p);
  const extras=[
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=900&h=700&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&h=700&fit=crop',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=900&h=700&fit=crop',
  ];
  return[main,...extras.filter(u=>u!==main)].slice(0,4);
}

// Extract specs from description
// ── MŰSZAKI ADATOK – MediaMarkt formátum, minden termékhez ──
const PRODUCT_SPECS = {
  1: [ // iPhone 15 Pro
    {icon:'bi-phone',          key:'Kijelző',             val:'6,1" Super Retina XDR OLED, 2556×1179 px'},
    {icon:'bi-cpu',            key:'Chip',                val:'Apple A17 Pro (3 nm)'},
    {icon:'bi-camera',         key:'Főkamera',            val:'48 MP + 12 MP + 12 MP (Triple)'},
    {icon:'bi-camera2',        key:'Előlapi kamera',      val:'12 MP TrueDepth'},
    {icon:'bi-lightning',      key:'Frissítési ráta',     val:'120 Hz ProMotion'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'3274 mAh, MagSafe 15 W'},
    {icon:'bi-usb-c',          key:'Csatlakozó',          val:'USB-C (USB 3)'},
    {icon:'bi-globe',          key:'Mobilhálózat',        val:'5G (Sub-6 GHz + mmWave)'},
    {icon:'bi-shield-check',   key:'Vízállóság',          val:'IP68 (6 m / 30 perc)'},
    {icon:'bi-apple',          key:'Operációs rendszer',  val:'iOS 17'},
  ],
  2: [ // Samsung Galaxy S24 Ultra
    {icon:'bi-phone',          key:'Kijelző',             val:'6,8" Dynamic AMOLED 2X, 3088×1440 px'},
    {icon:'bi-cpu',            key:'Processzor',          val:'Snapdragon 8 Gen 3'},
    {icon:'bi-camera',         key:'Főkamera',            val:'200 MP + 12 MP + 50 MP + 10 MP'},
    {icon:'bi-memory',         key:'RAM',                 val:'12 GB'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'256 GB / 512 GB / 1 TB'},
    {icon:'bi-lightning',      key:'Frissítési ráta',     val:'120 Hz adaptív'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'5000 mAh, 45 W gyorstöltés'},
    {icon:'bi-shield-check',   key:'Vízállóság',          val:'IP68'},
    {icon:'bi-pen',            key:'S Pen',               val:'Beépített, 2,8 ms késés'},
    {icon:'bi-globe',          key:'Mobilhálózat',        val:'5G'},
  ],
  3: [ // ASUS ROG Strix G16
    {icon:'bi-display',        key:'Kijelző',             val:'16" QHD IPS, 2560×1600 px'},
    {icon:'bi-cpu',            key:'Processzor',          val:'Intel Core i7-13650HX'},
    {icon:'bi-gpu-card',       key:'Videokártya',         val:'NVIDIA GeForce RTX 4060 8 GB'},
    {icon:'bi-memory',         key:'RAM',                 val:'16 GB DDR5 4800 MHz'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'512 GB NVMe SSD'},
    {icon:'bi-lightning',      key:'Frissítési ráta',     val:'165 Hz, 3 ms válaszidő'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'90 Wh, 240 W adapter'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 6E, Bluetooth 5.3'},
    {icon:'bi-keyboard',       key:'Billentyűzet',        val:'RGB háttérvilágítás (Aura Sync)'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'2,5 kg'},
  ],
  4: [ // MacBook Air M2 (2023)
    {icon:'bi-display',        key:'Kijelző',             val:'13,6" Liquid Retina, 2560×1664 px'},
    {icon:'bi-cpu',            key:'Chip',                val:'Apple M2 (8 mag CPU, 10 mag GPU)'},
    {icon:'bi-memory',         key:'RAM',                 val:'8 GB / 16 GB / 24 GB egységes'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'256 GB – 2 TB SSD'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'52,6 Wh, ~18 óra üzemidő'},
    {icon:'bi-plug',           key:'Töltés',              val:'MagSafe 3, 30–70 W'},
    {icon:'bi-thermometer',    key:'Hűtés',               val:'Passzív (ventilátor nélkül)'},
    {icon:'bi-camera',         key:'Webkamera',           val:'1080p FaceTime HD'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 6, Bluetooth 5.3'},
    {icon:'bi-apple',          key:'Operációs rendszer',  val:'macOS Ventura'},
  ],
  5: [ // Dell XPS 13 Plus
    {icon:'bi-display',        key:'Kijelző',             val:'13,4" OLED, 3456×2160 px, 60 Hz'},
    {icon:'bi-cpu',            key:'Processzor',          val:'Intel Core i7-1360P'},
    {icon:'bi-memory',         key:'RAM',                 val:'16 GB LPDDR5'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'512 GB NVMe SSD'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'55 Wh, ~10 óra üzemidő'},
    {icon:'bi-plug',           key:'Töltés',              val:'2× Thunderbolt 4 (60 W)'},
    {icon:'bi-camera',         key:'Webkamera',           val:'720p HD'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 6E, Bluetooth 5.2'},
    {icon:'bi-palette2',       key:'Szín lefedettség',    val:'100% DCI-P3, HDR 400'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'1,24 kg'},
  ],
  6: [ // HP Pavilion 15-eh3
    {icon:'bi-display',        key:'Kijelző',             val:'15,6" FHD IPS, 1920×1080 px'},
    {icon:'bi-cpu',            key:'Processzor',          val:'AMD Ryzen 7 7730U'},
    {icon:'bi-memory',         key:'RAM',                 val:'16 GB DDR4 3200 MHz'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'512 GB NVMe SSD'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'41 Wh, ~8 óra üzemidő'},
    {icon:'bi-usb-c',          key:'Csatlakozók',         val:'USB-C, 2× USB-A, HDMI'},
    {icon:'bi-camera',         key:'Webkamera',           val:'HP True Vision 720p'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 5, Bluetooth 5.0'},
    {icon:'bi-windows',        key:'Operációs rendszer',  val:'Windows 11 Home'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'1,75 kg'},
  ],
  7: [ // Lenovo ThinkPad X1 Carbon Gen 11
    {icon:'bi-display',        key:'Kijelző',             val:'14" 2.8K OLED, 2880×1800 px'},
    {icon:'bi-cpu',            key:'Processzor',          val:'Intel Core i7-1365U vPro'},
    {icon:'bi-memory',         key:'RAM',                 val:'16 GB LPDDR5 6000 MHz'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'512 GB NVMe SSD'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'57 Wh, ~15 óra üzemidő'},
    {icon:'bi-shield-check',   key:'Szabvány',            val:'MIL-STD-810H katonai'},
    {icon:'bi-fingerprint',    key:'Biztonság',           val:'Ujjlenyomatolvasó + IR kamera'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 6E, Bluetooth 5.3'},
    {icon:'bi-plug',           key:'Csatlakozók',         val:'2× Thunderbolt 4, 2× USB-A'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'1,12 kg'},
  ],
  8: [ // Sony WH-1000XM5
    {icon:'bi-speaker',        key:'Hangszóró méret',     val:'30 mm'},
    {icon:'bi-soundwave',      key:'Frekvenciatartomány', val:'4 Hz – 40 kHz (LDAC)'},
    {icon:'bi-ear',            key:'Zajszűrés',           val:'Aktív ANC (8 processzor, 12 mikrofon)'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'30 óra ANC-vel, 3 h töltés'},
    {icon:'bi-bluetooth',      key:'Bluetooth',           val:'5.2, Multipoint (2 eszköz)'},
    {icon:'bi-plug',           key:'Töltés',              val:'USB-C, 3 perc → 3 óra'},
    {icon:'bi-mic',            key:'Mikrofon',            val:'8 mikrofon (Precise Voice Pickup)'},
    {icon:'bi-headphones',     key:'Viselet',             val:'Over-ear, összecsukható'},
    {icon:'bi-phone',          key:'Alkalmazás',          val:'Sony Headphones Connect'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'250 g'},
  ],
  9: [ // Apple AirPods Pro 2
    {icon:'bi-ear',            key:'Zajszűrés',           val:'Aktív (Adaptive Transparency)'},
    {icon:'bi-soundwave',      key:'Hang',                val:'Apple H2 chip, Spatial Audio'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'6 h (ANC), +30 h tokkal'},
    {icon:'bi-plug',           key:'Töltő tok',           val:'USB-C + MagSafe + Apple Watch'},
    {icon:'bi-bluetooth',      key:'Bluetooth',           val:'5.3'},
    {icon:'bi-shield-check',   key:'Vízállóság',          val:'IP54 (fülhallgató + tok)'},
    {icon:'bi-hand-index',     key:'Vezérlés',            val:'Érintés + nyomás + csettintés'},
    {icon:'bi-apple',          key:'Kompatibilitás',      val:'iPhone / iPad / Mac / Apple Watch'},
    {icon:'bi-geo-alt',        key:'Helymeghatározás',    val:'Precision Finding (U1 chip)'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'5,3 g (fülhallgató)'},
  ],
  10: [ // JBL Charge 5
    {icon:'bi-speaker',        key:'Teljesítmény',        val:'40 W RMS'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'7500 mAh, ~20 óra lejátszás'},
    {icon:'bi-plug',           key:'Csatlakozó',          val:'USB-C töltés, USB-A kimenet'},
    {icon:'bi-bluetooth',      key:'Bluetooth',           val:'5.1, 10 m hatótáv'},
    {icon:'bi-shield-check',   key:'Vízállóság',          val:'IP67 (vízálló + porálló)'},
    {icon:'bi-soundwave',      key:'Hangrendszer',        val:'2 JBL fullrange + 2 tweeter'},
    {icon:'bi-link-45deg',     key:'PartyBoost',          val:'Több hangszóró összekapcsolása'},
    {icon:'bi-mic',            key:'Speakerphone',        val:'Beépített mikrofon'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'960 g'},
    {icon:'bi-palette2',       key:'Szín',                val:'Fekete / Kék / Szürke / Piros'},
  ],
  11: [ // Samsung QLED 55" QN90C
    {icon:'bi-display',        key:'Kijelző',             val:'55" Neo QLED 4K, 3840×2160 px'},
    {icon:'bi-lightning',      key:'Frissítési ráta',     val:'120 Hz, Motion Xcelerator Turbo+'},
    {icon:'bi-brightness-high',key:'Fényerő',             val:'2000 nit (Mini LED)'},
    {icon:'bi-soundwave',      key:'Hangrendszer',        val:'60 W, Dolby Atmos, OTS Lite'},
    {icon:'bi-cpu',            key:'Processzor',          val:'NQ4 AI Gen2'},
    {icon:'bi-controller',     key:'Gaming',              val:'4× HDMI 2.1, 144 Hz, VRR, ALLM'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 5, Bluetooth 5.2'},
    {icon:'bi-smart-home',     key:'Smart TV',            val:'Tizen OS, Alexa / Bixby'},
    {icon:'bi-plug',           key:'Csatlakozók',         val:'4× HDMI, 2× USB, LAN, optikai'},
    {icon:'bi-shield-check',   key:'HDR',                 val:'HDR10+, HDR10, HLG'},
  ],
  12: [ // LG OLED C3 65"
    {icon:'bi-display',        key:'Kijelző',             val:'65" OLED evo, 3840×2160 px'},
    {icon:'bi-lightning',      key:'Frissítési ráta',     val:'120 Hz (144 Hz HDMI 2.1)'},
    {icon:'bi-brightness-high',key:'Kontraszt',           val:'∞:1 (önvilágító pixel)'},
    {icon:'bi-soundwave',      key:'Hangrendszer',        val:'60 W, Dolby Atmos, DTS:X'},
    {icon:'bi-cpu',            key:'Processzor',          val:'α9 Gen6 AI 4K'},
    {icon:'bi-controller',     key:'Gaming',              val:'4× HDMI 2.1, G-Sync, FreeSync'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 6 (802.11ax), Bluetooth 5.0'},
    {icon:'bi-smart-home',     key:'Smart TV',            val:'webOS 23, ThinQ AI'},
    {icon:'bi-shield-check',   key:'HDR',                 val:'Dolby Vision IQ, HDR10, HLG'},
    {icon:'bi-box-seam',       key:'Tömeg (állv. nélkül)',val:'23 kg'},
  ],
  13: [ // iPhone 15
    {icon:'bi-phone',          key:'Kijelző',             val:'6,1" Super Retina XDR OLED, 2556×1179 px'},
    {icon:'bi-cpu',            key:'Chip',                val:'Apple A16 Bionic'},
    {icon:'bi-camera',         key:'Főkamera',            val:'48 MP + 12 MP (Dual)'},
    {icon:'bi-lightning',      key:'Frissítési ráta',     val:'60 Hz'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'3349 mAh, MagSafe 15 W'},
    {icon:'bi-usb-c',          key:'Csatlakozó',          val:'USB-C (USB 2)'},
    {icon:'bi-globe',          key:'Mobilhálózat',        val:'5G'},
    {icon:'bi-shield-check',   key:'Vízállóság',          val:'IP68'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'128 GB / 256 GB / 512 GB'},
    {icon:'bi-apple',          key:'Operációs rendszer',  val:'iOS 17'},
  ],
  14: [ // Samsung Galaxy S24
    {icon:'bi-phone',          key:'Kijelző',             val:'6,2" Dynamic AMOLED 2X, 2340×1080 px'},
    {icon:'bi-cpu',            key:'Processzor',          val:'Snapdragon 8 Gen 3'},
    {icon:'bi-camera',         key:'Főkamera',            val:'50 MP + 12 MP + 10 MP (Triple)'},
    {icon:'bi-memory',         key:'RAM',                 val:'8 GB'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'128 GB / 256 GB'},
    {icon:'bi-lightning',      key:'Frissítési ráta',     val:'120 Hz adaptív'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'4000 mAh, 25 W töltés'},
    {icon:'bi-shield-check',   key:'Vízállóság',          val:'IP68'},
    {icon:'bi-globe',          key:'Mobilhálózat',        val:'5G'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'167 g'},
  ],
  15: [ // Xiaomi Redmi Note 13 Pro
    {icon:'bi-phone',          key:'Kijelző',             val:'6,67" AMOLED, 2712×1220 px, 120 Hz'},
    {icon:'bi-cpu',            key:'Processzor',          val:'MediaTek Dimensity 7200 Ultra'},
    {icon:'bi-camera',         key:'Főkamera',            val:'200 MP + 8 MP + 2 MP'},
    {icon:'bi-memory',         key:'RAM',                 val:'8 GB / 12 GB'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'256 GB'},
    {icon:'bi-lightning',      key:'Frissítési ráta',     val:'120 Hz'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'5100 mAh, 67 W gyorstöltés'},
    {icon:'bi-shield-check',   key:'Vízállóság',          val:'IP54'},
    {icon:'bi-globe',          key:'Mobilhálózat',        val:'4G LTE'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'187 g'},
  ],
  16: [ // Google Pixel 8
    {icon:'bi-phone',          key:'Kijelző',             val:'6,2" OLED, 2400×1080 px, 120 Hz'},
    {icon:'bi-cpu',            key:'Chip',                val:'Google Tensor G3'},
    {icon:'bi-camera',         key:'Főkamera',            val:'50 MP OIS + 12 MP ultraszéles'},
    {icon:'bi-camera2',        key:'Előlapi kamera',      val:'10,5 MP'},
    {icon:'bi-memory',         key:'RAM',                 val:'8 GB'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'4575 mAh, 27 W töltés'},
    {icon:'bi-shield-check',   key:'Vízállóság',          val:'IP68'},
    {icon:'bi-globe',          key:'Mobilhálózat',        val:'5G'},
    {icon:'bi-android2',       key:'Operációs rendszer',  val:'Android 14 (7 év frissítés)'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'187 g'},
  ],
  17: [ // MacBook Air M2 variant
    {icon:'bi-display',        key:'Kijelző',             val:'13,6" Liquid Retina, 2560×1664 px'},
    {icon:'bi-cpu',            key:'Chip',                val:'Apple M2 (8 mag CPU, 10 mag GPU)'},
    {icon:'bi-memory',         key:'RAM',                 val:'8 GB / 16 GB unified'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'256 GB – 2 TB SSD'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'52,6 Wh, ~18 óra üzemidő'},
    {icon:'bi-plug',           key:'Töltés',              val:'MagSafe 3, 30–70 W'},
    {icon:'bi-thermometer',    key:'Hűtés',               val:'Passzív (ventilátor nélkül)'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 6, Bluetooth 5.3'},
    {icon:'bi-apple',          key:'Operációs rendszer',  val:'macOS Ventura'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'1,24 kg'},
  ],
  18: [ // Dell XPS 13
    {icon:'bi-display',        key:'Kijelző',             val:'13,4" OLED, 2880×1800 px'},
    {icon:'bi-cpu',            key:'Processzor',          val:'Intel Core i7-1355U'},
    {icon:'bi-memory',         key:'RAM',                 val:'16 GB LPDDR5'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'512 GB NVMe SSD'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'54 Wh, ~12 óra üzemidő'},
    {icon:'bi-plug',           key:'Csatlakozók',         val:'2× Thunderbolt 4, microSD'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 6E, Bluetooth 5.3'},
    {icon:'bi-windows',        key:'Operációs rendszer',  val:'Windows 11 Home'},
    {icon:'bi-palette2',       key:'Szín lefedettség',    val:'100% DCI-P3'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'1,17 kg'},
  ],
  19: [ // Lenovo ThinkPad E14
    {icon:'bi-display',        key:'Kijelző',             val:'14" IPS FHD+, 1920×1200 px'},
    {icon:'bi-cpu',            key:'Processzor',          val:'AMD Ryzen 5 7530U'},
    {icon:'bi-memory',         key:'RAM',                 val:'16 GB DDR4'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'512 GB SSD'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'57 Wh, ~11 óra üzemidő'},
    {icon:'bi-plug',           key:'Csatlakozók',         val:'USB-C, 2× USB-A, HDMI 2.0'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 6, Bluetooth 5.1'},
    {icon:'bi-fingerprint',    key:'Biztonság',           val:'Ujjlenyomatolvasó'},
    {icon:'bi-windows',        key:'Operációs rendszer',  val:'Windows 11 Pro'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'1,59 kg'},
  ],
  20: [ // HP Envy 15
    {icon:'bi-display',        key:'Kijelző',             val:'15,6" OLED 4K, 3840×2160 px'},
    {icon:'bi-cpu',            key:'Processzor',          val:'Intel Core i7-13700H'},
    {icon:'bi-memory',         key:'RAM',                 val:'16 GB DDR5'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'1 TB NVMe SSD'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'83 Wh, ~11 óra üzemidő'},
    {icon:'bi-plug',           key:'Töltés',              val:'USB-C 100 W, Thunderbolt 4'},
    {icon:'bi-camera',         key:'Webkamera',           val:'5 MP IR (Windows Hello)'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 6E, Bluetooth 5.3'},
    {icon:'bi-windows',        key:'Operációs rendszer',  val:'Windows 11 Home'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'1,99 kg'},
  ],
  21: [ // Samsung 55" QLED TV
    {icon:'bi-display',        key:'Kijelző',             val:'55" QLED 4K, 3840×2160 px'},
    {icon:'bi-lightning',      key:'Frissítési ráta',     val:'120 Hz'},
    {icon:'bi-brightness-high',key:'HDR',                 val:'HDR10+, HLG'},
    {icon:'bi-soundwave',      key:'Hangrendszer',        val:'40 W, Dolby Digital+'},
    {icon:'bi-controller',     key:'Gaming',              val:'2× HDMI 2.1, ALLM, FreeSync'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 5, Bluetooth 4.2'},
    {icon:'bi-smart-home',     key:'Smart TV',            val:'Tizen OS'},
    {icon:'bi-plug',           key:'Csatlakozók',         val:'4× HDMI, 2× USB, LAN'},
    {icon:'bi-cpu',            key:'Processzor',          val:'Crystal 4K processzor'},
    {icon:'bi-box-seam',       key:'Tömeg (állv. nélkül)',val:'13,8 kg'},
  ],
  22: [ // LG 65" OLED TV
    {icon:'bi-display',        key:'Kijelző',             val:'65" OLED 4K, 3840×2160 px'},
    {icon:'bi-lightning',      key:'Frissítési ráta',     val:'120 Hz'},
    {icon:'bi-brightness-high',key:'HDR',                 val:'Dolby Vision, HDR10, HLG'},
    {icon:'bi-soundwave',      key:'Hangrendszer',        val:'40 W, Dolby Atmos'},
    {icon:'bi-cpu',            key:'Processzor',          val:'α7 Gen6 AI 4K'},
    {icon:'bi-controller',     key:'Gaming',              val:'4× HDMI 2.1, G-Sync, VRR'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 6, Bluetooth 5.0'},
    {icon:'bi-smart-home',     key:'Smart TV',            val:'webOS 23, ThinQ AI'},
    {icon:'bi-plug',           key:'Csatlakozók',         val:'4× HDMI, 3× USB, LAN'},
    {icon:'bi-box-seam',       key:'Tömeg (állv. nélkül)',val:'19,5 kg'},
  ],
  23: [ // Sony WH-1000XM5 (variant)
    {icon:'bi-speaker',        key:'Hangszóró méret',     val:'30 mm'},
    {icon:'bi-soundwave',      key:'Frekvenciatartomány', val:'4 Hz – 40 kHz (LDAC)'},
    {icon:'bi-ear',            key:'Zajszűrés',           val:'Aktív ANC (8 processzor, 12 mikrofon)'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'30 óra ANC-vel, 3 h töltés'},
    {icon:'bi-bluetooth',      key:'Bluetooth',           val:'5.2, Multipoint (2 eszköz)'},
    {icon:'bi-plug',           key:'Töltés',              val:'USB-C, 3 perc → 3 óra'},
    {icon:'bi-mic',            key:'Mikrofon',            val:'8 mikrofon array'},
    {icon:'bi-headphones',     key:'Viselet',             val:'Over-ear, összecsukható'},
    {icon:'bi-phone',          key:'Alkalmazás',          val:'Sony Headphones Connect'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'250 g'},
  ],
  24: [ // Apple AirPods Pro 2 (variant)
    {icon:'bi-ear',            key:'Zajszűrés',           val:'Aktív (Adaptive Transparency)'},
    {icon:'bi-soundwave',      key:'Hang',                val:'Apple H2 chip, Spatial Audio'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'6 h (ANC), +30 h tokkal'},
    {icon:'bi-plug',           key:'Töltő tok',           val:'USB-C + MagSafe + Apple Watch'},
    {icon:'bi-bluetooth',      key:'Bluetooth',           val:'5.3'},
    {icon:'bi-shield-check',   key:'Vízállóság',          val:'IP54'},
    {icon:'bi-hand-index',     key:'Vezérlés',            val:'Érintés + nyomás + csettintés'},
    {icon:'bi-apple',          key:'Kompatibilitás',      val:'iPhone / iPad / Mac'},
    {icon:'bi-geo-alt',        key:'Helymeghatározás',    val:'Precision Finding (U1)'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'5,3 g (fülhallgató)'},
  ],
  25: [ // JBL Charge 5 (variant)
    {icon:'bi-speaker',        key:'Teljesítmény',        val:'40 W RMS'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'7500 mAh, ~20 óra lejátszás'},
    {icon:'bi-plug',           key:'Csatlakozó',          val:'USB-C töltés, USB-A kimenet'},
    {icon:'bi-bluetooth',      key:'Bluetooth',           val:'5.1, 10 m hatótáv'},
    {icon:'bi-shield-check',   key:'Vízállóság',          val:'IP67 (vízálló + porálló)'},
    {icon:'bi-soundwave',      key:'Hangrendszer',        val:'2 fullrange + 2 tweeter'},
    {icon:'bi-link-45deg',     key:'PartyBoost',          val:'Több hangszóró összekapcsolása'},
    {icon:'bi-mic',            key:'Speakerphone',        val:'Beépített mikrofon'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'960 g'},
    {icon:'bi-palette2',       key:'Szín',                val:'Fekete / Kék / Szürke / Piros'},
  ],
  26: [ // Logitech MX Master 3S
    {icon:'bi-mouse2',         key:'Érzékelő',            val:'Darkfield 8000 DPI'},
    {icon:'bi-lightning',      key:'Gördítőkerék',        val:'MagSpeed elektromágneses'},
    {icon:'bi-bluetooth',      key:'Csatlakozás',         val:'Bluetooth + Logi Bolt USB'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'500 mAh, ~70 nap üzemidő'},
    {icon:'bi-plug',           key:'Töltés',              val:'USB-C, 1 perc → 3 óra'},
    {icon:'bi-laptop',         key:'Multi-device',        val:'3 eszköz, Easy-Switch gomb'},
    {icon:'bi-hand-index',     key:'Gombok',              val:'7 programozható gomb'},
    {icon:'bi-wifi',           key:'Hatótáv',             val:'10 m'},
    {icon:'bi-app',            key:'Szoftver',            val:'Logi Options+'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'141 g'},
  ],
  27: [ // Keychron K8 Pro TKL
    {icon:'bi-keyboard',       key:'Elrendezés',          val:'TKL (87 billentyű)'},
    {icon:'bi-toggle-on',      key:'Kapcsolók',           val:'Gateron G Pro Red / Brown / Blue'},
    {icon:'bi-bluetooth',      key:'Csatlakozás',         val:'Bluetooth 5.1 + USB-C'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'4000 mAh'},
    {icon:'bi-lightbulb',      key:'Háttérvilágítás',     val:'Per-key RGB'},
    {icon:'bi-laptop',         key:'Kompatibilitás',      val:'macOS / Windows / Android'},
    {icon:'bi-wrench',         key:'Hot-swap',            val:'Igen (5-pin)'},
    {icon:'bi-layout-sidebar', key:'Keret',               val:'Alumínium felső keret'},
    {icon:'bi-laptop',         key:'Multi-device',        val:'3 eszköz Bluetooth'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'860 g'},
  ],
  28: [ // ASUS TUF Gaming Monitor
    {icon:'bi-display',        key:'Kijelző',             val:'27" IPS, 2560×1440 px (QHD)'},
    {icon:'bi-lightning',      key:'Frissítési ráta',     val:'170 Hz (OC)'},
    {icon:'bi-hourglass',      key:'Válaszidő',           val:'1 ms (MPRT)'},
    {icon:'bi-brightness-high',key:'Fényerő',             val:'400 nit, HDR400'},
    {icon:'bi-palette2',       key:'Szín lefedettség',    val:'130% sRGB, 95% DCI-P3'},
    {icon:'bi-plug',           key:'Csatlakozók',         val:'2× HDMI 2.0, 2× DisplayPort 1.2'},
    {icon:'bi-controller',     key:'Szinkron',            val:'G-Sync Compatible + FreeSync Premium'},
    {icon:'bi-usb-plug',       key:'USB Hub',             val:'USB-B bemenet, 2× USB-A 3.0'},
    {icon:'bi-aspect-ratio',   key:'Dőlésszög',           val:'-5° / +20°, VESA 100×100'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'6,2 kg'},
  ],
  29: [ // Samsung Odyssey G5
    {icon:'bi-display',        key:'Kijelző',             val:'27" VA Curved 1000R, 2560×1440 px'},
    {icon:'bi-lightning',      key:'Frissítési ráta',     val:'165 Hz'},
    {icon:'bi-hourglass',      key:'Válaszidő',           val:'1 ms (MPRT)'},
    {icon:'bi-brightness-high',key:'Fényerő',             val:'300 nit'},
    {icon:'bi-shield-check',   key:'HDR',                 val:'HDR10'},
    {icon:'bi-plug',           key:'Csatlakozók',         val:'1× HDMI 2.0, 1× DisplayPort 1.2'},
    {icon:'bi-controller',     key:'AMD FreeSync',        val:'FreeSync Premium (48–165 Hz)'},
    {icon:'bi-aspect-ratio',   key:'Görbület',            val:'1000R'},
    {icon:'bi-arrows-angle-expand', key:'Dőlésszög',     val:'-2° / +20°'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'5,9 kg'},
  ],
  30: [ // Canon EOS R10
    {icon:'bi-camera',         key:'Szenzor',             val:'24,2 MP APS-C CMOS'},
    {icon:'bi-cpu',            key:'Processzor',          val:'DIGIC X'},
    {icon:'bi-aspect-ratio',   key:'Sorozatkép',          val:'23 kép/mp (elektr. zár)'},
    {icon:'bi-film',           key:'Videó',               val:'4K 30fps / FHD 120fps'},
    {icon:'bi-eye',            key:'Autófókusz',          val:'Dual Pixel CMOS AF II, Eye AF'},
    {icon:'bi-display',        key:'Kijelző',             val:'3" érintőképernyő, forgatható'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'LP-E17, ~260 kép/töltés'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 5 GHz, Bluetooth 4.1'},
    {icon:'bi-usb-c',          key:'Csatlakozó',          val:'USB-C, micro HDMI, 3,5 mm'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'429 g (váz)'},
  ],
  31: [ // Sony Alpha A6400
    {icon:'bi-camera',         key:'Szenzor',             val:'24,2 MP APS-C Exmor R BSI CMOS'},
    {icon:'bi-cpu',            key:'Processzor',          val:'BIONZ X'},
    {icon:'bi-eye',            key:'Autófókusz',          val:'Real-time Eye AF, 0,02 mp'},
    {icon:'bi-aspect-ratio',   key:'Sorozatkép',          val:'11 kép/mp'},
    {icon:'bi-film',           key:'Videó',               val:'4K 30fps, FHD 120fps, HLG'},
    {icon:'bi-display',        key:'Kijelző',             val:'3" flip érintőkijelző, 921k pont'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'NP-FW50, ~400 kép/töltés'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi, NFC, Bluetooth 4.1'},
    {icon:'bi-camera2',        key:'Képformátum',         val:'RAW + JPEG, XAVC S videó'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'403 g (váz)'},
  ],
  32: [ // GoPro Hero 12 Black
    {icon:'bi-film',           key:'Videó',               val:'5,3K 60fps / 4K 120fps'},
    {icon:'bi-camera',         key:'Fotó',                val:'27 MP fénykép'},
    {icon:'bi-shield-check',   key:'Vízállóság',          val:'10 m (tok nélkül)'},
    {icon:'bi-soundwave',      key:'Hang',                val:'3-mikrofon, szélzaj-szűrés'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'1720 mAh, ~85 perc 4K 60fps'},
    {icon:'bi-bluetooth',      key:'Csatlakozás',         val:'Bluetooth + WiFi (GoPro App)'},
    {icon:'bi-display',        key:'Kijelző',             val:'1,4" hátlap + 2,27" előlap érintő'},
    {icon:'bi-brightness-high',key:'HDR',                 val:'Auto HDR videó'},
    {icon:'bi-geo-alt',        key:'GPS',                 val:'Beépített'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'154 g'},
  ],
  33: [ // Anker PowerCore 20000
    {icon:'bi-battery-full',   key:'Kapacitás',           val:'20 000 mAh'},
    {icon:'bi-plug',           key:'USB-C PD kimenet',    val:'65 W (laptophoz is)'},
    {icon:'bi-usb-plug',       key:'USB-A kimenet',       val:'2× USB-A, 12 W'},
    {icon:'bi-lightning',      key:'Egyidejű töltés',     val:'3 eszköz egyszerre'},
    {icon:'bi-phone',          key:'Telefon feltöltés',   val:'~4× iPhone 15'},
    {icon:'bi-laptop',         key:'Laptop töltés',       val:'MacBook Air ~1×'},
    {icon:'bi-battery-half',   key:'Saját töltés',        val:'USB-C 65 W bemeneten ~3 h'},
    {icon:'bi-shield-check',   key:'Biztonság',           val:'MultiProtect (túltöltés-védelem)'},
    {icon:'bi-palette2',       key:'LED kijelző',         val:'Töltöttségi szint kijelzése'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'440 g'},
  ],
  34: [ // Samsung 990 Pro SSD
    {icon:'bi-device-hdd',     key:'Kapacitás',           val:'1 TB (2 TB is elérhető)'},
    {icon:'bi-speedometer2',   key:'Olvasási sebesség',   val:'7450 MB/s (PCIe 4.0 NVMe)'},
    {icon:'bi-speedometer',    key:'Írási sebesség',      val:'6900 MB/s'},
    {icon:'bi-cpu',            key:'Csatlakozó',          val:'M.2 2280, PCIe 4.0 × 4'},
    {icon:'bi-shield-check',   key:'Titkosítás',          val:'AES 256-bit (Samsung)'},
    {icon:'bi-thermometer',    key:'Hőkezelés',           val:'Dynamic Thermal Guard'},
    {icon:'bi-battery-half',   key:'MTBF',                val:'1 500 000 óra'},
    {icon:'bi-app',            key:'Szoftver',            val:'Samsung Magician'},
    {icon:'bi-graph-up',       key:'TBW',                 val:'600 TBW'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'9,8 g'},
  ],
  35: [ // TP-Link Archer AX55
    {icon:'bi-wifi',           key:'WiFi szabvány',       val:'WiFi 6 (802.11ax), AX3000'},
    {icon:'bi-speedometer2',   key:'Max sebesség',        val:'2402 Mbps (5 GHz) + 574 Mbps (2,4 GHz)'},
    {icon:'bi-broadcast-pin',  key:'Antenna',             val:'4× külső antenna'},
    {icon:'bi-cpu',            key:'Processzor',          val:'1,5 GHz dual-core'},
    {icon:'bi-hdd-network',    key:'LAN portok',          val:'4× Gigabit LAN + 1× Gigabit WAN'},
    {icon:'bi-plug',           key:'USB',                 val:'1× USB 3.0 (NAS / nyomtató)'},
    {icon:'bi-shield-check',   key:'Biztonság',           val:'WPA3, HomeCare, OneMesh'},
    {icon:'bi-people',         key:'Kapacitás',           val:'OFDMA + MU-MIMO, 128 eszköz'},
    {icon:'bi-arrow-repeat',   key:'Beamforming',         val:'Adaptív beamforming'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'305 g'},
  ],
  36: [ // Apple Watch Series 9
    {icon:'bi-smartwatch',     key:'Kijelző',             val:'1,9" Always-On Retina (LTPO OLED)'},
    {icon:'bi-cpu',            key:'Chip',                val:'Apple S9 SiP'},
    {icon:'bi-heart-pulse',    key:'Egészség',            val:'EKG, vér O₂, bőrhőmérséklet'},
    {icon:'bi-geo-alt',        key:'Navigáció',           val:'GPS + GLONASS + Galileo + BeiDou'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'~18 h (Low Power Mode: 36 h)'},
    {icon:'bi-shield-check',   key:'Vízállóság',          val:'WR50 (50 m)'},
    {icon:'bi-bluetooth',      key:'Csatlakozás',         val:'Bluetooth 5.3, WiFi 802.11n'},
    {icon:'bi-hand-index',     key:'Gesztus',             val:'Double Tap (mutatóujj + hüvelyk)'},
    {icon:'bi-apple',          key:'Kompatibilitás',      val:'iPhone XS+, iOS 17+'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'39 g (alumínium)'},
  ],
  37: [ // Amazon Echo Dot 5
    {icon:'bi-speaker',        key:'Hangszóró',           val:'1,73" front-firing'},
    {icon:'bi-soundwave',      key:'Hang',                val:'Mélybőgő, tisztább közepes sáv'},
    {icon:'bi-mic',            key:'Mikrofon',            val:'4 mikrofon, Wake Word érzékelés'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 6, 2,4 + 5 GHz'},
    {icon:'bi-bluetooth',      key:'Bluetooth',           val:'5.0'},
    {icon:'bi-smart-home',     key:'Okosotthon',          val:'Alexa, Matter, Zigbee Hub'},
    {icon:'bi-clock',          key:'LED kijelző',         val:'Óra és értesítések'},
    {icon:'bi-plug',           key:'Tápellátás',          val:'Hálózati adapter (30 W)'},
    {icon:'bi-thermometer',    key:'Szenzor',             val:'Beépített hőmérséklet szenzor'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'304 g'},
  ],
  38: [ // iPhone 14
    {icon:'bi-phone',          key:'Kijelző',             val:'6,1" Super Retina XDR OLED, 2532×1170 px'},
    {icon:'bi-cpu',            key:'Chip',                val:'Apple A15 Bionic'},
    {icon:'bi-camera',         key:'Főkamera',            val:'12 MP + 12 MP (Dual, ƒ/1.5)'},
    {icon:'bi-lightning',      key:'Frissítési ráta',     val:'60 Hz'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'3279 mAh, MagSafe 15 W'},
    {icon:'bi-usb-c',          key:'Csatlakozó',          val:'Lightning'},
    {icon:'bi-globe',          key:'Mobilhálózat',        val:'5G'},
    {icon:'bi-shield-check',   key:'Vízállóság',          val:'IP68'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'128 GB / 256 GB / 512 GB'},
    {icon:'bi-apple',          key:'Operációs rendszer',  val:'iOS 16 → iOS 17+'},
  ],
  39: [ // Samsung Galaxy S23
    {icon:'bi-phone',          key:'Kijelző',             val:'6,1" Dynamic AMOLED 2X, 2340×1080 px'},
    {icon:'bi-cpu',            key:'Processzor',          val:'Snapdragon 8 Gen 2'},
    {icon:'bi-camera',         key:'Főkamera',            val:'50 MP + 12 MP + 10 MP'},
    {icon:'bi-memory',         key:'RAM',                 val:'8 GB'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'128 GB / 256 GB'},
    {icon:'bi-lightning',      key:'Frissítési ráta',     val:'120 Hz adaptív'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'3900 mAh, 25 W töltés'},
    {icon:'bi-shield-check',   key:'Vízállóság',          val:'IP68'},
    {icon:'bi-globe',          key:'Mobilhálózat',        val:'5G'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'168 g'},
  ],
  40: [ // Dell Inspiron 15
    {icon:'bi-display',        key:'Kijelző',             val:'15,6" FHD IPS, 1920×1080 px'},
    {icon:'bi-cpu',            key:'Processzor',          val:'Intel Core i5-1335U'},
    {icon:'bi-memory',         key:'RAM',                 val:'8 GB DDR4'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'512 GB NVMe SSD'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'54 Wh, ~8 óra üzemidő'},
    {icon:'bi-plug',           key:'Csatlakozók',         val:'USB-C, 2× USB-A, HDMI, SD'},
    {icon:'bi-camera',         key:'Webkamera',           val:'720p HD'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 6, Bluetooth 5.2'},
    {icon:'bi-windows',        key:'Operációs rendszer',  val:'Windows 11 Home'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'1,83 kg'},
  ],
  41: [ // HP Pavilion 14
    {icon:'bi-display',        key:'Kijelző',             val:'14" FHD IPS micro-edge, 1920×1080 px'},
    {icon:'bi-cpu',            key:'Processzor',          val:'AMD Ryzen 5 7530U'},
    {icon:'bi-memory',         key:'RAM',                 val:'8 GB DDR4'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'512 GB NVMe SSD'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'43 Wh, ~9 óra üzemidő'},
    {icon:'bi-plug',           key:'Csatlakozók',         val:'USB-C, USB-A 3.1, HDMI 2.0'},
    {icon:'bi-camera',         key:'Webkamera',           val:'HP True Vision 720p IR'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 6, Bluetooth 5.2'},
    {icon:'bi-windows',        key:'Operációs rendszer',  val:'Windows 11 Home'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'1,55 kg'},
  ],
};

function extractSpecs(p){
  // Use static specs lookup first (MediaMarkt-style, 10 adat/termék)
  if(p.id && PRODUCT_SPECS[p.id]){
    return PRODUCT_SPECS[p.id];
  }
  // Fallback: parse from description text
  const name=(p.name||''), desc=(p.description||''), tx=name+' '+desc;
  const specs=[];
  const add=(icon,key,val)=>specs.push({icon,key,val});
  const m=s=>tx.match(s);
  let r;
  if(r=m(/(\d+)\s*GB\s*RAM/i))                add('bi-memory','RAM',r[1]+' GB');
  if(r=m(/(\d+)\s*(GB|TB)\s*(SSD|NVMe|tárhely)/i)) add('bi-device-hdd','Tárhely',r[1]+' '+r[2].toUpperCase());
  if(r=m(/(\d+\.?\d*)"[^,\s]*(kijelző|Liquid|Retina|OLED|IPS|VA|FHD|QHD)?/i)||m(/(\d+\.?\d*)"\s/i)) add('bi-display','Képernyő',r[1]+'"');
  if(r=m(/(\d{3,4})x(\d{3,4})/))              add('bi-aspect-ratio','Felbontás',r[1]+'×'+r[2]);
  else if(r=m(/(4K|8K|FHD|QHD|UHD|UWQHD|2\.8K|2\.5K|2K|1080p|1440p|2160p)/i)) add('bi-aspect-ratio','Felbontás',r[1].toUpperCase());
  if(r=m(/(\d+)\s*Hz/i))                      add('bi-lightning','Frissítési ráta',r[1]+' Hz');
  if(r=m(/(\d+)\s*MP/i))                      add('bi-camera','Kamera',r[1]+' MP');
  if(r=m(/(\d+)\s*mAh/i))                     add('bi-battery-half','Akkumulátor',r[1]+' mAh');
  if(p.weight&&Number(p.weight)>0){const w=Number(p.weight);add('bi-box-seam','Tömeg',w>=1?w.toFixed(2)+' kg':Math.round(w*1000)+' g');}
  return specs;
}

let currentProduct=null,imgs=[];

function renderGallery(p){
  imgs=getExtraPhotos(p);
  const main=qs('#mainImg');
  if(!main)return;
  main.src=imgs[0];main.alt=p.name;
  // Single image only – no thumbnails
}

function renderSpecs(p){
  const specs=extractSpecs(p);
  const el=qs('#pdSpecs');if(!el)return;
  if(!specs.length){el.innerHTML='<div style="padding:12px;color:var(--muted-2);font-size:13px;">Nincsenek elérhető műszaki adatok.</div>';return;}
  el.innerHTML=specs.map((s,i)=>`<div class="rp-specs-row" style="animation:rp-fade-up .4s ${i*40}ms cubic-bezier(0.23,1,0.32,1) both;"><span class="rp-specs-icon"><i class="bi ${s.icon}"></i></span><span class="rp-specs-key">${esc(s.key)}</span><span class="rp-specs-val">${esc(s.val)}</span></div>`).join('');
}

function stockPill(stock){
  if(stock===null||stock===undefined)return`<span class="rp-stock-pill rp-stock--ok"><i class="bi bi-check-circle-fill"></i> Készleten</span>`;
  const n=Number(stock);
  if(n<=0)return`<span class="rp-stock-pill rp-stock--out"><i class="bi bi-x-circle-fill"></i> Elfogyott</span>`;
  if(n<=5)return`<span class="rp-stock-pill rp-stock--warn"><i class="bi bi-exclamation-circle-fill"></i> Utolsó darabok (${n} db)</span>`;
  return`<span class="rp-stock-pill rp-stock--ok"><i class="bi bi-check-circle-fill"></i> Készleten</span>`;
}

function setupTabs(){
  document.querySelectorAll('.rp-tab-pill').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const target=btn.dataset.tab;
      document.querySelectorAll('.rp-tab-pill').forEach(b=>b.classList.toggle('active',b.dataset.tab===target));
      document.querySelectorAll('.rp-tab-panel-content').forEach(p=>p.classList.toggle('active',p.dataset.tab===target));
    });
  });
}

function addToCart(p){
  if(!p)return;
  const cart=JSON.parse(localStorage.getItem('rp_cart')||'[]');
  const ex=cart.find(c=>c.id===p.id);
  if(ex)ex.qty=(ex.qty||1)+1;else cart.push({id:p.id,qty:1,name:p.name,price:pickPrice(p),image:imgs[0]||'',category:p.category_name||p.category||''});
  localStorage.setItem('rp_cart',JSON.stringify(cart));
  const badge=document.getElementById('cartBadge');
  if(badge){const tot=cart.reduce((s,c)=>s+(c.qty||1),0);badge.textContent=tot;badge.style.display=tot>0?'flex':'none';}
  window.rpToast?.(p.name,t('add_to_cart','Kosárba helyezve')+' ✓','success');
  const btn=qs('#pdAddBtn');
  if(btn){btn.innerHTML='<i class="bi bi-check-circle rp-icon"></i> Hozzáadva';setTimeout(()=>{btn.innerHTML='<i class="bi bi-cart-plus rp-icon"></i> Kosárba';},2000);}
}

function setupWish(p){
  const btn=qs('#pdWishBtn');if(!btn)return;
  const ws=new Set(JSON.parse(localStorage.getItem('rp_wishlist')||'[]'));
  const icon=btn.querySelector('i');
  if(ws.has(p.id)){icon.className='bi bi-heart-fill rp-icon';btn.style.color='#ef4444';}
  btn.addEventListener('click',()=>{
    const ws2=new Set(JSON.parse(localStorage.getItem('rp_wishlist')||'[]'));
    if(ws2.has(p.id)){ws2.delete(p.id);icon.className='bi bi-heart rp-icon';btn.style.color='';window.rpToast?.('','Eltávolítva a kedvencekből','info');}
    else{ws2.add(p.id);icon.className='bi bi-heart-fill rp-icon';btn.style.color='#ef4444';window.rpToast?.('♥ Kedvencekhez adva','','success');}
    localStorage.setItem('rp_wishlist',JSON.stringify([...ws2]));
  });
}

// ── DEMO ADATOK az ultra_real_products.sql alapján (P001–P012) ──
// Teljes, valódi műszaki leírásokkal
// ── TELJES TERMÉK LISTA – db_schema.sql + products.sql alapján (41 db) ──
// ── TELJES TERMÉK LISTA – 41 db, hosszú HU/EN/DE leírásokkal ──
function getDemoProducts(){return[
  {id:1,sku:'P001',name:'iPhone 15 Pro',
   description:'Az iPhone 15 Pro nem csupán egy telefon – ez az az eszköz, ami miatt az ember elgondolkodik, hogy valaha is kellett-e más. A légipari titánium keret miatt szinte hihetetlenül könnyű a méretéhez képest, mégis tart egy életen át. A 48 MP-es főszenzor gyenge fényben, portréknál és tájakban egyaránt természetes, részletgazdag képeket ad, a 3× optikai zoom diszkrét és gyors. ProRAW és ProRes videófelvétellel profi szinten szerkeszthet az anyagokon. Az Action gomb egy kattintással bármit előhív, az A17 Pro chip pedig gyorsabb és hűvösebb marad játék vagy videószerkesztés közben is. iOS frissítések évekig garantálják, hogy a telefon naprakész és biztonságos maradjon.',
   image_url:'https://image.alza.cz/products/HRI045b1/HRI045b1.jpg?width=500&height=500',
   unit_price:489600,stock:21,weight:0.187,category_name:'Mobil',avg_rating:4.8,review_count:124},

  {id:2,sku:'P002',name:'Samsung Galaxy S24 Ultra',
   description:'A Galaxy S24 Ultra az a telefon, amit ha egyszer kézbe vesz, nehéz letenni. A beépített S Pen minden más kiegészítőt feleslegessé tesz – vázlatrajzolástól valós idejű fordításig mindent kezel. A 200 MP-es főszenzor annyira részletes képeket ad, hogy utólag is szabadon vágható, közelíthető az anyag. A Galaxy AI funkciók – képszerkesztés, Chat Assist, körlevélfordítás – napról napra megkönnyítik a munkát. A Snapdragon 8 Gen 3 chip és az 5000 mAh-s akku 45 W-os gyorstöltéssel gondoskodik arról, hogy soha ne hagyja cserben.',
   image_url:'https://p1.akcdn.net/full/1240638079.samsung-galaxy-s24-ultra-5g-1tb-12gb-ram-dual-sm-s928b.jpg',
   unit_price:393990,stock:22,weight:0.232,category_name:'Mobil',avg_rating:4.8,review_count:124},

  {id:3,sku:'P003',name:'ASUS ROG Strix G16 (2024)',
   description:'Ha gaming laptopot keres, de nem akar kompromisszumot kötni a teljesítménnyel, az ROG Strix G16 az egyik legjobb választás ezen az áron. Az RTX 4060 videokártya gond nélkül kezeli a modern AAA játékokat, a 165 Hz-es QHD kijelző pedig valóban érezhetően simább képet ad, mint az átlagos kijelzők. Az Intel Core i7 és 16 GB DDR5 RAM nem csak játékban, de videószerkesztésben és renderelésben is kiemelkedő. Az MUX Switch direkt GPU módban maximális teljesítményt biztosít, a háromzónás RGB háttérvilágítás pedig szabadon személyre szabható.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/1_jm1148rk.png?v=3',
   unit_price:599990,stock:4,weight:2.500,category_name:'Gaming',avg_rating:4.7,review_count:98},

  {id:4,sku:'P004',name:'MacBook Air M2 (2023)',
   description:'A MacBook Air M2 az a laptop, amit szinte mindenki szeretne, aki Macet akar. Ventilátor nincs benne, tehát teljesen csendben működik – mégis meglepően gyors, és felülmúlja a korábbi Intel alapú MacBookokat. A Liquid Retina kijelző éles és pontos, a MagSafe 3 töltő gyors és biztonságos, az akku akár 18 óráig bírja egy töltéssel. Csupán 1,24 kg és 11 mm vékony – mindennapi munkára, kreatív feladatokra és tanulásra egyaránt kiváló választás.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/s1_0gljqn0o.jpeg?v=3',
   unit_price:369990,stock:24,weight:1.240,category_name:'Laptop',avg_rating:4.6,review_count:67},

  {id:5,sku:'P005',name:'Dell XPS 13 Plus (2023)',
   description:'Az XPS 13 Plus az a laptop, amit a dizájnja miatt is megszeret az ember, de a teljesítménye sem okoz csalódást. A szinte keret nélküli OLED panel vibrálóan élénk és pontos képet ad, a billentyűzetbe olvadt kapacitív érintősáv haptic visszajelzéssel egészen más kategóriát képvisel. Az Intel Core i7 és 16 GB LPDDR5 RAM a legtöbb feladatot könnyedén elvégzi. Mindössze 1,24 kg, két Thunderbolt 4 port és kb. 10 óra üzemidő – utazáshoz és irodai munkához egyaránt tökéletes.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/1dell_140rqx64.png?v=3',
   unit_price:549990,stock:25,weight:1.240,category_name:'Laptop',avg_rating:4.9,review_count:203},

  {id:6,sku:'P006',name:'HP Pavilion 15-eh3 (2023)',
   description:'Ha egyszerűen csak egy jól működő, megbízható laptopot keres mindennapi használatra, a HP Pavilion 15 pontosan erre való. Nagy a kijelzője, kényelmes a billentyűzete, az AMD Ryzen 7 processzor és 16 GB RAM pedig gyors és energiahatékony a napi feladatokhoz. USB-C, három USB-A, HDMI és kártyaolvasó is megtalálható rajta, Windows 11 Home előtelepítve. Böngészés, iroda, videóhívás – minden gond nélkül megy, nehezebb feladatokhoz is megállja a helyét.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/1_0bxnxfwe.png?v=3',
   unit_price:249990,stock:26,weight:1.750,category_name:'Laptop',avg_rating:4.5,review_count:55},

  {id:7,sku:'P007',name:'Lenovo ThinkPad X1 Carbon Gen 11',
   description:'A ThinkPad X1 Carbon az a laptop, amire az irodai szakemberek évek óta esküsznek – legendás megbízhatóság, kompromisszummentesen. Alig 1,12 kg, és katonai szabványoknak megfelelő védelemmel érkezik extrém hideg, meleg, por és ütés ellen egyaránt. A 14 colos OLED kijelző éles és szemkímélő, a billentyűzet a legjobb laptopbillentyűzetek közé tartozik. Az Intel Core i7 vPro és a 57 Wh-s akku kb. 15 óra valódi üzemidőt biztosít, ujjlenyomatolvasóval és IR kamerával kiegészítve.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/1_9bm45yxi.jpg?v=3',
   unit_price:649990,stock:3,weight:1.120,category_name:'Laptop',avg_rating:4.7,review_count:89},

  {id:8,sku:'P008',name:'Sony WH-1000XM5',
   description:'Ha sokat utazik vagy zajos helyen dolgozik, a WH-1000XM5 az, amit keresett. A zajszűrése annyira hatékony, hogy repülőn is úgy érzi magát, mintha egy hangstúdióban ülne. A memóriahab párnák puhák és szellőzők, órákon át kényelmes a viselése. Az LDAC kodek Hi-Res minőségű hangot biztosít, a Multipoint csatlakozás pedig egyszerre két eszközzel párosítható. Mindössze 3 perc töltéssel 3 óra extra üzemidőt kap, teljes töltéssel 30 óra ANC-vel.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/111_wx83ssf0.jpg?v=4',
   unit_price:89990,stock:28,weight:0.250,category_name:'Fejhallgató',avg_rating:4.8,review_count:156},

  {id:9,sku:'P009',name:'Apple AirPods Pro 2. gen',
   description:'Az AirPods Pro 2 az a fülhallgató, amit egyszer feltesz, és nem akar levenni. Az Adaptív Transparencia mód valós időben szűri a zajokat, mégis átengedi a fontos hangokat. A Spatial Audio funkció a zenét és a filmeket fizikailag körülötte helyezi el – élménye teljesen más, mint hagyományos fülhallgatónál. USB-C töltőtok, IP54 védettség, 6 óra önálló üzemidő ANC-vel, a tokkal együtt 30+ óra. Ha iPhone-ja van, ez a természetes választás.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/1_rcr2ctja.jpg?v=3',
   unit_price:99990,stock:29,weight:0.061,category_name:'Fejhallgató',avg_rating:4.8,review_count:312},

  {id:10,sku:'P010',name:'JBL Charge 5',
   description:'A JBL Charge 5 az a bluetooth hangszóró, ami mindenhova elkíséri és sosem hagyja cserben. IP67 védettséggel nem kell félni az esőtől vagy a strandtól, a 7500 mAh belső akku 20 óra zenét biztosít egyetlen töltéssel. Közben a telefont is töltheti az USB-A kimeneten. A JBL Pro Sound basszusrendszere mélyen tömör, részletgazdag hangot ad szabadban is. PartyBoost funkcióval több JBL hangszóró összeköthető egyszerre.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/6_rru9cyfo.png?v=3',
   unit_price:44990,stock:30,weight:0.960,category_name:'Hangszóró',avg_rating:4.7,review_count:445},

  {id:12,sku:'P012',name:'LG OLED C3 65"',
   description:'Az LG OLED C3 az egyik legjobb televízió, amit pénzért megvásárolhat. Az OLED panel minden pixele önmaga állítja elő és oltja el a fényt – tökéletes fekete, végtelen kontraszt, milliárd szín. Az α9 Gen6 AI processzor valós időben javítja a kép- és hangminőséget a tartalomtól függően. Négy HDMI 2.1 port biztosítja a PS5, Xbox és PC csatlakoztatását 4K/120Hz-en, G-Sync és FreeSync Premium Pro támogatással. Filmekhez, sorozatokhoz és komoly játékosoknak egyaránt az első választás.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/1_qa5u5m70.png?v=4',
   unit_price:699990,stock:5,weight:24.700,category_name:'TV & Monitor',avg_rating:4.5,review_count:134},

  {id:13,sku:'E001',name:'iPhone 15',
   description:'Az iPhone 15 az első iPhone USB-C csatlakozóval – végre egyetlen töltő minden eszközhöz. A Dynamic Island az értesítéseket vizuálisan integrálja a kijelzőbe, a 48 MP-es főkamera és a Photonic Engine pedig minden fényviszonyban természetes képeket ad. Az A16 Bionic chip gyors és hatékony, az akku egész napra elegendő. MagSafe-kompatibilis, iOS frissítések évekig, mindössze 171 g – kényelmes egykézi használatra optimalizálva.',
   image_url:'https://image.alza.cz/products/HRI045b1/HRI045b1.jpg?width=500&height=500',
   unit_price:279990,stock:40,weight:0.171,category_name:'Mobil',avg_rating:4.8,review_count:219},

  {id:14,sku:'E002',name:'Samsung Galaxy S24',
   description:'A Galaxy S24 a Samsung 2024-es kompakt csúcstelefonja, ahol semmiből sem engedtek. A Snapdragon 8 Gen 3 processzor és a beépített Galaxy AI – valós idejű fordítás, AI alapú képszerkesztés – napról napra megkönnyíti az életet. Az 50 MP-es háromkamerás rendszer éjszaka is megbízható, az optikai zoom diszkrét és pontos. 4000 mAh-s akku 25 W-os töltéssel, IP68 vízállóság, mindössze 167 g – kis méretben maximális teljesítmény.',
   image_url:'https://s13emagst.akamaized.net/products/64817/64816439/images/res_fdecd9733172144ab6b418e28f699e1c.jpg?width=720&height=720&hash=91C5F7015A569F5237D415DE60CD1451',
   unit_price:249990,stock:35,weight:0.167,category_name:'Mobil',avg_rating:4.5,review_count:50},

  {id:15,sku:'E003',name:'Xiaomi Redmi Note 13 Pro',
   description:'A Redmi Note 13 Pro az ár-érték kategória egyik legjobb választása. A 200 MP-es szenzor olyan részletes képeket ad, amilyeneket korábban csak csúcstelefonoktól kapott az ember. A 120 Hz-es AMOLED kijelző éles, élénk és folyékony, a 67 W-os gyorstöltés pedig 40 perc alatt teljesen feltölti az 5100 mAh-s akkumulátort. A MediaTek Dimensity 7200 Ultra processzor gyors és energiahatékony, 256 GB belső tárhely bőségesen elegendő.',
   image_url:'https://www.bestbyte.hu/Xiaomi_Redmi_Note_13_Pro_667_LTE_8256GB_DualSIM_fekete_okostelefon-i40357342.webp',
   unit_price:69990,stock:60,weight:0.187,category_name:'Mobil',avg_rating:4.5,review_count:50},

  {id:16,sku:'E004',name:'Google Pixel 8',
   description:'A Pixel 8 a legtisztább Android élményt adja – 7 éves frissítési garancia, és Google AI funkciók, amiket más márkák még nem kínálnak. A Magic Eraser eltünteti a nem kívánt tárgyakat a képről, a Best Take mindenkit a legjobb arckifejezéssel mutat a csoportképen. A Tensor G3 chip az összes AI feladatot a telefonon hajtja végre, internet nélkül, privát módon. 4575 mAh akku, IP68 vízállóság és hat éves biztonsági frissítési garancia.',
   image_url:'https://p1.akcdn.net/full/1201801729.google-pixel-8-5g-128gb-8gb-ram-dual.jpg',
   unit_price:219990,stock:25,weight:0.187,category_name:'Mobil',avg_rating:4.5,review_count:50},

  {id:17,sku:'E005',name:'MacBook Air M2',
   description:'A MacBook Air M2 a legjobb mindennapi laptop azoknak, akik Macet akarnak. Teljesen csendes, ventilátor nélküli működéssel felülmúlja a korábbi Intel alapú MacBookokat. A Liquid Retina kijelző gyönyörű, a MagSafe 3 töltő gyors és biztonságos, az akku akár 18 óráig bírja egy töltéssel. 1,24 kg, mindössze 11 mm vékony, két Thunderbolt 4 porttal – mindennapi munkára és kreatív feladatokra egyaránt kiváló.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/s1_0gljqn0o.jpeg?v=3',
   unit_price:369990,stock:15,weight:1.240,category_name:'Laptop',avg_rating:4.5,review_count:50},

  {id:18,sku:'E006',name:'Dell XPS 13',
   description:'Az XPS 13 a Dell prémium ultrabookja szinte keret nélküli OLED kijelzővel és könnyű alumínium házzal. Az Intel Core i7 és 16 GB RAM minden feladatot kezel, az OLED kijelző pontos és élénk képet ad, az 512 GB NVMe SSD villámgyors hozzáférést biztosít. Két Thunderbolt 4 port, kb. 12 óra üzemidő, mindössze 1,17 kg – utazáshoz és irodai munkához egyaránt tökéletes.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/1dell_140rqx64.png?v=3',
   unit_price:499990,stock:12,weight:1.200,category_name:'Laptop',avg_rating:4.5,review_count:50},

  {id:19,sku:'E007',name:'Lenovo ThinkPad E14 Gen 5',
   description:'A ThinkPad E14 a megbízható irodai laptop, amit Lenovo évtizedek óta tökéletesít. Az AMD Ryzen 7 processzor és 16 GB RAM a legtöbb irodai feladatot könnyedén kezeli, a kényelmes billentyűzet és az ujjlenyomatolvasó napi szinten megtérül. A 14 colos IPS kijelző csökkentett kék fénnyel védi a szemét hosszú munkamenetek során. USB-C, USB-A, HDMI és SD kártyaolvasó egyaránt megtalálható – megbízható, könnyen karbantartható választás.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/1_9bm45yxi.jpg?v=3',
   unit_price:299990,stock:18,weight:1.690,category_name:'Laptop',avg_rating:4.5,review_count:50},

  {id:20,sku:'E008',name:'HP Envy 15',
   description:'A HP Envy 15 az a laptop, ahol a teljesítmény és a prémium dizájn valóban találkozik. Az Intel Core i7 és a dedikált NVIDIA GeForce MX450 grafika lehetővé teszi a képszerkesztést és a könnyű videómontázst is. A 15,6 colos OLED kijelző élénk és szemkímélő, Dolby Vision támogatással, a Bang & Olufsen hangrendszer pedig minőségi hangzást nyújt. 16 GB RAM, 512 GB SSD, Thunderbolt 4 – prémium megjelenés, komoly teljesítmény.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/1_0bxnxfwe.png?v=3',
   unit_price:399990,stock:0,weight:2.100,category_name:'Laptop',avg_rating:4.5,review_count:50},

  {id:22,sku:'E010',name:'LG 65" OLED TV',
   description:'Az LG 65 colos OLED tévé a nappali szoba prémium médiaközpontja. Az önmegvilágító panel tökéletes feketéket és végtelen kontrasztarányt biztosít, amihez az LCD kijelzők nem érnek fel. Az α9 Gen6 AI processzor automatikusan optimalizálja a kép- és hangminőséget a tartalomtól függően. Négy HDMI 2.1 port PS5-höz, Xboxhoz és PC-hez egyaránt ideális, Dolby Vision IQ, Dolby Atmos és webOS felülettel.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/1_qa5u5m70.png?v=4',
   unit_price:699990,stock:8,weight:19.400,category_name:'TV & Monitor',avg_rating:4.5,review_count:50},

  {id:23,sku:'E011',name:'Sony WH-1000XM5',
   description:'A WH-1000XM5 a zajszűrős fejhallgatók egyik legelismertebb darabja. A zajszűrés repülőn és irodában egyaránt hatékony, a memóriahab párnák puhák, órákon át kényelmes a viselésük. Az LDAC kodek Hi-Res minőségű hangot biztosít, a Multipoint csatlakozás egyszerre két eszközzel párosítható. 30 óra üzemidő ANC-vel, 3 perc töltéssel 3 óra extra – és a Speak-to-Chat automatikusan szünetelteti a zenét, ha megszólal.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/111_wx83ssf0.jpg?v=4',
   unit_price:59990,stock:50,weight:0.250,category_name:'Fejhallgató',avg_rating:4.5,review_count:50},

  {id:24,sku:'E012',name:'Apple AirPods Pro 2. gen',
   description:'Az AirPods Pro 2 a legjobb iOS-kompatibilis fülhallgató. Az Adaptív Transparencia mód intelligensen szűri a zajos környezetet, mégis átengedi a fontos hangokat. A Spatial Audio és a fejkövetés mozgáshoz igazított, háromdimenziós hangképet teremt. USB-C töltőtok, IP54 védettség a fülhallgatóra és a tokra egyaránt, 6 óra önálló üzemidő ANC-vel, tokkal együtt 30+ óra.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/1_rcr2ctja.jpg?v=3',
   unit_price:79990,stock:70,weight:0.061,category_name:'Fejhallgató',avg_rating:4.5,review_count:50},

  {id:26,sku:'E014',name:'Logitech MX Master 3S',
   description:'Az MX Master 3S az irodai és kreatív felhasználók egyik legkedveltebb egere – pontossága, kényelme és gombjainak száma egyedülálló. A 8000 DPI-s szenzor üvegen is tökéletesen működik, a MagSpeed görgő csendesen és villámgyorsan lapoz nagy dokumentumokban. Bluetooth és Logi Bolt vevőn keresztül egyszerre három eszközhöz csatlakoztatható, és könnyen váltható közöttük. Ergonomikus forma, 70 napos akkumulátor – macOS és Windows egyaránt támogatott.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/s1_fbk4fyf7.jpg?v=2',
   unit_price:44990,stock:80,weight:0.141,category_name:'PC Kiegészítők',avg_rating:4.5,review_count:50},

  {id:27,sku:'E015',name:'Keychron K8 Pro TKL',
   description:'A Keychron K8 Pro a mechanikus billentyűzet-rajongók egyik kedvenc darabja. Hot-swap foglalatokkal szinte bármilyen MX-kompatibilis kapcsoló behelyezhető csavarhúzó nélkül, a QMK/VIA firmware teljes remappinget és makrózást tesz lehetővé. RGB háttérvilágítás, Bluetooth 5.1 és USB-C kábeles mód – asztali géphez és tablethez egyaránt használható. Az alumínium keret stabilitást és prémium megjelenést biztosít.',
   image_url:'https://image.alza.cz/products/KCHRON30HU/KCHRON30HU.jpg?width=500&height=500',
   unit_price:34990,stock:55,weight:0.850,category_name:'PC Kiegészítők',avg_rating:4.5,review_count:50},

  {id:28,sku:'E016',name:'ASUS TUF Gaming VG27AQL1A 27"',
   description:'Az ASUS TUF Gaming VG27AQL1A a versenyszintű gaming és a kreativitás határán egyensúlyoz. A 27 colos QHD IPS panel 170 Hz-es frissítési rátával és 1 ms válaszidővel folyékony képet ad, G-Sync Compatible és FreeSync Premium Pro támogatással. Az ELMB Sync technológia egyidejű mozgásszinkronizálást és motion blur csökkentést biztosít. HDR10 és 130% sRGB lefedéssel kreatív munkához is elegendő, az ergonomikus állvány teljesen dönthető és forgatható.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/1_ats7x339.jpg?v=3',
   unit_price:129990,stock:22,weight:6.500,category_name:'TV & Monitor',avg_rating:4.5,review_count:50},

  {id:29,sku:'E017',name:'Samsung Odyssey G5 27"',
   description:'A Samsung Odyssey G5 az ívelt gaming monitorok megfizethetőbb csúcsa. Az 1000R görbületű 27 colos VA panel szinte teljesen lefedi a látómezőt, a 165 Hz és 1 ms válaszidő versenyszintű élményt biztosít. QHD felbontás, AMD FreeSync Premium és HDR10 – nehéz ennél jobbat találni ezen az áron. Újratervezett állvány kábelmenedzsmenttel és VESA-kompatibilis rögzítéssel.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/s1_gfnzsulc.jpg?v=4',
   unit_price:99990,stock:19,weight:6.200,category_name:'TV & Monitor',avg_rating:4.5,review_count:50},

  {id:30,sku:'E018',name:'Canon EOS R10',
   description:'A Canon EOS R10 a legjobb belépő tükör nélküli fényképezőgép azoknak, akik komolyan szeretnék elsajátítani a fotózást. A 24,2 MP-es APS-C szenzor és a DIGIC X processzor kiváló képminőséget biztosít, az autófókusz rendszer 651 zónán, arcfelismeréssel és állat-AF-fel is dolgozik. 4K/30fps videó, Full HD/120fps lassítás, 15 fps sorozatfelvétel – mindez kompakt, könnyű házban, 625 kép üzemidővel.',
   image_url:'https://image.alza.cz/products/OC0989a3/OC0989a3.jpg?width=500&height=500',
   unit_price:249990,stock:2,weight:0.429,category_name:'Fotózás',avg_rating:4.5,review_count:50},

  {id:31,sku:'E019',name:'Sony Alpha A6400',
   description:'A Sony Alpha A6400 az Eye AF technológia miatt vált legendássá. A valós idejű szemfókusz portréknál, gyerekeknél és állatoknál egyaránt verhetetlen, 0,02 másodperces fókuszidővel. A 24,2 MP-es szenzor ISO 32000-ig kiterjeszthető tartományban is részletgazdag képet ad, 4K HDR videó és 1080p/120fps lassítással. A kihajtható LCD kijelző vlogoláshoz is ideális – kicsi, könnyű, az E-mount lencserendszer teljes választékával bővíthető.',
   image_url:'https://image.alza.cz/products/OS072i1m12/OS072i1m12.jpg?width=500&height=500',
   unit_price:269990,stock:11,weight:0.403,category_name:'Fotózás',avg_rating:4.5,review_count:50},

  {id:32,sku:'E020',name:'GoPro Hero 12 Black',
   description:'A GoPro Hero 12 Black az élményrögzítés legsokoldalúbb eszköze. 5,3K/60fps, 4K/120fps és 2,7K/240fps felvétel egyaránt elérhető, a HyperSmooth 6.0 stabilizáció rázkódás nélküli képet biztosít. Vízálló 10 méteres mélységig tok nélkül, 177 fokos látószög, Max Lens Mod 2.0 opcióval. Síeléshez, búvárkodáshoz, bringázáshoz és utazáshoz – ez a kamera mindenhova elkísér.',
   image_url:'https://image.alza.cz/products/OG012a1ce/OG012a1ce.jpg?width=500&height=500',
   unit_price:139990,stock:0,weight:0.154,category_name:'Fotózás',avg_rating:4.5,review_count:50},

  {id:34,sku:'E022',name:'Samsung 990 Pro 1TB NVMe SSD',
   description:'A Samsung 990 Pro a leggyorsabb fogyasztói NVMe SSD-k egyike. PCIe 4.0×4 buszon 7450/6900 MB/s szekvenciális olvasási és írási sebesség, TLC V-NAND technológiával és 600 TBW élettartam-garanciával. A dinamikus thermal guard megakadályozza a túlmelegedést hosszú átvitel során is. Ideális operációs rendszernek, játékok telepítéséhez és nagy fájlok kezeléséhez – PS5-tel és minden PCIe 4.0 M.2 slottal kompatibilis.',
   image_url:'https://image.alza.cz/products/SAS990ep4/SAS990ep4.jpg?width=500&height=500',
   unit_price:29990,stock:75,weight:0.050,category_name:'PC Kiegészítők',avg_rating:4.5,review_count:50},

  {id:35,sku:'E023',name:'TP-Link Archer AX55 WiFi 6 Router',
   description:'Az Archer AX55 WiFi 6 routerrel az egész otthon lefedhető gyors és stabil internettel. Az OFDMA és MU-MIMO technológiák egyszerre több eszközzel kommunikálnak hatékonyan, csökkentve a torlódást és a késleltetést. 2,4 GHz-en 574 Mbps, 5 GHz-en 2402 Mbps összesített kapacitás, négy Gigabit LAN port és USB 3.0 hálózati meghajtóhoz. Beépített Trend Micro antivírus védelemmel, szülői felügyelettel és QoS beállítással.',
   image_url:'https://image.alza.cz/products/TP23_007/TP23_007.jpg?width=500&height=500',
   unit_price:19990,stock:40,weight:0.510,category_name:'Hálózat',avg_rating:4.5,review_count:50},

  {id:36,sku:'E024',name:'Apple Watch Series 9 (GPS, 45mm)',
   description:'Az Apple Watch Series 9 a legjobb okosóra iPhone mellé. Az S9 chip Double Tap gesztust hoz: összezárva mutatóujját és hüvelykujját kezelni tudja az órát anélkül, hogy a másik kezével is hozzáérne. A mindig bekapcsolt Retina kijelző 2000 nit fényerővel napfényben is jól olvasható. EKG, véroxigén-szint mérés, alváskövetés, esésdetekció – egészségügyi és sportfunkciók teljeskörűen, IP6X porállósággal és 50 méteres vízállósággal.',
   image_url:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQDY3ref_AV1?wid=800&hei=800&fmt=jpeg&qlt=90',
   unit_price:149990,stock:28,weight:0.045,category_name:'Okoseszközök',avg_rating:4.5,review_count:50},

  {id:37,sku:'E025',name:'Amazon Echo Dot 5. generáció',
   description:'Az Echo Dot 5 a legjobb belépő okosotthon eszköz. A megújult hangszóró erősebb basszust biztosít az előző generációhoz képest – zene, podcastok és rádiók közel hifi minőségben szólnak ebből az apró eszközből. Az Alexa hangsegéd vezérli az okosotthon többi eszközét, megválaszolja a kérdéseket és kezeli a naptárat. Beépített hőmérséklet szenzor, WiFi 6, Bluetooth 5.2 és 3,5 mm-es audió kimenet.',
   image_url:'https://image.alza.cz/products/AMAECHDO5TH/AMAECHDO5TH.jpg?width=500&height=500',
   unit_price:14990,stock:65,weight:0.304,category_name:'Okoseszközök',avg_rating:4.5,review_count:50},

  {id:39,sku:'T002',name:'Samsung Galaxy S23',
   description:'A Galaxy S23 a tavalyi csúcstelefon, idei áron – és ez egyáltalán nem szégyen. A Snapdragon 8 Gen 2 valódi csúcsteljesítményt biztosít, az 50 MP-es háromkamerás rendszer éjszakai fotózásban különösen kiemelkedő. Az 1200 nit csúcsfényerejű Dynamic AMOLED 2X kijelző napfényben is tökéletesen olvasható. Kompakt, 168 grammos ház, IP68 vízállóság, 3900 mAh akku 25 W gyorstöltéssel – megbízható és elegáns.',
   image_url:'https://s13emagst.akamaized.net/products/52576/52575504/images/res_675b5c9d6f650e7c7c6d275f906d8f6e.jpg?width=720&height=720&hash=BA59C6D73AB2704CC4825815A0759290',
   unit_price:219990,stock:36,weight:0.168,category_name:'Mobil',avg_rating:4.5,review_count:50},

  {id:40,sku:'T003',name:'Dell Inspiron 15',
   description:'A Dell Inspiron 15 az egyszerű, megbízható mindennapi laptop – semmi extra, csak ami valóban szükséges. Az Intel Core i5 és 8 GB RAM elvégzi a napi feladatokat, az 512 GB SSD gyors rendszerindítást biztosít, a 15,6 colos FHD kijelző kényelmes felületet ad böngészéshez és videóhívásokhoz. USB-A, USB-C, HDMI és SD kártyaolvasó megtalálható a gépen, Windows 11 Home előtelepítve – megbízható belépő laptop otthoni és iskolai használatra.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/1dell_140rqx64.png?v=3',
   unit_price:179990,stock:27,weight:1.920,category_name:'Laptop',avg_rating:4.5,review_count:50},

  {id:41,sku:'T004',name:'HP Pavilion 14',
   description:'A HP Pavilion 14 kompakt és könnyű laptop napi feladatokhoz. Az AMD Ryzen 5 processzor és 8 GB RAM a legtöbb irodai és online feladatot gond nélkül elvégzi, a 14 colos FHD IPS kijelző éles és széleslátószögű képet ad. 256 GB NVMe SSD gyors töltési időt biztosít, USB-C, két USB-A, HDMI és SD kártyaolvasóval felszerelve. Windows 11 Home előtelepítve – kényelmes, hordozható választás mindennapi használatra.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/1_0bxnxfwe.png?v=3',
   unit_price:159990,stock:23,weight:1.550,category_name:'Laptop',avg_rating:4.5,review_count:50},
];}

async function load(){
  const id=Number(getParam('id'));
  const errEl=qs('#pdError'),wrap=qs('#pdWrap');
  if(!id){if(errEl){errEl.style.display='block';errEl.textContent='Hiányzó termék azonosító.';}return;}
  try{
    // API-ból tölt
    if(!window.api) throw new Error('API nem elérhető');
    const res=await window.api.get(`/products/${id}`);
    let p=res?.data?.data??res?.data??res;
    if(!p||!p.id) throw new Error('Termék nem található (ID: '+id+')');
    // Merge with demo for image_url + description fallback
    const demo=getDemoProducts().find(x=>x.id===id);
    if(demo){
      if(!p.image_url||!p.image_url.startsWith('http')) p.image_url=demo.image_url||'';
      if(!p.description) p.description=demo.description||'';
    }
    currentProduct=p;
    document.title='Raktár Pro – '+p.name;
    const user=getUser(),admin=isAdmin(user);

    // Populate
    qs('#pdTitle').textContent=p.name||'';
    qs('#pdPrice').textContent=fmt(pickPrice(p));
    // Star rating display
    const avg=parseFloat(p.avg_rating)||0;
    const cnt=parseInt(p.review_count)||0;
    const ratEl=qs('#pdRating');
    if(ratEl){
      const stars=[1,2,3,4,5].map(i=>{
        const r=Math.round(avg*2)/2;
        if(r>=i)return'<i class="bi bi-star-fill" style="color:#f59e0b;font-size:14px;"></i>';
        if(r>=i-0.5)return'<i class="bi bi-star-half" style="color:#f59e0b;font-size:14px;"></i>';
        return'<i class="bi bi-star" style="color:rgba(100,120,150,.3);font-size:14px;"></i>';
      }).join('');
      ratEl.innerHTML=avg>0
        ? `<span style="display:flex;align-items:center;gap:5px;">${stars}<span style="font-size:13px;font-weight:700;color:var(--text);">${avg.toFixed(1)}</span><span style="font-size:12px;color:var(--text-dim);">(${cnt} értékelés)</span></span>`
        : `<span style="font-size:12px;color:var(--text-dim);">Még nincs értékelés</span>`;
    }
    qs('#pdCategory').textContent=p.category_name||p.category||'Termék';
    // Leírás – mindig magyarul
    const rawDesc = p.description || 'Nincs leírás.';
    const descEl = qs('#pdDesc');
    if (descEl) descEl.innerHTML = `<p style="line-height:1.8;color:var(--text);font-size:14px;margin:0;">${esc(rawDesc)}</p>`;
    const stock=p.stock!==undefined?Number(p.stock):null;
    if(qs('#pdStock'))qs('#pdStock').innerHTML=stockPill(stock);

    // Admin meta
    const adminMeta=qs('#pdAdminMeta');
    if(adminMeta){
      if(admin){
        if(qs('#pdSku'))qs('#pdSku').textContent=p.sku||'—';
        if(qs('#pdId'))qs('#pdId').textContent=String(p.id);
        if(qs('#pdStockExact'))qs('#pdStockExact').textContent=stock!==null?stock+' db':'—';
        if(qs('#pdWeight'))qs('#pdWeight').textContent=p.weight?Number(p.weight).toFixed(3)+' kg':'—';
      }else{adminMeta.style.display='none';}
    }

    renderGallery(p);
    renderSpecs(p);
    setupTabs();
    setupWish(p);

    const addBtn=qs('#pdAddBtn');
    if(addBtn){
      if(stock!==null&&stock<=0){addBtn.disabled=true;addBtn.innerHTML='<i class="bi bi-x-circle rp-icon"></i> Elfogyott';addBtn.style.opacity='.5';}
      else{addBtn.addEventListener('click',()=>addToCart(p));}
    }

    // Cart badge
    const cart=JSON.parse(localStorage.getItem('rp_cart')||'[]');
    const badge=document.getElementById('cartBadge');
    if(badge){const tot=cart.reduce((s,c)=>s+(c.qty||1),0);badge.textContent=tot;badge.style.display=tot>0?'flex':'none';}

    if(wrap)wrap.style.display='';
    if(errEl)errEl.style.display='none';
  }catch(e){
    if(errEl){errEl.style.display='block';errEl.textContent='Hiba: '+e.message;}
  }
}

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',load);}else{load();}
})();
