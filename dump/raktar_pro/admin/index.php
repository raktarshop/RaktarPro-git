<?php
require_once __DIR__ . '/_init.php'; // csak admin láthatja (betölti configot + h())
?>
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <title>Admin – Dashboard | Raktár Pro</title>
  <link rel="stylesheet" href="/raktar_pro/admin/style_admin.css">
  <style>
    .nav{background:#fff;border-bottom:1px solid #e5e7eb}
    .nav .inner{width:min(1100px,94vw);margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:12px 0}
    .brand{display:flex;align-items:center;gap:10px;font-weight:900}
    .logo{width:32px;height:32px;border-radius:8px;background:#111827;color:#fff;display:grid;place-items:center}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}
    .link-cards a.btn{width:100%;justify-content:center}
  </style>
</head>
<body>

  <!-- Felső sáv -->
  <div class="nav">
    <div class="inner">
      <div class="brand">
        <div class="logo">RP</div>
        <div>Raktár Pro – <span style="color:#6b7280;font-weight:700">Admin</span></div>
      </div>
      <div style="display:flex;gap:8px">
        <a class="btn outline" href="/raktar_pro/index.php">← Vissza a boltba</a>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="card">
      <h1 style="margin-top:0">Raktár Pro – Admin Dashboard</h1>
      <p>Üdv, <strong><?php echo h($_SESSION['teljes_nev'] ?? 'Admin'); ?></strong>!</p>
    </div>

    <div class="card link-cards">
      <h2 style="margin-top:0">Gyors műveletek</h2>
      <div class="grid">
        <a class="btn" href="/raktar_pro/admin/termekek.php">📦 Termékek kezelése</a>
        <a class="btn outline" href="/raktar_pro/admin/termekek.php?q=">🔎 Termék keresése</a>
        <!-- későbbiek:
        <a class="btn outline" href="/raktar_pro/admin/rendelesek.php">🧾 Rendelések</a>
        <a class="btn outline" href="/raktar_pro/admin/felhasznalok.php">👤 Felhasználók</a>
        -->
        <a class="btn outline" href="/raktar_pro/admin/kategoriak.php">🏷️ Kategóriák</a>
        <a class="btn" href="rendelesek.php">🧾 Rendelések</a>
      </div>
    </div>
  </div>

</body>
</html>
