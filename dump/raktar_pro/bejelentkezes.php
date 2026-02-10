<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  exit('Hibás kérés.');
}

$email = trim($_POST['email'] ?? '');
$jelszo = $_POST['jelszo'] ?? '';

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { exit('Érvénytelen e-mail cím.'); }
if (strlen($jelszo) < 6) { exit('A jelszó túl rövid.'); }

$stmt = $mysqli->prepare("SELECT id, jelszo, teljes_nev, szerepkor_id FROM felhasznalok WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

if (!$user || !password_verify($jelszo, $user['jelszo'])) {
  exit('Hibás e-mail vagy jelszó.');
}

$_SESSION['user_id'] = $user['id'];
$_SESSION['email'] = $email;
$_SESSION['teljes_nev'] = $user['teljes_nev'] ?? '';
$_SESSION['szerepkor_id'] = $user['szerepkor_id'] ?? null;

$upd = $mysqli->prepare("UPDATE felhasznalok SET modositva = NOW() WHERE id = ?");
$upd->bind_param("i", $user['id']);
$upd->execute();
$upd->close();

// ✅ Itt módosítottam az átirányítást:
header("Location: index.php");
exit;
