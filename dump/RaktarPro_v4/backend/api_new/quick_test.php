<?php
/**
 * ⚡ GYORS TESZT - Mi van a /products endpoint válaszában?
 */
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Capture the output of /products
$url = 'http://localhost:8888/raktar_api_mvc/api_new/products';

?>
<!DOCTYPE html>
<html>
<head>
    <title>Products Endpoint GYORS TESZT</title>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Courier New', monospace;
            background: #000;
            color: #0f0;
            padding: 20px;
        }
        .box {
            background: #111;
            border: 2px solid #0f0;
            padding: 30px;
            margin: 20px 0;
            border-radius: 10px;
        }
        h1 { color: #0ff; margin-bottom: 20px; }
        h2 { color: #ff0; margin: 20px 0 10px 0; }
        .success { color: #0f0; font-weight: bold; }
        .error { color: #f00; font-weight: bold; }
        pre {
            background: #222;
            color: #0f0;
            padding: 20px;
            overflow-x: auto;
            border-left: 4px solid #0f0;
        }
        .url {
            background: #003;
            color: #0ff;
            padding: 10px;
            font-size: 16px;
            word-break: break-all;
        }
        a {
            color: #0ff;
            text-decoration: none;
            padding: 10px 20px;
            background: #003;
            display: inline-block;
            margin: 10px 5px;
            border: 1px solid #0ff;
        }
        a:hover { background: #006; }
    </style>
</head>
<body>

<h1>⚡ PRODUCTS ENDPOINT GYORS TESZT</h1>

<div class="box">
    <h2>🔗 URL amit tesztelünk:</h2>
    <div class="url"><?php echo $url; ?></div>
</div>

<div class="box">
    <h2>📡 VÁLASZ:</h2>
    <?php
    // Use cURL to get the response
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_NOBODY, false);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    
    $headers = substr($response, 0, $headerSize);
    $body = substr($response, $headerSize);
    
    curl_close($ch);
    
    echo "<p><strong>HTTP Státusz:</strong> ";
    if ($httpCode == 200) {
        echo "<span class='success'>$httpCode OK ✅</span>";
    } else {
        echo "<span class='error'>$httpCode ❌</span>";
    }
    echo "</p>";
    
    echo "<h3>Headers:</h3>";
    echo "<pre>" . htmlspecialchars($headers) . "</pre>";
    
    echo "<h3>Body:</h3>";
    
    // Try to decode JSON
    $json = json_decode($body, true);
    
    if ($json) {
        echo "<p class='success'>✅ VALID JSON!</p>";
        
        if (isset($json['success']) && $json['success']) {
            echo "<p class='success'>✅ success: true</p>";
            
            if (isset($json['data']['products'])) {
                $count = count($json['data']['products']);
                echo "<p class='success'>✅ Termékek: $count db</p>";
                
                if ($count > 0) {
                    echo "<p class='success'>🎉 MINDEN MŰKÖDIK! A /products endpoint tökéletes!</p>";
                    
                    echo "<h3>Első 3 termék:</h3>";
                    echo "<pre>" . json_encode(array_slice($json['data']['products'], 0, 3), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "</pre>";
                    
                    echo "<h3>Teljes válasz:</h3>";
                    echo "<pre>" . json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "</pre>";
                } else {
                    echo "<p class='error'>❌ Termékek tömb üres!</p>";
                }
            } else {
                echo "<p class='error'>❌ Nincs 'products' a válaszban!</p>";
                echo "<pre>" . json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "</pre>";
            }
        } else {
            echo "<p class='error'>❌ success: false vagy hiányzik</p>";
            echo "<pre>" . json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "</pre>";
        }
    } else {
        echo "<p class='error'>❌ NEM VALID JSON!</p>";
        echo "<p>Raw body:</p>";
        echo "<pre>" . htmlspecialchars($body) . "</pre>";
    }
    ?>
</div>

<div class="box">
    <h2>🧪 Tesztek:</h2>
    <a href="<?php echo $url; ?>" target="_blank">📦 Nyisd meg: /products</a>
    <a href="<?php echo $_SERVER['PHP_SELF']; ?>">🔄 Frissítés</a>
    <a href="/raktar_api_mvc/api_new/">🏠 API Index</a>
    <a href="/raktar_api_mvc/api_new/diagnose.php">🔍 Diagnózis</a>
</div>

</body>
</html>
