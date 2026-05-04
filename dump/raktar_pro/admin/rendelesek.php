<?php
require_once __DIR__ . '/_init.php'; // admin ellenőrzés, $mysqli, h()

// --- Szűrők
$st = trim($_GET['statusz'] ?? ''); // uj|feldolgozas|kiszallitva|teljesitve|torolve|''(mind)
$q  = trim($_GET['q'] ?? '');       // id, név, email keresés
$from = trim($_GET['from'] ?? '');  // 'YYYY-MM-DD'
$to   = trim($_GET['to'] ?? '');    // 'YYYY-MM-DD'

$where = "WHERE 1=1";
$params = [];
$types  = "";

if ($st !== '') {
  $where  .= " AND r.statusz = ?";
  $params[] = $st; $types .= "s";
}
if ($q !== '') {
  // id pontos találat vagy név/email LIKE
  if (ctype_digit($q)) {
    $where  .= " AND (r.id = ? OR r.nev LIKE CONCAT('%', ?, '%') OR r.email LIKE CONCAT('%', ?, '%'))";
    $params[] = (int)$q; $types .= "i";
    $params[] = $q; $types .= "s";
    $params[] = $q; $types .= "s";
  } else {
    $where  .= " AND (r.nev LIKE CONCAT('%', ?, '%') OR r.email LIKE CONCAT('%', ?, '%'))";
    $params[] = $q; $types .= "s";
    $params[] = $q; $types .= "s";
  }
}
if ($from !== '') {
  $where  .= " AND r.letrehozva >= CONCAT(?, ' 00:00:00')";
  $params[] = $from; $types .= "s";
}
if ($to !== '') {
  $where  .= " AND r.letrehozva <= CONCAT(?, ' 23:59:59')";
  $params[] = $to; $types .= "s";
}

// --- Lekérdezés (utolsó 200)
$sql = "SELECT r.id, r.nev, r.email, r.osszeg_brutt, r.statusz, r.letrehozva
        FROM rendelesek r
        $where
        ORDER BY r.letrehozva DESC
        LIMIT 200";

$stmt = $mysqli->prepare($sql);
if ($params) $stmt->bind_param($types, ...$params);
$stmt->execute();
$rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

$statuses = ['uj'=>'Új','feldolgozas'=>'Feldolgozás','kiszallitva'=>'Kiszállítva','teljesitve'=>'Teljesítve','torolve'=>'Törölve'];
?>
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <title>Admin – Rendelések</title>
  <link rel="stylesheet" href="style_admin.css">
  <style>
    .filters{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}
    .filters input,.filters select{padding:10px;border:1px solid #e5e7eb;border-radius:10px}
    .status-badge{display:inline-block;padding:4px 8px;border-radius:9999px;border:1px solid #e5e7eb;background:#f9fafb}
    .table{width:100%;border-collapse:collapse}
    .table th,.table td{padding:10px;border-bottom:1px solid #e5e7eb;text-align:left}
    .row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .btn{display:inline-flex;gap:8px;align-items:center;background:#111827;color:#fff;border:none;border-radius:10px;padding:10px 12px;text-decoration:none;cursor:pointer}
    .btn.outline{background:#fff;color:#111827;border:1px solid #111827}
    .container{width:min(1100px,94vw);margin:20px auto}
    .card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:16px;margin-bottom:16px}
  </style>
</head>
<body>
<div class="container">
  <div class="card">
    <div class="row" style="justify-content:space-between">
      <h1>🧾 Rendelések</h1>
      <div class="row">
        <a class="btn outline" href="/raktar_pro/admin/index.php">← Dashboard</a>
        <a class="btn outline" href="/raktar_pro/index.php">🏪 Bolt</a>
      </div>
    </div>

    <form class="filters" method="get">
      <select name="statusz">
        <option value="">Minden státusz</option>
        <?php foreach ($statuses as $k=>$v): ?>
          <option value="<?php echo h($k); ?>" <?php if($k===$st) echo 'selected'; ?>><?php echo h($v); ?></option>
        <?php endforeach; ?>
      </select>
      <input type="date" name="from" value="<?php echo h($from); ?>">
      <input type="date" name="to"   value="<?php echo h($to); ?>">
      <input type="text" name="q" placeholder="Keresés: #ID / név / e-mail" value="<?php echo h($q); ?>">
      <button class="btn">Szűrés</button>
      <a class="btn outline" href="rendelesek.php">Szűrők törlése</a>
    </form>

    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Vevő</th>
          <th>E-mail</th>
          <th>Összeg</th>
          <th>Státusz</th>
          <th>Dátum</th>
          <th>Művelet</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($rows as $r): ?>
          <tr>
            <td>#<?php echo (int)$r['id']; ?></td>
            <td><?php echo h($r['nev']); ?></td>
            <td><?php echo h($r['email']); ?></td>
            <td><?php echo number_format((int)$r['osszeg_brutt'], 0, '', ' '); ?> Ft</td>
            <td><span class="status-badge"><?php echo h($statuses[$r['statusz']] ?? $r['statusz']); ?></span></td>
            <td><?php echo h($r['letrehozva']); ?></td>
            <td><a class="btn outline" href="rendeles_reszletek.php?id=<?php echo (int)$r['id']; ?>">Részletek</a></td>
          </tr>
        <?php endforeach; ?>
        <?php if (empty($rows)): ?>
          <tr><td colspan="7" style="color:#6b7280;text-align:center">Nincs találat a szűrésre.</td></tr>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>
</body>
</html>
