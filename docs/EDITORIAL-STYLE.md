# PPI Ishikawa Website — Editorial Style

## Tujuan

Konten publik harus mudah dipahami mahasiswa Indonesia, tetap akurat terhadap istilah Jepang, dan tidak terasa seperti catatan teknis untuk pengelola website.

## Bahasa

- Gunakan Bahasa Indonesia sebagai bahasa utama.
- Pertahankan istilah Inggris/Jepang bila terjemahannya tidak lazim atau justru mengurangi kejelasan.
- Pada kemunculan pertama, istilah teknis dapat ditulis sebagai: **masa tinggal (period of stay)** atau **izin aktivitas di luar status tinggal (資格外活動許可)**.
- Setelah istilah diperkenalkan, gunakan bentuk yang paling sederhana dan konsisten.

## Istilah yang disarankan

| Gunakan | Hindari jika tidak perlu |
| --- | --- |
| asuransi kesehatan | medical insurance |
| klinik / rumah sakit | clinic / hospital |
| kerja paruh waktu | part-time work |
| perpanjangan masa tinggal | renewal / extension tanpa konteks |
| masuk kembali ke Jepang | re-entry jika pembaca belum diperkenalkan |
| dukungan bahasa | foreign-language support |
| informasi langsung / sumber resmi terbaru | live links |
| catatan praktis PPI | PPI practical notes |
| pemerintah setempat / kota tempat tinggal | municipality berulang kali |
| kesalahan yang sering terjadi | common mistakes |

Nama sistem resmi seperti **National Health Insurance**, **National Pension**, **My Number**, **Student Special Payment System**, dan nama institusi boleh dipertahankan bila membantu pencarian sumber resmi.

## Nada

- Langsung, tenang, dan praktis.
- Utamakan tindakan pembaca: apa yang harus dilakukan, kapan, dan di mana mengecek.
- Hindari kalimat yang terdengar seperti instruksi editor: “jangan hard-code”, “website PPI sebaiknya”, “jangan copy data”.
- Untuk data dinamis, tulis kepada pembaca: “cek sumber resmi terbaru” atau “gunakan informasi langsung dari operator”.

## Struktur halaman

- Judul harus menjelaskan kebutuhan pembaca.
- Gunakan bagian **Ringkasnya** untuk keputusan cepat.
- Gunakan daftar isi untuk guide panjang.
- Paragraf sebaiknya pendek dan nyaman dibaca di mobile.
- Detail hukum/administratif dipisahkan dari **Catatan praktis PPI**.
- Jangan menduplikasi detail yang sudah memiliki halaman khusus; gunakan internal link bila perlu.

## Sumber dan freshness

- Aturan resmi harus bersumber dari registry.
- Jadwal, tarif, alert, availability, dan status layanan yang berubah cepat tidak disalin sebagai nilai permanen.
- Metadata verifikasi dan volatility dikelola dari `src/data/survival.ts`.
- Informasi publik tidak boleh memberi kesan lebih mutakhir daripada tanggal verifikasi sebenarnya.

## Privasi

- Jangan menampilkan data pribadi anggota pada halaman publik.
- Statistik anggota hanya dalam bentuk agregat kecuali ada dasar dan persetujuan yang jelas untuk publikasi.
- Jangan menggunakan kontak pribadi sebagai kanal resmi organisasi.
