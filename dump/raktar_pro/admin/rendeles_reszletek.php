<?php
require_once __DIR__ . '/_init.php'; // admin check, $mysqli, h(), csrf_token/csrf_verify (configból)

$id = (int)($_GET['id'] ?? 0);
if ($id <= 0) { exit('Hibás rendelés azonosító.'); }

if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(16));
$csrf = $_SESSION['csrf'];

$allowed = ['uj','feldolgozas','kiszallitva','teljesitve','torolve'];
$msg = $err = '';

// --- POST: státusz módosítás
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  if (!hash_equals($csrf, $_POST['csrf'] ?? '')) {
    $err = "Érvénytelen kérés (CSRF).";
  } else {
    $uj = $_POST['statusz'] ?? '';
    if (!in_array($uj, $allowed, true)) {
      $err = "Ismeretlen státusz.";
    } else {
      $u = $mysqli->prepare("UPDATE rendelesek SET statusz = ? WHERE id = ?");
      $u->bind_param("si", $uj, $id);
      if ($u->execute()) {
        $msg = "Státusz frissítve: " . htmlspecialchars($uj, ENT_QUOTES, 'UTF-8');
      } else {
        $err = "Hiba történt a módosításkor: " . $u->error;
      }
      $u->close();
    }
  }
}

// --- Fej lekérés
$h = $mysqli->prepare("SELECT id, nev, email, cim, fizetes_mod, osszeg_brutt, statusz, letrehozva
                       FROM rendelesek WHERE id = ?");
$h->bind_param("i", $id);
$h->execute();
$order = $h->get_result()->fetch_assoc();
$h->close();
if (!$order) { exit('Rendelés nem található.'); }

// --- Tételek lekérése
$t = $mysqli->prepare("SELECT rt.termek_id, rt.mennyiseg, rt.egysegar, rt.osszeg, t2.nev, t2.cikkszam, t2.kep_url
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
  <title>Rendelés #<?php echo (int)$order['id']; ?> – Admin</title>
  <link rel="stylesheet" href="style_admin.css">
  <style>
    .container{width:min(1100px,94vw);margin:20px auto}
    .card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:16px;margin-bottom:16px}
    .row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .kv{display:grid;grid-template-columns:180px 1fr;gap:6px}
    .status-badge{display:inline-block;padding:4px 8px;border-radius:9999px;border:1px solid #e5e7eb;background:#f9fafb}
    .table{width:100%;border-collapse:collapse}
    .table th,.table td{padding:10px;border-bottom:1px solid #e5e7eb;text-align:left;vertical-align:middle}
    .thumb{width:64px;height:64px;border-radius:8px;object-fit:cover;border:1px solid #e5e7eb;background:#fafafa}
    .btn{display:inline-flex;gap:8px;align-items:center;background:#111827;color:#fff;border:none;border-radius:10px;padding:10px 12px;text-decoration:none;cursor:pointer}
    .btn.outline{background:#fff;color:#111827;border:1px solid #111827}
    .note{padding:10px 12px;border-radius:10px;margin-bottom:12px}
    .notice{background:#ecfdf5;border:1px solid #a7f3d0;color:#065f46}
    .error{background:#fef2f2;border:1px solid #fecaca;color:#7f1d1d}
  </style>
</head>
<body>
<div class="container">
  <div class="card">
    <div class="row" style="justify-content:space-between">
      <h1>Rendelés #<?php echo (int)$order['id']; ?></h1>
      <div class="row">
        <a class="btn outline" href="rendelesek.php">← Rendelések</a>
        <a class="btn outline" href="/raktar_pro/index.php">🏪 Bolt</a>
      </div>
    </div>

    <?php if ($msg): ?><div class="note notice"><?php echo h($msg); ?></div><?php endif; ?>
    <?php if ($err): ?><div class="note error"><?php echo h($err); ?></div><?php endif; ?>

    <div class="grid">
      <div class="card" style="margin:0">
        <h3 style="margin-top:0">Vevő adatai</h3>
        <div class="kv">
          <div><strong>Név</strong></div><div><?php echo h($order['nev']); ?></div>
          <div><strong>E-mail</strong></div><div><?php echo h($order['email']); ?></div>
          <div><strong>Cím</strong></div><div><?php echo h($order['cim']); ?></div>
          <div><strong>Fizetés</strong></div><div><?php echo h($order['fizetes_mod']); ?></div>
          <div><strong>Összeg</strong></div><div><strong><?php echo number_format((int)$order['osszeg_brutt'], 0, '', ' '); ?> Ft</strong></div>
          <div><strong>Státusz</strong></div><div><span class="status-badge"><?php echo h($statuses[$order['statusz']] ?? $order['statusz']); ?></span></div>
          <div><strong>Dátum</strong></div><div><?php echo h($order['letrehozva']); ?></div>
        </div>
      </div>

      <div class="card" style="margin:0">
        <h3 style="margin-top:0">Státusz módosítás</h3>
        <form method="post" class="row">
          <input type="hidden" name="csrf" value="<?php echo h($csrf); ?>">
          <select name="statusz" style="padding:10px;border:1px solid #e5e7eb;border-radius:10px">
            <?php foreach ($statuses as $k=>$v): ?>
              <option value="<?php echo h($k); ?>" <?php if($k===$order['statusz']) echo 'selected'; ?>>
                <?php echo h($v); ?>
              </option>
            <?php endforeach; ?>
          </select>
          <button class="btn" type="submit">Mentés</button>
        </form>
      </div>
    </div>
  </div>

  <div class="card">
    <h3 style="margin-top:0">Tételek</h3>
    <table class="table">
      <thead>
        <tr>
          <th></th>
          <th>Termék</th>
          <th>Cikkszám</th>
          <th>Egységár</th>
          <th>Menny.</th>
          <th>Összeg</th>
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
