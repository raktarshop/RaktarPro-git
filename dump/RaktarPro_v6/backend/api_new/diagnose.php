<?php
/**
 * API DIAGNOSZTIKA
 * Megnézi mi a probléma az API-val
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

?>
<!DOCTYPE html>
<html>
<head>
    <title>API Diagnosztika</title>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            color: #667eea;
            margin-bottom: 30px;
            font-size: 32px;
        }
        h2 {
            color: #333;
            margin-top: 30px;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #667eea;
        }
        .test-section {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
        }
        .success { 
            background: #d4edda; 
            color: #155724; 
            border-left-color: #28a745; 
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
        }
        .error { 
            background: #f8d7da; 
            color: #721c24; 
            border-left-color: #dc3545; 
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
        }
        .warning { 
            background: #fff3cd; 
            color: #856404; 
            border-left-color: #ffc107; 
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
        }
        .info { 
            background: #d1ecf1; 
            color: #0c5460; 
            border-left-color: #17a2b8; 
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
        }
        pre {
            background: #2d2d2d;
            color: #f8f8f2;
            padding: 15px;
            border-radius: 8px;
            overflow-x: auto;
            font-size: 13px;
            line-height: 1.5;
            margin: 10px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background: #667eea;
            color: white;
        }
        tr:hover {
            background: #f5f5f5;
        }
        .button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 8px;
            margin: 10px 5px;
            font-weight: bold;
            transition: all 0.3s;
        }
        .button:hover {
            background: #5568d3;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
    </style>
</head>
<body>
<div class="container">
    <h1>🔍 API Diagnosztika</h1>
    <p style="color: #666; margin-bottom: 30px;">Megnézem mi a probléma az API-val...</p>

<?php

// ============================================
// 1. FÁJLRENDSZER ELLENŐRZÉS
// ============================================
echo "<h2>📁 1. Fájlrendszer ellenőrzés</h2>";
echo "<div class='test-section'>";

$models_dir = __DIR__ . '/models';
$required_files = [
    'BaseModel.php',
    'CategoryModel.php',
    'CouponModel.php',
    'FavoriteModel.php',
    'LocationModel.php',
    'OrderItemModel.php',
    'OrderModel.php',
    'ProductModel.php',
    'ProductReviewModel.php',
    'RoleModel.php',
    'StockModel.php',
    'SupplierModel.php',
    'UserModel.php',
    'WarehouseModel.php'
];

$missing_files = [];
$found_files = [];

foreach ($required_files as $file) {
    $filepath = $models_dir . '/' . $file;
    if (file_exists($filepath)) {
        $found_files[] = $file;
        echo "<div class='success'>✅ $file - MEGVAN</div>";
    } else {
        $missing_files[] = $file;
        echo "<div class='error'>❌ $file - HIÁNYZIK!</div>";
    }
}

if (empty($missing_files)) {
    echo "<div class='success'><strong>🎉 Minden model fájl megvan! (14/14)</strong></div>";
} else {
    echo "<div class='error'><strong>❌ Hiányzó fájlok: " . count($missing_files) . " db</strong></div>";
}

echo "</div>";

// ============================================
// 2. MODELLEK ELLENŐRZÉSE
// ============================================
echo "<h2>🔍 2. Modellek belső ellenőrzése</h2>";
echo "<div class='test-section'>";

$models_to_check = [
    'CategoryModel',
    'FavoriteModel',
    'LocationModel',
    'OrderItemModel',
    'OrderModel',
    'ProductModel',
    'ProductReviewModel',
    'RoleModel',
    'StockModel',
    'SupplierModel',
    'UserModel',
    'WarehouseModel'
];

$broken_models = [];
$perfect_models = [];

foreach ($models_to_check as $model_name) {
    $filepath = $models_dir . '/' . $model_name . '.php';
    
    if (!file_exists($filepath)) {
        continue;
    }
    
    $content = file_get_contents($filepath);
    
    $has_extends = preg_match('/class\s+' . preg_quote($model_name) . '\s+extends\s+BaseModel/', $content);
    $has_parent_construct = preg_match('/parent::__construct\(\)/', $content);
    $has_old_db = preg_match('/private\s+mysqli\s+\$db/', $content);
    
    echo "<div class='info'>";
    echo "<strong>📄 $model_name.php</strong><br>";
    echo ($has_extends ? "✅" : "❌") . " extends BaseModel<br>";
    echo ($has_parent_construct ? "✅" : "❌") . " parent::__construct()<br>";
    echo ($has_old_db ? "⚠️ RÉGI private mysqli \$db még benne van!" : "✅ Nincs régi \$db property") . "<br>";
    
    if ($has_extends && $has_parent_construct && !$has_old_db) {
        echo "<strong>✅ TÖKÉLETES!</strong>";
        $perfect_models[] = $model_name;
    } else {
        echo "<strong>❌ JAVÍTANDÓ!</strong>";
        $broken_models[] = $model_name;
    }
    echo "</div>";
}

if (empty($broken_models)) {
    echo "<div class='success'><strong>🎉 Minden model tökéletes! (" . count($perfect_models) . "/12)</strong></div>";
} else {
    echo "<div class='error'><strong>❌ Javítandó modellek: " . count($broken_models) . " db</strong><br>";
    echo "Modellek: " . implode(', ', $broken_models) . "</div>";
}

echo "</div>";

// ============================================
// 3. ADATBÁZIS KAPCSOLAT
// ============================================
echo "<h2>🔌 3. Adatbázis kapcsolat</h2>";
echo "<div class='test-section'>";

require_once __DIR__ . '/config/Database.php';

try {
    $db = Database::getInstance()->getConnection();
    echo "<div class='success'>✅ Adatbázis kapcsolat SIKERES!</div>";
    
    // Check database name
    $result = $db->query("SELECT DATABASE() as dbname");
    $row = $result->fetch_assoc();
    echo "<div class='info'>📊 Adatbázis név: <strong>" . $row['dbname'] . "</strong></div>";
    
} catch (Exception $e) {
    echo "<div class='error'>❌ Adatbázis kapcsolat HIBA!<br>";
    echo "Hiba: " . $e->getMessage() . "</div>";
}

echo "</div>";

// ============================================
// 4. STORED PROCEDURES ELLENŐRZÉSE
// ============================================
echo "<h2>⚙️ 4. Stored Procedures ellenőrzése</h2>";
echo "<div class='test-section'>";

$required_procedures = [
    'products_get',
    'products_get_all',
    'products_insert',
    'products_update',
    'products_delete'
];

if (isset($db)) {
    echo "<table>";
    echo "<tr><th>Stored Procedure</th><th>Státusz</th></tr>";
    
    $sp_missing = [];
    
    foreach ($required_procedures as $sp_name) {
        $result = $db->query("SHOW PROCEDURE STATUS WHERE Name = '$sp_name'");
        if ($result->num_rows > 0) {
            echo "<tr><td>$sp_name</td><td style='color: green;'>✅ MEGVAN</td></tr>";
        } else {
            echo "<tr><td>$sp_name</td><td style='color: red;'>❌ HIÁNYZIK</td></tr>";
            $sp_missing[] = $sp_name;
        }
    }
    echo "</table>";
    
    if (empty($sp_missing)) {
        echo "<div class='success'>✅ Minden fontos stored procedure megvan!</div>";
    } else {
        echo "<div class='error'>❌ Hiányzó stored procedures: " . implode(', ', $sp_missing) . "<br>";
        echo "Futtatnod kell a webaruhaz1.sql fájlt!</div>";
    }
} else {
    echo "<div class='error'>❌ Nem lehet ellenőrizni - nincs DB kapcsolat!</div>";
}

echo "</div>";

// ============================================
// 5. PRODUCTS TABLE ELLENŐRZÉSE
// ============================================
echo "<h2>📦 5. Products tábla ellenőrzése</h2>";
echo "<div class='test-section'>";

if (isset($db)) {
    try {
        $result = $db->query("SELECT COUNT(*) as count FROM products");
        $row = $result->fetch_assoc();
        $count = $row['count'];
        
        echo "<div class='success'>✅ Products tábla ELÉRHETŐ!</div>";
        echo "<div class='info'>📊 Termékek száma: <strong>$count db</strong></div>";
        
        if ($count == 0) {
            echo "<div class='warning'>⚠️ Nincs termék az adatbázisban! Futtasd a webaruhaz1.sql-t!</div>";
        }
        
    } catch (Exception $e) {
        echo "<div class='error'>❌ Products tábla HIBA!<br>";
        echo "Hiba: " . $e->getMessage() . "</div>";
    }
} else {
    echo "<div class='error'>❌ Nem lehet ellenőrizni - nincs DB kapcsolat!</div>";
}

echo "</div>";

// ============================================
// 6. PRODUCTMODEL TESZT
// ============================================
echo "<h2>🧪 6. ProductModel teszt</h2>";
echo "<div class='test-section'>";

try {
    require_once __DIR__ . '/models/ProductModel.php';
    
    echo "<div class='success'>✅ ProductModel betöltve!</div>";
    
    $productModel = new ProductModel();
    echo "<div class='success'>✅ ProductModel példány létrehozva!</div>";
    
    // Try to get all products
    try {
        $products = $productModel->getAll();
        echo "<div class='success'>✅ getAll() metódus MŰKÖDIK!</div>";
        echo "<div class='info'>📊 Visszaadott termékek: <strong>" . count($products) . " db</strong></div>";
        
        if (count($products) > 0) {
            echo "<div class='success'><strong>🎉 PRODUCTS ENDPOINT MŰKÖDNIE KELLENE!</strong></div>";
            
            // Show first product
            echo "<h3>Első termék példa:</h3>";
            echo "<pre>" . json_encode($products[0], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "</pre>";
        }
        
    } catch (Exception $e) {
        echo "<div class='error'>❌ getAll() metódus HIBA!<br>";
        echo "Hiba: " . $e->getMessage() . "</div>";
        echo "<div class='warning'>⚠️ Ez lehet a probléma a /products endpoint-tal!</div>";
    }
    
} catch (Exception $e) {
    echo "<div class='error'>❌ ProductModel betöltési HIBA!<br>";
    echo "Hiba: " . $e->getMessage() . "</div>";
}

echo "</div>";

// ============================================
// 7. ÖSSZEGZÉS
// ============================================
echo "<h2>📊 7. Összegzés és javaslatok</h2>";
echo "<div class='test-section'>";

$issues = [];

if (!empty($missing_files)) {
    $issues[] = "Hiányzó model fájlok: " . implode(', ', $missing_files);
}

if (!empty($broken_models)) {
    $issues[] = "Javítandó modellek: " . implode(', ', $broken_models);
}

if (isset($sp_missing) && !empty($sp_missing)) {
    $issues[] = "Hiányzó stored procedures: " . implode(', ', $sp_missing);
}

if (empty($issues)) {
    echo "<div class='success'>";
    echo "<h3>🎉 MINDEN RENDBEN!</h3>";
    echo "<p>Az API-nak működnie kellene! Ha még mindig nem működik:</p>";
    echo "<ol>";
    echo "<li>Próbáld meg újraindítani a MAMP-ot</li>";
    echo "<li>Töröld a böngésző cache-t</li>";
    echo "<li>Nézd meg a PHP error log-ot</li>";
    echo "</ol>";
    echo "</div>";
} else {
    echo "<div class='error'>";
    echo "<h3>❌ PROBLÉMÁK TALÁLVA:</h3>";
    echo "<ol>";
    foreach ($issues as $issue) {
        echo "<li>$issue</li>";
    }
    echo "</ol>";
    echo "</div>";
    
    echo "<div class='warning'>";
    echo "<h3>🔧 JAVASOLT LÉPÉSEK:</h3>";
    echo "<ol>";
    
    if (!empty($missing_files)) {
        echo "<li>Töltsd le újra a <strong>models.zip</strong> fájlt</li>";
        echo "<li>Csomagold ki és másold be a models/ mappába</li>";
    }
    
    if (!empty($broken_models)) {
        echo "<li>Töltsd le újra a <strong>models.zip</strong> fájlt</li>";
        echo "<li>Csomagold ki és másold be (felülírás!)</li>";
    }
    
    if (isset($sp_missing) && !empty($sp_missing)) {
        echo "<li>Futtasd a <strong>webaruhaz1.sql</strong> fájlt phpMyAdmin-ban</li>";
        echo "<li>Ellenőrizd hogy a webaruhaz1 adatbázis ki van-e választva</li>";
    }
    
    echo "</ol>";
    echo "</div>";
}

echo "</div>";

?>

<div style="margin-top: 30px; text-align: center;">
    <a href="<?php echo $_SERVER['PHP_SELF']; ?>" class="button">🔄 Újra ellenőrzés</a>
    <a href="/raktar_api_mvc/api_new/" class="button">🏠 API Index</a>
    <a href="/raktar_api_mvc/api_new/products" class="button">📦 Products teszt</a>
</div>

</div>
</body>
</html>
