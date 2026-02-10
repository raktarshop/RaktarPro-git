<?php
/**
 * GYORS STÁTUSZ ELLENŐRZŐ
 * Egy pillantással látod mi működik és mi nem
 */

error_reporting(0);
?>
<!DOCTYPE html>
<html>
<head>
    <title>API Státusz</title>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: Arial, sans-serif;
            background: #1a1a2e;
            color: white;
            padding: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .dashboard {
            background: #16213e;
            padding: 40px;
            border-radius: 20px;
            max-width: 800px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        h1 {
            text-align: center;
            margin-bottom: 40px;
            font-size: 36px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .status-card {
            background: #0f3460;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            transition: transform 0.3s;
        }
        .status-card:hover {
            transform: translateY(-5px);
        }
        .status-icon {
            font-size: 48px;
            margin-bottom: 15px;
        }
        .status-title {
            font-size: 14px;
            color: #aaa;
            margin-bottom: 10px;
        }
        .status-value {
            font-size: 20px;
            font-weight: bold;
        }
        .ok { color: #00ff88; }
        .error { color: #ff4444; }
        .warning { color: #ffaa00; }
        .summary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px;
            border-radius: 15px;
            text-align: center;
        }
        .summary h2 {
            margin-bottom: 20px;
            font-size: 28px;
        }
        .big-status {
            font-size: 72px;
            margin: 20px 0;
        }
        .actions {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 30px;
            flex-wrap: wrap;
        }
        .button {
            display: inline-block;
            background: rgba(255,255,255,0.2);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 10px;
            font-weight: bold;
            transition: all 0.3s;
        }
        .button:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
<div class="dashboard">
    <h1>⚡ API Státusz Dashboard</h1>
    
    <div class="status-grid">
        <?php
        // 1. Models mappa
        $models_exist = is_dir(__DIR__ . '/models');
        $models_count = $models_exist ? count(glob(__DIR__ . '/models/*.php')) : 0;
        ?>
        <div class="status-card">
            <div class="status-icon"><?php echo $models_exist ? '📁' : '❌'; ?></div>
            <div class="status-title">MODELS MAPPA</div>
            <div class="status-value <?php echo $models_exist ? 'ok' : 'error'; ?>">
                <?php echo $models_exist ? "$models_count fájl" : 'HIÁNYZIK'; ?>
            </div>
        </div>
        
        <?php
        // 2. Database kapcsolat
        $db_ok = false;
        $db_msg = 'Nincs';
        try {
            require_once __DIR__ . '/config/Database.php';
            $db = Database::getInstance()->getConnection();
            $db_ok = true;
            $result = $db->query("SELECT DATABASE() as db");
            $row = $result->fetch_assoc();
            $db_msg = $row['db'];
        } catch (Exception $e) {
            $db_msg = 'HIBA';
        }
        ?>
        <div class="status-card">
            <div class="status-icon"><?php echo $db_ok ? '🔌' : '❌'; ?></div>
            <div class="status-title">DATABASE</div>
            <div class="status-value <?php echo $db_ok ? 'ok' : 'error'; ?>">
                <?php echo $db_msg; ?>
            </div>
        </div>
        
        <?php
        // 3. Products tábla
        $products_count = 0;
        $products_ok = false;
        if ($db_ok) {
            try {
                $result = $db->query("SELECT COUNT(*) as cnt FROM products");
                $row = $result->fetch_assoc();
                $products_count = $row['cnt'];
                $products_ok = true;
            } catch (Exception $e) {}
        }
        ?>
        <div class="status-card">
            <div class="status-icon"><?php echo $products_ok ? '📦' : '❌'; ?></div>
            <div class="status-title">TERMÉKEK</div>
            <div class="status-value <?php echo $products_ok ? 'ok' : 'error'; ?>">
                <?php echo $products_ok ? "$products_count db" : 'HIBA'; ?>
            </div>
        </div>
        
        <?php
        // 4. ProductModel teszt
        $model_ok = false;
        $model_msg = 'HIBA';
        if ($models_exist && $db_ok) {
            try {
                require_once __DIR__ . '/models/ProductModel.php';
                $pm = new ProductModel();
                $products = $pm->getAll();
                $model_ok = true;
                $model_msg = count($products) . ' termék';
            } catch (Exception $e) {
                $model_msg = 'queryOne() hiba';
            }
        }
        ?>
        <div class="status-card">
            <div class="status-icon"><?php echo $model_ok ? '✅' : '❌'; ?></div>
            <div class="status-title">API MŰKÖDÉS</div>
            <div class="status-value <?php echo $model_ok ? 'ok' : 'error'; ?>">
                <?php echo $model_msg; ?>
            </div>
        </div>
    </div>
    
    <?php
    // Összesített státusz
    $all_ok = $models_exist && $db_ok && $products_ok && $model_ok;
    $issues = [];
    if (!$models_exist) $issues[] = 'Models mappa';
    if (!$db_ok) $issues[] = 'Database kapcsolat';
    if (!$products_ok) $issues[] = 'Products tábla';
    if (!$model_ok) $issues[] = 'Model működés';
    ?>
    
    <div class="summary">
        <div class="big-status"><?php echo $all_ok ? '🎉' : '⚠️'; ?></div>
        <h2><?php echo $all_ok ? 'MINDEN MŰKÖDIK!' : 'PROBLÉMÁK VANNAK!'; ?></h2>
        
        <?php if ($all_ok): ?>
            <p style="font-size: 18px; margin: 20px 0;">
                Az API tökéletesen működik!<br>
                Teszteld a /products endpoint-ot!
            </p>
        <?php else: ?>
            <p style="font-size: 18px; margin: 20px 0;">
                Problémák: <?php echo implode(', ', $issues); ?><br>
                Futtasd a diagnose.php-t a részletekért!
            </p>
        <?php endif; ?>
        
        <div class="actions">
            <a href="<?php echo $_SERVER['PHP_SELF']; ?>" class="button">🔄 Frissítés</a>
            <a href="/raktar_api_mvc/api_new/diagnose.php" class="button">🔍 Diagnózis</a>
            <a href="/raktar_api_mvc/api_new/products" class="button">📦 Products</a>
            <a href="/raktar_api_mvc/api_new/" class="button">🏠 API Index</a>
        </div>
    </div>
</div>
</body>
</html>
