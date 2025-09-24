<?php
declare(strict_types=1);

const ADMIN_USERNAME = 'dikalfe';
const ADMIN_PASSWORD_HASH = '$2y$12$X9XAqOVhasxVoiqbES8WAOZwJwAvEy9wIxmsDGbR8cOnz4JKpQy8i';

const DB_HOST = 'localhost';
const DB_NAME = 'portfolio';
const DB_USER = 'root';
const DB_PASSWORD = '';
const DB_CHARSET = 'utf8mb4';
const DB_COLLATION = 'utf8mb4_unicode_ci';

function get_database_connection(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', DB_HOST, DB_NAME, DB_CHARSET);

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASSWORD, $options);
    } catch (PDOException $exception) {
        if (is_unknown_database_error($exception)) {
            try {
                create_database_if_missing($options);
                $pdo = new PDO($dsn, DB_USER, DB_PASSWORD, $options);
            } catch (PDOException $creationException) {
                respond_with_connection_error(
                    $creationException,
                    'Gagal membuat database otomatis. Periksa kredensial MySQL Anda.'
                );
            }
        } else {
            respond_with_connection_error(
                $exception,
                'Gagal terhubung ke database. Periksa konfigurasi di api/config.php.'
            );
        }
    }

    try {
        ensure_projects_schema($pdo);
        seed_default_projects($pdo);
    } catch (PDOException $exception) {
        respond_with_connection_error(
            $exception,
            'Gagal menyiapkan skema database projects secara otomatis.'
        );
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

function is_unknown_database_error(PDOException $exception): bool
{
    $errorInfo = $exception->errorInfo;

    return is_array($errorInfo)
        && isset($errorInfo[1])
        && (int) $errorInfo[1] === 1049;
}

function create_database_if_missing(array $options): void
{
    $dsn = sprintf('mysql:host=%s;charset=%s', DB_HOST, DB_CHARSET);
    $pdo = new PDO($dsn, DB_USER, DB_PASSWORD, $options);

    $pdo->exec(sprintf(
        'CREATE DATABASE IF NOT EXISTS `%s` CHARACTER SET %s COLLATE %s',
        DB_NAME,
        DB_CHARSET,
        DB_COLLATION
    ));
}

function ensure_projects_schema(PDO $pdo): void
{
    $pdo->exec(sprintf(
        'CREATE TABLE IF NOT EXISTS `projects` (
            `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
            `title` VARCHAR(150) NOT NULL,
            `summary` VARCHAR(255) NOT NULL,
            `description` TEXT NOT NULL,
            `technologies` TEXT NULL,
            `live_url` VARCHAR(255) NULL,
            `repo_url` VARCHAR(255) NULL,
            `category` VARCHAR(60) NOT NULL DEFAULT "Poster Event",
            `status` VARCHAR(40) NOT NULL DEFAULT "concept",
            `created_at` DATE NOT NULL DEFAULT (CURRENT_DATE),
            PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=%s COLLATE=%s',
        DB_CHARSET,
        DB_COLLATION
    ));
}

function seed_default_projects(PDO $pdo): void
{
    $count = (int) $pdo->query('SELECT COUNT(*) FROM projects')->fetchColumn();

    if ($count > 0) {
        return;
    }

    $defaults = [
        [
            'title' => 'Sunrise Music Festival Poster',
            'summary' => 'Konsep poster festival musik energi sunrise.',
            'description' => 'Eksplorasi tipografi blok, gradien neon, dan layout modular untuk menonjolkan line-up artis beserta QR RSVP.',
            'technologies' => ['Adobe Photoshop', 'Adobe Illustrator', 'Gradien Neon'],
            'live_url' => 'https://www.behance.net/',
            'repo_url' => null,
            'category' => 'Poster Event',
            'status' => 'concept',
            'created_at' => '2024-08-04',
        ],
        [
            'title' => 'Daily Brew Promo Poster',
            'summary' => 'Poster promo coffee shop bergaya minimalis.',
            'description' => 'Menggabungkan fotografi produk dan ilustrasi grainy untuk promo buy 1 get 1 lengkap dengan harga dan lokasi.',
            'technologies' => ['Adobe Illustrator', 'Affinity Photo', 'Texture Overlay'],
            'live_url' => 'https://www.behance.net/',
            'repo_url' => null,
            'category' => 'Poster Promosi',
            'status' => 'concept',
            'created_at' => '2024-07-12',
        ],
        [
            'title' => 'Creative Labs Workshop Poster',
            'summary' => 'Poster workshop komunitas bergaya editorial.',
            'description' => 'Layout kolom informatif dengan highlight pembicara, palet monokrom biru, dan konsistensi branding acara.',
            'technologies' => ['Figma', 'Adobe InDesign', 'Editorial Layout'],
            'live_url' => 'https://www.behance.net/',
            'repo_url' => null,
            'category' => 'Poster Komunitas',
            'status' => 'live',
            'created_at' => '2024-05-28',
        ],
    ];

    $statement = $pdo->prepare(
        'INSERT INTO projects (title, summary, description, technologies, live_url, repo_url, category, status, created_at)
        VALUES (:title, :summary, :description, :technologies, :live_url, :repo_url, :category, :status, :created_at)'
    );

    foreach ($defaults as $project) {
        $statement->execute([
            ':title' => $project['title'],
            ':summary' => $project['summary'],
            ':description' => $project['description'],
            ':technologies' => json_encode($project['technologies'], JSON_UNESCAPED_UNICODE),
            ':live_url' => $project['live_url'],
            ':repo_url' => $project['repo_url'],
            ':category' => $project['category'],
            ':status' => $project['status'],
            ':created_at' => $project['created_at'],
        ]);
    }
}

function respond_with_connection_error(PDOException $exception, string $message): void
{
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => $message,
        'error' => $exception->getMessage(),
    ], JSON_UNESCAPED_UNICODE);
    exit;
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
        'category' => $record['category'] ?? 'Poster Event',
        'status' => $record['status'] ?? 'concept',
        'createdAt' => isset($record['created_at']) ? substr((string) $record['created_at'], 0, 10) : null,
    ];
}
