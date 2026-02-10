<?php
require_once __DIR__ . '/config.php';

function h($s){ return htmlspecialchars($s ?? "", ENT_QUOTES, "UTF-8"); }
$id = intval($_GET['id'] ?? 0);
if ($id <= 0) { http_response_code(404); exit('Termék nem található.'); }

/* --- Termék + kategória + összesített keszlet --- */
$stmt = $mysqli->prepare("
  SELECT t.id, t.cikkszam, t.nev, t.leiras, t.egysegar, t.kep_url, t.keszlet, k.nev AS kategoria
  FROM termekek t
  LEFT JOIN kategoriak k ON k.id = t.kategoria_id
  WHERE t.id = ?
");
$stmt->bind_param("i", $id);
$stmt->execute();
$termek = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$termek) { http_response_code(404); exit('Termék nem található.'); }

/* --- Készlet raktáranként (ha van ilyen táblád) --- */
$keszletek = [];
try {
  $q = $mysqli->prepare("
    SELECT r.nev AS raktar, h.kod AS hely, kz.mennyiseg
    FROM keszlet kz
    LEFT JOIN raktarak r ON r.id = kz.raktar_id
    LEFT JOIN helyek h ON h.id = kz.hely_id
    WHERE kz.termek_id = ?
    ORDER BY r.nev, h.kod
  ");
  $q->bind_param("i", $id);
  $q->execute();
  $keszletek = $q->get_result()->fetch_all(MYSQLI_ASSOC);
  $q->close();
} catch (Throwable $e) {
  // Ha nincs ilyen tábla, hagyjuk üresen – az UI kezeli.
}

/* Összesített készlet megjelenítéshez */
$stock_total = (int)($termek['keszlet'] ?? 0);
if (!empty($keszletek)) {
  $stock_total = 0;
  foreach ($keszletek as $k) $stock_total += (int)$k['mennyiseg'];
}
?>
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title><?php echo h($termek['nev']); ?> – Raktár Pro</title>
  <link rel="stylesheet" href="style_home.css" />
  <style>
    .wrap{width:min(1100px,94vw);margin:24px auto;display:grid;grid-template-columns:1fr 1.2fr;gap:24px}
    .card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:16px}
    .imgbox{background:#eef2ff;border-radius:12px;display:grid;place-items:center;aspect-ratio:1/1;overflow:hidden}
    .imgbox img{max-width:100%;max-height:100%;object-fit:contain}
    .title{font-size:26px;font-weight:900;margin:6px 0}
    .meta{color:#6b7280;margin:2px 0}
    .price{font-size:22px;font-weight:900;margin-top:8px}
    .btn{display:inline-flex;gap:8px;align-items:center;background:#111827;color:#fff;border:none;border-radius:12px;padding:12px 16px;font-weight:800;cursor:pointer}
    .btn.outline{background:#fff;color:#111827;border:1px solid #111827}
    .qty{display:inline-flex;align-items:center;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden}
    .qty input{width:68px;padding:10px;border:0;outline:0;text-align:center}
    .table{width:100%;border-collapse:collapse;margin-top:10px}
    .table th,.table td{border-bottom:1px solid #e5e7eb;padding:8px;text-align:left}
    .crumbs{color:#6b7280;margin:8px 0}
    .badge{display:inline-block;padding:4px 8px;border-radius:9999px;border:1px solid #e5e7eb}
  </style>
</head>
<body>
  <!-- NAV -->
  <div class="nav">
    <div class="container row">
      <div class="brand">
        <div class="logo">RP</div>
        <div><div>Raktár Pro</div><small style="color:#6b7280">Termék</small></div>
      </div>
      <div class="right">
        <a class="btn outline" href="index.php">← Vissza</a>
        <a class="btn outline" href="kosar.php">🛒 Kosár</a>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="crumbs">Kategória: <?php echo h($termek['kategoria'] ?: 'N/A'); ?> • Cikkszám: <?php echo h($termek['cikkszam']); ?></div>
    <div class="wrap">
      <div class="card">
        <div class="imgbox">
          <?php if (!empty($termek['kep_url'])): ?>
            <img src="<?php echo h($termek['kep_url']); ?>" alt="<?php echo h($termek['nev']); ?>">
          <?php else: ?>
            <div style="font-weight:900;color:#1f2937"><?php echo h($termek['cikkszam']); ?></div>
          <?php endif; ?>
        </div>
      </div>

      <div class="card">
        <div class="title"><?php echo h($termek['nev']); ?></div>
        <div class="meta"><?php echo h($termek['kategoria'] ?: ''); ?></div>
        <div class="meta"><?php echo nl2br(h($termek['leiras'] ?: '')); ?></div>
        <div class="price" style="display:flex;align-items:center;gap:10px">
          <?php echo number_format((float)$termek['egysegar'], 0, '', ' '); ?> Ft
          <?php if ($stock_total <= 0): ?>
            <span class="badge" style="background:#fee2e2;color:#991b1b;border:1px solid #fecaca">Nincs készleten</span>
          <?php else: ?>
            <span class="badge" style="background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0"><?php echo $stock_total; ?> db</span>
          <?php endif; ?>
        </div>

        <form method="post" action="add_to_cart.php" style="margin-top:14px;display:flex;gap:10px;align-items:center">
          <?php if ($stock_total > 0): ?>
            <div class="qty">
              <input type="number" name="qty" value="1" min="1" max="<?php echo (int)$stock_total; ?>" />
            </div>
            <input type="hidden" name="termek_id" value="<?php echo (int)$termek['id']; ?>">
            <button class="btn" type="submit">🛒 Kosárba</button>
            <a class="btn outline" href="kosar.php">Kosár megnyitása</a>
          <?php else: ?>
            <div class="meta" style="font-weight:700">Jelenleg nem elérhető</div>
          <?php endif; ?>
        </form>

        <div style="margin-top:16px">
          <div style="font-weight:800;margin-bottom:6px">Készlet elérhetőség</div>
          <?php if (!empty($keszletek)): ?>
            <table class="table">
              <thead><tr><th>Raktár</th><th>Hely</th><th>Mennyiség</th></tr></thead>
              <tbody>
                <?php foreach($keszletek as $k): ?>
                  <tr>
                    <td><?php echo h($k['raktar'] ?: ''); ?></td>
                    <td><?php echo h($k['hely'] ?: ''); ?></td>
                    <td><?php echo h((string)$k['mennyiseg']); ?> db</td>
                  </tr>
                <?php endforeach; ?>
              </tbody>
            </table>
          <?php else: ?>
            <div class="meta">Nincs részletes raktárkészlet adat.</div>
          <?php endif; ?>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
