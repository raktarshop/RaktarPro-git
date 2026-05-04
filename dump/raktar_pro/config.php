<?php
/**
 * Raktár Pro – config.php (MAMP-ready)
 * - MAMP default: user=root, pass=root, port=8889, socket a MAMP tmp-ben
 * - TCP és socket fallback
 * - mysqli: exceptions, utf8mb4
 * - session + pár helper
 */

declare(strict_types=1);

// ---- DB paraméterek (MAMP alapok) ----
$DB_HOST = 'localhost';
$DB_USER = 'root';
$DB_PASS = 'root';          // MAMP alap
$DB_NAME = 'webaruhaz';
$DB_PORT = 8889;            // MAMP MySQL port
$DB_SOCK = '/Applications/MAMP/tmp/mysql/mysql.sock'; // MAMP socket

// ---- Hibakezelés: dobjon kivételt a mysqli ----
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

// ---- Kapcsolat felépítése: először TCP, aztán socket fallback ----
try {
    // TCP
    $mysqli = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME, $DB_PORT);
} catch (Throwable $e) {
    // Socket fallback
    $mysqli = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME, null, $DB_SOCK);
}

// Karakterkódolás
$mysqli->set_charset('utf8mb4');

// ---- Időzóna (szükséges lehet DATETIME mezőknél) ----
date_default_timezone_set('Europe/Budapest');

// ---- Session indítás (egyszer) ----
if (session_status() !== PHP_SESSION_ACTIVE) {
    // opcionális: biztonságosabb sütibeállítások helyben fejlesztéshez
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'httponly' => true,
        'secure'   => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
        'samesite' => 'Lax',
    ]);
    session_start();
}

// ---- Hasznos helper függvények ----
if (!function_exists('h')) {
    function h(?string $s): string {
        return htmlspecialchars($s ?? '', ENT_QUOTES, 'UTF-8');
    }
}

if (!function_exists('is_logged_in')) {
    function is_logged_in(): bool {
        return isset($_SESSION['user_id']) && (int)$_SESSION['user_id'] > 0;
    }
}

if (!function_exists('is_admin')) {
    function is_admin(): bool {
        return isset($_SESSION['szerepkor_id']) && (int)$_SESSION['szerepkor_id'] === 1;
    }
}

// CSRF segédek
if (!function_exists('csrf_token')) {
    function csrf_token(): string {
        if (empty($_SESSION['csrf'])) {
            $_SESSION['csrf'] = bin2hex(random_bytes(16));
        }
        return $_SESSION['csrf'];
    }
}
if (!function_exists('csrf_verify')) {
    function csrf_verify(?string $token): bool {
        return isset($_SESSION['csrf']) && is_string($token) && hash_equals($_SESSION['csrf'], $token);
    }
}
