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

$input = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($input)) {
    $input = $_POST;
}

$username = isset($input['username']) ? trim((string) $input['username']) : '';
$password = isset($input['password']) ? (string) $input['password'] : '';

if ($username === '' || $password === '') {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Username dan password wajib diisi.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($username === ADMIN_USERNAME && password_verify($password, ADMIN_PASSWORD_HASH)) {
    $_SESSION['user'] = [
        'username' => ADMIN_USERNAME,
        'role' => 'admin',
        'loggedInAt' => (new DateTimeImmutable())->format(DateTimeInterface::ATOM),
    ];

    echo json_encode([
        'success' => true,
        'user' => $_SESSION['user'],
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(401);
echo json_encode([
    'success' => false,
    'message' => 'Kredensial tidak valid.'
], JSON_UNESCAPED_UNICODE);
