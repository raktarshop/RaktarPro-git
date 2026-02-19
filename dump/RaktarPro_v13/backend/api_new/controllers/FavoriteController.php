<?php
require_once __DIR__ . '/../services/FavoriteService.php';
require_once __DIR__ . '/../middlewares/AuthMiddleware.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

class FavoriteController {
    private FavoriteService $favoriteService;
    
    public function __construct() {
        $this->favoriteService = new FavoriteService();
    }
    
    public function index(): void {
        try {
            $user = AuthMiddleware::requireAuth();
            $favorites = $this->favoriteService->getUserFavorites($user['id']);
            Response::success(['favorites' => $favorites]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
    
    public function show(int $id): void {
        try {
            AuthMiddleware::requireAuth();
            // Service-ben ellenőrizzük
            Response::success(['message' => 'Not implemented yet']);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
    
    public function create(): void {
        try {
            $user = AuthMiddleware::requireAuth();
            $data = Validator::getJsonInput();
            
            if (!isset($data['product_id'])) {
                Response::validationError(['product_id' => 'Termék ID szükséges']);
            }
            
            $favoriteId = $this->favoriteService->addFavorite($user['id'], (int)$data['product_id']);
            Response::success(['id' => $favoriteId], 'Kedvenc sikeresen hozzáadva', 201);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
    
    public function delete(int $id): void {
        try {
            AuthMiddleware::requireAuth();
            $this->favoriteService->removeFavorite($id);
            Response::success(null, 'Kedvenc sikeresen eltávolítva');
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
    
    public function toggle(): void {
        try {
            $user = AuthMiddleware::requireAuth();
            $data = Validator::getJsonInput();
            
            if (!isset($data['product_id'])) {
                Response::validationError(['product_id' => 'Termék ID szükséges']);
            }
            
            $result = $this->favoriteService->toggleFavorite($user['id'], (int)$data['product_id']);
            Response::success($result);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
}
