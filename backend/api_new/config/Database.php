<?php
/**
 * Database Connection - Singleton Pattern
 * Konfig: backend/api_new/.env fájlból olvas — nem kell a kódot szerkeszteni,
 * csak a .env-t állítsd be a saját adatbázis nevével.
 */

class Database {
    private static ?Database $instance = null;
    private ?mysqli $conn = null;

    private function __construct() {
        // .env betöltése (ha még nem töltötte be az Env osztály)
        $envFile = __DIR__ . '/../.env';
        if (file_exists($envFile)) {
            foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
                if (str_starts_with(trim($line), '#') || !str_contains($line, '=')) continue;
                [$key, $val] = explode('=', $line, 2);
                $k = trim($key); $v = trim($val);
                if (!isset($_ENV[$k])) { $_ENV[$k] = $v; putenv("$k=$v"); }
            }
        }

        $host   = $_ENV['DB_HOST'] ?? 'localhost';
        $port   = (int)($_ENV['DB_PORT'] ?? 8889);
        $dbName = $_ENV['DB_NAME'] ?? 'webaruhaz1';
        $user   = $_ENV['DB_USER'] ?? 'root';
        $pass   = $_ENV['DB_PASS'] ?? 'root';
        $socket = $_ENV['DB_SOCKET'] ?? '/Applications/MAMP/tmp/mysql/mysql.sock';

        mysqli_report(MYSQLI_REPORT_OFF);

        $systemDbs = ['information_schema', 'mysql', 'performance_schema', 'sys'];

        // Try to connect without specifying DB, then auto-detect
        $hostPortCombos = [
            [$host, $port],
            ['127.0.0.1', $port],
            ['localhost', 3306],
            ['127.0.0.1', 3306],
        ];

        $baseConn = null;
        foreach ($hostPortCombos as [$h, $p]) {
            try {
                $c = new mysqli($h, $user, $pass, '', $p);
                if ($c && !$c->connect_error) { $baseConn = $c; break; }
            } catch (Exception $e) {}
        }

        // Try named pipe (Windows MAMP)
        if (!$baseConn) {
            try {
                $c = new mysqli('localhost', $user, $pass, '', null, '\\\\.\\pipe\\MySQL');
                if ($c && !$c->connect_error) $baseConn = $c;
            } catch (Exception $e) {}
        }

        // Try Mac socket
        if (!$baseConn) {
            try {
                $c = new mysqli('localhost', $user, $pass, '', null, '/Applications/MAMP/tmp/mysql/mysql.sock');
                if ($c && !$c->connect_error) $baseConn = $c;
            } catch (Exception $e) {}
        }

        if (!$baseConn) {
            throw new Exception('Adatbazis kapcsolat sikertelen - ellenorizd a .env beallitasokat');
        }

        // Try the configured DB name first
        if ($dbName && $baseConn->select_db($dbName)) {
            $this->conn = $baseConn;
        } else {
            // Auto-detect: find first non-system database
            $result = $baseConn->query('SHOW DATABASES');
            $found = null;
            while ($row = $result->fetch_row()) {
                if (!in_array($row[0], $systemDbs)) {
                    $found = $row[0];
                    break;
                }
            }
            if ($found && $baseConn->select_db($found)) {
                $this->conn = $baseConn;
            } else {
                throw new Exception('Nem talalhato hasznalhato adatbazis');
            }
        }

        $this->conn->set_charset('utf8mb4');
    }

    public static function getInstance(): Database {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection(): mysqli {
        return $this->conn;
    }

    private function __clone() {}
    public function __wakeup() { throw new Exception("Cannot unserialize singleton"); }
}
