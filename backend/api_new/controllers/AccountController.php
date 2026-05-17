<?php
/**
 * AccountController
 * GET  /account          – profil lekérése
 * PUT  /account/profile  – név, vezeteknev, keresztnev frissítése
 * PUT  /account/address  – szállítási cím frissítése
 * PUT  /account/password – jelszó csere (régi jelszó ellenőrzéssel)
 */

require_once __DIR__ . '/../models/UserModel.php';
require_once __DIR__ . '/../middlewares/AuthMiddleware.php';
require_once __DIR__ . '/../utils/Response.php';

class AccountController {
    private UserModel $userModel;

    public function __construct() {
        $this->userModel = new UserModel();
    }

    // GET /account
    public function getProfile(): void {
        $user = AuthMiddleware::requireAuth();
        $row = $this->userModel->find((int)$user['id']);
        if (!$row) { Response::error('Felhasználó nem található', 404); return; }
        Response::success([
            'id'         => $row['id'],
            'email'      => $row['email'],
            'full_name'  => $row['full_name'] ?? '',
            'first_name' => $row['first_name'] ?? '',
            'last_name'  => $row['last_name'] ?? '',
            'address'    => $row['address'] ?? '',
            'role_id'    => $row['role_id'],
        ]);
    }

    // PUT /account/profile
    public function updateProfile(): void {
        $user = AuthMiddleware::requireAuth();
        $body = json_decode(file_get_contents('php://input'), true) ?? [];

        $first = trim($body['first_name'] ?? '');
        $last  = trim($body['last_name']  ?? '');
        $full  = trim($body['full_name']  ?? '');

        // Ha nincs szétválasztva, teljes névből próbál
        if (!$first && !$last && $full) {
            $parts = explode(' ', $full, 2);
            $last  = $parts[0] ?? '';
            $first = $parts[1] ?? '';
        }
        if (!$first && !$last && !$full) {
            Response::error('A név megadása kötelező', 422); return;
        }

        $fullName = trim("$last $first") ?: $full;

        $this->userModel->update((int)$user['id'], [
            'full_name'  => $fullName,
            'first_name' => $first,
            'last_name'  => $last,
            'updated_at' => date('Y-m-d H:i:s'),
        ]);

        Response::success(['full_name' => $fullName, 'first_name' => $first, 'last_name' => $last]);
    }

    // PUT /account/address
    public function updateAddress(): void {
        $user = AuthMiddleware::requireAuth();
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $address = trim($body['address'] ?? '');
        if (!$address) { Response::error('A cím megadása kötelező', 422); return; }

        $this->userModel->update((int)$user['id'], [
            'address'    => $address,
            'updated_at' => date('Y-m-d H:i:s'),
        ]);

        Response::success(['address' => $address]);
    }

    // PUT /account/password
    public function updatePassword(): void {
        $user = AuthMiddleware::requireAuth();
        $body = json_decode(file_get_contents('php://input'), true) ?? [];

        $oldPw  = $body['old_password'] ?? '';
        $newPw  = $body['new_password'] ?? '';

        if (!$oldPw || !$newPw) {
            Response::error('Régi és új jelszó megadása kötelező', 422); return;
        }
        if (strlen($newPw) < 6) {
            Response::error('Az új jelszónak legalább 6 karakter kell', 422); return;
        }

        $row = $this->userModel->find((int)$user['id']);
        if (!$row) { Response::error('Felhasználó nem található', 404); return; }

        if (!password_verify($oldPw, $row['password_hash'])) {
            Response::error('A jelenlegi jelszó helytelen', 401); return;
        }

        $this->userModel->update((int)$user['id'], [
            'password_hash' => password_hash($newPw, PASSWORD_DEFAULT),
            'updated_at'    => date('Y-m-d H:i:s'),
        ]);

        Response::success(['message' => 'Jelszó sikeresen megváltoztatva']);
    }
}
