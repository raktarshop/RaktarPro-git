<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/cart_utils.php';

function h($s){ return htmlspecialchars($s ?? "", ENT_QUOTES, "UTF-8"); }

// Kosár ellenőrzés
$items = cart_items($mysqli);
if (!$items) { header("Location: kosar.php"); exit; }

// CSRF
if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(16));
$csrf = $_SESSION['csrf'];

// Alap űrlapértékek
$pref_nev   = $_SESSION['teljes_nev'] ?? '';
$pref_email = $_SESSION['email'] ?? '';
$pref_cim   = '';

$msg = $err = '';
$total = cart_total($mysqli);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  if (!hash_equals($csrf, $_POST['csrf'] ?? '')) {
    $err = "Érvénytelen kérés (CSRF).";
  } else {
    // Bejövő adatok
    $nev   = trim($_POST['nev'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $cim   = trim($_POST['cim'] ?? '');
    $fiz   = ($_POST['fizetes_mod'] ?? 'utanvet');

    // Pótlások sessionből, végső fallback
    if ($nev   === '') $nev   = trim($_SESSION['teljes_nev'] ?? '');
    if ($email === '') $email = trim($_SESSION['email'] ?? '');
    if ($nev   === '') $nev   = 'Vásárló';
    if ($email === '') $email = 'nincs@pelda.hu';

    // Hossz limit (ha a tábla rövidebb)
    $nev   = mb_substr($nev,   0, 120);
    $email = mb_substr($email, 0, 120);
    $cim   = mb_substr($cim,   0, 255);
    $fiz   = mb_substr($fiz,   0, 50);

    // Validáció
    if ($nev === '' || $email === '' || $cim === '') {
      $err = "Minden mező kötelező (név, e-mail, cím).";
    }
    if (!$err && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
      $err = "Érvénytelen e-mail cím.";
    }

    // Szerver oldali totalszámítás
    $items = cart_items($mysqli);
    $total = cart_total($mysqli);
    if (!$items) $err = "A kosár üres.";

    // Hibánál visszatöltjük a mezőket
    if ($err) { $pref_nev = $nev; $pref_email = $email; $pref_cim = $cim; }

    if (!$err) {
      $uid = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : null;

      try {
        $mysqli->begin_transaction();

        /* 1) KÉSZLETELLENŐRZÉS – minden kosár tételre */
        $stockOk = true;
        $need = []; // pid => qty
        $getStock = $mysqli->prepare("SELECT keszlet, nev FROM termekek WHERE id = ?");
        foreach ($items as $it) {
          $pid = (int)$it['id'];
          $qty = (int)$it['qty'];
          $getStock->bind_param("i", $pid);
          $getStock->execute();
          $rs = $getStock->get_result()->fetch_assoc();
          $curr = (int)($rs['keszlet'] ?? 0);
          if ($qty > $curr) {
            $stockOk = false;
            throw new Exception("A(z) „".h($rs['nev'] ?? 'ismeretlen termék')."” készlete nem elegendő. Készlet: {$curr} db, kért: {$qty} db.");
          }
          $need[$pid] = $qty;
        }
        $getStock->close();

        /* 2) Rendelés fej mentése */
        $sql = "INSERT INTO rendelesek
                  (nev, email, cim, fizetes_mod, osszeg_brutt, statusz, letrehozva, felhasznalo_id)
                VALUES
                  (?,   ?,     ?,   ?,           ?,            'uj',   NOW(),      ?)";
        $ins = $mysqli->prepare($sql);
        if (!$ins) throw new Exception("Előkészítési hiba: " . $mysqli->error);

        $ins->bind_param("ssssii", $nev, $email, $cim, $fiz, $total, $uid);
        if (!$ins->execute()) throw new Exception($ins->error);
        $order_id = $ins->insert_id;
        $ins->close();

        /* 3) Tételek mentése */
        $ins2 = $mysqli->prepare("
          INSERT INTO rendeles_tetelek_app (rendeles_id, termek_id, mennyiseg, egysegar, osszeg)
          VALUES (?, ?, ?, ?, ?)
        ");
        if (!$ins2) throw new Exception("Tételek előkészítési hiba: " . $mysqli->error);

        foreach ($items as $it) {
          $rid   = $order_id;
          $pid   = (int)$it['id'];
          $qty   = (int)$it['qty'];
          $price = (int)$it['egysegar'];
          $sum   = $price * $qty;
          $ins2->bind_param("iiiii", $rid, $pid, $qty, $price, $sum);
          if (!$ins2->execute()) throw new Exception("Tétel mentési hiba: " . $ins2->error);
        }
        $ins2->close();

        /* 4) KÉSZLET LEVONÁSA – garantáltan nem megy 0 alá */
        $dec = $mysqli->prepare("UPDATE termekek SET keszlet = GREATEST(keszlet - ?, 0) WHERE id = ?");
        foreach ($need as $pid => $qty) {
          $dec->bind_param("ii", $qty, $pid);
          if (!$dec->execute()) throw new Exception("Készlet levonási hiba (termék #{$pid}).");
        }
        $dec->close();

        $mysqli->commit();
        cart_clear();

        header("Location: rendelés_sikeres.php?id=" . $order_id);
        exit;

      } catch (Throwable $e) {
        $mysqli->rollback();
        $err = "Hiba történt a rendelés mentésekor: " . $e->getMessage();
      }
    }
  }
}

// kijelzéshez
$total = cart_total($mysqli);
?>
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <title>Pénztár | Raktár Pro</title>
  <link rel="stylesheet" href="style_home.css">
  <style>
    .wrap{width:min(900px,94vw);margin:24px auto;display:grid;gap:16px}
    .card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:16px}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .full{grid-column:1/-1}
    label{font-weight:700;margin-bottom:6px;display:block}
    input, textarea, select{width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:10px}
    .btn{display:inline-flex;gap:8px;align-items:center;background:#111827;color:#fff;border:none;border-radius:10px;padding:10px 12px;cursor:pointer;text-decoration:none}
    .btn.outline{background:#fff;color:#111827;border:1px solid #111827}
    .note{padding:10px 12px;border-radius:10px;margin-bottom:12px}
    .error{background:#fef2f2;border:1px solid #fecaca;color:#7f1d1d}
    .summary{background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:12px}
  </style>
</head>
<body>

<div class="wrap">
  <div class="card">
    <h2 style="margin:0 0 12px">🧾 Pénztár</h2>

    <?php if ($err): ?><div class="note error"><?php echo h($err); ?></div><?php endif; ?>

    <form method="post" class="grid">
      <input type="hidden" name="csrf" value="<?php echo h($csrf); ?>">

      <div>
        <label>Név</label>
        <input type="text" name="nev" value="<?php echo h($pref_nev); ?>" required>
      </div>
      <div>
        <label>E-mail</label>
        <input type="email" name="email" value="<?php echo h($pref_email); ?>" required>
      </div>
      <div class="full">
        <label>Szállítási cím</label>
        <input type="text" name="cim" placeholder="Irányítószám, város, utca, házszám" value="<?php echo h($pref_cim); ?>" required>
      </div>
      <div>
        <label>Fizetési mód</label>
        <select name="fizetes_mod">
          <option value="utanvet">Utánvét</option>
          <option value="bankkartya" disabled>Bankkártya (hamarosan)</option>
        </select>
      </div>
      <div class="summary">
        <div style="display:flex;justify-content:space-between">
          <div>Végösszeg:</div>
          <strong><?php echo number_format((int)$total, 0, '', ' '); ?> Ft</strong>
        </div>
      </div>

      <div class="full" style="display:flex;justify-content:flex-end;gap:8px">
        <a class="btn outline" href="kosar.php">← Vissza a kosárhoz</a>
        <button class="btn" type="submit">Rendelés leadása</button>
      </div>
    </form>
  </div>
</div>
</body>
</html>
