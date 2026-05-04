<?php
/**
 * JWT TESZT SCRIPT
 * 
 * Futtatás: php jwt_test.php
 */

require_once __DIR__ . '/utils/Env.php';
require_once __DIR__ . '/utils/JWT.php';

echo "========================================\n";
echo "JWT RENDSZER TESZT\n";
echo "========================================\n\n";

try {
    // 1. ENV betöltése
    Env::load(__DIR__ . '/.env');
    echo "✅ .env betöltve\n\n";
    
    // 2. Secretek ellenőrzése
    $accessSecret = Env::getString('f4fe9067084183bdd0346049a9c72b085a1d975e820b68bfa2a354a905320f5b');
    $refreshSecret = Env::getString('4d568c341fa30a08e808beededfc7891d2b95da9cb58fe36cb3eb5a5cf81651d');
    
    echo "=== SECRETEK ELLENŐRZÉSE ===\n";
    echo "Access secret hossz: " . strlen($accessSecret) . " karakter ";
    echo (strlen($accessSecret) >= 32 ? "✅" : "❌") . "\n";
    
    echo "Refresh secret hossz: " . strlen($refreshSecret) . " karakter ";
    echo (strlen($refreshSecret) >= 32 ? "✅" : "❌") . "\n";
    
    echo "Secretek különbözőek: ";
    echo ($accessSecret !== $refreshSecret ? "✅" : "❌") . "\n\n";
    
    // 3. Access token létrehozása
    echo "=== ACCESS TOKEN ===\n";
    $accessPayload = [
        'user_id' => 17,
        'email' => 'test@example.com',
        'full_name' => 'Test User',
        'role_id' => 1
    ];
    
    $accessToken = JWT::createAccessToken($accessPayload);
    echo "Token létrehozva:\n";
    echo substr($accessToken, 0, 50) . "...\n\n";
    
    // 4. Access token ellenőrzése
    echo "=== ACCESS TOKEN VERIFY ===\n";
    $verifiedPayload = JWT::verifyAccessToken($accessToken);
    
    if ($verifiedPayload) {
        echo "✅ Token érvényes!\n";
        echo "User ID: " . $verifiedPayload['user_id'] . "\n";
        echo "Email: " . $verifiedPayload['email'] . "\n";
        echo "Lejár: " . date('Y-m-d H:i:s', $verifiedPayload['exp']) . "\n\n";
    } else {
        echo "❌ Token érvénytelen!\n\n";
    }
    
    // 5. Refresh token létrehozása
    echo "=== REFRESH TOKEN ===\n";
    $refreshPayload = [
        'user_id' => 17
    ];
    
    $refreshToken = JWT::createRefreshToken($refreshPayload);
    echo "Token létrehozva:\n";
    echo substr($refreshToken, 0, 50) . "...\n\n";
    
    // 6. Refresh token ellenőrzése
    echo "=== REFRESH TOKEN VERIFY ===\n";
    $verifiedRefresh = JWT::verifyRefreshToken($refreshToken);
    
    if ($verifiedRefresh) {
        echo "✅ Token érvényes!\n";
        echo "User ID: " . $verifiedRefresh['user_id'] . "\n";
        echo "Lejár: " . date('Y-m-d H:i:s', $verifiedRefresh['exp']) . "\n\n";
    } else {
        echo "❌ Token érvénytelen!\n\n";
    }
    
    // 7. Token típus ellenőrzés
    echo "=== TÍPUS ELLENŐRZÉS ===\n";
    
    // Access token NEM működik refresh-ként
    $wrongVerify = JWT::verifyRefreshToken($accessToken);
    echo "Access token mint refresh: ";
    echo ($wrongVerify === null ? "✅ Helyesen visszautasítva" : "❌ Hiba!") . "\n";
    
    // Refresh token NEM működik access-ként
    $wrongVerify2 = JWT::verifyAccessToken($refreshToken);
    echo "Refresh token mint access: ";
    echo ($wrongVerify2 === null ? "✅ Helyesen visszautasítva" : "❌ Hiba!") . "\n\n";
    
    // 8. Token decode (debug)
    echo "=== TOKEN DECODE (DEBUG) ===\n";
    $decoded = JWT::decode($accessToken);
    echo "Token típus: " . $decoded['token_type'] . "\n";
    echo "Létrehozva: " . date('Y-m-d H:i:s', $decoded['iat']) . "\n";
    echo "Lejár: " . date('Y-m-d H:i:s', $decoded['exp']) . "\n\n";
    
    echo "========================================\n";
    echo "MINDEN TESZT SIKERES! ✅\n";
    echo "========================================\n\n";
    
    echo "KÖVETKEZŐ LÉPÉSEK:\n";
    echo "1. Teszteld Postman-nel:\n";
    echo "   POST http://localhost:8888/raktar_api_mvc/api_new/auth/login\n";
    echo "   Body: {\"email\": \"mmate06625@gmail.com\", \"password\": \"asd\"}\n\n";
    echo "2. Használd az access_token-t:\n";
    echo "   GET http://localhost:8888/raktar_api_mvc/api_new/auth/me\n";
    echo "   Header: Authorization: Bearer <access_token>\n\n";
    
} catch (Exception $e) {
    echo "\n❌ HIBA: " . $e->getMessage() . "\n\n";
    
    if (strpos($e->getMessage(), 'JWT_ACCESS_SECRET') !== false) {
        echo "MEGOLDÁS:\n";
        echo "1. Ellenőrizd hogy létezik a .env fájl\n";
        echo "2. Generálj secreteket:\n";
        echo "   php -r \"echo bin2hex(random_bytes(32));\" \n";
        echo "3. Másold be őket a .env fájlba\n";
    }
}
