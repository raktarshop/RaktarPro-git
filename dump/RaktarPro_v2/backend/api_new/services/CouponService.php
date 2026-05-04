<?php
require_once __DIR__ . '/../models/CouponModel.php';
require_once __DIR__ . '/../utils/Validator.php';

class CouponService {
    private CouponModel $couponModel;
    
    public function __construct() {
        $this->couponModel = new CouponModel();
    }
    
    public function getAllCoupons(): array {
        return $this->couponModel->getAll();
    }
    
    public function getCouponById(int $id): ?array {
        $coupon = $this->couponModel->getById($id);
        if (!$coupon) {
            throw new Exception('Kupon nem található');
        }
        return $coupon;
    }
    
    public function createCoupon(array $data): int {
        $errors = Validator::required($data, ['code', 'type', 'value']);
        if (!empty($errors)) {
            throw new Exception(json_encode($errors));
        }
        
        if ($this->couponModel->codeExists($data['code'])) {
            throw new Exception('Ez a kupon kód már létezik');
        }
        
        // Validáció: érték nem lehet negatív
        if ($data['value'] <= 0) {
            throw new Exception('Az érték csak pozitív szám lehet');
        }
        
        // Validáció: type csak szazalek vagy total_amount lehet
        if (!in_array($data['type'], ['szazalek', 'total_amount'])) {
            throw new Exception('Érvénytelen kupon típus');
        }
        
        // Validáció: százalék esetén max 100
        if ($data['type'] === 'szazalek' && $data['value'] > 100) {
            throw new Exception('A százalék nem lehet több mint 100');
        }
        
        $couponData = [
            'code' => Validator::sanitizeString($data['code']),
            'type' => $data['type'],
            'value' => (float)$data['value'],
            'valid_from' => $data['valid_from'] ?? null,
            'valid_to' => $data['valid_to'] ?? null,
            'is_active' => isset($data['is_active']) ? (int)$data['is_active'] : 1
        ];
        
        return $this->couponModel->create($couponData);
    }
    
    public function updateCoupon(int $id, array $data): bool {
        $coupon = $this->getCouponById($id);
        
        if (isset($data['code']) && $this->couponModel->codeExists($data['code'], $id)) {
            throw new Exception('Ez a kupon kód már létezik');
        }
        
        if (isset($data['value']) && $data['value'] <= 0) {
            throw new Exception('Az érték csak pozitív szám lehet');
        }
        
        $updateData = [
            'code' => Validator::sanitizeString($data['code'] ?? $coupon['code']),
            'type' => $data['type'] ?? $coupon['type'],
            'value' => isset($data['value']) ? (float)$data['value'] : $coupon['value'],
            'valid_from' => $data['valid_from'] ?? $coupon['valid_from'],
            'valid_to' => $data['valid_to'] ?? $coupon['valid_to'],
            'is_active' => isset($data['is_active']) ? (int)$data['is_active'] : $coupon['is_active']
        ];
        
        return $this->couponModel->update($id, $updateData);
    }
    
    public function deleteCoupon(int $id): bool {
        $this->getCouponById($id);
        return $this->couponModel->delete($id);
    }
    
    public function validateCoupon(string $code): array {
        if (empty($code)) {
            throw new Exception('Kupon kód szükséges');
        }
        
        return $this->couponModel->validate($code);
    }
}
