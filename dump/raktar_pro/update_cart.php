<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/cart_utils.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit('Hibás kérés.'); }

// CSRF
if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(16));
if (!hash_equals($_SESSION['csrf'], $_POST['csrf'] ?? '')) {
  exit('Érvénytelen kérés (CSRF).');
}

// mennyiségek frissítése
$qtys = $_POST['qty'] ?? [];
if (is_array($qtys)) {
  foreach ($qtys as $pid => $q) {
    $pid = (int)$pid; $q = (int)$q;
    cart_set($pid, $q);
  }
}

// egy tétel törlése (ha külön gombbal kérted)
if (isset($_POST['remove'])) {
  $rid = (int)$_POST['remove'];
  cart_remove($rid);
}

// teljes kosár ürítés
if (isset($_POST['clear']) && $_POST['clear'] === '1') {
  cart_clear();
}

header("Location: kosar.php");
exit;
