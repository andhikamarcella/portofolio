<?php
declare(strict_types=1);

require __DIR__ . '/config.php';

header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Metode tidak diizinkan.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

ensure_session_started();

$_SESSION = [];
if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
}

session_destroy();

echo json_encode([
    'success' => true,
    'message' => 'Berhasil keluar.'
], JSON_UNESCAPED_UNICODE);
