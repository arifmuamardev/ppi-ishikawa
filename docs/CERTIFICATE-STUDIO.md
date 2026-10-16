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
- Pratinjau dan gambar tanda tangan diproses di browser, tanpa mengunggah gambar tanda tangan. **Saat tombol pengesahan resmi ditekan, nama penerima, kegiatan, peran, dan identitas pengesah dicatat pada registri Supabase** untuk pemeriksaan QR dan pencabutan. Jangan menerbitkan tanpa persetujuan peserta dan pemeriksaan data.
- Mode resmi Studio membuat nomor sertifikat, token QR unik, dan registri tersendiri. Verifikasi sertifikat Studio ada di `/verify/studio-certificate/`, bukan di halaman sertifikat anggota `/verify/certificate/`.\n- QR informasi opsional hanya berisi URL informasi kegiatan yang sama untuk semua penerima; **nonaktifkan ketika menerbitkan sertifikat resmi**, karena QR pengesahan unik akan dibuat otomatis. Pada mode informasi saja, PDF akan memberi label **INFO KEGIATAN — Bukan verifikasi**. URL harus memakai HTTPS. Jangan menyertakan data peserta atau token privat dalam URL.
- File PDF harus diperiksa oleh pengurus berwenang sebelum dibagikan. Gunakan tanda tangan hanya dengan izin pemilik.
- Modul lama `/member/admin/certificates/` tetap ada untuk sertifikat anggota yang tercatat sebagai hadir/check-in, memakai database dan token verifikasi resmi.
- **Penting:** GitHub Pages adalah hosting statis. UI admin memverifikasi sesi di browser; perlindungan data sebenarnya harus ditegakkan di Supabase RLS. Studio tidak memerlukan pembacaan data privat Supabase.
- Data peserta tidak disertakan dalam URL QR, kode repository, log, atau localStorage. QR hanya memiliki token acak; detail terbatas ditampilkan setelah pemindaian melalui query registri.

## Pengembangan lanjut (tidak termasuk rilis pertama)
- Opsional impor XLSX jika benar-benar diperlukan; saat ini Excel dapat **copy-paste nama** langsung.
- Surat digital/sertifikat dengan nomor seri dan verifikasi online memerlukan **backend issuing registry** untuk peserta non-anggota serta kebijakan otorisasi yang teruji.
- Template tambahan, tanda tangan tersimpan aman, email distribusi, dan link unduhan pribadi bisa menyusul setelah ada kebutuhan nyata.

## Pengujian
`node scripts/check-certificate-studio.mjs`, `node scripts/check-certificate-qr.mjs`, `npm run build`, `node scripts/check-internal-links.mjs`, dan audit responsif GitHub Actions.

## QR pengesahan resmi

Sertifikat resmi diterbitkan melalui tombol **Terbitkan & sahkan seluruh sertifikat**. Database mencatat identitas Ketua yang berwenang, tanggal penerbitan, nomor unik, dan QR berbeda untuk setiap penerima. Unduhan PDF resmi baru diaktifkan setelah pencatatan berhasil. Penerima memindai QR menuju `/verify/studio-certificate/?token=...`. Ketua dapat mencabut/reaktivasi melalui `/member/admin/studio-registry/`. Sertifikat yang dicabut tetap memiliki jejak penerbitan. Ini verifikasi organisasi berbasis database, **bukan** tanda tangan kriptografis PDF (PAdES/X.509). Fitur hanya aktif saat Supabase production tersedia dan akun Ketua berwenang, bukan dalam demo.
