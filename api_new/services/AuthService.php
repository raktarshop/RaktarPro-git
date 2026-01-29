<?php
/**
 * Auth Service
 * Authentikációs business logic
 */

require_once __DIR__ . '/../models/UserModel.php';
require_once __DIR__ . '/../utils/JWT.php';
require_once __DIR__ . '/../utils/Validator.php';

class AuthService {
    
    private UserModel $userModel;
    
    public function __construct() {
        $this->userModel = new UserModel();
    }
    
    /**
     * Register new user
     */
    public function register(array $data): array {
        // Validate required fields
        $errors = Validator::required($data, ['email', 'password', 'full_name']);
        
        if (!empty($errors)) {
            throw new Exception(json_encode($errors));
        }
        
        // Validate email
        if (!Validator::email($data['email'])) {
            throw new Exception('Érvénytelen email cím');
        }
        
        // Validate password
        $passwordErrors = Validator::password($data['password']);
        if (!empty($passwordErrors)) {
            throw new Exception(implode(', ', $passwordErrors));
        }
        
        // Check email exists
        if ($this->userModel->emailExists($data['email'])) {
            throw new Exception('Ez az email cím már regisztrálva van');
        }
        
        // Create user
        $userId = $this->userModel->createUser(
            $data['email'],
            $data['password'],
            $data['full_name'],
            $data['company_name'] ?? null
        );
        
        // Generate token
        $token = JWT::create([
            'user_id' => $userId,
            'email' => $data['email'],
            'role' => 'user'
        ]);
        
        return [
            'user_id' => $userId,
            'email' => $data['email'],
            'full_name' => $data['full_name'],
            'access_token' => $token,
            'expires_in' => 900
        ];
    }
    
    /**
     * Login user
     */
    public function login(array $data): array {
        // Validate required fields
        $errors = Validator::required($data, ['email', 'password']);
        
        if (!empty($errors)) {
            throw new Exception(json_encode($errors));
        }
        
        // Find user
        $user = $this->userModel->findByEmail($data['email']);
        
        if (!$user) {
            throw new Exception('Hibás email vagy jelszó');
        }
        
        // Verify password
        if (!$this->userModel->verifyPassword($data['password'], $user['password_hash'])) {
            throw new Exception('Hibás email vagy jelszó');
        }
        
        // Generate token
        $token = JWT::create([
            'user_id' => $user['id'],
            'email' => $user['email'],
            'role' => (int)$user['role_id'] === 1 ? 'admin' : 'user'
        ]);
        
        return [
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'full_name' => $user['full_name'],
                'role_id' => $user['role_id']
            ],
            'access_token' => $token,
            'expires_in' => 900
        ];
    }
}
