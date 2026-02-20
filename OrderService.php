# Raktár Pro REST API - MVC Architektúra

Professzionális REST API warehouse management rendszerhez, tiszta MVC (Model-View-Controller) + Service Layer architektúrával.

## 📂 Projekt Struktúra

```
api_new/
├── config/
│   └── Database.php          # Singleton DB kapcsolat
├── models/
│   ├── BaseModel.php         # Alap CRUD műveletek
│   ├── UserModel.php         # users tábla
│   ├── ProductModel.php      # products tábla
│   ├── CategoryModel.php     # categories tábla
│   └── OrderModel.php        # orders, app_order_items táblák
├── services/
│   ├── AuthService.php       # Authentikációs logika
│   ├── ProductService.php    # Termék business logic
│   └── OrderService.php      # Rendelés business logic
├── controllers/
│   ├── AuthController.php    # Auth endpointok
│   ├── ProductController.php # Termék endpointok
│   ├── CategoryController.php# Kategória endpointok
│   └── OrderController.php   # Rendelés endpointok
├── middlewares/
│   └── AuthMiddleware.php    # JWT authentikáció
├── utils/
│   ├── Response.php          # JSON válasz helper
│   ├── Validator.php         # Input validáció
│   └── JWT.php               # Token kezelés
├── index.php                 # Entry point (router)
├── .htaccess                 # Apache URL rewriting
└── README.md                 # Ez a fájl
```

## 🚀 Telepítés

### 1. Fájlok másolása
```bash
# Másold az api_new mappát a MAMP htdocs-ba
cp -r api_new /Applications/MAMP/htdocs/
```

### 2. Apache mod_rewrite engedélyezése
```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

### 3. Adatbázis beállítás
Ellenőrizd a `config/Database.php` beállításokat:
```php
private string $host = 'localhost';
private string $db = 'webaruhaz1';  // <-- NÉV ELLENŐRZÉS!
private int $port = 8889;
```

### 4. JWT Secret megváltoztatása
Nyisd meg `utils/JWT.php` és változtasd meg:
```php
private static string $secret = 'ITT-VALTOZTATSD-MEG-RANDOM-STRING';
```

### 5. Tesztelés
```bash
# Health check
curl http://localhost:8888/api_new/

# Várható válasz:
{"success":true,"data":{"api":"Raktár Pro REST API","version":"1.0","status":"running"}}
```

## 📚 API Endpointok

### Auth Endpointok

#### POST /auth/register
Új felhasználó regisztrációja
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "Teszt User",
  "company_name": "Optional Kft"
}
```

#### POST /auth/login
Bejelentkezés
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Válasz:**
```json
{
  "success": true,
  "data": {
    "user": {...},
    "access_token": "eyJhbGc...",
    "expires_in": 900
  }
}
```

#### POST /auth/logout
Kijelentkezés (token-based, egyszerű)

---

### Product Endpointok

#### GET /products
Termékek listázása (PUBLIC)

**Query params:**
- `search` - keresés (név, leírás, SKU)
- `category_id` - kategória szűrés
- `sort` - rendezés (newest, price_asc, price_desc, name_asc, name_desc)
- `page` - oldal szám
- `limit` - elemek száma (max 100)

**Példa:**
```bash
curl "http://localhost:8888/api_new/products?search=csavar&page=1&limit=12"
```

#### GET /products/{id}
Termék részletei (PUBLIC)

