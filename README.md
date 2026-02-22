# 📦 RaktárPro – Központi Raktár Webshop

Egy modern, többnyelvű (🇭🇺 🇬🇧 🇩🇪) webshop és raktárkezelő rendszer, amely lehetővé teszi a vásárlók és partnerek számára a termékek böngészését, kosárba helyezését és rendelések leadását – adminisztrátoroknak pedig a készlet, kategória és rendeléskezelést.

---

## 👥 Csapat

| Szerepkör | Név |
|---|---|
| Projekt Manager / Frontend | Molnár Dániel |
| Backend fejlesztő | Trubics Gorán |
| Adatbázis kezelő | Molnár Máté |

---

## 🛠 Technológiák

**Frontend**
- HTML5, CSS3, JavaScript (Vanilla)
- Bootstrap 5 + Bootstrap Icons
- Egyedi i18n rendszer (`lang.js`) – HU / EN / DE
- Sötét / Világos téma váltás

**Backend**
- PHP 8+ (REST API, MVC struktúra)
- JWT alapú hitelesítés (access + refresh token)
- Apache `.htaccess` routing

**Adatbázis**
- MySQL (`webaruhaz1`)
- Migrációs SQL fájlok

**Eszközök**
- Git, GitHub
- Figma (UI/UX tervezés)
- Jira (projektmenedzsment)
- MAMP (helyi fejlesztői környezet)

---

## 📂 Projekt struktúra

```
RaktarPro_/
│
├── frontend/
│   └── public/
│       ├── auth.html                   # Bejelentkezés / regisztráció
│       ├── products.html               # Terméklista
│       ├── product_details.html        # Termék részletek
│       ├── cart.html                   # Kosár + fizetés
│       ├── orders.html                 # Rendeléseim
│       ├── account.html                # Fiókbeállítások
│       ├── support.html                # Bejelentkezési segítség
│       ├── admin.html                  # Admin – készlet / ár
│       ├── admin_orders.html           # Admin – rendelések
│       ├── admin_categories.html       # Admin – kategóriák
│       ├── admin_support.html          # Admin – support ticketek
│       └── assets/
│           ├── css/
│           │   ├── common.css
│           │   ├── auth.css
│           │   ├── auth-light-fix.css
│           │   ├── products.css
│           │   ├── cart.css
│           │   ├── orders.css
│           │   ├── admin.css
│           │   └── nav-unify.css
│           ├── js/
│           │   ├── api.js              # API hívások (fetch wrapper)
│           │   ├── lang.js             # i18n – HU/EN/DE fordítások
│           │   ├── nav.js              # Navigáció, kosár badge
│           │   ├── animate.js          # Animációk
│           │   ├── auth.js             # Bejelentkezés / regisztráció
│           │   ├── products.js         # Terméklista, szűrés, kosár
│           │   ├── product_details.js  # Termék részletek oldal
│           │   ├── cart.js             # Kosár kezelés, checkout
│           │   ├── orders.js           # Rendelések listája
│           │   ├── account.js          # Fiókbeállítások
│           │   ├── support.js          # Support űrlap
│           │   ├── admin.js            # Admin – készlet/ár
│           │   ├── admin_orders.js     # Admin – rendeléskezelés
│           │   ├── admin_categories.js # Admin – kategóriák
│           │   └── admin_support.js    # Admin – support ticketek
│           └── img/
│               └── logo.png
│
├── backend/
│   └── api_new/
│       ├── index.php                   # API belépési pont + routing
│       ├── .htaccess                   # Apache URL rewrite
│       ├── .env                        # Környezeti változók (DB, JWT)
│       ├── config/
│       │   └── Database.php            # MySQL kapcsolat
│       ├── controllers/
│       │   ├── AuthController.php
│       │   ├── ProductController.php
│       │   ├── CategoryController.php
│       │   ├── OrderController.php
│       │   ├── OrderItemController.php
│       │   ├── StockController.php
│       │   ├── CouponController.php
│       │   ├── FavoriteController.php
│       │   ├── LocationController.php
│       │   ├── ProductReviewController.php
│       │   ├── RoleController.php
│       │   ├── SupplierController.php
│       │   ├── SupportController.php
│       │   └── WarehouseController.php
│       ├── models/                     # DB modellek (BaseModel + entitások)
│       ├── services/                   # Üzleti logika réteg
│       ├── middlewares/
│       │   └── AuthMiddleware.php      # JWT ellenőrzés
│       └── utils/
│           ├── JWT.php
│           ├── Response.php
│           ├── Validator.php
│           └── Env.php
│
├── database/
│   ├── webaruhaz1.sql                  # Alap adatbázis dump
│   ├── webaruhaz1_updated.sql          # Frissített dump
│   └── migrations/
│       ├── product_description.sql
│       └── product_transl.sql
│
├── docs/
│   ├── RaktarPro-Warehouse-Management-Web-App.pptx
│   └── RaktarPro_tests.xlsx
│
└── dump/                               # Korábbi verziók archívuma (v2–v13)
```

