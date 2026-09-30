# PPI Ishikawa 2026/27 — Public Website

Website publik PPI Ishikawa untuk periode 2026/27. Saat ini mencakup halaman institusional, struktur organisasi draft, dan Ishikawa Survival Guide SG00–SG14.

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

Repository saat ini:

`arifmuamardev/ppi-ishikawa`

dengan deployment publik di:

`https://arifmuamardev.github.io/ppi-ishikawa/`

Workflow `.github/workflows/deploy.yml` melakukan build dan deployment setiap ada push ke `main`.

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


## Status konten

- SG00–SG14 Survival Guide: tersedia.
- Home, Tentang, Komunitas, Program, Sumber Daya, dan Kontak: draft publik aktif.
- Struktur organisasi: fungsi dan posisi sudah tersedia; nama pengurus menunggu penetapan resmi.
- Visi, misi, program kerja final, kanal kontak resmi, dan data agregat anggota: belum dipublikasikan.
- Search indexing: sengaja dinonaktifkan sampai official launch.

## Maintenance

- Metadata Survival Guide: `src/data/survival.ts`
- Struktur organisasi: `src/data/organization.ts`
- Source registry: `docs/survival/OFFICIAL-SOURCE-REGISTRY.md`
- Editorial style: `docs/EDITORIAL-STYLE.md`
- Content maintenance: `docs/CONTENT-GUIDE.md`
- External link audit: `.github/workflows/link-check.yml`
