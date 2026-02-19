<?php
/**
 * SupportController
 * Public endpoint: POST /support (email + message)
 * Admin endpoint:  GET /admin/support (list)
 * Admin endpoint:  PUT /admin/support/{id} (resolve)
 */

require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../middlewares/AuthMiddleware.php';
require_once __DIR__ . '/../models/SupportTicketModel.php';

class SupportController {
    private SupportTicketModel $model;

    public function __construct() {
        $this->model = new SupportTicketModel();
    }

    /**
     * POST /support
     */
    public function create(): void {
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $email = trim((string)($body['email'] ?? ''));
        $message = trim((string)($body['message'] ?? ''));

        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('Érvénytelen e-mail cím', 422);
        }
        if (empty($message) || mb_strlen($message) < 3) {
            Response::error('A leírás túl rövid', 422);
        }

        $id = $this->model->create([
            'email' => $email,
            'message' => $message,
            'resolved' => 0
        ]);

        Response::success([
            'message' => 'Köszönjük! A kérésed rögzítettük, egy admin hamarosan megnézi.',
            'id' => $id
        ], 201);
    }

    /**
     * GET /admin/support
     */
    public function adminIndex(): void {
        AuthMiddleware::requireAdmin();

        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 200;
        $rows = $this->model->listLatest($limit);

        Response::success([
            'tickets' => $rows,
            'count' => count($rows)
        ]);
    }

    /**
     * PUT /admin/support/{id}
     */
    public function resolve(int $id): void {
        AuthMiddleware::requireAdmin();
        if ($id <= 0) Response::error('Érvénytelen ID', 400);

        $ok = $this->model->update($id, [
            'resolved' => 1,
            'resolved_at' => date('Y-m-d H:i:s')
        ]);

        if (!$ok) Response::error('Nem sikerült frissíteni', 500);

        Response::success([
            'message' => 'Megjelölve megoldottnak',
            'id' => $id
        ]);
    }
}
