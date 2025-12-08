<?php
require_once __DIR__ . '/_init.php';

$id = (int)($_GET['id'] ?? 0);
if ($id <= 0) exit('Hibás termékazonosító.');

// --- Terméknév lekérdezése
$stmt = $mysqli->prepare("SELECT nev FROM termekek WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$prod = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$prod) exit('A termék nem található.');

$msg = '';
$err = '';

// Segédfüggvény: létezik-e a tábla az adatbázisban
function table_exists(mysqli $db, string $table): bool {
  $check = $db->prepare("
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = DATABASE() AND table_name = ?
    LIMIT 1
  ");
  $check->bind_param("s", $table);
  $check->execute();
  $exists = $check->get_result()->num_rows > 0;
  $check->close();
  return $exists;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['confirm'])) {
  try {
    $mysqli->begin_transaction();

    // --- 1) Ha van rendelési tétel tábla és hivatkozik rá, ne töröljük
    $hasOrder = false;
    if (table_exists($mysqli, 'rendeles_tetelek_app')) {
      $chk = $mysqli->prepare("SELECT COUNT(*) AS c FROM rendeles_tetelek_app WHERE termek_id = ?");
      $chk->bind_param("i", $id);
      $chk->execute();
      $hasOrder = (int)($chk->get_result()->fetch_assoc()['c'] ?? 0) > 0;
      $chk->close();
    } elseif (table_exists($mysqli, 'rendeles_tetelek')) {
      $chk = $mysqli->prepare("SELECT COUNT(*) AS c FROM rendeles_tetelek WHERE termek_id = ?");
      $chk->bind_param("i", $id);
      $chk->execute();
      $hasOrder = (int)($chk->get_result()->fetch_assoc()['c'] ?? 0) > 0;
      $chk->close();
    }

    if ($hasOrder) {
      $mysqli->rollback();
      $err = "A(z) „" . h($prod['nev']) . "” szerepel korábbi rendelésben, ezért nem törölhető. "
           . "Javaslat: archiváld (állítsd inaktívra) a törlés helyett.";
    }

    // --- 2) Gyerek táblák takarítása (csak ha léteznek)
    if (!$err) {
      // Kedvencek
      if (table_exists($mysqli, 'kedvencek')) {
        $q = $mysqli->prepare("DELETE FROM kedvencek WHERE termek_id = ?");
        $q->bind_param("i", $id);
        $q->execute();
        $q->close();
      }

      // Kosár tételek (ha lenne ilyen táblád)
      if (table_exists($mysqli, 'kosar_tetelek')) {
        $q = $mysqli->prepare("DELETE FROM kosar_tetelek WHERE termek_id = ?");
        $q->bind_param("i", $id);
        $q->execute();
        $q->close();
      }

      // ✅ Készlet (ez okozta most a FK hibát)
      if (table_exists($mysqli, 'keszlet')) {
        $q = $mysqli->prepare("DELETE FROM keszlet WHERE termek_id = ?");
        $q->bind_param("i", $id);
        $q->execute();
        $q->close();
      }

      // Ha van még más hivatkozó tábla nálad, ide veheted fel hasonlóan:
      // pl. termek_cimkek, termek_kepek, stb.

      // --- 3) Termék törlése
      $del = $mysqli->prepare("DELETE FROM termekek WHERE id = ?");
      $del->bind_param("i", $id);
      $del->execute();
      $del->close();

      $mysqli->commit();
      $msg = "A(z) „" . h($prod['nev']) . "” sikeresen törölve lett.";
    }

  } catch (Throwable $e) {
    $mysqli->rollback();
    $err = "Hiba történt a törlés közben: " . $e->getMessage();
  }
}
?>
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <title>Termék törlése</title>
  <link rel="stylesheet" href="style_admin.css">
  <style>
    .danger {background:#dc2626;color:#fff}
    .danger:hover {background:#b91c1c}
  </style>
</head>
<body>
<div class="container">
  <div class="card">
    <?php if ($msg): ?>
      <div class="notice"><?php echo $msg; ?></div>
      <a class="btn" href="termekek.php">← Vissza a listához</a>

    <?php elseif ($err): ?>
      <div class="error"><?php echo $err; ?></div>
      <a class="btn outline" href="termekek.php">← Vissza a listához</a>

    <?php else: ?>
      <h2>🗑️ Termék törlése</h2>
      <p>Biztosan törölni szeretnéd a következő terméket?</p>
      <p><strong><?php echo h($prod['nev']); ?></strong></p>

      <form method="post">
        <button class="btn danger" type="submit" name="confirm" value="1">Igen, törlöm</button>
        <a class="btn outline" href="termekek.php">Mégse</a>
      </form>
    <?php endif; ?>
  </div>
</div>
</body>
</html>
