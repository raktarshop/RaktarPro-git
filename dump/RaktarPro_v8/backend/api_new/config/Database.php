<?php
/**
 * Database Connection - Singleton Pattern
 * Egyetlen adatbázis kapcsolat az egész alkalmazásban
 */

class Database {
    private static ?Database $instance = null;
    private ?\mysqli $conn = null;
    
    // MAMP beállítások (config.php-ból)
    private string $host = 'localhost';
    private string $user = 'root';
    private string $pass = 'root';
    private string $db = 'webaruhaz1';
    private int $port = 8889;
    private string $socket = '/Applications/MAMP/tmp/mysql/mysql.sock';
    
    private function __construct() {
        mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
        
        try {
            // Próba port-tal
            $this->conn = new mysqli(
                $this->host,
                $this->user,
                $this->pass,
                $this->db,
                $this->port
            );
        } catch (Exception $e) {
            // Ha nem megy, próbáljuk socket-tel
            $this->conn = new mysqli(
                $this->host,
                $this->user,
                $this->pass,
                $this->db,
                null,
                $this->socket
            );
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
    
    // Singleton védelem
    private function __clone() {}
    public function __wakeup() {
        throw new Exception("Cannot unserialize singleton");
    }
}
