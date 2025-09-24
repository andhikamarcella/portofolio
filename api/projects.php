<?php
declare(strict_types=1);

require __DIR__ . '/config.php';

header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    switch ($method) {
        case 'GET':
            echo json_encode([
                'success' => true,
                'projects' => list_projects(),
            ], JSON_UNESCAPED_UNICODE);
            break;
        case 'POST':
            require_authentication();
            echo json_encode(create_project(), JSON_UNESCAPED_UNICODE);
            break;
        case 'PUT':
            require_authentication();
            echo json_encode(update_project(), JSON_UNESCAPED_UNICODE);
            break;
        case 'DELETE':
            require_authentication();
            echo json_encode(delete_project(), JSON_UNESCAPED_UNICODE);
            break;
        case 'OPTIONS':
            header('Allow: GET, POST, PUT, DELETE, OPTIONS');
            exit;
        default:
            http_response_code(405);
            echo json_encode([
                'success' => false,
                'message' => 'Metode tidak diizinkan.'
            ], JSON_UNESCAPED_UNICODE);
            break;
    }
} catch (InvalidArgumentException $exception) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $exception->getMessage(),
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $exception) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Terjadi kesalahan tak terduga.',
        'error' => $exception->getMessage(),
    ], JSON_UNESCAPED_UNICODE);
}

function list_projects(): array
{
    $pdo = get_database_connection();
    $query = 'SELECT id, title, summary, description, technologies, live_url, repo_url, category, status, created_at FROM projects ORDER BY created_at DESC, id DESC';
    $statement = $pdo->query($query);

    $results = [];
    foreach ($statement->fetchAll() as $row) {
        $results[] = normalize_project($row);
    }

    return $results;
}

function create_project(): array
{
    $data = validate_project_payload(read_request_payload());

    $pdo = get_database_connection();
    $statement = $pdo->prepare(
        'INSERT INTO projects (title, summary, description, technologies, live_url, repo_url, category, status, created_at) VALUES (:title, :summary, :description, :technologies, :live_url, :repo_url, :category, :status, :created_at)'
    );

    $statement->execute([
        ':title' => $data['title'],
        ':summary' => $data['summary'],
        ':description' => $data['description'],
        ':technologies' => json_encode($data['technologies'], JSON_UNESCAPED_UNICODE),
        ':live_url' => $data['liveUrl'],
        ':repo_url' => $data['repoUrl'],
        ':category' => $data['category'],
        ':status' => $data['status'],
        ':created_at' => $data['createdAt'],
    ]);

    $id = (int) $pdo->lastInsertId();
    $project = fetch_project_by_id($pdo, $id);

    return [
        'success' => true,
        'project' => $project,
    ];
}

function update_project(): array
{
    $payload = read_request_payload();
    $id = isset($_GET['id']) ? (int) $_GET['id'] : (isset($payload['id']) ? (int) $payload['id'] : 0);

    if ($id <= 0) {
        throw new InvalidArgumentException('ID project tidak valid.');
    }

    $data = validate_project_payload($payload);

    $pdo = get_database_connection();

    $statement = $pdo->prepare(
        'UPDATE projects SET title = :title, summary = :summary, description = :description, technologies = :technologies, live_url = :live_url, repo_url = :repo_url, category = :category, status = :status, created_at = :created_at WHERE id = :id'
    );

    $statement->execute([
        ':id' => $id,
        ':title' => $data['title'],
        ':summary' => $data['summary'],
        ':description' => $data['description'],
        ':technologies' => json_encode($data['technologies'], JSON_UNESCAPED_UNICODE),
        ':live_url' => $data['liveUrl'],
        ':repo_url' => $data['repoUrl'],
        ':category' => $data['category'],
        ':status' => $data['status'],
        ':created_at' => $data['createdAt'],
    ]);

    $project = fetch_project_by_id($pdo, $id);

    return [
        'success' => true,
        'project' => $project,
    ];
}

function delete_project(): array
{
    $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

    if ($id <= 0) {
        throw new InvalidArgumentException('ID project tidak valid.');
    }

    $pdo = get_database_connection();
    $statement = $pdo->prepare('DELETE FROM projects WHERE id = :id');
    $statement->execute([':id' => $id]);

    if ($statement->rowCount() === 0) {
        throw new InvalidArgumentException('Project tidak ditemukan.');
    }

    return [
        'success' => true,
        'message' => 'Project berhasil dihapus.'
    ];
}

function fetch_project_by_id(PDO $pdo, int $id): array
{
    $statement = $pdo->prepare('SELECT id, title, summary, description, technologies, live_url, repo_url, category, status, created_at FROM projects WHERE id = :id LIMIT 1');
    $statement->execute([':id' => $id]);
    $record = $statement->fetch();

    if (!$record) {
        throw new InvalidArgumentException('Project tidak ditemukan.');
    }

    return normalize_project($record);
}

function read_request_payload(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $decoded = json_decode($raw, true);
    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
        return $decoded;
    }

    parse_str($raw, $parsed);
    if (is_array($parsed)) {
        return $parsed;
    }

    return [];
}

function validate_project_payload(array $payload): array
{
    $title = isset($payload['title']) ? trim((string) $payload['title']) : '';
    $summary = isset($payload['summary']) ? trim((string) $payload['summary']) : '';
    $description = isset($payload['description']) ? trim((string) $payload['description']) : '';

    if ($title === '') {
        throw new InvalidArgumentException('Judul project wajib diisi.');
    }

    if ($summary === '') {
        throw new InvalidArgumentException('Ringkasan project wajib diisi.');
    }

    $technologies = [];
    if (isset($payload['technologies'])) {
        if (is_array($payload['technologies'])) {
            $technologies = array_values(array_filter(array_map(static function ($value) {
                return trim((string) $value);
            }, $payload['technologies'])));
        } elseif (is_string($payload['technologies'])) {
            $technologies = array_values(array_filter(array_map('trim', explode(',', $payload['technologies']))));
        }
    }

    $category = isset($payload['category']) ? trim((string) $payload['category']) : 'Poster Event';
    $status = isset($payload['status']) ? trim((string) $payload['status']) : 'concept';

    $liveUrl = isset($payload['liveUrl']) ? trim((string) $payload['liveUrl']) : '';
    $repoUrl = isset($payload['repoUrl']) ? trim((string) $payload['repoUrl']) : '';

    $createdAt = isset($payload['createdAt']) ? trim((string) $payload['createdAt']) : date('Y-m-d');
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $createdAt)) {
        $createdAt = date('Y-m-d');
    }

    return [
        'title' => $title,
        'summary' => $summary,
        'description' => $description,
        'technologies' => $technologies,
        'category' => $category ?: 'Poster Event',
        'status' => $status ?: 'concept',
        'liveUrl' => $liveUrl,
        'repoUrl' => $repoUrl,
        'createdAt' => $createdAt,
    ];
}
