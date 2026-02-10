<?php
require_once __DIR__ . '/config.php';
function h($s){ return htmlspecialchars($s ?? "", ENT_QUOTES, "UTF-8"); }

if (!isset($_SESSION['user_id'])) {
  header('Location: bejelentkezes.html'); exit;
}
$uid = (int)$_SESSION['user_id'];

$sql = "SELECT id, osszeg_brutt, statusz, letrehozva
        FROM rendelesek
        WHERE felhasznalo_id = ?
        ORDER BY letrehozva DESC";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("i", $uid);
$stmt->execute();
$orders = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

$statuses = ['uj'=>'Új','feldolgozas'=>'Feldolgozás','kiszallitva'=>'Kiszállítva','teljesitve'=>'Teljesítve','torolve'=>'Törölve'];
?>
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <title>Rendeléseim – Raktár Pro</title>
  <link rel="stylesheet" href="style_home.css" />
  <style>
    .wrap{width:min(980px,94vw);margin:24px auto;display:grid;gap:16px}
    .card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:16px}
    .table{width:100%;border-collapse:collapse}
    .table th,.table td{padding:10px;border-bottom:1px solid #e5e7eb;text-align:left}
    .badge{display:inline-block;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:999px;padding:4px 8px}
    .btn{display:inline-flex;gap:8px;align-items:center;background:#111827;color:#fff;border:none;border-radius:12px;padding:10px 14px;font-weight:800;cursor:pointer;text-decoration:none}
    .btn.outline{background:#fff;color:#111827;border:1px solid #111827}
  </style>
</head>
<body>
  <div class="nav">
    <div class="container row">
      <div class="brand">
        <div class="logo">RP</div>
        <div><div>Raktár Pro</div><small style="color:#6b7280">Rendeléseim</small></div>
      </div>
      <div class="right">
        <a class="btn outline" href="profil.php">← Profil</a>
        <a class="btn outline" href="index.php">🏪 Bolt</a>
      </div>
    </div>
  </div>

  <div class="wrap">
    <div class="card">
      <h2 style="margin:0 0 6px">Rendeléseim</h2>
      <table class="table">
        <thead>
          <tr><th>#</th><th>Dátum</th><th>Státusz</th><th>Végösszeg</th><th></th></tr>
        </thead>
        <tbody>
          <?php foreach($orders as $o): ?>
            <tr>
              <td>#<?php echo (int)$o['id']; ?></td>
              <td><?php echo h($o['letrehozva']); ?></td>
              <td><span class="badge"><?php echo h($statuses[$o['statusz']] ?? $o['statusz']); ?></span></td>
              <td><strong><?php echo number_format((int)$o['osszeg_brutt'], 0, '', ' '); ?> Ft</strong></td>
              <td><a class="btn outline" href="rendeles_megtekint.php?id=<?php echo (int)$o['id']; ?>">Részletek</a></td>
            </tr>
          <?php endforeach; ?>
          <?php if (empty($orders)): ?>
            <tr><td colspan="5" style="color:#6b7280">Még nincs rendelésed.</td></tr>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>
