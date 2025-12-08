<?php
/**
 * _init.php
 * Betölti a közös konfigurációt és csak admin felhasználóknak enged belépést.
 */

require_once __DIR__ . '/../config.php'; // betölti az adatbázis-kapcsolatot és a sessiont

// --------------------
// 🔐 Jogosultság-ellenőrzés
// --------------------
if (!isset($_SESSION['user_id'])) {
    // ha nincs bejelentkezve, irány a login
    header('Location: /raktar_pro/bejelentkezes.html');
    exit;
}

if ((int)($_SESSION['szerepkor_id'] ?? 3) !== 1) {
    // ha nem admin szerepkör (1), nincs jogosultság
    echo "<h2 style='font-family:sans-serif;color:red;text-align:center;margin-top:40px'>
            🚫 Nincs jogosultságod az admin felület megnyitásához.
          </h2>";
    exit;
}

// --------------------
// 🧩 Segédfüggvény – HTML escapelés
// --------------------
if (!function_exists('h')) {
    function h($s) {
        return htmlspecialchars($s ?? "", ENT_QUOTES, "UTF-8");
    }
}

