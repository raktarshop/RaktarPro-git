<?php
require_once __DIR__ . '/_init.php';

$msg = $err = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $nev = trim($_POST['nev'] ?? '');
  $action = $_POST['action'] ?? '';

  if ($action === 'add' && $nev !== '') {
    $stmt = $mysqli->prepare("INSERT INTO kategoriak (nev) VALUES (?)");
    $stmt->bind_param("s", $nev);
    $stmt->execute();
    $stmt->close();
    $msg = 'Kategória hozzáadva.';
  }

  if ($action === 'rename' && isset($_POST['id'])) {
    $id = (int)$_POST['id'];
    if ($nev !== '') {
      $stmt = $mysqli->prepare("UPDATE kategoriak SET nev = ? WHERE id = ?");
      $stmt->bind_param("si", $nev, $id);
      $stmt->execute();
      $stmt->close();
      $msg = 'Kategória átnevezve.';
    }
  }

  if ($action === 'delete' && isset($_POST['id'])) {
    $id = (int)$_POST['id'];
    $stmt = $mysqli->prepare("DELETE FROM kategoriak WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->close();
    $msg = 'Kategória törölve.';
  }
}

$rows = $mysqli->query("SELECT id, nev FROM kategoriak ORDER BY nev")->fetch_all(MYSQLI_ASSOC);
?>
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <title>Kategóriák kezelése</title>
  <link rel="stylesheet" href="style_admin.css">
</head>
<body>
<div class="container">
  <div class="card">
    <h1>🏷️ Kategóriák kezelése</h1>
    <a class="btn outline" href="index.php">← Vissza a Dashboardra</a>
    <?php if ($msg): ?><div class="notice"><?php echo h($msg); ?></div><?php endif; ?>

    <h2>Új kategória</h2>
    <form method="post" class="row" style="gap:8px">
      <input type="text" name="nev" placeholder="Kategória neve" required>
      <button class="btn" type="submit" name="action" value="add">➕ Hozzáadás</button>
    </form>

    <h2 style="margin-top:20px;">Meglévő kategóriák</h2>
    <table class="table">
      <thead>
        <tr><th>ID</th><th>Név</th><th>Műveletek</th></tr>
      </thead>
      <tbody>
        <?php foreach($rows as $r): ?>
          <tr>
            <td><?php echo (int)$r['id']; ?></td>
            <td><?php echo h($r['nev']); ?></td>
            <td class="row" style="gap:6px">
              <form method="post" style="display:flex;gap:6px;">
                <input type="hidden" name="id" value="<?php echo (int)$r['id']; ?>">
                <input type="text" name="nev" placeholder="Új név">
                <button class="btn outline" name="action" value="rename">✏️ Átnevezés</button>
                <button class="btn danger" name="action" value="delete" onclick="return confirm('Biztos törlöd?');">🗑️ Törlés</button>
              </form>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>
</body>
</html>
