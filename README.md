# PPI Ishikawa 2026/27 — Website Foundation

Fondasi website publik PPI Ishikawa untuk periode 2026/27.

## Stack

- Astro 7
- Tailwind CSS 4 via Vite plugin
- GitHub Pages
- GitHub Actions
- Static-first: belum memakai database, CMS, atau login

## Jalankan secara lokal

```bash
npm install
npm run dev
```

Build production:

```bash
npm run build
npm run preview
```

## GitHub Pages

Konfigurasi awal diasumsikan memakai repository:

`arifmuamardev/ppi-ishikawa`

sehingga preview publiknya akan berada di:

`https://arifmuamardev.github.io/ppi-ishikawa/`

Setelah repository dibuat:

1. Push semua file ke branch `main`.
2. Buka **Settings → Pages**.
3. Pada **Source**, pilih **GitHub Actions**.
4. Workflow `.github/workflows/deploy.yml` akan melakukan build dan deployment setiap ada push ke `main`.

## Saat pindah ke ppi-ishikawa.org

Setelah domain resmi dibeli:

1. Ubah `site` di `astro.config.mjs` menjadi `https://ppi-ishikawa.org`.
2. Hapus `base: '/ppi-ishikawa'`.
3. Tambahkan `public/CNAME` berisi `ppi-ishikawa.org`.
4. Konfigurasikan DNS domain sesuai petunjuk GitHub Pages.
5. Karena helper URL menggunakan `import.meta.env.BASE_URL`, navigasi akan menyesuaikan setelah `base` dihapus.

## Prinsip konten

Website dirancang bukan hanya sebagai profil organisasi, tetapi sebagai:

- portal anggota,
- Ishikawa Survival Guide,
- arsip dan institutional memory,
- katalog program dan kegiatan,
- pintu kolaborasi eksternal.

Jangan menyimpan data pribadi anggota, nomor telepon personal, token, password, atau secret di repository publik.
