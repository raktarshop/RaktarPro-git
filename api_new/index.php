<?php
/**
 * REST API Entry Point
 * Main router - minden kérés ide érkezik
 * Teljes CRUD endpointok minden táblához
 */

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0); // Production: 0, Dev: 1

// Timezone
date_default_timezone_set('Europe/Budapest');

// Load controllers
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/ProductController.php';
require_once __DIR__ . '/controllers/CategoryController.php';
require_once __DIR__ . '/controllers/OrderController.php';
require_once __DIR__ . '/controllers/SupplierController.php';
require_once __DIR__ . '/controllers/WarehouseController.php';
require_once __DIR__ . '/controllers/LocationController.php';
require_once __DIR__ . '/controllers/StockController.php';
require_once __DIR__ . '/controllers/FavoriteController.php';
require_once __DIR__ . '/controllers/CouponController.php';
require_once __DIR__ . '/controllers/ProductReviewController.php';
require_once __DIR__ . '/controllers/RoleController.php';
require_once __DIR__ . '/controllers/OrderItemController.php';
require_once __DIR__ . '/utils/Response.php';

// Get request info
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove base path if exists
$scriptName = dirname($_SERVER['SCRIPT_NAME']);
if ($scriptName !== '/' && strpos($path, $scriptName) === 0) {
    $path = substr($path, strlen($scriptName));
}

$path = rtrim($path, '/');
if (empty($path)) {
    $path = '/';
}

// Parse path segments
$segments = explode('/', trim($path, '/'));