#### POST /products (ADMIN)
Új termék létrehozása
```json
{
  "sku": "PROD-001",
  "name": "Termék neve",
  "description": "Leírás",
  "unit_price": 1500,
  "stock": 100,
  "category_id": 1,
  "supplier_id": 1
}
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

#### PUT /products/{id} (ADMIN)
Termék módosítása

#### DELETE /products/{id} (ADMIN)
Termék törlése

---

### Category Endpointok

#### GET /categories
Kategóriák listázása (PUBLIC)

#### GET /categories/{id}
Kategória részletei (PUBLIC)

#### POST /categories (ADMIN)
Új kategória
```json
{
  "name": "Új kategória",
  "parent_id": 1
}
```

#### PUT /categories/{id} (ADMIN)
Kategória módosítása

#### DELETE /categories/{id} (ADMIN)
Kategória törlése

---

### Order Endpointok (USER)

#### GET /orders
Saját rendelések listázása

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

#### GET /orders/{id}
Rendelés részletei

#### POST /orders
Új rendelés leadása (CHECKOUT)
```json
{
  "name": "Vásárló Neve",
  "email": "vasarlo@example.com",
  "address": "1234 Budapest, Utca 1",
  "payment_method": "utanvet",
  "items": [
    {
      "product_id": 15,
      "quantity": 2
    }
  ]
}
```

---

### Admin Order Endpointok

#### GET /admin/orders
Összes rendelés (ADMIN)

**Query params:**
- `status` - státusz szűrés (uj, feldolgozas, kiszallitva, teljesitve, torolve)
- `from_date` - dátum szűrés (YYYY-MM-DD)
- `to_date` - dátum szűrés
- `search` - keresés (név, email, ID)
- `page`, `limit` - lapozás

#### PUT /admin/orders/{id}/status
Rendelés státusz módosítása (ADMIN)
```json
{
  "status": "feldolgozas"
}
```

---

## 🔒 Authentikáció

JWT (JSON Web Token) alapú.

### Token megszerzése:
1. Register vagy Login endpoint
2. Válasz tartalmazza az `access_token`-t
3. Token érvényesség: 15 perc (900 sec)

### Token használata:
Minden védett endpoint-nál:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Példa curl-lel:
```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:8888/api_new/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"pass123"}' \
  | jq -r '.data.access_token')

# Protected endpoint
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8888/api_new/orders
```

---

## ✅ HTTP Status Codes

| Kód | Jelentés |
|-----|----------|
| 200 | OK - Sikeres kérés |
| 201 | Created - Sikeres létrehozás |
| 400 | Bad Request - Hibás input |
| 401 | Unauthorized - Nincs bejelentkezve |
| 403 | Forbidden - Nincs jogosultság |
| 404 | Not Found - Nem található |
| 500 | Server Error - Szerver hiba |

---

## 📋 Response Formátum

### Success:
```json
{
  "success": true,
  "message": "Sikeres művelet",
  "data": { ... }
}
```

### Error:
```json
{
  "success": false,
  "error": {
    "message": "Hibaüzenet",
    "code": "ERROR_CODE",
    "details": { ... }
  }
}
```

---

## 🛠️ Development Tips

### Debug mód:
`index.php`-ban:
```php
ini_set('display_errors', 1); // Development
```

### JWT Secret módosítás (FONTOS!):
`utils/JWT.php`:
```php
private static string $secret = 'GENERÁLJ-ÚJ-HOSSZÚ-RANDOM-STRINGET';
```

### Database connection debug:
`config/Database.php` - kivételek automatikusan hibát dobnak

---

## 🧪 Tesztelés

### 1. Health Check
```bash
curl http://localhost:8888/api_new/
```

### 2. Register
```bash
curl -X POST http://localhost:8888/api_new/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "test123",
    "full_name": "Test User"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:8888/api_new/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "test123"
  }'
```

### 4. Products (PUBLIC)
```bash
curl http://localhost:8888/api_new/products
```

---

## 📁 Adatbázis Táblák

Az API az alábbi táblákat használja:
- `users` - felhasználók
- `roles` - szerepkörök
- `products` - termékek
- `categories` - kategóriák
- `suppliers` - beszállítók
- `orders` - rendelések feje
- `app_order_items` - rendelés tételek

---

## 🔄 MVC Architektúra Flow

```
Request → index.php (Router) 
         ↓
       Controller (validáció, auth check)
         ↓
       Service (business logic)
         ↓
       Model (database műveletek)
         ↓
       Response (JSON)
```

---

## 💡 Best Practices

1. **Token biztonság**: Mindig használj HTTPS-t production-ben
2. **JWT Secret**: Változtasd meg véletlenszerű hosszú stringre
3. **Input validáció**: Minden input validálva van
4. **SQL injection védelem**: Prepared statements mindenhol
5. **Error handling**: Try-catch minden rétegben
6. **Clean code**: MVC separation of concerns

---

**Verzió:** 1.0  
**Utolsó frissítés:** 2026-01-16  
**Fejlesztő:** Raktár Pro Team
