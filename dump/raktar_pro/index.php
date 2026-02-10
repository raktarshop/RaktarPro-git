<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/cart_utils.php'; // kosár funkciók

$q    = trim($_GET['q'] ?? '');
$kat  = intval($_GET['kat'] ?? 0);
$page = max(1, intval($_GET['page'] ?? 1));
$limit = 12;
$offset = ($page - 1) * $limit;

// --- Kategóriák lekérése
$kats = [];
if ($res = $mysqli->query("SELECT id, nev FROM kategoriak ORDER BY nev")) {
  while ($row = $res->fetch_assoc()) $kats[] = $row;
  $res->free();
}

// --- Szűrés előkészítés
$where = "WHERE 1=1";
$params = [];
$types = '';

if ($q !== '') {
  $where .= " AND (t.nev LIKE CONCAT('%', ?, '%') OR t.leiras LIKE CONCAT('%', ?, '%') OR t.cikkszam LIKE CONCAT('%', ?, '%'))";
  $params = [$q, $q, $q];
  $types = 'sss';
}

if ($kat > 0) {
  $where .= " AND t.kategoria_id = ?";
  $params[] = $kat;
  $types .= 'i';
}

// --- Találatok száma
$stmt = $mysqli->prepare("SELECT COUNT(*) AS c FROM termekek t $where");
if ($params) $stmt->bind_param($types, ...$params);
$stmt->execute();
$total = (int)($stmt->get_result()->fetch_assoc()['c'] ?? 0);
$stmt->close();

// --- Termékek lekérése (👉 keszlet is!)
$query = "SELECT t.id, t.cikkszam, t.nev, t.leiras, t.egysegar, t.kep_url, t.keszlet, k.nev AS kategoria
          FROM termekek t
          LEFT JOIN kategoriak k ON k.id = t.kategoria_id
          $where
          ORDER BY t.id DESC
          LIMIT ? OFFSET ?";
if ($params) {
  $stmt = $mysqli->prepare($query);
  $stmt->bind_param($types . 'ii', ...array_merge($params, [$limit, $offset]));
} else {
  $stmt = $mysqli->prepare($query);
  $stmt->bind_param('ii', $limit, $offset);
}
$stmt->execute();
$products = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

$pages = max(1, ceil($total / $limit));

function h($s){ return htmlspecialchars($s ?? '', ENT_QUOTES, 'UTF-8'); }
$cartCount = function_exists('cart_count') ? cart_count() : 0;
?>
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Raktár Pro – Főoldal</title>
  <link rel="stylesheet" href="style_home.css" />
</head>
<body>

<!-- NAV -->
<div class="nav">
  <div class="container row">
    <div class="brand">
      <div class="logo">RP</div>
      <div>
        <div>Raktár Pro</div>
        <small style="color:#6b7280">Professzionális raktári megoldások</small>
      </div>
    </div>

    <div class="right">
      <?php if (isset($_SESSION['szerepkor_id']) && (int)$_SESSION['szerepkor_id'] === 1): ?>
        <a class="btn" href="/raktar_pro/admin/index.php">🛠️ Admin</a>
      <?php endif; ?>

      <a class="btn outline" href="kosar.php">
        🛒 Kosár<?php if ($cartCount > 0) echo ' ('.$cartCount.')'; ?>
      </a>

      <a class="avatar" href="profil.php" title="<?php echo h($_SESSION['teljes_nev'] ?? 'Profil'); ?>">
        <?php echo strtoupper(substr($_SESSION['teljes_nev'] ?? 'K', 0, 1)); ?>
      </a>
    </div>
  </div>
</div>

<!-- HERO -->
<section class="hero">
  <div class="container">
    <h1>Profi raktári megoldások</h1>
    <p>Fedezze fel széleskörű termékpalettánkat az ipari eszközöktől az irodai kellékekig.<br>
       Több mint <strong>1000+</strong> termék raktáron, gyors szállítással.</p>
    <div class="perks">
      <span class="perk">⚙️ Legmagasabb minőség</span>
      <span class="perk">⭐ Megbízható szolgáltatás</span>
      <span class="perk">⚡ Azonnali raktári készlet</span>
    </div>
  </div>
