<?php
/**
 * SupportTicketModel
 * Egyszerű support/hiba bejelentések tárolása
 */

require_once __DIR__ . '/BaseModel.php';

class SupportTicketModel extends BaseModel {
    protected string $table = 'support_tickets';

    public function __construct() {
        parent::__construct();
        $this->ensureTable();
    }

    /**
     * Létrehozza a táblát, ha még nem létezik.
     * (Nincs külön migrációs rendszer, ezért itt biztosítjuk.)
     */
    private function ensureTable(): void {
        $sql = "CREATE TABLE IF NOT EXISTS support_tickets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            resolved TINYINT(1) NOT NULL DEFAULT 0,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            resolved_at TIMESTAMP NULL DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

        $this->db->query($sql);
    }

    /**
     * Listázás admin nézethez
     */
    public function listLatest(int $limit = 200): array {
        $limit = max(1, min(500, $limit));
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} ORDER BY created_at DESC LIMIT ?");
        $stmt->bind_param('i', $limit);
        $stmt->execute();
        $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        return $rows;
    }
}
