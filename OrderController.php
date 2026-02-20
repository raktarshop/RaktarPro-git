<?php
/**
 * Auth Controller
 * Authentikációs endpointok: register, login
 */

require_once __DIR__ . '/../services/AuthService.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

class AuthController {
    
    private AuthService $authService;
    
    public function __construct() {
        $this->authService = new AuthService();
    }
    
    /**
     * POST /auth/register
     */
    public function register(): void {
        try {
            $data = Validator::getJsonInput();
            
            $result = $this->authService->register($data);
            
            Response::success($result, 'Sikeres regisztráció', 201);
            
        } catch (Exception $e) {
            $decoded = json_decode($e->getMessage(), true);
            if (is_array($decoded)) {
                Response::validationError($decoded);
            } else {
                Response::error($e->getMessage(), 400);
            }
        }
    }
    
    /**
     * POST /auth/login
     */
    public function login(): void {
        try {
            $data = Validator::getJsonInput();
            
            $result = $this->authService->login($data);
            
            Response::success($result, 'Sikeres bejelentkezés');
            
        } catch (Exception $e) {
            $decoded = json_decode($e->getMessage(), true);
            if (is_array($decoded)) {
                Response::validationError($decoded);
            } else {
                Response::error($e->getMessage(), 401);
            }
        }
    }
    
    /**
     * POST /auth/logout
     */
    public function logout(): void {
        // Simple logout (token-based, nincs szerver oldali session)
        Response::success(null, 'Sikeres kijelentkezés');
    }
    
    /**
     * POST /auth/refresh
     */
    public function refresh(): void {
        try {
            $data = Validator::getJsonInput();
            
            if (empty($data['refresh_token'])) {
                throw new Exception('Refresh token kötelező');
            }
            
            $result = $this->authService->refresh($data['refresh_token']);
            
            Response::success($result, 'Token frissítve');
            
        } catch (Exception $e) {
            Response::error($e->getMessage(), 401);
        }
    }
    
    /**
     * GET /auth/me
     */
    public function me(): void {
        try {
            require_once __DIR__ . '/../utils/JWT.php';
            
            // Token az Authorization headerből
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
            
            if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
                throw new Exception('Token hiányzik');
            }
            
            $token = $matches[1];
            $payload = JWT::verifyAccessToken($token);
            
            if (!$payload) {
                throw new Exception('Érvénytelen token');
            }
            
            Response::success([
                'user_id' => $payload['user_id'],
                'email' => $payload['email'],
                'full_name' => $payload['full_name'],
                'role_id' => $payload['role_id'],
                'is_admin' => (int)($payload['is_admin'] ?? 0)
            ]);
            
        } catch (Exception $e) {
            Response::error($e->getMessage(), 401);
        }
    }
}
