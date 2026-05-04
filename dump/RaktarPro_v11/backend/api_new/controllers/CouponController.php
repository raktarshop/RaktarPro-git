<?php
require_once __DIR__ . '/../services/CouponService.php';
require_once __DIR__ . '/../middlewares/AuthMiddleware.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

class CouponController {
    private CouponService $couponService;
    
    public function __construct() {
        $this->couponService = new CouponService();
    }
    
    public function index(): void {
        try {
            AuthMiddleware::requireAdmin();
            $coupons = $this->couponService->getAllCoupons();
            Response::success(['coupons' => $coupons]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
    
    public function show(int $id): void {
        try {
            AuthMiddleware::requireAdmin();
            $coupon = $this->couponService->getCouponById($id);
            Response::success($coupon);
        } catch (Exception $e) {
            Response::error($e->getMessage(), $e->getMessage() === 'Kupon nem található' ? 404 : 500);
        }
    }
    
    public function create(): void {
        try {
            AuthMiddleware::requireAdmin();
            $data = Validator::getJsonInput();
            $couponId = $this->couponService->createCoupon($data);
            Response::success(['id' => $couponId], 'Kupon sikeresen létrehozva', 201);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
    
    public function update(int $id): void {
        try {
            AuthMiddleware::requireAdmin();
            $data = Validator::getJsonInput();
            $this->couponService->updateCoupon($id, $data);
            Response::success(null, 'Kupon sikeresen frissítve');
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
    
    public function delete(int $id): void {
        try {
            AuthMiddleware::requireAdmin();
            $this->couponService->deleteCoupon($id);
            Response::success(null, 'Kupon sikeresen törölve');
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
    
    public function validate(): void {
        try {
            $data = Validator::getJsonInput();
            
            if (!isset($data['code'])) {
                Response::validationError(['code' => 'Kupon kód szükséges']);
            }
            
            $result = $this->couponService->validateCoupon($data['code']);
            Response::success($result);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
}
