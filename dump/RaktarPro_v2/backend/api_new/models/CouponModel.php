<?php
/**
 * Coupon Model
 * Tábla: coupons
 * Kuponok kezelése
 */

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/BaseModel.php';

class CouponModel extends BaseModel {
    protected string $table = 'coupons';
    
    public function __construct() {
        parent::__construct();
    }
    
    /**
     * Get coupon by ID
     */
    public function getById(int $id): ?array {
        $stmt = $this->db->prepare("CALL coupons_get(?)");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        $this->db->next_result();
        
        return $result ?: null;
    }
    
    /**
     * Get all coupons
     */
    public function getAll(): array {
        $result = $this->db->query("CALL coupons_get_all()");
        $coupons = $result->fetch_all(MYSQLI_ASSOC);
        $this->db->next_result();
        
        return $coupons;
    }
    
    /**
     * Create new coupon
     */
    public function create(array $data): int {
        $stmt = $this->db->prepare("
            INSERT INTO coupons 
            (code, type, value, valid_from, valid_to, is_active, created_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        ");
        $stmt->bind_param(
            "ssdssi",
            $data['code'],
            $data['type'],
            $data['value'],
            $data['valid_from'],
            $data['valid_to'],
            $data['is_active']
        );
        $stmt->execute();
        $insertId = $stmt->insert_id;
        $stmt->close();
        
        return $insertId;
    }
    
    /**
     * Update coupon
     */
    public function update(int $id, array $data): bool {
        $stmt = $this->db->prepare("
            UPDATE coupons 
            SET code = ?, type = ?, value = ?, 
                valid_from = ?, valid_to = ?, is_active = ?
            WHERE id = ?
        ");
        $stmt->bind_param(
            "ssdssii",
            $data['code'],
            $data['type'],
            $data['value'],
            $data['valid_from'],
            $data['valid_to'],
            $data['is_active'],
            $id
        );
        $result = $stmt->execute();
        $stmt->close();
        
        return $result;
    }
    
    /**
     * Delete coupon
     */
    public function delete(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM coupons WHERE id = ?");
        $stmt->bind_param("i", $id);
        $result = $stmt->execute();
        $stmt->close();
        
        return $result;
    }
    
    /**
     * Get coupon by code
     */
    public function getByCode(string $code): ?array {
        $stmt = $this->db->prepare("
            SELECT * FROM coupons 
            WHERE code = ?
            LIMIT 1
        ");
        $stmt->bind_param("s", $code);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        
        return $result ?: null;
    }
    
    /**
     * Validate coupon
     */
    public function validate(string $code): array {
        $coupon = $this->getByCode($code);
        
        if (!$coupon) {
            return ['valid' => false, 'message' => 'Kupon nem található'];
        }
        
        if (!$coupon['is_active']) {
            return ['valid' => false, 'message' => 'Kupon nem aktív'];
        }
        
        $today = date('Y-m-d');
        
        if ($coupon['valid_from'] && $today < $coupon['valid_from']) {
            return ['valid' => false, 'message' => 'Kupon még nem érvényes'];
        }
        
        if ($coupon['valid_to'] && $today > $coupon['valid_to']) {
            return ['valid' => false, 'message' => 'Kupon lejárt'];
        }
        
        return [
            'valid' => true,
            'coupon' => $coupon,
            'message' => 'Kupon érvényes'
        ];
    }
    
    /**
     * Calculate discount
     */
    public function calculateDiscount(array $coupon, float $totalAmount): float {
        if ($coupon['type'] === 'szazalek') {
            return ($totalAmount * $coupon['value']) / 100;
        } else {
            // total_amount type
            return min($coupon['value'], $totalAmount);
        }
    }
    
    /**
     * Get active coupons
     */
    public function getActive(): array {
        $today = date('Y-m-d');
        $stmt = $this->db->prepare("
            SELECT * FROM coupons 
            WHERE is_active = 1
            AND (valid_from IS NULL OR valid_from <= ?)
            AND (valid_to IS NULL OR valid_to >= ?)
            ORDER BY created_at DESC
        ");
        $stmt->bind_param("ss", $today, $today);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        
        return $result;
    }
    
    /**
     * Check if coupon code exists
     */
    public function codeExists(string $code, ?int $excludeId = null): bool {
        if ($excludeId) {
            $stmt = $this->db->prepare("SELECT id FROM coupons WHERE code = ? AND id != ?");
            $stmt->bind_param("si", $code, $excludeId);
        } else {
            $stmt = $this->db->prepare("SELECT id FROM coupons WHERE code = ?");
            $stmt->bind_param("s", $code);
        }
        
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        
        return $result !== null;
    }
}
