<?php
require_once __DIR__ . '/_init.php';

// kis szűrő (keresés)
$q = trim($_GET['q'] ?? '');
$where = "WHERE 1=1";
$params = [];
$types = '';

if ($q !== '') {
  $where .= " AND (t.nev LIKE CONCAT('%', ?, '%') OR t.cikkszam LIKE CONCAT('%', ?, '%'))";
  $params = [$q, $q];
  $types = 'ss';
}

// Lekérdezés
$sql = "SELECT t.id, t.cikkszam, t.nev, t.egysegar, t.kep_url, t.keszlet, k.nev AS kategoria

        FROM termekek t
        LEFT JOIN kategoriak k ON k.id = t.kategoria_id
        $where
        ORDER BY t.id DESC
        LIMIT 200";

$stmt = $mysqli->prepare($sql);
if ($params) { $stmt->bind_param($types, ...$params); }
$stmt->execute();
$rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();
?>
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <title>Admin – Termékek</title>
  <link rel="stylesheet" href="style_admin.css">
  <style>
    img.thumb {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 6px;
      border: 1px solid #ddd;
    }
    .badge {
      background: #f3f4f6;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.9em;
      color: #374151;
    }
    .table td, .table th { vertical-align: middle; }
    .btn.danger { background:#dc2626; color:#fff; }
    .btn.danger:hover { background:#b91c1c; }
  </style>
</head>
<body>
<div class="container">
  <div class="card">
    <div class="row" style="justify-content:space-between;align-items:center;">
      <h1>📦 Termékek</h1>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
        <a class="btn outline" href="/raktar_pro/admin/kategoriak.php">🏷️ Kategóriák</a>
        <a class="btn outline" href="/raktar_pro/admin/index.php">← Dashboard</a>
        <a class="btn outline" href="/raktar_pro/index.php">🏪 Bolt nézete</a>
        <span class="badge">Admin: <?php echo h($_SESSION['teljes_nev'] ?? ''); ?></span>
      </div>
    </div>

    <form method="get" class="row" style="margin:10px 0;gap:8px;">
      <input type="text" name="q" placeholder="Keresés név / cikkszám alapján" value="<?php echo h($q); ?>" style="flex:1;">
      <button class="btn">🔍 Keresés</button>
    </form>

    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Kép</th>
          <th>Cikkszám</th>
          <th>Név</th>
          <th>Kategória</th>
          <th>Ár</th>
          <th>Készlet</th>
          <th>Műveletek</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($rows as $r): ?>
          <tr>
            <td><?php echo (int)$r['id']; ?></td>
            <td>
              <?php if (!empty($r['kep_url'])): ?>
                <img class="thumb" src="<?php echo h($r['kep_url']); ?>" alt="">
              <?php else: ?>
                <span class="badge">nincs kép</span>
              <?php endif; ?>
            </td>
            <td><?php echo h($r['cikkszam']); ?></td>
            <td><?php echo h($r['nev']); ?></td>
            <td><?php echo h($r['kategoria']); ?></td>
            <td><?php echo number_format((float)$r['egysegar'], 0, '', ' '); ?> Ft</td>
            <td><?php echo (int)$r['keszlet'] ?? 0; ?> db</td>

            <td class="row" style="gap:6px;flex-wrap:wrap;">
              <a class="btn outline" href="termek_szerkeszt.php?id=<?php echo (int)$r['id']; ?>">✏️ Szerkesztés</a>
              <a class="btn outline" href="termek_kep.php?id=<?php echo (int)$r['id']; ?>">🖼️ Kép</a>
              <a class="btn outline" href="/raktar_pro/termek.php?id=<?php echo (int)$r['id']; ?>" target="_blank">👁️ Megnyitás</a>
              <a class="btn danger" href="termek_torles.php?id=<?php echo (int)$r['id']; ?>">🗑️ Törlés</a>
            </td>
          </tr>
        <?php endforeach; ?>
        <?php if (empty($rows)): ?>
          <tr><td colspan="7" style="text-align:center;color:#666;">Nincs találat.</td></tr>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>
</body>
</html>
