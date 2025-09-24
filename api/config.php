<?php
declare(strict_types=1);

const ADMIN_USERNAME = 'dikalfe';
const ADMIN_PASSWORD_HASH = '$2y$12$X9XAqOVhasxVoiqbES8WAOZwJwAvEy9wIxmsDGbR8cOnz4JKpQy8i';

const DB_HOST = 'localhost';
const DB_NAME = 'portfolio';
const DB_USER = 'root';
const DB_PASSWORD = '';
const DB_CHARSET = 'utf8mb4';

function get_database_connection(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', DB_HOST, DB_NAME, DB_CHARSET);

    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASSWORD, $options);
    } catch (PDOException $exception) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'Gagal terhubung ke database. Periksa konfigurasi di api/config.php',
            'error' => $exception->getMessage(),
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    return $pdo;
}

function ensure_session_started(): void
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

function is_authenticated(): bool
{
    ensure_session_started();
    return isset($_SESSION['user']) && $_SESSION['user']['role'] === 'admin';
}

function require_authentication(): void
{
    if (!is_authenticated()) {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'Otorisasi diperlukan. Silakan masuk sebagai admin.',
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

function normalize_project(array $record): array
{
    $technologies = [];
    if (!empty($record['technologies'])) {
        $decoded = json_decode($record['technologies'], true);
        if (is_array($decoded)) {
            $technologies = array_values(array_filter(array_map('strval', $decoded)));
        }
    }

    return [
        'id' => isset($record['id']) ? (int) $record['id'] : null,
        'title' => $record['title'] ?? '',
        'summary' => $record['summary'] ?? '',
        'description' => $record['description'] ?? '',
        'technologies' => $technologies,
        'liveUrl' => $record['live_url'] ?? '',
        'repoUrl' => $record['repo_url'] ?? '',
        'category' => $record['category'] ?? 'Case Study',
        'status' => $record['status'] ?? 'prototype',
        'createdAt' => isset($record['created_at']) ? substr((string) $record['created_at'], 0, 10) : null,
    ];
}
