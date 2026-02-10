<?php
require_once __DIR__ . '/config.php';
if (!isset($_SESSION['user_id'])) { header("Location: bejelentkezes.html"); exit; }
?>
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8" />
  <title>Irányítópult</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <main class="container">
    <h1 class="title">Irányítópult</h1>
    <p class="subtitle">Szia, <?php echo htmlspecialchars($_SESSION['teljes_nev'] ?: $_SESSION['email']); ?>!</p>
    <div class="tabs" style="margin-top:32px">
      <a class="tab" href="bejelentkezes.html">Vissza a bejelentkezéshez</a>
      <a class="tab" href="kijelentkezes.php">Kijelentkezés</a>
    </div>
  </main>
</body>
</html>
