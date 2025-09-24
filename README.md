# React Portfolio CRUD

Website portofolio interaktif berbasis React tanpa proses build sehingga langsung kompatibel dengan hosting statis seperti [InfinityFree](https://www.infinityfree.com/). Edisi ini dikurasi untuk graphic designer poster (Dikalfe) lengkap dengan layanan, kalkulator rate, dan kontak WhatsApp yang aman karena data project disimpan di database MySQL melalui API PHP.

## Fitur

- ✨ Landing page poster designer dengan hero, showcase layanan, workflow kolaborasi, skill matrix, dan timeline perjalanan.
- 💼 Switcher layanan poster untuk melihat deliverables, estimasi durasi, serta kegunaan tiap paket.
- 💰 Kalkulator rate poster (mulai Rp250.000) lengkap dengan opsi format, timeline, dan add-on yang langsung mengarah ke WhatsApp `0851 6320 7556`.
- 🧾 Poster Brief Builder untuk merangkum kebutuhan campaign sebelum diskusi dengan client.
- 🎨 Moodboard & inspiration board interaktif agar mudah menentukan vibe warna, tipografi, dan tekstur poster.
- 🧠 CRUD project secara penuh (tambah, baca, edit, hapus) langsung dari browser.
- 🔍 Pencarian cepat, filter status & kategori poster, serta pengurutan project.
- 📊 Statistik jumlah project live/concept/prototype otomatis ter-update.
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
3. Jalankan aplikasi; backend akan otomatis membuat database (jika user memiliki izin) beserta tabel `projects` dan data contoh poster pertama kali dijalankan.
4. Dari root proyek, jalankan server PHP bawaan: `php -S localhost:8000`.
5. Buka `http://localhost:8000` pada browser modern. Login admin menggunakan username `dikalfe` dan password `dikalfegantengbanget123` untuk mulai mengelola project.

## Deploy ke InfinityFree

1. Buat akun dan domain/subdomain di InfinityFree, lalu buat database MySQL baru dari panel kontrol (catat host, nama DB, user, dan password).
2. Edit `api/config.php` sesuai kredensial database InfinityFree yang Anda dapatkan.
3. Upload seluruh isi folder proyek (termasuk folder `assets` dan `api`) ke direktori `htdocs` menggunakan File Manager atau FTP.
4. Pastikan `index.html` berada di root `htdocs`. Pada akses pertama backend akan mencoba membuat tabel `projects` dan mengisi tiga contoh poster otomatis. Gunakan phpMyAdmin hanya jika hosting tidak mengizinkan pembuatan otomatis.
5. Akses domain Anda dan gunakan kredensial admin untuk login sebelum mengunggah project baru.

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
  `category` VARCHAR(60) NOT NULL DEFAULT 'Poster Event',
  `status` VARCHAR(40) NOT NULL DEFAULT 'concept',
  `created_at` DATE NOT NULL DEFAULT (CURRENT_DATE),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `projects` (`title`, `summary`, `description`, `technologies`, `live_url`, `repo_url`, `category`, `status`, `created_at`) VALUES
('Sunrise Music Festival Poster', 'Konsep poster festival musik energi sunrise.', 'Eksplorasi tipografi blok, gradien neon, dan layout modular untuk menonjolkan line-up artis beserta QR RSVP.', '["Adobe Photoshop","Adobe Illustrator","Gradien Neon"]', 'https://www.behance.net/', NULL, 'Poster Event', 'concept', '2024-08-04'),
('Daily Brew Promo Poster', 'Poster promo coffee shop bergaya minimalis.', 'Menggabungkan fotografi produk dan ilustrasi grainy untuk promo buy 1 get 1 lengkap dengan harga dan lokasi.', '["Adobe Illustrator","Affinity Photo","Texture Overlay"]', 'https://www.behance.net/', NULL, 'Poster Promosi', 'concept', '2024-07-12'),
('Creative Labs Workshop Poster', 'Poster workshop komunitas bergaya editorial.', 'Layout kolom informatif dengan highlight pembicara, palet monokrom biru, dan konsistensi branding acara.', '["Figma","Adobe InDesign","Editorial Layout"]', 'https://www.behance.net/', NULL, 'Poster Komunitas', 'live', '2024-05-28');
```

## Kustomisasi

- Kelola project langsung melalui UI setelah login admin atau lakukan *seed* awal melalui database.
- Konstanta `defaultProjects` di `assets/app.jsx` berisi contoh konsep poster ketika database belum terhubung.
- Sesuaikan daftar skill, layanan (`servicePackages`), kalkulator rate, hingga preset moodboard langsung di `assets/app.jsx`.
- Edit gaya visual pada `assets/styles.css` untuk mengubah warna, tipografi, atau layout.
- Untuk mengganti kredensial admin, ubah `ADMIN_USERNAME` dan `ADMIN_PASSWORD_HASH` pada `api/config.php`.

---

Dikembangkan secara hati-hati tanpa mengubah fitur eksisting dan siap menjadi dasar portofolio profesional yang dinamis.
