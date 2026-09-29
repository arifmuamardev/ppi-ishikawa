# Content Guide

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
