<?php
require_once __DIR__ . '/../models/UserModel.php';
require_once __DIR__ . '/../utils/JWT.php';
require_once __DIR__ . '/../utils/Validator.php';

class AuthService {
    
    private UserModel $userModel;
    
    public function __construct() {
        $this->userModel = new UserModel();
    }
    
    public function register(array $data): array {
        $errors = Validator::required($data, ['email', 'password', 'full_name']);
        
        if (!empty($errors)) {
            throw new Exception(json_encode($errors));
        }
        
        if (!Validator::email($data['email'])) {
            throw new Exception(json_encode(['email' => 'Érvénytelen email cím']));
        }
        
        if ($this->userModel->emailExists($data['email'])) {
            throw new Exception('Ez az email cím már regisztrálva van');
        }
        
        if (strlen($data['password']) < 6) {
            throw new Exception(json_encode(['password' => 'A jelszó minimum 6 karakter']));
        }
        
        $passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);
        
        $userId = $this->userModel->create([
            'email' => Validator::sanitizeEmail($data['email']),
            'password_hash' => $passwordHash,
            'full_name' => Validator::sanitizeString($data['full_name']),
            'company_name' => $data['company_name'] ?? null,
            'role_id' => 3,
            'created_at' => date('Y-m-d H:i:s')
        ]);
        
        return [
            'user_id' => $userId,
            'message' => 'Regisztráció sikeres'
        ];
    }
    
    public function login(array $data): array {
        // Validation
        if (empty($data['email']) || empty($data['password'])) {
            throw new Exception('Email és jelszó kötelező');
        }
        
        $user = $this->userModel->findByEmail($data['email']);
        
        if (!$user) {
            throw new Exception('Hibás email vagy jelszó');
        }
        
        if (!password_verify($data['password'], $user['password_hash'])) {
            throw new Exception('Hibás email vagy jelszó');
        }
        
        $tokens = $this->generateTokens($user);
        
        return [
            'access_token' => $tokens['access_token'],
            'refresh_token' => $tokens['refresh_token'],
            'expires_in' => $tokens['expires_in'],
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'full_name' => $user['full_name'],
                'company_name' => $user['company_name'],
                'role_id' => $user['role_id']
            ]
        ];
    }
    
    public function refresh(string $refreshToken): array {
        $payload = JWT::verifyRefreshToken($refreshToken);
        
        if ($payload === null) {
            throw new Exception('Érvénytelen refresh token');
        }
        
        $user = $this->userModel->find($payload['user_id']);
        
        if (!$user) {
            throw new Exception('User nem található');
        }
        
        $tokens = $this->generateTokens($user);
        
        return [
            'access_token' => $tokens['access_token'],
            'refresh_token' => $tokens['refresh_token'],
            'expires_in' => $tokens['expires_in'],
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'full_name' => $user['full_name'],
                'role_id' => $user['role_id']
            ]
        ];
    }
    
    private function generateTokens(array $user): array {
        $accessPayload = [
            'user_id' => $user['id'],
            'email' => $user['email'],
            'full_name' => $user['full_name'],
            'role_id' => $user['role_id']
        ];
        
        $refreshPayload = [
            'user_id' => $user['id']
        ];
        
        $accessToken = JWT::createAccessToken($accessPayload);
        $refreshToken = JWT::createRefreshToken($refreshPayload);
        
        return [
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'expires_in' => Env::getInt('JWT_ACCESS_EXPIRY', 900)
        ];
    }
}