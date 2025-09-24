# React Portfolio CRUD

Website portofolio interaktif berbasis React tanpa proses build sehingga langsung kompatibel dengan hosting statis seperti [InfinityFree](https://www.infinityfree.com/). Data project kini disimpan di database MySQL melalui API PHP sehingga aman dari inspeksi *view source* dan dapat diakses oleh admin terautentikasi.

## Fitur

- ✨ Landing page modern dengan hero section, skill matrix, dan timeline perjalanan karier.
- 🧠 CRUD project secara penuh (tambah, baca, edit, hapus) langsung dari browser.
- 🔍 Pencarian cepat, filter status & kategori, serta pengurutan project.
- 📊 Statistik jumlah project live/prototype otomatis ter-update.
- 🔐 Panel admin dengan autentikasi server-side (username `dikalfe`) agar hanya pemilik yang dapat mengunggah/mengubah project.
- 💾 Persistensi data menggunakan database MySQL melalui endpoint PHP (`api/`) lengkap dengan sesi login.
- ⚡ Shortcut `Ctrl/Cmd + K` untuk fokus ke pencarian project.
- 📱 Desain responsif dan siap dipublikasikan ke hosting statis.

## Struktur Proyek

```
├── index.html        # Entry point yang memuat React melalui CDN
├── assets/
│   ├── app.jsx       # Seluruh komponen React, autentikasi, dan logika CRUD
│   └── styles.css    # Styling utama dengan efek glassmorphism & responsif
├── api/
│   ├── config.php    # Konfigurasi database & kredensial admin (hash tersimpan di server)
│   ├── login.php     # Endpoint login admin (POST)
│   ├── logout.php    # Endpoint logout admin (POST)
│   ├── session.php   # Mengecek status sesi admin (GET)
│   └── projects.php  # Endpoint CRUD project (GET/POST/PUT/DELETE)
└── README.md
```

## Cara Menjalankan Secara Lokal

1. Pastikan PHP 8+ dan MySQL/MariaDB tersedia di komputer Anda.
2. Salin `api/config.php` lalu isi kredensial database lokal Anda pada konstanta `DB_HOST`, `DB_NAME`, `DB_USER`, dan `DB_PASSWORD`.
3. Buat database dan tabel menggunakan skrip pada bagian [Skema Database](#skema-database). Anda juga bisa menambahkan data contoh melalui *seed* yang sama.
4. Dari root proyek, jalankan server PHP bawaan: `php -S localhost:8000`.
5. Buka `http://localhost:8000` pada browser modern. Login admin menggunakan username `dikalfe` dan password `dikalfegantengbanget123` untuk mulai mengelola project.

## Deploy ke InfinityFree

1. Buat akun dan domain/subdomain di InfinityFree, lalu buat database MySQL baru dari panel kontrol (catat host, nama DB, user, dan password).
2. Edit `api/config.php` sesuai kredensial database InfinityFree yang Anda dapatkan.
3. Melalui phpMyAdmin InfinityFree, jalankan skrip pada bagian [Skema Database](#skema-database) untuk membuat tabel `projects` dan data awal (opsional).
4. Upload seluruh isi folder proyek (termasuk folder `assets` dan `api`) ke direktori `htdocs` menggunakan File Manager atau FTP.
5. Pastikan `index.html` berada di root `htdocs`. Akses domain Anda dan gunakan kredensial admin untuk login sebelum mengunggah project baru.

> ℹ️ Hash password admin disimpan di sisi server (`api/config.php`) sehingga tidak akan muncul saat *view source*. Ubah konstanta `ADMIN_USERNAME` dan `ADMIN_PASSWORD_HASH` jika ingin mengganti kredensial (gunakan `password_hash()` di PHP untuk menghasilkan hash baru).

## Skema Database

Jalankan skrip SQL berikut untuk membuat tabel `projects` dan menambahkan data contoh. Sesuaikan nama database sesuai konfigurasi Anda.

```sql
CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(150) NOT NULL,
  `summary` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `technologies` TEXT NULL,
  `live_url` VARCHAR(255) NULL,
  `repo_url` VARCHAR(255) NULL,
  `category` VARCHAR(60) NOT NULL DEFAULT 'Case Study',
  `status` VARCHAR(40) NOT NULL DEFAULT 'prototype',
  `created_at` DATE NOT NULL DEFAULT (CURRENT_DATE),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `projects` (`title`, `summary`, `description`, `technologies`, `live_url`, `repo_url`, `category`, `status`, `created_at`) VALUES
('Product Launchpad', 'Landing page dengan automasi waitlist.', 'High converting landing page dengan storytelling hero, pricing tiers, dan integrasi waitlist realtime.', '["React","Tailwind","Framer Motion"]', 'https://example.com/launchpad', 'https://github.com/username/launchpad', 'Product', 'live', '2024-06-12'),
('Creator Revenue Dashboard', 'Dashboard tracking income kreator.', 'Widget modular, kartu KPI, dan filter lanjutan untuk memantau sponsorship, ads, hingga produk digital.', '["React","D3.js","Supabase"]', 'https://example.com/revenue-dashboard', 'https://github.com/username/revenue-dashboard', 'Dashboard', 'prototype', '2024-04-20'),
('UX Research Lab', 'Case study dengan storytelling interaktif.', 'Highlight metode riset, persona, serta animasi perjalanan pengguna dengan integrasi Notion API.', '["React","GSAP","Notion API"]', 'https://example.com/ux-lab', 'https://github.com/username/ux-lab', 'Case Study', 'live', '2023-11-05');
```

## Kustomisasi

- Kelola project langsung melalui UI setelah login admin atau lakukan *seed* awal melalui database.
- Konstanta `defaultProjects` di `assets/app.jsx` hanya berfungsi sebagai fallback saat server/database belum tersedia.
- Sesuaikan daftar skill di konstanta `skills` dan timeline karier pada `timelineItems`.
- Edit gaya visual pada `assets/styles.css` untuk mengubah warna, tipografi, atau layout.
- Untuk mengganti kredensial admin, ubah `ADMIN_USERNAME` dan `ADMIN_PASSWORD_HASH` pada `api/config.php`.

---

Dikembangkan secara hati-hati tanpa mengubah fitur eksisting dan siap menjadi dasar portofolio profesional yang dinamis.
