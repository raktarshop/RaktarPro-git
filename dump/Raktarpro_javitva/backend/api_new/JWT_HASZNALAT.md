# 🔐 JWT AUTENTIKÁCIÓ - HASZNÁLATI ÚTMUTATÓ

## ✅ TELEPÍTVE ÉS KONFIGURÁLVA!

A JWT autentikációs rendszer már telepítve van és működik! 🎉

---

## 📋 MIT TARTALMAZ:

### Fájlok:
- ✅ `.env` - Környezeti változók (secretek)
- ✅ `utils/Env.php` - ENV loader
- ✅ `utils/JWT.php` - JWT token kezelés
- ✅ `services/AuthService.php` - Auth logika
- ✅ `controllers/AuthController.php` - Auth endpointok
- ✅ `index.php` - Routing (frissítve)
- ✅ `jwt_test.php` - Teszt script

### Endpointok:
- ✅ `POST /auth/register` - Regisztráció
- ✅ `POST /auth/login` - Bejelentkezés
- ✅ `POST /auth/refresh` - Token frissítés
- ✅ `GET /auth/me` - Aktuális user
- ✅ `POST /auth/logout` - Kijelentkezés

---

## 🧪 GYORS TESZT

### Terminal-ban:
```bash
php jwt_test.php
```

**Mit kell látnod:**
```
✅ .env betöltve
✅ Token érvényes!
✅ Minden teszt sikeres!
```

---

## 🔌 POSTMAN TESZTEK

### 1. LOGIN

```
POST http://localhost:8888/raktar_api_mvc/api_new/auth/login

Headers:
Content-Type: application/json

Body (raw JSON):
{
  "email": "mmate06625@gmail.com",
  "password": "asd"
}

Response:
{
  "success": true,
  "message": "Sikeres bejelentkezés",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 900,
    "user": {
      "id": 17,
      "email": "mmate06625@gmail.com",
      "full_name": "Molnár Máté",
      "company_name": "molnar es tarsa",
      "role_id": 1
    }
  }
}
```

**MÁSOLD KI AZ access_token-t!**

---

### 2. ME (TOKEN VERIFY)

```
GET http://localhost:8888/raktar_api_mvc/api_new/auth/me

Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
              ↑ ide másold be az access_token-t!

Response:
{
  "success": true,
  "data": {
    "user_id": 17,
    "email": "mmate06625@gmail.com",
    "full_name": "Molnár Máté",
    "role_id": 1
  }
}
```

---

### 3. REFRESH TOKEN

```
POST http://localhost:8888/raktar_api_mvc/api_new/auth/refresh

Headers:
Content-Type: application/json

Body (raw JSON):
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response:
{
  "success": true,
  "message": "Token frissítve",
  "data": {
    "access_token": "eyJ... ÚJ TOKEN ...",
    "refresh_token": "eyJ... ÚJ TOKEN ...",
    "expires_in": 900,
    "user": { ... }
  }
}
```

---

### 4. REGISTER

```
POST http://localhost:8888/raktar_api_mvc/api_new/auth/register

Headers:
Content-Type: application/json

Body (raw JSON):
{
  "email": "ujuser@example.com",
  "password": "password123",
  "full_name": "Új Felhasználó",
  "company_name": "Teszt Cég"
}

Response:
{
  "success": true,
  "message": "Sikeres regisztráció",
  "data": {
    "user_id": 22,
    "message": "Regisztráció sikeres"
  }
}
```

---

## 🔒 VÉDETT ENDPOINT PÉLDA

### Hogyan védj le egy endpointot JWT-vel:

```php
// controllers/ProductController.php

public function getAll(): void {
    try {
        // ===== JWT ELLENŐRZÉS =====
        require_once __DIR__ . '/../utils/JWT.php';
        
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        
        if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            throw new Exception('Token hiányzik');
        }
        
        $token = $matches[1];
        $payload = JWT::verifyAccessToken($token);
        
        if (!$payload) {
            throw new Exception('Érvénytelen token');
        }
        
        // User ID elérhető: $payload['user_id']
        // Role ID: $payload['role_id']
        // ============================
        
        // ... tovább a normál kóddal
        $products = $this->productService->getAll();
        Response::success($products);
        
    } catch (Exception $e) {
        http_response_code(401);
        Response::error($e->getMessage());
    }
}
```

---

## 🔑 TOKEN FLOW

```
1. User bejelentkezik (POST /auth/login)
   → Email + jelszó

2. Backend ellenőrzi és generál tokeneket
   → Access token (15 perc)
   → Refresh token (14 nap)

3. User minden kérésnél az Access tokent küldi
   → Header: Authorization: Bearer <access_token>

4. 15 perc után az Access token lejár
   → User a Refresh tokennel kér új tokent (POST /auth/refresh)

5. Backend új token párt generál
   → Új Access token
   → Új Refresh token

6. Folyamat újra kezdődik...
```

---

## ⚙️ KONFIGURÁCIÓ (.env)

```env
# JWT SECRETEK (64 karakter mindkettő)
JWT_ACCESS_SECRET=f4fe9067084183bdd0346049a9c72b085a1d975e820b68bfa2a354a905320f5b
JWT_REFRESH_SECRET=4d568c341fa30a08e808beededfc7891d2b95da9cb58fe36cb3eb5a5cf81651d

# ÉLETTARTAMOK (másodpercben)
JWT_ACCESS_EXPIRY=900         # 15 perc
JWT_REFRESH_EXPIRY=1209600    # 14 nap

# ADATBÁZIS
DB_HOST=localhost
DB_PORT=8889
DB_NAME=<adatbázis_neve>
DB_USER=root
DB_PASS=root
```

---

## 🛡️ BIZTONSÁGI JELLEMZŐK

✅ Külön secretek az access és refresh tokenekhez
✅ Token típus validáció (access vs refresh)
✅ Lejárati idő ellenőrzés
✅ Signature verification (hash_equals)
✅ HS256 algoritmus
✅ Base64 URL-safe encoding
✅ Minimum 32 karakteres secret követelmény

---

## 📊 TOKEN PAYLOAD

### Access Token:
```json
{
  "user_id": 17,
  "email": "mmate06625@gmail.com",
  "full_name": "Molnár Máté",
  "role_id": 1,
  "token_type": "access",
  "iat": 1738411200,
  "exp": 1738412100
}
```

### Refresh Token:
```json
{
  "user_id": 17,
  "token_type": "refresh",
  "iat": 1738411200,
  "exp": 1739620800
}
```

---

## 🆘 HIBAELHÁRÍTÁS

### "JWT_ACCESS_SECRET nincs beállítva"
→ Ellenőrizd hogy létezik a `.env` fájl
→ Ellenőrizd hogy a secretek kitöltötted

### "Érvénytelen token"
→ Ellenőrizd hogy jó token típust használsz (access vs refresh)
→ Token lejárt? Használd a refresh endpointot

### "Token hiányzik"
→ Ellenőrizd hogy az Authorization headert küldöd
→ Formátum: `Authorization: Bearer <token>`

---

## 🎉 KÉSZ!

A JWT rendszer telepítve és működik! 

**Következő lépések:**
1. ✅ Futtasd le: `php jwt_test.php`
2. ✅ Tesztelj Postman-nel
3. ✅ Védj le további endpointokat JWT-vel

**Kérdések?** Nézd meg a `jwt_test.php` fájlt példákért!
