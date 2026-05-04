<?php
require_once __DIR__ . '/../services/LocationService.php';
require_once __DIR__ . '/../middlewares/AuthMiddleware.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

class LocationController {
    private LocationService $locationService;
    
    public function __construct() {
        $this->locationService = new LocationService();
    }
    
    public function index(): void {
        try {
            AuthMiddleware::requireAuth();
            $locations = $this->locationService->getAllLocations();
            Response::success(['locations' => $locations]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
    
    public function show(int $id): void {
        try {
            AuthMiddleware::requireAuth();
            $location = $this->locationService->getLocationById($id);
            Response::success($location);
        } catch (Exception $e) {
            Response::error($e->getMessage(), $e->getMessage() === 'Hely nem található' ? 404 : 500);
        }
    }
    
    public function create(): void {
        try {
            AuthMiddleware::requireAdmin();
            $data = Validator::getJsonInput();
            $locationId = $this->locationService->createLocation($data);
            Response::success(['id' => $locationId], 'Hely sikeresen létrehozva', 201);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
    
    public function update(int $id): void {
        try {
            AuthMiddleware::requireAdmin();
            $data = Validator::getJsonInput();
            $this->locationService->updateLocation($id, $data);
            Response::success(null, 'Hely sikeresen frissítve');
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
    
    public function delete(int $id): void {
        try {
            AuthMiddleware::requireAdmin();
            $this->locationService->deleteLocation($id);
            Response::success(null, 'Hely sikeresen törölve');
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
}
