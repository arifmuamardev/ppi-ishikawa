# Certificate Studio (2026/2027)

## Untuk apa
Pembuatan sertifikat PDF **tanpa mengharuskan peserta memiliki akun** atau kegiatan didaftarkan lebih dulu.

Rute admin: `/member/admin/certificate-studio/`. Masuk melalui **Admin Center → Studio Sertifikat**. Tetap mewajibkan administrator terautentikasi lewat `MemberLayout requireAdmin`.

## Alur tercepat
1. Isi nama kegiatan, tanggal, jenis/kapasitas peserta.
2. Tempel kolom nama dari Excel (satu nama tiap baris) atau impor berkas CSV/TSV.
3. Nama penanda tangan otomatis terisi **Arif Mu'amar Wahid — Ketua PPI Ishikawa**; pengurus tetap bisa mengubahnya. Gambar tanda tangan asli tetap opsional dan harus diunggah dengan izin pemilik.\n4. Jika perlu, aktifkan **QR informasi kegiatan** dan isi URL resmi HTTPS. QR ini adalah tautan informasi, **bukan** verifikasi sertifikat.
5. Tekan **Unduh PDF semua penerima**. Setiap orang mendapat satu halaman A4 landscape dalam satu berkas PDF.

Batas awal: 200 penerima per berkas PDF; untuk jumlah yang lebih besar, buat beberapa kelompok.

## Privasi dan keabsahan
- Semua pemrosesan nama, pratinjau, dan gambar tanda tangan berlangsung **di browser**, tidak dikirim ke backend dan tidak tersimpan dalam riwayat database.
- Studio tidak membuat kartu sertifikat di database, token verifikasi, nomor seri resmi, atau QR validasi; output **tidak dapat diverifikasi di /verify/certificate/**.\n- QR opsional hanya berisi URL informasi kegiatan yang sama untuk semua penerima. Pada PDF tercetak label **INFO KEGIATAN — Bukan verifikasi**. URL harus memakai HTTPS. Jangan menyertakan data peserta atau token privat dalam URL.
- File PDF harus diperiksa oleh pengurus berwenang sebelum dibagikan. Gunakan tanda tangan hanya dengan izin pemilik.
- Modul lama `/member/admin/certificates/` tetap ada untuk sertifikat anggota yang tercatat sebagai hadir/check-in, memakai database dan token verifikasi resmi.
- **Penting:** GitHub Pages adalah hosting statis. UI admin memverifikasi sesi di browser; perlindungan data sebenarnya harus ditegakkan di Supabase RLS. Studio tidak memerlukan pembacaan data privat Supabase.
- Tidak ada data peserta dalam URL, kode repository, log, atau localStorage.

## Pengembangan lanjut (tidak termasuk rilis pertama)
- Opsional impor XLSX jika benar-benar diperlukan; saat ini Excel dapat **copy-paste nama** langsung.
- Surat digital/sertifikat dengan nomor seri dan verifikasi online memerlukan **backend issuing registry** untuk peserta non-anggota serta kebijakan otorisasi yang teruji.
- Template tambahan, tanda tangan tersimpan aman, email distribusi, dan link unduhan pribadi bisa menyusul setelah ada kebutuhan nyata.

## Pengujian
`node scripts/check-certificate-studio.mjs`, `node scripts/check-certificate-qr.mjs`, `npm run build`, `node scripts/check-internal-links.mjs`, dan audit responsif GitHub Actions.

## QR pengesahan resmi

Sertifikat resmi diterbitkan melalui tombol **Terbitkan & sahkan seluruh sertifikat**. Database mencatat identitas Ketua yang berwenang, tanggal penerbitan, nomor unik, dan QR berbeda untuk setiap penerima. Unduhan PDF resmi baru diaktifkan setelah pencatatan berhasil. Penerima memindai QR menuju `/verify/studio-certificate/?token=...`. Ketua dapat mencabut/reaktivasi melalui `/member/admin/studio-registry/`. Sertifikat yang dicabut tetap memiliki jejak penerbitan. Ini verifikasi organisasi berbasis database, **bukan** tanda tangan kriptografis PDF (PAdES/X.509). Fitur hanya aktif saat Supabase production tersedia dan akun Ketua berwenang, bukan dalam demo.
