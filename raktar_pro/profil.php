<?php
require_once __DIR__ . '/config.php';
function h($s){ return htmlspecialchars($s ?? "", ENT_QUOTES, "UTF-8"); }

if (!isset($_SESSION['user_id'])) {
  header('Location: bejelentkezes.html');
  exit;
}

$uid   = (int)$_SESSION['user_id'];
$nev   = $_SESSION['teljes_nev'] ?? '';
$email = $_SESSION['email'] ?? '';
$role  = (int)($_SESSION['szerepkor_id'] ?? 3);

$role_nev = [
  1 => 'Admin',
  2 => 'Raktáros',
  3 => 'Felhasználó'
][$role] ?? 'Felhasználó';

/* CSRF token */
if (empty($_SESSION['csrf'])) {
  $_SESSION['csrf'] = bin2hex(random_bytes(16));
}
$csrf = $_SESSION['csrf'];

/* Felhasználó betöltése DB-ből (jelszó-ellenőrzéshez is) */
$stmt = $mysqli->prepare("
  SELECT id, email, teljes_nev, cegnev, jelszo, letrehozva, modositva
  FROM felhasznalok
  WHERE id = ?
");
$stmt->bind_param("i", $uid);
$stmt->execute();
$u = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$u) {
  session_destroy();
  header('Location: bejelentkezes.html');
  exit;
}

$msg = $err = "";

/* Jelszó módosítás */
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'change_password') {
  if (!hash_equals($csrf, $_POST['csrf'] ?? '')) {
    $err = "Érvénytelen kérés (CSRF).";
  } else {
    $jelenlegi = $_POST['jelenlegi'] ?? '';
    $uj        = $_POST['uj'] ?? '';
    $uj2       = $_POST['uj2'] ?? '';

    if (strlen($uj) < 6)               $err = "Az új jelszó legalább 6 karakter legyen.";
    if (!$err && $uj !== $uj2)         $err = "Az új jelszók nem egyeznek.";
    if (!$err && !password_verify($jelenlegi, $u['jelszo'] ?? '')) {
      $err = "A jelenlegi jelszó hibás.";
    }

    if (!$err) {
      $hash = password_hash($uj, PASSWORD_DEFAULT);
      $upd  = $mysqli->prepare("UPDATE felhasznalok SET jelszo = ?, modositva = NOW() WHERE id = ?");
      $upd->bind_param("si", $hash, $uid);
      if ($upd->execute()) {
        $msg = "Jelszó sikeresen módosítva.";
      } else {
        $err = "Mentési hiba: " . $upd->error;
      }
      $upd->close();
    }
  }
}
?>
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <title>Profil – Raktár Pro</title>
  <link rel="stylesheet" href="style_home.css" />
  <style>
    .wrap{width:min(980px,94vw);margin:24px auto;display:grid;gap:16px}
    .card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:16px}
    .row{display:flex;gap:12px;align-items:center;flex-wrap:wrap}
    .btn{display:inline-flex;gap:8px;align-items:center;background:#111827;color:#fff;border:none;border-radius:12px;padding:10px 14px;font-weight:800;cursor:pointer;text-decoration:none}
    .btn:hover{opacity:.95}
    .btn.outline{background:#fff;color:#111827;border:1px solid #111827}
    .badge{display:inline-block;background:#eef2ff;border:1px solid #e5e7eb;border-radius:999px;padding:6px 10px;color:#374151;font-weight:700}
    .kv{display:grid;grid-template-columns:180px 1fr;gap:8px;margin-top:8px}
    .note{padding:10px 12px;border-radius:10px;margin-bottom:12px}
    .success{background:#ecfdf5;border:1px solid #a7f3d0;color:#065f46}
    .error{background:#fef2f2;border:1px solid #fecaca;color:#7f1d1d}
    input[type="password"]{width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:10px}
    label{display:block;font-weight:700;margin:6px 0}
    @media (max-width:600px){.kv{grid-template-columns:1fr}}
  </style>
</head>
<body>
  <!-- NAV -->
  <div class="nav">
    <div class="container row">
      <div class="brand">
        <div class="logo">RP</div>
        <div><div>Raktár Pro</div><small style="color:#6b7280">Profil</small></div>
      </div>
      <div class="right">
        <?php if ($role === 1): ?>
          <a class="btn" href="admin/index.php">🛠️ Admin panel</a>
        <?php endif; ?>
        <a class="btn outline" href="rendeleseim.php">🧾 Rendeléseim</a>
        <a class="btn outline" href="index.php">🏪 Bolt</a>
        <a class="btn outline" href="kosar.php">🛒 Kosár</a>
      </div>
    </div>
  </div>

  <div class="wrap">
    <?php if ($msg): ?><div class="note success"><?php echo h($msg); ?></div><?php endif; ?>
    <?php if ($err): ?><div class="note error"><?php echo h($err); ?></div><?php endif; ?>

    <!-- Alapadatok -->
    <div class="card">
      <h2 style="margin:0 0 6px">Üdv, <?php echo h(($nev ?: $email)); ?>!</h2>
      <div class="row">
        <span class="badge">Szerepkör: <?php echo h($role_nev); ?></span>
      </div>
      <div class="kv">
        <div><strong>Név</strong></div><div><?php echo h($u['teljes_nev'] ?: '—'); ?></div>
        <div><strong>E-mail</strong></div><div><?php echo h($u['email']); ?></div>
        <div><strong>Cégnév</strong></div><div><?php echo h($u['cegnev'] ?: '—'); ?></div>
        <div><strong>Regisztráció</strong></div><div><?php echo h($u['letrehozva']); ?></div>
        <div><strong>Utoljára módosítva</strong></div><div><?php echo h($u['modositva'] ?? '—'); ?></div>
      </div>
      <div style="margin-top:12px" class="row">
        <a class="btn outline" href="kijelentkezes.php">Kijelentkezés</a>
        <a class="btn" href="rendeleseim.php">🧾 Rendeléseim</a>
      </div>
    </div>

    <!-- Jelszó módosítás -->
    <div class="card">
      <h3 style="margin:0 0 8px">🔒 Jelszó módosítása</h3>
      <form method="post" class="kv" style="gap:10px">
        <input type="hidden" name="csrf" value="<?php echo h($csrf); ?>">
        <input type="hidden" name="action" value="change_password">

        <div><label>Jelenlegi jelszó</label></div>
        <div><input type="password" name="jelenlegi" required></div>

        <div><label>Új jelszó</label></div>
        <div><input type="password" name="uj" required></div>

        <div><label>Új jelszó ismét</label></div>
        <div><input type="password" name="uj2" required></div>

        <div></div>
        <div><button class="btn" type="submit">Jelszó csere</button></div>
      </form>
    </div>

    <?php if ($role === 1): ?>
    <!-- ADMIN blokk csak adminoknak -->
    <div class="card" style="border-color:#c7d2fe">
      <h3 style="margin-top:0">🛠️ Admin panel</h3>
      <p>Innen elérheted az admin funkciókat: termékek, képek, rendeléskezelés.</p>
      <div class="row" style="margin-top:8px">
        <a class="btn" href="admin/index.php">Admin Dashboard</a>
        <a class="btn outline" href="admin/termekek.php">Termékek kezelése</a>
        <a class="btn outline" href="admin/rendelesek.php">Rendelések</a>
      </div>
    </div>
    <?php endif; ?>
  </div>
</body>
</html>
