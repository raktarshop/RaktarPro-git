<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/cart_utils.php';

if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(16));
$csrf = $_SESSION['csrf'];

$items = cart_items($mysqli);
$total = cart_total($mysqli);
function h($s){ return htmlspecialchars($s ?? "", ENT_QUOTES, "UTF-8"); }
$cartCount = cart_count();
?>
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <title>Kosár | Raktár Pro</title>
  <link rel="stylesheet" href="style_home.css">
  <style>
    .wrap{width:min(1000px,94vw);margin:24px auto}
    .card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:16px;margin-bottom:16px}
    table{width:100%;border-collapse:collapse}
    th,td{padding:12px;border-bottom:1px solid #e5e7eb;text-align:left;vertical-align:middle}
    th{font-weight:800;color:#374151}
    .thumb{width:64px;height:64px;border-radius:10px;object-fit:cover;border:1px solid #e5e7eb;background:#fafafa}
    .qty{width:90px;padding:8px;border:1px solid #e5e7eb;border-radius:10px;text-align:right}
    .row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .btn{display:inline-flex;gap:8px;align-items:center;background:#111827;color:#fff;border:none;border-radius:10px;padding:10px 12px;cursor:pointer;text-decoration:none}
    .btn.outline{background:#fff;color:#111827;border:1px solid #111827}
    .btn.muted{background:#6b7280}
    .btn.danger{background:#dc2626}
    .btn.danger:hover{background:#b91c1c}
    .tot{display:flex;justify-content:flex-end;gap:16px;align-items:center}
    .note{padding:10px 12px;border-radius:10px;background:#f3f4f6;border:1px solid #e5e7eb;color:#374151}
    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button{opacity:1} /* megmarad a spinner, de számot is írhatsz */
  </style>
</head>
<body>

<!-- NAV -->
<div class="nav">
  <div class="container row">
    <div class="brand">
      <div class="logo">RP</div>
      <div><div>Raktár Pro</div><small style="color:#6b7280">Kosár</small></div>
    </div>
    <div class="right">
      <a class="btn outline" href="index.php">← Vásárlás folytatása</a>
      <a class="btn outline" href="profil.php">👤 Profil</a>
      <a class="btn" href="kosar.php">🛒 Kosár<?php if($cartCount>0) echo " ($cartCount)"; ?></a>
    </div>
  </div>
</div>

<div class="wrap">
  <div class="card">
    <h2 style="margin:0 0 12px">🛒 Kosár</h2>

    <?php if (empty($items)): ?>
      <div class="note">A kosarad üres.</div>
    <?php else: ?>
      <form method="post" action="update_cart.php">
        <input type="hidden" name="csrf" value="<?php echo h($csrf); ?>">

        <table>
          <thead>
            <tr>
              <th></th>
              <th>Termék</th>
              <th>Cikkszám</th>
              <th>Egységár</th>
              <th>Mennyiség</th>
              <th>Összeg</th>
              <th></th>
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
                <td><?php echo h($it['nev']); ?></td>
                <td><?php echo h($it['cikkszam']); ?></td>
                <td><?php echo number_format((int)$it['egysegar'], 0, '', ' '); ?> Ft</td>
                <td>
                  <!-- SZÁMBEKÉRŐ: beírással állítható -->
                  <input class="qty" type="number" min="0" max="9999"
                         name="qty[<?php echo (int)$it['id']; ?>]"
                         value="<?php echo (int)$it['qty']; ?>">
                </td>
                <td><strong><?php echo number_format((int)$it['subtotal'], 0, '', ' '); ?> Ft</strong></td>
                <td>
                  <button class="btn danger" type="submit" name="remove" value="<?php echo (int)$it['id']; ?>">Törlés</button>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>

        <div class="row" style="justify-content:space-between;margin-top:12px">
          <div class="row">
            <button class="btn outline" type="submit" name="clear" value="1">Kosár ürítése</button>
            <button class="btn" type="submit">Mennyiségek frissítése</button>
          </div>
          <div class="tot">
            <div>Végösszeg:</div>
            <div style="font-size:1.25rem;font-weight:900">
              <?php echo number_format((int)$total, 0, '', ' '); ?> Ft
            </div>
            <a class="btn" href="checkout.php">Tovább a pénztárhoz →</a>
          </div>
        </div>
      </form>
    <?php endif; ?>
  </div>
</div>

</body>
</html>
