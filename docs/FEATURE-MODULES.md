# Feature Registry — PPI Ishikawa 2026/2027

**Single source of truth:** `src/config/features.mjs`.

## Pengaturan

| Status | Perilaku | Akses melalui URL langsung |
| --- | --- | --- |
| `enabled` | Tampil pada komponen dan navigasi yang terhubung ke registry | Tersedia |
| `hidden` | Tidak dipromosikan dalam navigasi/kartu yang terhubung ke registry | Tersedia |
| `disabled` | Halaman HTML untuk modul dihapus dari `dist/` setelah Astro build | Tidak tersedia pada deploy baru (umumnya 404) |

Pengaturan bersifat **build-time**, bukan CMS real-time. Mengubah file memerlukan build, pengujian, merge, dan deployment ulang.

## Modul utama

| Nama pengaturan | Rute utama | Nilai awal |
| --- | --- | --- |
| `organization` | `/about/` | enabled |
| `campuses` | `/community/kampus/` dan panduan tiap kampus | enabled |
| `survivalGuide` | `/life-in-ishikawa/` (kecuali Family Guide dan Places) | enabled |
| `familyGuide` | `/life-in-ishikawa/family-anak/` dan `/life-in-ishikawa/family/` | enabled |
| `scholarships` | `/beasiswa/` | enabled |
| `career` | `/career/` | enabled |
| `places` | `/life-in-ishikawa/places/` | enabled |
| `community` | `/community/` (bukan halaman kampus) | enabled |
| `programs` | `/programs/` | enabled |
| `stories` | `/stories/` dan artikel | enabled |
| `instagram` | Widget Instagram pada Community (tanpa rute sendiri) | enabled |
| `designLab` | `/design-lab/` dan semua aset statisnya | hidden |
| `publicVerification` | `/verify/member/` dan `/verify/certificate/` | enabled |

Halaman `/`, `/contact/`, `/resources/`, dan kesalahan 404 merupakan layanan inti yang selalu ada.

## Area Anggota

- `membership: 'hidden'` adalah default: **tidak ada tombol Area Anggota di navigasi publik**, tetapi URL login/daftar, aplikasi anggota dan demo yang sudah ada tetap tersedia.
- Fitur turunan (`memberEvents`, `memberCommunity`, `memberOrganization`, `memberGrowth`, `memberCards`, `memberCertificates`, `memberDocuments`, `memberAdministration`) mengatur item pada menu member/admin serta rute spesifik masing-masing.
- Fitur turunan ditutup otomatis ketika `membership: 'disabled'`.
- `publicVerification` dipisahkan secara sengaja dari membership: kartu/sertifikat yang sudah diterbitkan mungkin masih membutuhkan layanan verifikasi.
- Menonaktifkan *halaman* bukanlah pengendalian API. Kebijakan RLS Supabase, izin admin, dan kebijakan rilis keanggotaan harus diperiksa sebelum menganggap data privat aman.
- Karena GitHub Pages berupa static hosting, kumpulan JavaScript bersama mungkin tetap memuat kode aplikasi walaupun rute dinonaktifkan; jangan menyimpan rahasia di dalam kode klien.

## Proses ON/OFF yang aman

1. Ubah satu atau lebih nilai dalam `src/config/features.mjs`; **tidak perlu menghapus berkas fitur**.
2. Jalankan `npm run check:features`.
3. Jalankan `npm run build`; skrip build menjalankan `scripts/apply-feature-gates.mjs` setelah Astro selesai menghasilkan `dist/`.
4. Jalankan `node scripts/check-internal-links.mjs`. Pemeriksaan **wajib lulus**: tautan menuju fitur yang dinonaktifkan adalah kegagalan rilis, bukan sesuatu yang disembunyikan oleh CSS.
5. Periksa screenshot mobile/desktop dan `npm run check:ui`.
6. Buat PR, review, dan merge setelah semua CI hijau. Untuk rollback, kembalikan nilai fitur dan deploy ulang.

**Batasan tahap pertama:** navigasi utama, footer, home, direktori, kartu navigasi, related links, Community, widget Instagram, dan menu Member/Admin sudah membaca registry. Beberapa tautan langsung pada halaman detail lain belum semuanya menggunakan kontrol ini. Oleh sebab itu, perubahan modul ke `disabled` dapat memerlukan penyesuaian tautan atau konten pendukung; audit internal-link sengaja akan menggagalkan build yang tidak konsisten. Jangan menonaktifkan pemeriksaan untuk memaksa rilis.

## Tests & architecture

- `scripts/check-feature-registry.mjs`: klasifikasi path, parent-child membership, semantic hidden vs disabled.
- `scripts/check-feature-gates.mjs`: fixture terisolasi membuktikan halaman disabled dan aset Lab benar-benar dihapus, sedangkan modul hidden tetap ada.
- `scripts/check-internal-links.mjs`: memeriksa keluaran akhir setelah gating.
- Pengaturan ini tidak memerlukan perubahan DNS, hosting atau database.
- PR #10 (nested-header lama) sengaja **tidak** digabung dalam perubahan modul.

## Certificate Studio

- `memberCertificateStudio`: rute `/member/admin/certificate-studio/`, default `enabled` **di dalam portal admin** (portal induk tetap hidden di navigasi publik).
- Modul ini mengikuti status `memberAdministration` dan `membership`: jika admin/portal dimatikan, Studio ikut tidak tersedia.
- Pengoperasian, batas kapasitas, privasi, dan perbedaan dengan sistem QR terverifikasi ada di `docs/CERTIFICATE-STUDIO.md`.