---

## 🚀 Helyi telepítés (MAMP – Windows)

### 1. Előfeltételek
- [MAMP](https://www.mamp.info/) telepítve (Apache + MySQL)
- PHP 8.0+

### 2. Fájlok elhelyezése
```
C:\MAMP\htdocs\RaktarPro_\
```

### 3. Adatbázis importálása
1. Nyisd meg: `http://localhost:8888/phpMyAdmin/`
2. Hozz létre egy `webaruhaz1` nevű adatbázist
3. Importáld: `database/webaruhaz1.sql`

### 4. Backend konfiguráció
A `backend/api_new/.env` és `config/Database.php` alapértelmezett értékei MAMP-hoz:

```
Host:      localhost
Port:      8889
Adatbázis: webaruhaz1
User:      root
Jelszó:    root
```

### 5. Az oldal megnyitása

| Oldal | URL |
|---|---|
| Bejelentkezés | `http://localhost:8888/RaktarPro_/frontend/public/auth.html` |
| Termékek | `http://localhost:8888/RaktarPro_/frontend/public/products.html` |
| Kosár | `http://localhost:8888/RaktarPro_/frontend/public/cart.html` |
| API root | `http://localhost:8888/RaktarPro_/backend/api_new/` |
| API ping | `http://localhost:8888/RaktarPro_/backend/api_new/ping` |

> A frontend automatikusan kitalálja az API alap URL-t a mappanévből – mappanév változtatásakor nincs szükség kézi konfigurációra.

---

## 🔐 Hitelesítés

JWT alapú, kétlépéses token rendszer:
- **Access token** – 15 perces élettartam
- **Refresh token** – 14 napos élettartam, automatikus megújítás

A tokenek `localStorage`-ban tárolódnak. Védett végpontokhoz az `Authorization: Bearer <token>` fejléc szükséges.

---

## 🌐 API végpontok (összefoglalás)

| Módszer | Végpont | Leírás |
|---|---|---|
| POST | `/auth/login` | Bejelentkezés |
| POST | `/auth/register` | Regisztráció |
| GET | `/products` | Termékek listája |
| GET | `/products/{id}` | Termék részletei |
| GET | `/categories` | Kategóriák |
| POST | `/orders` | Rendelés leadása |
| GET | `/orders` | Saját rendelések |
| GET | `/admin/orders` | Összes rendelés (admin) |
| PUT | `/admin/products/{id}` | Készlet/ár frissítés (admin) |

---

## 🗺 Funkciók

- 🛒 **Webshop** – terméklista, keresés, szűrés, rendezés, kosár, checkout (utánvét)
- 📄 **Termék részletek** – külön oldal képpel és leírással
- 👤 **Felhasználói fiók** – szállítási cím, jelszócsere, kijelentkezés minden eszközről
- 📦 **Admin panel** – készlet/ár szerkesztés, rendeléskezelés, kategóriakezelés
- 🎫 **Support rendszer** – bejelentkezési segítség, admin ticketkezelés
- 🌍 **Többnyelvűség** – Magyar / English / Deutsch 
- 🌙 **Témaváltás** – sötét / világos mód

---

## ⚠️ Megjegyzések

- Az online fizetés (bankkártya) jelenleg nem aktív, csak utánvét érhető el
- A `dump/` mappa a fejlesztés korábbi verzióit (v2–v13) tartalmazza, archiválási céllal

---

## 📄 Licenc

Iskolai projekt – belső használatra.
