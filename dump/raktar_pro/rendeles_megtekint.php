<?php
require_once __DIR__ . '/config.php';
function h($s){ return htmlspecialchars($s ?? "", ENT_QUOTES, "UTF-8"); }

if (!isset($_SESSION['user_id'])) {
  header('Location: bejelentkezes.html'); exit;
}
$uid = (int)$_SESSION['user_id'];
$id  = (int)($_GET['id'] ?? 0);
if ($id <= 0) { exit('Hibás rendelés azonosító.'); }

// Fej – csak a saját rendelés legyen látható
$h = $mysqli->prepare("SELECT id, nev, email, cim, fizetes_mod, osszeg_brutt, statusz, letrehozva, felhasznalo_id
                       FROM rendelesek WHERE id = ?");
$h->bind_param("i", $id);
$h->execute();
$order = $h->get_result()->fetch_assoc();
$h->close();

if (!$order || (int)$order['felhasznalo_id'] !== $uid) {
  exit('Nincs jogosultság ehhez a rendeléshez.');
}

// Tételek
$t = $mysqli->prepare("SELECT rt.termek_id, rt.mennyiseg, rt.egysegar, rt.osszeg,
                              t2.nev, t2.cikkszam, t2.kep_url
                       FROM rendeles_tetelek_app rt
                       LEFT JOIN termekek t2 ON t2.id = rt.termek_id
                       WHERE rt.rendeles_id = ?");
$t->bind_param("i", $id);
$t->execute();
$items = $t->get_result()->fetch_all(MYSQLI_ASSOC);
$t->close();

$statuses = ['uj'=>'Új','feldolgozas'=>'Feldolgozás','kiszallitva'=>'Kiszállítva','teljesitve'=>'Teljesítve','torolve'=>'Törölve'];
?>
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <title>Rendelés #<?php echo (int)$order['id']; ?> – Raktár Pro</title>
  <link rel="stylesheet" href="style_home.css" />
  <style>
    .wrap{width:min(980px,94vw);margin:24px auto;display:grid;gap:16px}
    .card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:16px}
    .kv{display:grid;grid-template-columns:180px 1fr;gap:6px}
    .table{width:100%;border-collapse:collapse}
    .table th,.table td{padding:10px;border-bottom:1px solid #e5e7eb;text-align:left;vertical-align:middle}
    .thumb{width:64px;height:64px;border-radius:8px;object-fit:cover;border:1px solid #e5e7eb;background:#fafafa}
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
        <div><div>Raktár Pro</div><small style="color:#6b7280">Rendelés részletei</small></div>
      </div>
      <div class="right">
        <a class="btn outline" href="rendeleseim.php">← Rendeléseim</a>
        <a class="btn outline" href="index.php">🏪 Bolt</a>
      </div>
    </div>
  </div>

  <div class="wrap">
    <div class="card">
      <h2 style="margin:0 0 8px">Rendelés #<?php echo (int)$order['id']; ?></h2>
      <div class="kv">
        <div><strong>Dátum</strong></div><div><?php echo h($order['letrehozva']); ?></div>
        <div><strong>Státusz</strong></div><div><span class="badge"><?php echo h($statuses[$order['statusz']] ?? $order['statusz']); ?></span></div>
        <div><strong>Végösszeg</strong></div><div><strong><?php echo number_format((int)$order['osszeg_brutt'], 0, '', ' '); ?> Ft</strong></div>
        <div><strong>Szállítási cím</strong></div><div><?php echo h($order['cim']); ?></div>
        <div><strong>Fizetési mód</strong></div><div><?php echo h($order['fizetes_mod']); ?></div>
      </div>
    </div>

    <div class="card">
      <h3 style="margin-top:0">Tételek</h3>
      <table class="table">
        <thead>
          <tr>
            <th></th><th>Termék</th><th>Cikkszám</th><th>Egységár</th><th>Menny.</th><th>Összeg</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($items as $it): ?>
            <tr>
              <td>
                <?php if (!empty($it['kep_url'])): ?>
                  <img class="thumb" src="<?php echo h($it['kep_url']); ?>" alt="">
                <?php else: ?>
                  <div class="thumb" style="display:grid;place-items:center;color:#9ca3af">—</div>
                <?php endif; ?>
              </td>
              <td><?php echo h($it['nev'] ?? ''); ?></td>
              <td><?php echo h($it['cikkszam'] ?? ''); ?></td>
              <td><?php echo number_format((int)$it['egysegar'], 0, '', ' '); ?> Ft</td>
              <td><?php echo (int)$it['mennyiseg']; ?></td>
              <td><strong><?php echo number_format((int)$it['osszeg'], 0, '', ' '); ?> Ft</strong></td>
            </tr>
          <?php endforeach; ?>
          <?php if (empty($items)): ?>
            <tr><td colspan="6" style="text-align:center;color:#6b7280">Nincsenek tételek.</td></tr>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>
