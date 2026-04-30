<?php
echo "<pre>";
echo "PHP version: " . phpversion() . "\n";
echo "mysqli loaded: " . (extension_loaded('mysqli') ? 'YES' : 'NO') . "\n\n";

$hosts = ['127.0.0.1', 'localhost'];
$ports = [8889, 3306];

foreach ($hosts as $h) {
    foreach ($ports as $p) {
        echo "Trying $h:$p ... ";
        try {
            @$conn = new mysqli($h, 'root', 'root', 'webaruhaz1', $p);
            if ($conn->connect_error) {
                echo "FAIL: " . $conn->connect_error . "\n";
            } else {
                echo "OK!\n";
                $conn->close();
            }
        } catch (Exception $e) {
            echo "EXCEPTION: " . $e->getMessage() . "\n";
        }
    }
}
echo "</pre>";
