# Certificate Studio (2026/2027)

## Untuk apa
Pembuatan sertifikat PDF **tanpa mengharuskan peserta memiliki akun** atau kegiatan didaftarkan lebih dulu.

Rute admin: `/member/admin/certificate-studio/`. Masuk melalui **Admin Center → Studio Sertifikat**. Tetap mewajibkan administrator terautentikasi lewat `MemberLayout requireAdmin`.

## Alur tercepat
1. Isi nama kegiatan, tanggal, jenis/kapasitas peserta.
2. Tempel kolom nama dari Excel (satu nama tiap baris) atau impor berkas CSV/TSV.
3. Isi nama penanda tangan (opsional), periksa pratinjau.
4. Tekan **Unduh PDF semua penerima**. Setiap orang mendapat satu halaman A4 landscape dalam satu berkas PDF.

Batas awal: 200 penerima per berkas PDF; untuk jumlah yang lebih besar, buat beberapa kelompok.

## Privasi dan keabsahan
- Semua pemrosesan nama, pratinjau, dan gambar tanda tangan berlangsung **di browser**, tidak dikirim ke backend dan tidak tersimpan dalam riwayat database.
- Studio tidak membuat kartu sertifikat di database, token verifikasi, nomor seri resmi, atau QR validasi; output **tidak dapat diverifikasi di /verify/certificate/**. Jangan menyisipkan QR yang seolah-olah verifiable.
- File PDF harus diperiksa oleh pengurus berwenang sebelum dibagikan. Gunakan tanda tangan hanya dengan izin pemilik.
- Modul lama `/member/admin/certificates/` tetap ada untuk sertifikat anggota yang tercatat sebagai hadir/check-in, memakai database dan token verifikasi resmi.
- **Penting:** GitHub Pages adalah hosting statis. UI admin memverifikasi sesi di browser; perlindungan data sebenarnya harus ditegakkan di Supabase RLS. Studio tidak memerlukan pembacaan data privat Supabase.
- Tidak ada data peserta dalam URL, kode repository, log, atau localStorage.

## Pengembangan lanjut (tidak termasuk rilis pertama)
- Opsional impor XLSX jika benar-benar diperlukan; saat ini Excel dapat **copy-paste nama** langsung.
- Surat digital/sertifikat dengan nomor seri dan verifikasi online memerlukan **backend issuing registry** untuk peserta non-anggota serta kebijakan otorisasi yang teruji.
- Template tambahan, tanda tangan tersimpan aman, email distribusi, dan link unduhan pribadi bisa menyusul setelah ada kebutuhan nyata.

## Pengujian
`node scripts/check-certificate-studio.mjs`, `npm run build`, `node scripts/check-internal-links.mjs`, dan audit responsif GitHub Actions.
