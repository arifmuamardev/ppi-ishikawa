# Ishikawa Places Directory

Direktori tempat berada di:

- `src/data/places.ts`
- halaman publik: `/life-in-ishikawa/places/`

Tujuannya bukan menyalin Google Maps, tetapi menyediakan daftar lokasi yang relevan untuk pelajar Indonesia dan keluarga di Ishikawa dengan rujukan resmi yang dapat diperiksa ulang.

## Prinsip data

1. **Sumber resmi lebih dulu.** Prioritaskan website pemerintah, universitas, prefektur, atau organisasi penyedia layanan.
2. **Google Maps bukan sumber utama.** Tombol Google Maps hanya membantu navigasi berdasarkan alamat yang sudah diverifikasi.
3. **Jangan memasukkan tempat hanya karena populer.** Tempat harus punya fungsi yang jelas untuk mahasiswa atau keluarga.
4. **Hindari duplikasi.** Jika beberapa layanan berada pada gedung yang sama, pertimbangkan satu entri kompleks dengan deskripsi layanan di dalamnya.
5. **Informasi volatil tetap di sumber resmi.** Jam buka, biaya, eligibility, jadwal, dan prosedur sebaiknya tidak ditulis terlalu detail kecuali benar-benar dibutuhkan.
6. **Isi `lastVerified`.** Gunakan tanggal ketika alamat/fungsi tempat terakhir dicek dari sumber resmi.
7. **Koordinat bersifat opsional.** Jika koordinat belum dapat diverifikasi dengan baik, cukup simpan alamat. Entri tetap dapat dibuka melalui Google Maps search link.

## Kategori

Kategori saat ini:

- `campus` — kampus dan lokasi akademik utama
- `administration` — city hall, prefectural office, dan layanan administrasi
- `support` — dukungan warga asing atau layanan lintas kebutuhan
- `family` — childcare, parenting support, parent-child space, dan layanan keluarga
- `health` — pusat kesehatan publik dan layanan kesehatan keluarga
- `transport` — disiapkan untuk lokasi transportasi penting

Kategori baru hanya ditambahkan jika benar-benar diperlukan agar filter tidak terlalu kompleks.

## Struktur entri

```ts
{
  id: 'unique-slug',
  name: 'Official or commonly used name',
  shortName: 'Short label',
  category: 'family',
  city: 'Kanazawa',
  address: 'Verified address',
  description: 'Mengapa tempat ini berguna untuk mahasiswa/keluarga.',
  officialUrl: 'https://official-source.example/',
  tags: ['anak', 'konsultasi'],
  lat: 36.0,          // optional
  lng: 136.0,         // optional
  approximate: false, // optional
  lastVerified: '6 October 2026'
}
```

## Checklist sebelum menambah lokasi

- Nama dan alamat cocok dengan sumber resmi.
- Fungsi tempat masih aktif.
- `officialUrl` mengarah ke halaman resmi yang relevan, bukan sekadar homepage jika halaman layanan tersedia.
- Deskripsi menjelaskan kegunaan, bukan menyalin teks promosi.
- Tags memakai istilah yang mungkin dicari pengguna, misalnya `anak`, `konsultasi`, `city hall`, `kesehatan`.
- Tidak ada entri lain yang mewakili gedung/layanan yang sama.
- Jika koordinat diragukan, jangan menebak.

## Deep link

Halaman direktori menerima parameter untuk kebutuhan internal-linking:

- `?category=family`
- `?city=Kanazawa`
- `?q=anak`
- kombinasi, misalnya `?category=family&city=Nonoichi`

Ini memungkinkan halaman Survival Guide atau Family Guide mengarah ke subset lokasi yang relevan tanpa membuat direktori terpisah.

## Integrasi

Saat perubahan pada `main` sudah stabil, integrasi yang disarankan:

- Family & Anak → `/life-in-ishikawa/places/?category=family`
- Kesehatan → `/life-in-ishikawa/places/?category=health`
- Municipality Guide → filter kota yang sesuai
- Campus Hub → tetap memakai Campus Pack sebagai sumber utama; Places hanya pelengkap lokasi

Hindari menambahkan Places ke terlalu banyak menu global. Lebih baik gunakan contextual link dari halaman yang memang membutuhkan lokasi.


## Sinkronisasi dengan Family Hub

Aktivitas keluarga yang sudah dikurasi di `src/data/family-activities.ts` **tidak ditulis ulang** di Places. `src/data/places.ts` mengimpor data tersebut dan mengubahnya menjadi entri kategori `family`. Dengan demikian:

- deskripsi, alamat, tags, dan official source untuk aktivitas keluarga tetap memiliki satu sumber utama;
- fasilitas family-service yang bukan activity tetap dapat disimpan langsung di `places.ts`;
- jika satu fasilitas sudah direpresentasikan oleh Family Activities, jangan tambahkan duplikat baru ke daftar service Places.

## Filter dan peta

Filter kategori, city, dan pencarian:

- memperbarui daftar kartu;
- memperbarui query string URL sehingga hasil dapat dibagikan;
- menyinkronkan marker pada peta;
- menyembunyikan peta dan menampilkan pesan jika hasil filter tidak memiliki koordinat terverifikasi.

`InteractiveMap.astro` mendukung `ariaLabel` dan event filter marker tanpa mengubah perilaku Campus Map yang sudah ada.
