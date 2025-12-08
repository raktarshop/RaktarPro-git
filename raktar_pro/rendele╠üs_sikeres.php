<?php
require_once __DIR__ . '/config.php';
function h($s){ return htmlspecialchars($s ?? "", ENT_QUOTES, "UTF-8"); }
$id = (int)($_GET['id'] ?? 0);
?>
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <title>Rendelés sikeres | Raktár Pro</title>
  <link rel="stylesheet" href="style_home.css">
  <style>
    .wrap{width:min(800px,94vw);margin:24px auto}
    .card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:16px;text-align:center}
    .btn{display:inline-flex;gap:8px;align-items:center;background:#111827;color:#fff;border:none;border-radius:10px;padding:10px 12px;text-decoration:none}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <h2>✅ Köszönjük, a rendelésed beérkezett!</h2>
      <?php if ($id): ?>
        <p>Rendelésszám: <strong>#<?php echo (int)$id; ?></strong></p>
      <?php endif; ?>
      <div style="margin-top:12px">
        <a class="btn" href="index.php">Vissza a főoldalra</a>
      </div>
    </div>
  </div>
</body>
</html>
