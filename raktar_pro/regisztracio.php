<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  exit('Hibás kérés.');
}

$email = trim($_POST['email'] ?? '');
$jelszo = $_POST['jelszo'] ?? '';
$teljes_nev = trim($_POST['teljes_nev'] ?? '');
$cegnev = trim($_POST['cegnev'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { exit('Érvénytelen e-mail cím.'); }
if (strlen($jelszo) < 6) { exit('A jelszó legalább 6 karakteres legyen.'); }
if ($teljes_nev === '') { exit('A teljes név kötelező.'); }

# E-mail egyediség
$stmt = $mysqli->prepare("SELECT id FROM felhasznalok WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) { exit('Ezzel az e-mail címmel már regisztráltak.'); }
$stmt->close();

$hash = password_hash($jelszo, PASSWORD_DEFAULT);

# 3 = 'felhasznalo' a te sémádban
$stmt = $mysqli->prepare("
  INSERT INTO felhasznalok (email, jelszo, teljes_nev, cegnev, szerepkor_id, letrehozva)
  VALUES (?, ?, ?, ?, 3, NOW())
");
$stmt->bind_param("ssss", $email, $hash, $teljes_nev, $cegnev);

if ($stmt->execute()) {
  $_SESSION['user_id'] = $stmt->insert_id;
  $_SESSION['email'] = $email;
  $_SESSION['teljes_nev'] = $teljes_nev;
  header("Location: dashboard.php");
  exit;
}
exit('Hiba történt a regisztrációnál: ' . $stmt->error);
