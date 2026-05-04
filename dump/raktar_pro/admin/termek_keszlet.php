<?php
require_once __DIR__ . '/_init.php';

$id = (int)($_GET['id'] ?? 0);
if ($id <= 0) exit('Hibás termék ID.');

$stmt = $mysqli->prepare("SELECT id, nev, keszlet FROM termekek WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$t = $stmt->get_result()->fetch_assoc();
$stmt->close();
if (!$t) exit('Termék nem található.');

$msg = $err = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $uj = max(0, intval($_POST['keszlet'] ?? 0));
  $upd = $mysqli->prepare("UPDATE termekek SET keszlet = ? WHERE id = ?");
  $upd->bind_param("ii", $uj, $id);
  if ($upd->execute()) $msg = "Készlet frissítve: {$uj} db";
  else $err = "Hiba: " . $upd->error;
  $upd->close();
}
?>
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <title>Készlet módosítása</title>
  <link rel="stylesheet" href="style_admin.css">
</head>
<body>
<div class="container">
  <div class="card">
    <h1>📦 Készlet módosítása</h1>
    <?php if($msg): ?><div class="notice"><?php echo h($msg); ?></div><?php endif; ?>
    <?php if($err): ?><div class="error"><?php echo h($err); ?></div><?php endif; ?>

    <form method="post" class="row" style="gap:8px">
      <label>Termék: <strong><?php echo h($t['nev']); ?></strong></label>
      <input type="number" name="keszlet" value="<?php echo (int)$t['keszlet']; ?>" min="0">
      <button class="btn" type="submit">Mentés</button>
      <a class="btn outline" href="termekek.php">Vissza</a>
    </form>
  </div>
</div>
</body>
</html>
