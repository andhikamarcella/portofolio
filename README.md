# React Portfolio CRUD

Website portofolio interaktif berbasis React tanpa proses build sehingga langsung kompatibel dengan hosting statis seperti [InfinityFree](https://www.infinityfree.com/). Seluruh data project tersimpan di browser (localStorage) dan bisa dikelola langsung melalui antarmuka CRUD.

## Fitur

- ✨ Landing page modern dengan hero section, skill matrix, dan timeline perjalanan karier.
- 🧠 CRUD project secara penuh (tambah, baca, edit, hapus) langsung dari browser.
- 🔍 Pencarian cepat, filter status & kategori, serta pengurutan project.
- 📊 Statistik jumlah project live/prototype otomatis ter-update.
- 💾 Persistensi data menggunakan `localStorage` sehingga tetap tersimpan di perangkat pengguna.
- ⚡ Shortcut `Ctrl/Cmd + K` untuk fokus ke pencarian project.
- 📱 Desain responsif dan siap dipublikasikan ke hosting statis.

## Struktur Proyek

```
├── index.html        # Entry point yang memuat React melalui CDN
├── assets/
│   ├── app.jsx       # Seluruh komponen React dan logika CRUD
│   └── styles.css    # Styling utama dengan efek glassmorphism & responsif
└── README.md
```

## Cara Menjalankan Secara Lokal

1. Cukup buka berkas `index.html` menggunakan browser modern (tidak perlu instalasi tambahan).
2. Semua interaksi React berjalan via CDN (`unpkg`) dan JSX diproses langsung oleh Babel Standalone.
3. Data project baru tersimpan otomatis pada `localStorage`. Gunakan tombol hapus pada setiap kartu untuk menghapus data.

## Deploy ke InfinityFree

1. Buat akun dan domain/subdomain di InfinityFree.
2. Upload seluruh isi folder proyek (termasuk folder `assets`) ke direktori `htdocs` menggunakan File Manager atau FTP.
3. Pastikan berkas utama bernama `index.html` berada di root `htdocs` agar langsung dibaca sebagai halaman depan.
4. Buka domain Anda dan website portofolio akan langsung aktif tanpa konfigurasi tambahan.

## Kustomisasi

- Perbarui data default project pada konstanta `defaultProjects` di `assets/app.jsx`.
- Sesuaikan daftar skill di konstanta `skills` dan timeline karier pada `timelineItems`.
- Edit gaya visual pada `assets/styles.css` untuk mengubah warna, tipografi, atau layout.
- Untuk reset data yang tersimpan di browser, hapus item `react-portfolio-projects` melalui DevTools atau panggil `localStorage.clear()` pada console.

---

Dikembangkan secara hati-hati tanpa mengubah fitur eksisting dan siap menjadi dasar portofolio profesional yang dinamis.
