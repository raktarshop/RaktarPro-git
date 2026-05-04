<?php
/**
 * Auth Middleware
 * JWT token ellenőrzés minden védett endpointra
 */

require_once __DIR__ . '/../utils/JWT.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../models/UserModel.php';

class AuthMiddleware {
    
    /**
     * Require authentication
     * Ellenőrzi a JWT tokent és visszaadja a user adatokat
     */
    public static function requireAuth(): array {
        // Get Authorization header
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';
        
        if (empty($authHeader)) {
            Response::unauthorized('Hiányzó Authorization header');
        }
        
        // Extract token
        if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            Response::unauthorized('Érvénytelen Authorization formátum');
        }
        
        $token = $matches[1];
        
        // Verify token (use public access-token verifier)
        $payload = JWT::verifyAccessToken($token);
        
        if (!$payload) {
            Response::unauthorized('Érvénytelen vagy lejárt token');
        }
        
        // Get user from database
        $userModel = new UserModel();
        $user = $userModel->find((int)$payload['user_id']);
        
        if (!$user) {
            Response::unauthorized('Felhasználó nem található');
        }
        
        return $user;
    }
    
    /**
     * Require admin role
     */
    public static function requireAdmin(): array {
        $user = self::requireAuth();
        
        if ((int)$user['role_id'] !== 1) {
            Response::forbidden('Admin jogosultság szükséges');
        }
        
        return $user;
    }
}
