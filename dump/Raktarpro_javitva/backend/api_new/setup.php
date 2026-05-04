<?php
/**
 * RaktarPro – Egyszer futtatandó setup script
 * Nyisd meg böngészőben: http://localhost:8888/RaktarPro/backend/api_new/setup.php
 * Ez beállítja a .env fájlt az adatbázis neveddel.
 */

$envFile = __DIR__ . '/.env';
$error = '';
$success = '';

// Próbálunk csatlakozni a megadott adatokkal
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $host   = trim($_POST['host']   ?? 'localhost');
    $port   = (int)($_POST['port']  ?? 8889);
    $dbName = trim($_POST['db']     ?? '');
    $user   = trim($_POST['user']   ?? 'root');
    $pass   = trim($_POST['pass']   ?? 'root');

    if (!$dbName) {
        $error = 'Az adatbázis neve kötelező.';
    } else {
        try {
            $conn = @new mysqli($host, $user, $pass, $dbName, $port);
            if ($conn->connect_error) throw new Exception($conn->connect_error);
            $conn->close();

            // Beolvassuk a meglévő .env-t és felülírjuk az adatbázis adatokat
            $env = file_exists($envFile) ? file_get_contents($envFile) : '';
            $lines = explode("\n", str_replace("\r\n", "\n", $env));
            $newLines = [];
            $keys = ['DB_HOST','DB_PORT','DB_NAME','DB_USER','DB_PASS'];
            $values = [
                'DB_HOST' => $host,
                'DB_PORT' => $port,
                'DB_NAME' => $dbName,
                'DB_USER' => $user,
                'DB_PASS' => $pass,
            ];
            $written = [];
            foreach ($lines as $line) {
                $trimmed = trim($line);
                $matched = false;
                foreach ($keys as $k) {
                    if (str_starts_with($trimmed, $k . '=')) {
                        $newLines[] = $k . '=' . $values[$k];
                        $written[] = $k;
                        $matched = true;
                        break;
                    }
                }
                if (!$matched) $newLines[] = $line;
            }
            // Ha valamelyik kulcs nem volt benne, hozzáadjuk
            foreach ($keys as $k) {
                if (!in_array($k, $written)) $newLines[] = $k . '=' . $values[$k];
            }
            file_put_contents($envFile, implode("\n", $newLines));
            $success = "✓ Sikeresen beállítva! Adatbázis: <strong>$dbName</strong>";
        } catch (Exception $e) {
            $error = 'Csatlakozási hiba: ' . htmlspecialchars($e->getMessage());
        }
    }
}

// Jelenlegi értékek a .env-ből
$current = ['DB_HOST'=>'localhost','DB_PORT'=>'8889','DB_NAME'=>'','DB_USER'=>'root','DB_PASS'=>'root'];
if (file_exists($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (str_starts_with(trim($line),'#') || !str_contains($line,'=')) continue;
        [$k,$v] = explode('=', $line, 2);
        $k = trim($k); $v = trim($v);
        if (isset($current[$k])) $current[$k] = $v;
    }
}
?><!DOCTYPE html>
<html lang="hu">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>RaktarPro – Setup</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',sans-serif;background:#0b1628;color:#e8f1ff;min-height:100vh;display:grid;place-items:center;padding:24px}
  .card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:40px;max-width:460px;width:100%}
  h1{font-size:22px;font-weight:800;margin-bottom:6px}
  .sub{color:rgba(232,241,255,.55);font-size:13px;margin-bottom:28px;line-height:1.6}
  label{display:block;font-size:12px;font-weight:700;color:rgba(232,241,255,.55);margin-bottom:6px;margin-top:14px}
  input{width:100%;padding:10px 14px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14);border-radius:10px;color:#e8f1ff;font-size:14px;outline:none}
  input:focus{border-color:rgba(59,92,255,.6);box-shadow:0 0 0 3px rgba(59,92,255,.15)}
  .row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  button{width:100%;margin-top:22px;padding:13px;background:linear-gradient(135deg,#3b5cff,#0bc5ff);color:#fff;font-size:15px;font-weight:800;border:none;border-radius:12px;cursor:pointer;transition:all 160ms}
  button:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(59,92,255,.4)}
  .success{background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.35);border-radius:12px;padding:14px 16px;margin-bottom:16px;font-size:13px;font-weight:600;color:rgba(167,243,194,.95)}
  .error{background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.3);border-radius:12px;padding:14px 16px;margin-bottom:16px;font-size:13px;font-weight:600;color:rgba(255,175,175,.95)}
  .hint{margin-top:20px;padding:14px;background:rgba(59,92,255,.1);border:1px solid rgba(59,92,255,.2);border-radius:12px;font-size:12px;color:rgba(232,241,255,.65);line-height:1.7}
  .hint strong{color:#e8f1ff}
</style>
</head>
<body>
<div class="card">
  <h1>🚀 RaktarPro Setup</h1>
  <p class="sub">Add meg az adatbázis adatait. Ez egyszer fut, beírja a <code>.env</code> fájlba — utána nem kell ide visszajönni.</p>

  <?php if ($success): ?><div class="success"><?= $success ?></div><?php endif ?>
  <?php if ($error):   ?><div class="error"><?= htmlspecialchars($error) ?></div><?php endif ?>

  <form method="POST">
    <label>Adatbázis neve *</label>
    <input name="db" required placeholder="pl. raktar_db" value="<?= htmlspecialchars($current['DB_NAME']) ?>">

    <div class="row">
      <div>
        <label>Host</label>
        <input name="host" value="<?= htmlspecialchars($current['DB_HOST']) ?>">
      </div>
      <div>
        <label>Port</label>
        <input name="port" type="number" value="<?= htmlspecialchars($current['DB_PORT']) ?>">
      </div>
    </div>

    <div class="row">
      <div>
        <label>Felhasználó</label>
        <input name="user" value="<?= htmlspecialchars($current['DB_USER']) ?>">
      </div>
      <div>
        <label>Jelszó</label>
        <input name="pass" type="password" value="<?= htmlspecialchars($current['DB_PASS']) ?>">
      </div>
    </div>

    <button type="submit">Beállítás mentése →</button>
  </form>

  <div class="hint">
    <strong>Hogyan importálj:</strong><br>
    1. phpMyAdminban hozz létre egy üres adatbázist (bármilyen névvel)<br>
    2. Válaszd ki, és importáld a <strong>database/db_schema.sql</strong> fájlt<br>
    3. Importáld a <strong>database/products.sql</strong> fájlt<br>
    4. Add meg itt a DB nevét → mentés<br>
    5. Kész, a webáruház működik!
  </div>
</div>
</body>
</html>
