# Content Guide

Untuk bahasa, istilah, nada, dan aturan editorial publik, lihat `docs/EDITORIAL-STYLE.md`.

## Prinsip

1. Informasi yang cepat berubah harus mencantumkan tanggal pembaruan.
2. Panduan administratif harus merujuk sumber resmi bila tersedia.
3. Jangan memasukkan data pribadi anggota ke repository publik.
4. Gunakan bahasa Indonesia yang lugas; terjemahan Inggris/Jepang diprioritaskan untuk halaman publik.
5. Arsip periode lama dipertahankan agar website menjadi institutional memory.

## Lokasi edit utama

- Identitas website dan navigasi: `src/data/site.ts`
- Homepage: `src/pages/index.astro`
- Halaman utama lain: `src/pages/*.astro`
- Global styling: `src/styles/global.css`
- Deployment: `.github/workflows/deploy.yml`

## Data yang tidak boleh dimasukkan

- Password / API token / secret
- Nomor residence card / passport
- Nomor telepon pribadi tanpa persetujuan
- Database anggota mentah
- Dokumen internal/confidential


## Survival Guide maintenance

- Metadata SG00–SG14 disimpan di `src/data/survival.ts`.
- Jangan hard-code ulang `lastVerified`, volatility, source registry IDs, atau urutan prev/next di halaman.
- Halaman dengan array `sections` memakai `GuideToc.astro`; setiap section harus mempunyai label unik.
- Navigasi bawah memakai `GuidePager.astro`.
- Sumber resmi baru harus ditambahkan ke `docs/survival/OFFICIAL-SOURCE-REGISTRY.md` dan kemudian direferensikan melalui ID.
- Data live (jadwal, tarif, alert, medical availability, road condition) tidak boleh dicopy menjadi nilai statis.
- Jalankan `node scripts/check-links.mjs` sebelum release besar. GitHub Actions juga menjalankan audit link mingguan.

## Review cadence

- Rendah: minimal 1× per tahun.
- Sedang: minimal setiap 6 bulan.
- Tinggi: minimal setiap 3 bulan.
- Live: jangan mirror nilai live; audit link dan konteks secara berkala.
