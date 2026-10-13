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

dengan domain resmi:

`https://ppi-ishikawa.org/`

Workflow `.github/workflows/deploy.yml` melakukan build dan deployment setiap ada push ke `main`.
GitHub Pages mengelola domain kustom melalui **Settings → Pages → Custom domain**. Karena
deployment memakai GitHub Actions, file `CNAME` di repository tidak diperlukan.

## Infrastruktur domain dan keamanan

- Registrar dan perpanjangan: Spaceship.
- Nameserver dan DNS: Cloudflare (mulai dengan **DNS only** / gray cloud).
- Hosting: GitHub Pages; domain utama `ppi-ishikawa.org`, alias `www.ppi-ishikawa.org`.
- Astro: `site: 'https://ppi-ishikawa.org'` tanpa `base` agar seluruh route memakai root `/`.
- GitHub Pages: aktifkan **Enforce HTTPS** setelah sertifikat siap.
- Supabase Auth → URL Configuration: set **Site URL** ke `https://ppi-ishikawa.org`; izinkan redirect:
  `https://ppi-ishikawa.org/member/login/` dan
  `https://ppi-ishikawa.org/member/reset-password/` (tambahkan callback dengan query bila diperlukan).
- Sesudah DNS dan deploy berubah, uji signup/konfirmasi email, login, logout, dan reset password di domain resmi.
- `public/robots.txt` tetap menolak indexing hingga peluncuran publik disetujui.

Jangan ubah Cloudflare menjadi proxied / orange cloud atau ubah mode TLS sebelum
sertifikat dan callback GitHub Pages terverifikasi.

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
- Campus Hub + 6/6 Campus Packs: tersedia.
- Home, Tentang, Komunitas, Program, Sumber Daya, dan Kontak: aktif sebagai draft publik.
- Arah/visi 2026/27 dan struktur fungsi organisasi: tersedia; nama pengurus menunggu publikasi resmi.
- Program kerja final, kanal kontak resmi, dan data agregat anggota: belum dipublikasikan.
- Search indexing: sengaja dinonaktifkan sampai official launch.

## Maintenance

- Metadata Survival Guide: `src/data/survival.ts`
- Struktur organisasi: `src/data/organization.ts`
- Source registry: `docs/survival/OFFICIAL-SOURCE-REGISTRY.md`
- Editorial style: `docs/EDITORIAL-STYLE.md`
- **UI/UX Design System & Governance (wajib untuk kontribusi UI):** `docs/brand/DESIGN-SYSTEM-GOVERNANCE.md`
- Inventory / catatan migrasi Page Archetypes: `docs/brand/PUBLIC-PAGE-ARCHETYPES.md`
- Audit visual responsif: `.github/workflows/responsive-audit.yml` (screenshots di artifact GitHub Actions)
- Checklist review perubahan UI: `.github/PULL_REQUEST_TEMPLATE.md`
- Content maintenance: `docs/CONTENT-GUIDE.md`
- External link audit: `.github/workflows/link-check.yml`
