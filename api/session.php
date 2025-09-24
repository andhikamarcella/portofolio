<?php
declare(strict_types=1);

require __DIR__ . '/config.php';

header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Metode tidak diizinkan.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

ensure_session_started();

if (is_authenticated()) {
    echo json_encode([
        'success' => true,
        'authenticated' => true,
        'user' => $_SESSION['user'],
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode([
    'success' => true,
    'authenticated' => false,
    'user' => null,
], JSON_UNESCAPED_UNICODE);
