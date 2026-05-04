# Raktár Pro – v7 (Login FIX + Windows MAMP)

## Miért ez a verzió?
- A korábbi 500-as hiba tipikusan azért volt, mert a backend DB kapcsolatnál **Mac socket path** volt beégetve.
- Ebben a verzióban a `backend/api_new/config/Database.php` **nem használ socket-et**, ezért Windows MAMP-on is stabil.

## Indítás (MAMP)
1. Másold a teljes mappát a MAMP/htdocs alá (pl. `RaktarPro_n`)
2. Start Servers (Apache + MySQL)

## Adatbázis import
- phpMyAdmin: `http://localhost:8888/phpMyAdmin/`
- Importáld: `database/webaruhaz1.sql` az adatbázisba: `webaruhaz1`

## Backend DB beállítás
- Fájl: `backend/api_new/config/Database.php`
- Alap MAMP értékek (Windows):
  - host: localhost
  - port: 8889
  - user: root
  - pass: root
  - db: webaruhaz1

## Frontend
- Bejelentkezés / regisztráció: `http://localhost:8888/<mappanév>/frontend/public/auth.html`
- Terméklista: `http://localhost:8888/<mappanév>/frontend/public/products.html`
- Kosár: `http://localhost:8888/<mappanév>/frontend/public/cart.html`

A frontend **automatikusan kitalálja** az API_BASE-t a mappanévből.

## Teszt endpoint
- `http://localhost:8888/<mappanév>/backend/api_new/` (API root)
- `http://localhost:8888/<mappanév>/backend/api_new/ping` (gyors ping)

## Tipp: ha a bejelentkezésnél HTML-t kapsz a Network-ben
Ez általában rossz RewriteBase / .htaccess miatt van. A `backend/api_new/.htaccess` fájlban a RewriteBase ki van kommentelve – hagyd így, vagy állítsd be a saját mappanevedre.
