<?php
require_once __DIR__ . '/_init.php'; // jogosultság + config + h()

$id = (int)($_GET['id'] ?? 0);
if ($id <= 0) { exit('Hiányzó vagy hibás termék azonosító.'); }

// Kategóriák lekérése a legördülőhöz
$kats = [];
$kq = $mysqli->query("SELECT id, nev FROM kategoriak ORDER BY nev");
while ($row = $kq->fetch_assoc()) { $kats[] = $row; }
$kq->free();

// Termék betöltése
$stmt = $mysqli->prepare("
  SELECT id, cikkszam, nev, leiras, egysegar, kategoria_id, kep_url
  FROM termekek
  WHERE id = ?
");
$stmt->bind_param("i", $id);
$stmt->execute();
$prod = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$prod) { exit('A termék nem található.'); }

$msg = $err = '';
$csrf_ok = true; // (egyszerűsített – később tehetünk valódi CSRF tokent is)

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Értékek
  $cikkszam    = trim($_POST['cikkszam'] ?? '');
  $nev         = trim($_POST['nev'] ?? '');
  $leiras      = trim($_POST['leiras'] ?? '');
  $egysegar    = (float)($_POST['egysegar'] ?? 0);
  $kategoria_id= (int)($_POST['kategoria_id'] ?? 0);
  $kep_url     = trim($_POST['kep_url'] ?? '');

  // Szerver oldali ellenőrzés
  if ($nev === '')            { $err = 'A név kötelező.'; }
  if ($cikkszam === '')       { $err = 'A cikkszám kötelező.'; }
  if ($egysegar <= 0)         { $err = 'Az egységár legyen pozitív.'; }
  if ($kategoria_id <= 0)     { $err = 'Válassz kategóriát.'; }

  if (!$err && $csrf_ok) {
    $u = $mysqli->prepare("
      UPDATE termekek
         SET cikkszam = ?, nev = ?, leiras = ?, egysegar = ?, kategoria_id = ?, kep_url = ?
       WHERE id = ?
    ");
    $u->bind_param("sssdisi", $cikkszam, $nev, $leiras, $egysegar, $kategoria_id, $kep_url, $id);
    if ($u->execute()) {
      $msg = 'Változtatások elmentve.';
      // frissítsük a lokális $prod-ot, hogy a formban azonnal látszódjon
      $prod['cikkszam'] = $cikkszam;
      $prod['nev'] = $nev;
      $prod['leiras'] = $leiras;
      $prod['egysegar'] = $egysegar;
      $prod['kategoria_id'] = $kategoria_id;
      $prod['kep_url'] = $kep_url;
    } else {
      $err = 'Mentési hiba: ' . $u->error;
    }
    $u->close();
  }
}
?>
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <title>Admin – Termék szerkesztés</title>
  <link rel="stylesheet" href="style_admin.css">
  <style>
    .formgrid{display:grid;grid-template-columns:1fr 2fr;gap:10px}
    .formgrid label{font-weight:700}
    .actions{display:flex;gap:8px;flex-wrap:wrap}
  </style>
</head>
<body>
<div class="container">
  <div class="card">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
      <h1 style="margin:0">✏️ Termék szerkesztése</h1>
      <div class="actions">
        <a class="btn outline" href="termekek.php">← Vissza a listához</a>
        <a class="btn outline" href="/raktar_pro/termek.php?id=<?php echo (int)$prod['id']; ?>" target="_blank">Megnyitás</a>
        <a class="btn outline" href="termek_kep.php?id=<?php echo (int)$prod['id']; ?>">🖼️ Kép feltöltés</a>
      </div>
    </div>
  </div>

  <div class="card">
    <?php if ($msg): ?><div class="notice"><?php echo h($msg); ?></div><?php endif; ?>
    <?php if ($err): ?><div class="error"><?php echo h($err); ?></div><?php endif; ?>

    <form method="post">
      <div class="formgrid">
        <label for="cikkszam">Cikkszám</label>
        <input id="cikkszam" name="cikkszam" type="text" value="<?php echo h($prod['cikkszam']); ?>" required>

        <label for="nev">Név</label>
        <input id="nev" name="nev" type="text" value="<?php echo h($prod['nev']); ?>" required>

        <label for="leiras">Leírás</label>
        <textarea id="leiras" name="leiras" rows="6"><?php echo h($prod['leiras']); ?></textarea>

        <label for="egysegar">Egységár (Ft)</label>
        <input id="egysegar" name="egysegar" type="number" step="0.01" min="0" value="<?php echo h($prod['egysegar']); ?>" required>

        <label for="kategoria_id">Kategória</label>
        <select id="kategoria_id" name="kategoria_id" required>
          <option value="">– Válassz –</option>
          <?php foreach($kats as $k): ?>
            <option value="<?php echo (int)$k['id']; ?>" <?php if((int)$prod['kategoria_id']===(int)$k['id']) echo 'selected'; ?>>
              <?php echo h($k['nev']); ?>
            </option>
          <?php endforeach; ?>
        </select>

        <label for="kep_url">Kép URL (opcionális)</label>
        <input id="kep_url" name="kep_url" type="text" placeholder="/raktar_pro/uploads/termekek/..." value="<?php echo h($prod['kep_url']); ?>">
      </div>

      <div style="margin-top:12px;display:flex;gap:8px">
        <button class="btn" type="submit">💾 Mentés</button>
        <a class="btn outline" href="termekek.php">Mégse</a>
      </div>
    </form>
  </div>
</div>
</body>
</html>
