<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/cart_utils.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit('Hibás kérés.'); }

$termek_id = (int)($_POST['termek_id'] ?? 0);
$qty       = max(1, (int)($_POST['qty'] ?? 1));

// validáljuk, hogy létezik
$stmt = $mysqli->prepare("SELECT id FROM termekek WHERE id = ?");
$stmt->bind_param("i", $termek_id);
$stmt->execute();
$ok = (bool)$stmt->get_result()->fetch_row();
$stmt->close();

if (!$ok) { exit('Ismeretlen termék.'); }

cart_add($termek_id, $qty);

// vissza oda, ahonnan jött
$back = $_SERVER['HTTP_REFERER'] ?? 'kosar.php';
header("Location: " . $back);
exit;