</section>

<div class="container">
  <!-- Keresés és szűrés -->
  <div class="search-card">
    <div class="search-title">🔎 Termékkeresés és szűrés</div>
    <form class="search-row" method="get" action="index.php">
      <div class="input">
        <span>🔍</span>
        <input type="search" name="q" value="<?php echo h($q); ?>" placeholder="Terméknév, leírás vagy cikkszám..." />
      </div>
      <div class="input">
        <span>🧭</span>
        <select name="kat">
          <option value="0">Minden kategória</option>
          <?php foreach($kats as $row): ?>
            <option value="<?php echo (int)$row['id']; ?>" <?php if($kat==$row['id']) echo 'selected'; ?>>
              <?php echo h($row['nev']); ?>
            </option>
          <?php endforeach; ?>
        </select>
      </div>
      <button class="btn" type="submit">Szűrés</button>
    </form>
    <div class="result-count"><?php echo (int)$total; ?> termék találat</div>
  </div>

  <!-- Termékkártyák -->
  <div class="grid">
    <?php foreach($products as $p): $kesz = (int)($p['keszlet'] ?? 0); ?>
      <div class="card">
        <div class="thumb">
          <?php if (!empty($p['kep_url'])): ?>
            <img src="<?php echo h($p['kep_url']); ?>" alt="<?php echo h($p['nev']); ?>" style="width:100%;height:160px;object-fit:cover;border-radius:8px;">
          <?php else: ?>
            <div style="height:160px;display:flex;align-items:center;justify-content:center;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb">
              <span style="color:#9ca3af">Nincs kép</span>
            </div>
          <?php endif; ?>
        </div>
        <div class="body">
          <div class="title"><?php echo h($p['nev']); ?></div>
          <div class="meta"><?php echo h($p['kategoria'] ?? '—'); ?></div>
          <div class="meta" style="color:#6b7280"><?php echo h(mb_substr($p['leiras'] ?? '', 0, 80)); ?></div>
          <div class="price" style="display:flex;align-items:center;gap:10px">
            <?php echo number_format((float)$p['egysegar'], 0, '', ' '); ?> Ft
            <?php if ($kesz <= 0): ?>
              <span class="badge" style="background:#fee2e2;color:#991b1b;border:1px solid #fecaca">Nincs készleten</span>
            <?php else: ?>
              <span class="badge" style="background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0"><?php echo $kesz; ?> db</span>
            <?php endif; ?>
          </div>
          <div class="actions">
            <a class="btn outline" href="termek.php?id=<?php echo (int)$p['id']; ?>">Részletek</a>
            <?php if ($kesz > 0): ?>
              <form method="post" action="add_to_cart.php" style="display:inline">
                <input type="hidden" name="termek_id" value="<?php echo (int)$p['id']; ?>">
                <input type="hidden" name="qty" value="1">
                <button class="btn" type="submit">Kosárba</button>
              </form>
            <?php endif; ?>
          </div>
        </div>
      </div>
    <?php endforeach; ?>
    <?php if(empty($products)): ?>
      <p style="grid-column:1/-1;text-align:center;color:#6b7280;">Nincs találat a megadott feltételekre.</p>
    <?php endif; ?>
  </div>

  <!-- Lapozás -->
  <?php if($pages > 1): ?>
    <div class="pager">
      <?php for($i=1; $i<=$pages; $i++): 
        $qs = http_build_query(['q'=>$q, 'kat'=>$kat, 'page'=>$i]);
      ?>
        <a class="<?php echo $i==$page ? 'active' : ''; ?>" href="index.php?<?php echo $qs; ?>">
          <?php echo $i; ?>
        </a>
      <?php endfor; ?>
    </div>
  <?php endif; ?>
</div>

</body>
</html>
