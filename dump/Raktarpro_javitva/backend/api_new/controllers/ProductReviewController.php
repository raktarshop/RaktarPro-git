<?php
require_once __DIR__ . '/../services/ProductReviewService.php';
require_once __DIR__ . '/../middlewares/AuthMiddleware.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

class ProductReviewController {
    private ProductReviewService $reviewService;
    
    public function __construct() {
        $this->reviewService = new ProductReviewService();
    }
    
    public function index(): void {
        try {
            $reviews = $this->reviewService->getAllReviews();
            Response::success(['reviews' => $reviews]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
    
    public function show(int $id): void {
        try {
            $review = $this->reviewService->getReviewById($id);
            Response::success($review);
        } catch (Exception $e) {
            Response::error($e->getMessage(), $e->getMessage() === 'Értékelés nem található' ? 404 : 500);
        }
    }
    
    public function create(): void {
        try {
            $user = AuthMiddleware::requireAuth();
            $data = Validator::getJsonInput();
            $reviewId = $this->reviewService->createReview($user['id'], $data);
            Response::success(['id' => $reviewId], 'Értékelés sikeresen létrehozva', 201);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
    
    public function update(int $id): void {
        try {
            $user = AuthMiddleware::requireAuth();
            $data = Validator::getJsonInput();
            $isAdmin = $user['role_id'] == 1;
            
            $this->reviewService->updateReview($id, $user['id'], $isAdmin, $data);
            Response::success(null, 'Értékelés sikeresen frissítve');
        } catch (Exception $e) {
            Response::error($e->getMessage(), $e->getMessage() === 'Nincs jogosultságod ehhez az értékeléshez' ? 403 : 400);
        }
    }
    
    public function delete(int $id): void {
        try {
            $user = AuthMiddleware::requireAuth();
            $isAdmin = $user['role_id'] == 1;
            
            $this->reviewService->deleteReview($id, $user['id'], $isAdmin);
            Response::success(null, 'Értékelés sikeresen törölve');
        } catch (Exception $e) {
            Response::error($e->getMessage(), $e->getMessage() === 'Nincs jogosultságod ehhez az értékeléshez' ? 403 : 400);
        }
    }
    
    public function getByProduct(int $productId): void {
        try {
            $result = $this->reviewService->getProductReviews($productId);
            Response::success($result);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
}