// Route Handler
try {
    
    // ===== HEALTH CHECK =====
    if ($path === '/' || $path === '') {
        Response::success([
            'api' => 'Raktár Pro REST API',
            'version' => '2.0',
            'status' => 'running',
            'endpoints' => [
                'auth' => '/auth/{register|login|logout}',
                'products' => '/products',
                'categories' => '/categories',
                'orders' => '/orders',
                'suppliers' => '/suppliers',
                'warehouses' => '/warehouses',
                'locations' => '/locations',
                'stock' => '/stock',
                'favorites' => '/favorites',
                'coupons' => '/coupons',
                'reviews' => '/reviews',
                'roles' => '/roles',
                'order-items' => '/order-items'
            ]
        ]);
    }
    
    // ===== AUTH ROUTES =====
    if ($segments[0] === 'auth') {
        $authController = new AuthController();
        
        switch ($segments[1] ?? '') {
            case 'register':
                if ($method === 'POST') $authController->register();
                break;
            case 'login':
                if ($method === 'POST') $authController->login();
                break;
            case 'logout':
                if ($method === 'POST') $authController->logout();
                break;
        }
    }
    
    // ===== PRODUCT ROUTES =====
    if ($segments[0] === 'products') {
        $controller = new ProductController();
        
        if (!isset($segments[1])) {
            // /products
            if ($method === 'GET') $controller->index();
            elseif ($method === 'POST') $controller->create();
        } else {
            // /products/{id}
            $id = (int)$segments[1];
            if ($method === 'GET') $controller->show($id);
            elseif ($method === 'PUT') $controller->update($id);
            elseif ($method === 'DELETE') $controller->delete($id);
        }
    }
    
    // ===== CATEGORY ROUTES =====
    if ($segments[0] === 'categories') {
        $controller = new CategoryController();
        
        if (!isset($segments[1])) {
            if ($method === 'GET') $controller->index();
            elseif ($method === 'POST') $controller->create();
        } else {
            $id = (int)$segments[1];
            if ($method === 'GET') $controller->show($id);
            elseif ($method === 'PUT') $controller->update($id);
            elseif ($method === 'DELETE') $controller->delete($id);
        }
    }
    
    // ===== ORDER ROUTES =====
    if ($segments[0] === 'orders') {
        $controller = new OrderController();
        
        if (!isset($segments[1])) {
            if ($method === 'GET') $controller->index();
            elseif ($method === 'POST') $controller->create();
        } else {
            $id = (int)$segments[1];
            if ($method === 'GET') $controller->show($id);
        }
    }
    
    // ===== ADMIN ORDER ROUTES =====
    if ($segments[0] === 'admin' && ($segments[1] ?? '') === 'orders') {
        $controller = new OrderController();
        
        if (!isset($segments[2])) {
            if ($method === 'GET') $controller->adminIndex();
        } else {
            $id = (int)$segments[2];
            if (($segments[3] ?? '') === 'status' && $method === 'PUT') {
                $controller->updateStatus($id);
            }
        }
    }
    
    // ===== SUPPLIER ROUTES =====
    if ($segments[0] === 'suppliers') {
        $controller = new SupplierController();
        
        if (!isset($segments[1])) {
            if ($method === 'GET') $controller->index();
            elseif ($method === 'POST') $controller->create();
        } elseif ($segments[1] === 'search') {
            if ($method === 'GET') $controller->search();
        } else {
            $id = (int)$segments[1];
            if ($method === 'GET') $controller->show($id);
            elseif ($method === 'PUT') $controller->update($id);
            elseif ($method === 'DELETE') $controller->delete($id);
        }
    }
    
    // ===== WAREHOUSE ROUTES =====
    if ($segments[0] === 'warehouses') {
        $controller = new WarehouseController();
        
        if (!isset($segments[1])) {
            if ($method === 'GET') $controller->index();
            elseif ($method === 'POST') $controller->create();
        } else {
            $id = (int)$segments[1];
            if ($method === 'GET') $controller->show($id);
            elseif ($method === 'PUT') $controller->update($id);
            elseif ($method === 'DELETE') $controller->delete($id);
        }
    }
    
    // ===== LOCATION ROUTES =====
    if ($segments[0] === 'locations') {
        $controller = new LocationController();
        
        if (!isset($segments[1])) {
            if ($method === 'GET') $controller->index();
            elseif ($method === 'POST') $controller->create();
        } else {
            $id = (int)$segments[1];
            if ($method === 'GET') $controller->show($id);
            elseif ($method === 'PUT') $controller->update($id);
            elseif ($method === 'DELETE') $controller->delete($id);
        }
    }
    
    // ===== STOCK ROUTES =====
    if ($segments[0] === 'stock') {
        $controller = new StockController();
        
        if (!isset($segments[1])) {
            if ($method === 'GET') $controller->index();
            elseif ($method === 'POST') $controller->create();
        } elseif ($segments[1] === 'alerts') {
            if ($method === 'GET') $controller->alerts();
        } elseif ($segments[1] === 'summary') {
            if ($method === 'GET') $controller->summary();
        } elseif ($segments[1] === 'move') {
            if ($method === 'POST') $controller->move();
        } elseif ($segments[1] === 'product' && isset($segments[2])) {
            if ($method === 'GET') $controller->getByProduct((int)$segments[2]);
        } elseif ($segments[1] === 'location' && isset($segments[2])) {
            if ($method === 'GET') $controller->getByLocation((int)$segments[2]);
        } else {
            $id = (int)$segments[1];
            
            if (isset($segments[2])) {
                if ($segments[2] === 'increase' && $method === 'POST') {
                    $controller->increase($id);
                } elseif ($segments[2] === 'decrease' && $method === 'POST') {
                    $controller->decrease($id);
                }
            } else {
                if ($method === 'GET') $controller->show($id);
                elseif ($method === 'PUT') $controller->update($id);
                elseif ($method === 'DELETE') $controller->delete($id);
            }
        }
    }
    
    // ===== FAVORITE ROUTES =====
    if ($segments[0] === 'favorites') {
        $controller = new FavoriteController();
        
        if (!isset($segments[1])) {
            if ($method === 'GET') $controller->index();
            elseif ($method === 'POST') $controller->create();
        } elseif ($segments[1] === 'toggle') {
            if ($method === 'POST') $controller->toggle();
        } else {
            $id = (int)$segments[1];
            if ($method === 'GET') $controller->show($id);
            elseif ($method === 'DELETE') $controller->delete($id);
        }
    }
    
    // ===== COUPON ROUTES =====
    if ($segments[0] === 'coupons') {
        $controller = new CouponController();
        
        if (!isset($segments[1])) {
            if ($method === 'GET') $controller->index();
            elseif ($method === 'POST') $controller->create();
        } elseif ($segments[1] === 'validate') {
            if ($method === 'POST') $controller->validate();
        } else {
            $id = (int)$segments[1];
            if ($method === 'GET') $controller->show($id);
            elseif ($method === 'PUT') $controller->update($id);
            elseif ($method === 'DELETE') $controller->delete($id);
        }
    }
    
    // ===== REVIEW ROUTES =====
    if ($segments[0] === 'reviews') {
        $controller = new ProductReviewController();
        
        if (!isset($segments[1])) {
            if ($method === 'GET') $controller->index();
            elseif ($method === 'POST') $controller->create();
        } elseif ($segments[1] === 'product' && isset($segments[2])) {
            if ($method === 'GET') $controller->getByProduct((int)$segments[2]);
        } else {
            $id = (int)$segments[1];
            if ($method === 'GET') $controller->show($id);
            elseif ($method === 'PUT') $controller->update($id);
            elseif ($method === 'DELETE') $controller->delete($id);
        }
    }
    
    // ===== ROLE ROUTES =====
    if ($segments[0] === 'roles') {
        $controller = new RoleController();
        
        if (!isset($segments[1])) {
            if ($method === 'GET') $controller->index();
            elseif ($method === 'POST') $controller->create();
        } else {
            $id = (int)$segments[1];
            if ($method === 'GET') $controller->show($id);
            elseif ($method === 'PUT') $controller->update($id);
            elseif ($method === 'DELETE') $controller->delete($id);
        }
    }
    
    // ===== ORDER ITEM ROUTES =====
    if ($segments[0] === 'order-items') {
        $controller = new OrderItemController();
        
        if (!isset($segments[1])) {
            if ($method === 'GET') $controller->index();
            elseif ($method === 'POST') $controller->create();
        } elseif ($segments[1] === 'order' && isset($segments[2])) {
            if ($method === 'GET') $controller->getByOrder((int)$segments[2]);
        } elseif ($segments[1] === 'popular') {
            if ($method === 'GET') $controller->popular();
        } else {
            $id = (int)$segments[1];
            if ($method === 'GET') $controller->show($id);
            elseif ($method === 'PUT') $controller->update($id);
            elseif ($method === 'DELETE') $controller->delete($id);
        }
    }
    
    // If no route matched
    Response::error('Endpoint nem található', 404, 'NOT_FOUND');
    
} catch (Throwable $e) {
    Response::serverError('Váratlan hiba: ' . $e->getMessage());
}
