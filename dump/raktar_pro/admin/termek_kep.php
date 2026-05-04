<?php
require_once __DIR__ . '/_init.php';

$id = (int)($_GET['id'] ?? 0);
if ($id <= 0) { exit('Hiányzó termék azonosító.'); }

// termék ellenőrzése
$stmt = $mysqli->prepare("SELECT id, nev, cikkszam, kep_url FROM termekek WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$prod = $stmt->get_result()->fetch_assoc();
$stmt->close();
if (!$prod) { exit('Termék nem található.'); }

$msg = $err = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // opcionálisan külső kép URL megadása
  $external = trim($_POST['external_url'] ?? '');

  // ha fájlt töltenek fel
  if (!empty($_FILES['kep']['name'])) {
    $f = $_FILES['kep'];
    if ($f['error'] !== UPLOAD_ERR_OK) {
      $err = 'Feltöltési hiba (kód: '.$f['error'].').';
    } else {
      // MIME ellenőrzés
      $fi = new finfo(FILEINFO_MIME_TYPE);
      $mime = $fi->file($f['tmp_name']);
      $allowed = ['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp','image/gif'=>'gif'];
      if (!isset($allowed[$mime])) {
        $err = 'Csak JPG, PNG, WEBP vagy GIF tölthető fel.';
      } elseif ($f['size'] > 5*1024*1024) {
        $err = 'A fájl túl nagy (max 5 MB).';
      } else {
        // cél mappa
        $dir = __DIR__ . '/../uploads/termekek';
        if (!is_dir($dir)) { @mkdir($dir, 0775, true); }
        // fájlnév: termekID_timestamp.ext
        $ext = $allowed[$mime];
        $fname = $id . '_' . time() . '.' . $ext;
        $targetAbs = $dir . '/' . $fname;
        $targetUrl = '/raktar_pro/uploads/termekek/' . $fname;

        if (!move_uploaded_file($f['tmp_name'], $targetAbs)) {
          $err = 'A fájlt nem sikerült véglegesen menteni.';
        } else {
          // elérési jog (ha kell)
          @chmod($targetAbs, 0664);
          // DB frissítés
          $u = $mysqli->prepare("UPDATE termekek SET kep_url = ? WHERE id = ?");
          $u->bind_param("si", $targetUrl, $id);
          $u->execute();
          $u->close();
          $msg = 'Kép feltöltve és mentve.';
          // frissítsük a $prod-ot, hogy azonnal látszódjon
          $prod['kep_url'] = $targetUrl;
        }
      }
    }
  } elseif ($external !== '') {
    // külső URL mentése
    $u = $mysqli->prepare("UPDATE termekek SET kep_url = ? WHERE id = ?");
    $u->bind_param("si", $external, $id);
    $u->execute();
    $u->close();
    $prod['kep_url'] = $external;
    $msg = 'Külső kép URL mentve.';
  } elseif (isset($_POST['delete']) && $_POST['delete'] === '1') {
    // kép törlése a rekordból (fájlt nem töröljük most)
    $u = $mysqli->prepare("UPDATE termekek SET kep_url = NULL WHERE id = ?");
    $u->bind_param("i", $id);
    $u->execute();
    $u->close();
    $prod['kep_url'] = null;
    $msg = 'Kép hivatkozás törölve.';
  } else {
    $err = 'Nem érkezett fájl vagy URL.';
  }
}
?>
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <title>Admin – Kép feltöltés</title>
  <link rel="stylesheet" href="style_admin.css">
</head>
<body>
<div class="container">
  <div class="card">
    <h1>🖼️ Kép feltöltés – <?php echo h($prod['nev']); ?> (<?php echo h($prod['cikkszam']); ?>)</h1>
    <div class="row" style="justify-content:space-between;margin-bottom:10px">
      <a class="btn outline" href="termekek.php">← Vissza a termékekhez</a>
      <a class="btn outline" href="/raktar_pro/termek.php?id=<?php echo (int)$prod['id']; ?>" target="_blank">Termék megnyitása</a>
    </div>

    <?php if ($msg): ?><div class="notice"><?php echo h($msg); ?></div><?php endif; ?>
    <?php if ($err): ?><div class="error"><?php echo h($err); ?></div><?php endif; ?>

    <div class="row">
      <div class="card" style="flex:1;min-width:280px">
        <h3>Jelenlegi kép</h3>
        <?php if (!empty($prod['kep_url'])): ?>
          <img src="<?php echo h($prod['kep_url']); ?>" alt="" style="max-width:100%;border:1px solid #e5e7eb;border-radius:10px">
          <form method="post" style="margin-top:10px">
            <input type="hidden" name="delete" value="1">
            <button class="btn outline" type="submit">Kép hivatkozás törlése</button>
          </form>
        <?php else: ?>
          <div class="badge">Ehhez a termékhez még nincs kép.</div>
        <?php endif; ?>
      </div>

      <div class="card" style="flex:1;min-width:280px">
        <h3>Fájl feltöltése</h3>
        <form method="post" enctype="multipart/form-data">
          <input type="file" name="kep" accept="image/*" required>
          <div style="margin-top:8px"><button class="btn" type="submit">Feltöltés</button></div>
          <div class="badge" style="margin-top:8px">Megengedett: JPG / PNG / WEBP / GIF, max 5 MB</div>
        </form>
      </div>

      <div class="card" style="flex:1;min-width:280px">
        <h3>Külső kép URL</h3>
        <form method="post">
          <input type="text" name="external_url" placeholder="https://példa.hu/kep.jpg" value="">
          <div style="margin-top:8px"><button class="btn" type="submit">URL mentése</button></div>
        </form>
      </div>
    </div>

  </div>
</div>
</body>
</html>
