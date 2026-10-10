# PPI Ishikawa — UI/UX Design System & Page Governance

**Status:** Kebijakan utama (normatif), versi 1.0 · 8 Oktober 2026  
**Cakupan:** website publik PPI Ishikawa; menu utama, halaman turunan, dan komponen publik.  
**Tujuan:** menjaga satu identitas visual dan hierarki interaksi antarhalaman, termasuk lintas pengurus dan AI coding agent, tanpa menyeragamkan seluruh isi halaman.

> **Aturan tertinggi:** Klasifikasi halaman ditentukan oleh **tugas utama pengguna**, bukan bentuk URL, jumlah section, jumlah kartu, atau preferensi pembuat. Keseragaman berarti *kerangka dan perilaku konsisten*, bukan setiap halaman harus identik.

## 1. Istilah dan dokumen pengendali

| Istilah | Fungsi | Dokumen / implementasi |
| --- | --- | --- |
| **Design System** | Tipografi, token warna, layout, pola visual, interaksi, aksesibilitas, komponen | Dokumen ini; `src/data/brand.ts`, `src/styles/global.css` |
| **Page Template / Archetype Standards** | Menentukan tipe dan struktur wajib berdasarkan tugas pengguna | Bagian 2–5 dokumen ini |
| **UI Governance** | Prosedur pengecualian, peninjauan, bukti visual, dan aturan merge | Bagian 6–9 dokumen ini |
| **Route inventory (referensi implementasi)** | Daftar detail rute yang pernah diaudit beserta implementasi/susunan historis | `docs/brand/PUBLIC-PAGE-ARCHETYPES.md` |
| **Audit historis (bukan spesifikasi)** | Temuan, kritik, catatan migrasi sebelumnya | `docs/brand/UI-UX-AUDIT.md` |

**Urutan otoritas saat dokumen tampak bertentangan:**
1. Kebijakan normatif dalam dokumen ini.
2. Keputusan pengecualian yang disetujui dan dicatat pada PR/ADR.
3. Registry/rute serta komponen yang aktif di kode, sebagai **bukti implementasi** (bukan otomatis pembenaran desain).
4. Catatan audit/matriks historis sebagai referensi, bukan alasan mengulangi pola yang keliru.

*Status target* dan *status terpasang* harus dipisahkan. Jangan menyatakan situs memenuhi aturan baru sebelum migrasi dan inspeksi visual selesai.

## 2. Pilih satu template utama berdasarkan tugas pengguna

Semua halaman publik non-pengecualian masuk tepat **satu** dari tiga keluarga template berikut:

| Template | Pertanyaan yang dijawab | Aksi utama | Struktur wajib |
| --- | --- | --- | --- |
| **A — Landing / Directory** | “Ke bagian mana saya harus pergi?” | Memilih satu jalur/topik | Page Intro → pilihan utama → konten orientasi → langkah lanjut jika diperlukan |
| **B — Finder / Explorer** | “Opsi mana yang cocok untuk saya?” | Mencari, menyaring, membandingkan hasil | Page Intro → filter/pencarian → jumlah hasil + hasil → metode/sumber/ketentuan |
| **C — Detail / Guide** | “Apa yang perlu saya pahami atau lakukan tentang satu topik?” | Membaca dan mengikuti panduan | Breadcrumb → Page Intro → metadata/TOC bila perlu → artikel/objek → sumber → satu pola navigasi akhir |

**Algoritma keputusan (berurutan):**

1. Jika output utamanya adalah **daftar yang bisa dicari/disaring**, pilih **B**.
2. Jika tujuan utamanya **satu panduan, objek, atau topik mendalam**, pilih **C**.
3. Jika tujuan utamanya **menemukan jalur ke beberapa bagian**, pilih **A**.
4. Bila campuran, tentukan satu **primary user task**; modul lain tetap boleh hadir sebagai modul pendukung. Jangan menggabungkan dua shell.
5. Jika tidak cocok, ajukan pengecualian terdokumentasi; jangan menciptakan jenis template keempat diam-diam.

**Halaman Direktori (`/resources/`) merupakan Template A**, bukan Finder: tugas pengguna adalah memilih tujuan, tanpa filter/pencarian. Gunakan `LandingHeader` dan kartu navigasi bersama. Halaman Cerita (`/stories/`) memakai Finder hanya saat ada cerita yang dapat difilter; keadaan belum ada cerita boleh memakai `HighlightPanel` untuk pemberitahuan tanpa mengganti keluarga Page Intro.

**Subtipe bukan template baru:** halaman Landing bertingkat dapat mempunyai konteks induk (A/nested); panduan dapat mempunyai metadata spesifik, tetapi tetap C. “Hub” boleh menjadi istilah internal historis, **bukan label UI**. **Tingkat navigasi berbeda dari kedalaman URL**: `/community/kampus/` adalah destinasi menu utama walaupun URL berada di bawah `/community/`.

**Pengecualian yang sah:** Beranda (portal/hero khusus), `MemberLayout` (aplikasi), `AuthShell`, `VerificationShell`, dan 404. Halaman utilitas tidak dipaksa mengikuti A/B/C; tetap mengikuti token, aksesibilitas, dan tata bahasa komponen bersama.

## 3. Kontrak untuk enam destinasi menu utama

Sumber daftar menu aktual: `src/data/site.ts` (`nav`). Matriks ini adalah **target kebijakan**, bukan klaim bahwa migrasi sudah tuntas.

| Menu | Template | Aksi paling awal yang harus jelas | Komponen header | Status harmonisasi (Okt 2026) |
| --- | --- | --- | --- | --- |
| Tentang PPI | A | Mengenal PPI, menjelajah bagian organisasinya | `LandingHeader` | Page Intro bersama (#44); navigasi section tersedia |
| Kampus | A | Memilih kampus | `NestedLandingHeader` → `PublicPageHeader` | Breadcrumb dinonaktifkan di level menu utama; Keluarga tetap memakai breadcrumb (#47) |
| Hidup di Ishikawa | A | Memilih situasi/panduan | `LandingHeader` | Pilihan utama sebelum foto (#45) |
| Beasiswa | B | Menyaring beasiswa | `FinderHeader` | Filter lebih dahulu, pintasan ringkas kemudian (#46); kepadatan hasil masih perlu dikaji |
| Karier | B | Menyaring peluang/sumber | `FinderHeader` | Navigasi section setelah filter, sebelum hasil (#46) |
| Komunitas | A | Menemukan kegiatan/jejaring | `LandingHeader` | Pilihan utama sebelum foto (#45) |

Tidak ada “Nested Landing” sebagai kategori keempat dalam menu utama: **Kampus tetap A**. Saat proses migrasi selesai, keenam halaman menu utama perlu mengikuti aturan Page Intro level-1, terlepas dari path.

**Kampus:** `NestedLandingHeader` tetap dipakai sebagai adapter untuk data konteks/metadata halaman, tetapi menggunakan `PublicPageHeader` bersama. Breadcrumb ditentukan dari posisi rute pada navigasi utama di `src/data/site.ts`, bukan dari bentuk URL. Kampus tidak menampilkan breadcrumb karena merupakan menu utama; Keluarga tetap menampilkannya sebagai halaman turunan. Implementasi ini divalidasi lewat screenshot dan pengecekan browser dalam PR #47.

## 4. Visual contract: bagian yang harus seragam

### 4.1 Global dan Page Intro

**Wajib pada seluruh halaman publik:**

- Gunakan `BaseLayout`: header, font, token, `main` dan footer sudah ada; jangan menambahkan `main` bersarang.
- Tepat satu `h1` utama; harus mendeskripsikan tujuan halaman.
- Halaman level-1 memakai satu bahasa visual untuk **Page Intro**: lebar kontainer, padding, gaya judul, lead, dan posisi konten konsisten.
- **Baseline desain terpasang:** container `max-w-7xl px-5 lg:px-8`, intro `pt-16 lg:pt-24 pb-10`, judul `type-display`, deskripsi `type-lead`. Ini baseline untuk harmonisasi, bukan izin menggunakan angka ad-hoc baru pada tiap halaman.
- Eyebrow **opsional**, hanya bila menambahkan konteks; tidak mengulang judul seperti “Hidup di Ishikawa” tepat di atas judul sama, tidak otomatis menyisipkan periode pada sebagian halaman menu tetapi tidak lainnya.
- Deskripsi intro ringkas dan berorientasi tugas pengguna. Jangan memakai paragraf panjang atau disclaimer sebagai hero.
- **Breadcrumb:** tidak tampil pada Home dan keenam destinasi menu utama; diperlukan pada halaman publik turunan bila berguna untuk lokasi hierarkis. Posisi dalam shell konsisten. Jangan menentukan breadcrumb hanya dari jumlah garis miring pada URL.
- Meta sumber/tanggal verifikasi tampil secara ringkas, konsisten, dan hanya bila memang informatif.

**Komponen implementasi sekarang:** `LandingHeader`, `NestedLandingHeader`, `FinderHeader`, `GuideHeader`, `CampusGuideHeader`, `FamilyGuideHeader`. Mereka **belum** dianggap sudah memiliki keseragaman visual penuh. Gunakan yang sesuai dengan kontrak pada saat ini; penyatuan ke satu API header dilakukan melalui PR migrasi terpisah. Jangan memperkenalkan `PageIntro` baru sekarang karena `check:ui` saat ini justru melarang komponen lama bernama demikian.

### 4.2 Urutan modul dan foto

- **A:** dalam area konten awal, tampilkan pilihan utama/kategori/aksi terlebih dahulu. Foto, statistik, disclaimer, dan informasi tambahan tidak boleh menutupi jalur utama.
- **B:** pencarian/filter harus mudah ditemukan langsung setelah Page Intro. Jumlah hasil, empty state, reset, dan kartu hasil harus konsisten. Penjelasan panjang berada setelah hasil atau pada disclosure.
- **C:** topik tunggal, heading terstruktur, sumber, dan navigasi akhir yang tidak repetitif. Untuk panduan linear gunakan `GuidePager`; untuk non-linear boleh `RelatedLinks`; **jangan keduanya sekaligus**.
- Foto boleh ada dan berlisensi/kredit jelas; gunakan untuk memperjelas konteks. **Jangan membuat banner besar wajib** pada satu Landing dan tidak pada Landing lain. Jika foto penting, posisikan di area pendukung yang tidak menggeser primary action terlalu jauh.
- Section jump navigation (misalnya `ScrollPillNav`) hanya jika membantu scanning halaman panjang. Letakkan secara konsisten sesudah Page Intro, atau setelah **kontrol ringkas** untuk Finder; **jangan setelah seluruh daftar hasil**.
- Jangan mengulang kartu link generik di awal dan akhir apabila keduanya mengarah ke destinasi yang sama.
- Penjelasan hukum, administratif, medis, visa, beasiswa, dan layanan publik harus punya rujukan resmi; penempatan dan format sumber menggunakan pola bersama.

### 4.3 Spacing, kartu, dan tindakan

Pakai semantic utility yang tersedia terlebih dahulu; **hindari angka baru yang hanya dipakai satu halaman**.

| Lapisan | Prinsip | Referensi |
| --- | --- | --- |
| Width | Intro/menu utama & Landing/Finder `max-w-7xl`; konten baca panduan lebih sempit, mis. `max-w-5xl` | `src/styles/global.css` |
| Section heading | Untuk judul section utama gunakan kelas semantik `type-section` (24 px mobile, 30 px mulai breakpoint 640px); pertahankan ukuran lebih kecil untuk judul **di dalam** kartu/callout | `src/styles/global.css` |
| Rhythm | Compact 24–32 px; section umum 48 px mobile / 64 px desktop; major 64 px mobile / 80 px desktop | `ui-section-space-compact`, `ui-section-space`, `ui-section-space-major` |
| Surfaces | Feature panel jarang; kartu actionable standar; soft group untuk keterangan; list row untuk hasil berulang | `docs/brand/UI-UX-AUDIT.md` |
| Radius | Kontrol `rounded-xl`; kartu umum `rounded-2xl`; feature panel `rounded-3xl` | gunakan pola yang sudah ada |
| CTA | Aksi utama menonjol terbatas; secondary lebih tenang; hasil berulang tidak perlu tombol utama penuh semua | `ui-action-*` jika sesuai |
| Touch & keyboard | Target interaksi diusahakan minimal 44 px; focus-visible, navigasi keyboard, semantik, state kosong dan pesan hasil | verifikasi manual + CI |
| Color & font | Ambil warna melalui semantic tokens; **jangan hardcode palet periode** pada tiap komponen | `src/data/brand.ts`, Fira Sans |

Satu jenis kartu untuk satu *peran informasi* (navigation, result, status, advisory); **jangan** menyatukan semua gaya tanpa membedakan fungsi. Namun kartu dengan peran sama harus berperilaku dan tampil konsisten lintas halaman.

**Taksonomi kartu yang ditegakkan:** 
- **Navigation card:** seluruh permukaan kartu adalah tautan ke satu destinasi. Gunakan `src/components/NavigationCard.astro` dengan `density="comfortable"` untuk pilihan utama dan `density="compact"` untuk directory padat; judul, deskripsi, hover, radius, dan focus mengikuti satu pola. Mulai diterapkan pada Komunitas dan Tentang PPI. Jangan gunakan untuk hasil filter, panel bantuan, atau kontrol yang mengubah state.
- **Result card:** gunakan `src/components/ResultCard.astro` sebagai *surface* semantik `article` dengan slot untuk metadata, konten, dan aksi tersendiri—bukan seluruh kartu menjadi link. Sudah diterapkan pada `StoryCard.astro` untuk cerita terbit dan `src/pages/life-in-ishikawa/places.astro` untuk hasil Direktori Tempat yang aktif (dengan data atribut filter dan peta yang diteruskan). **Sudah diterapkan pada Beasiswa/Karier melalui PR migrasi bertahap:** setiap kartu tetap menyimpan struktur `data-*` untuk filter, pagination, dan tautan resmi independen. Migrasi berdasarkan `main` terbaru, bukan dengan menggabungkan komponen lama PR #10.
- **Advisory / status panel:** gunakan `src/components/AdvisoryPanel.astro` untuk informasi kontekstual berstatus `info` atau `caution`, dengan `role="note"` non-interruptive. Bukan kartu navigasi dan tidak perlu seluruh panel clickable; CTA tetap elemen tersendiri. Sudah dipakai pada status Program & Kegiatan. Jangan gunakan advisory untuk ringkasan promosi/visi, atau mengasumsikan status ini sebagai pengumuman real-time.
- **Highlight / feature panel:** blok naratif khusus visi atau ajakan utama (CTA), dengan satu permukaan aksen bersama melalui `src/components/HighlightPanel.astro`; berbeda dari advisory yang membawa peringatan atau status. Panel highlight tidak otomatis menjadi tautan penuh—aksi khusus tetap menjadi elemen fokus terpisah.


**Catatan koordinasi PR #10 (Oktober 2026):** PR "standardize nested landing headers" mengubah 26 file dan tidak dapat langsung di-merge. Hasil audit berkas per berkas ada di [`PR10-RECONCILIATION.md`](./PR10-RECONCILIATION.md). **Jangan merge branch lamanya secara otomatis.** Migrasi kartu Finder utama kini menggunakan `ResultCard` dari `main` beserta pemeriksaan metadata/filter; copy-edit tersisa dari PR lama harus diputuskan sendiri, terpisah dari UI.

**Prinsip spacing:** area sesudah Page Intro memprioritaskan aksi utama tanpa padding awal tambahan yang berlebihan. Section pendukung mengikuti `ui-section-space-compact`, `ui-section-space`, atau `ui-section-space-major` menurut tingkat pentingnya, bukan angka ad-hoc untuk tiap halaman. Perubahan spacing lintas halaman harus divalidasi lewat screenshot mobile dan desktop.

## 5. Kewajiban setiap template

### A — Landing / Directory

**Wajib:** Page Intro → sejumlah kecil jalur utama yang jelas → informasi pendukung terkelompok.  
**Opsional:** foto kontekstual, statistik, peta, section-jump navigation, sumber resmi.  
**Dilarang:** mewajibkan setiap tautan menjadi kartu besar, breadcrumb di level-1, filler berupa “Hub”, banyak CTA sama kuat.

### B — Finder / Explorer

**Wajib:** Page Intro → filter/search atau selector utama → total hasil/empty state → daftar hasil → catatan sumber.  
**Opsional:** jalan pintas ke query yang sudah terfilter, source verification, ringkasan singkat, konten edukasi sekunder.  
**Dilarang:** header dipisahkan dari filter oleh banyak bagian promosi/penjelasan; navigasi section baru muncul setelah daftar hasil; default menampilkan kartu berat tanpa pembatasan/pengelompokan yang dapat diterima.

**Progressive results:** untuk Finder dengan kartu hasil panjang, tampilkan kelompok awal yang terbatas dan sediakan aksi eksplisit untuk menampilkan hasil lain. Filter harus tetap dievaluasi pada **seluruh data**, jumlah hasil menjelaskan *ditampilkan X dari Y hasil cocok*, dan pilihan filter baru mengembalikan batas tampilan awal. Jangan hilangkan hasil dari DOM hanya untuk ringkasan, sehingga konten tetap tersedia jika JavaScript tidak aktif. Pola ini diterapkan dahulu pada Beasiswa; bukan kewajiban untuk Finder yang memang hanya memiliki sedikit hasil.

### C — Detail / Guide

**Wajib:** breadcrumb yang benar, intro, satu hierarki h1/h2/h3, sumber relevan, satu mekanisme “langkah selanjutnya”.  
**Opsional:** TOC (sekitar 4+ section bermakna atau sulit dipindai), metadata, ilustrasi, FAQ, tab/accordion saat benar-benar membantu.  
**Dilarang:** satu panduan diperlakukan sekaligus sebagai Landing, Finder, dan Guide; Related + Pager bersamaan tanpa justifikasi eksplisit.

**Urutan bukti dan navigasi akhir:** untuk semua panduan C yang menyertakan sumber resmi, letakkan sumber **setelah konten utama tetapi sebelum satu-satunya navigasi akhir**. Survival linear menggunakan `OfficialSources → GuidePager`; panduan Kampus menggunakan `CampusOfficialSources → RelatedLinks`; Family reference menggunakan `OfficialSources → kembali ke Keluarga`. Ketiganya mempertahankan identitas/metadata yang sesuai subjek; jangan menyalin komponen tambahan hanya untuk membuat tiap halaman identik. Daftar audit lengkap dan pengecualian ada pada [Template C Guide Audit](TEMPLATE-C-GUIDE-AUDIT.md).

## 6. Prosedur membuat/mengubah halaman

Setiap PR yang menambah/mengubah layout halaman harus menjawab pertanyaan ini **sebelum coding**:

1. **Primary user task:** satu kalimat “Pengguna datang ke halaman ini untuk …”.
2. **Template:** pilih A, B, atau C melalui algoritma di bagian 2. Catat apakah pengecualian (Home/app/utilitas).
3. **Navigation level:** apakah menu utama/halaman turunan? Tentukan breadcrumb berdasarkan navigasi **bukan URL**.
4. **Reuse first:** komponen shared mana yang bisa dipakai? Jangan menduplikasi header, breadcrumb, kartu, atau CSS untuk alasan kosmetik.
5. **Page anatomy:** tulis urutan modul dari Page Intro ke footer. Tandai wajib/opsional; pastikan aksi utama mudah terlihat.
6. **Visual proof:** bandingkan screenshot halaman dengan satu halaman *acuan dari template sama*, pada 390 px dan 1280 px (360 dan 768 px untuk stres tambahan).
7. **QA:** jalankan `npm run check:theme`, `npm run check:ui`, build, internal/external links, dan responsive audit. Uji interaksi serta aksesibilitas secara manual untuk hal yang tidak ditangkap skrip.
8. **Review:** sebutkan perubahan struktur, pengecualian, bukti dan risiko di PR; jangan merge jika template salah, bukti tidak ada, atau CI merah.

Pekerjaan konten murni yang **tidak mengubah layout/komponen** tidak perlu screenshot before/after baru, kecuali isi kontennya menyebabkan wrapping, overflow, atau hierarki berubah.

## 7. Pemeriksaan otomatis vs peninjauan manusia

**Sudah berjalan pada repo:** `scripts/check-ui-contracts.mjs`, `scripts/check-brand-theme.mjs`, build/link-check GitHub Actions, dan `scripts/audit-responsive.mjs` dengan screenshot pada lebar 360, 390, 430, 768, dan 1280 px.

**Ditegakkan bersama dokumen ini:** perubahan menu utama perlu memakai keluarga template yang sudah diregistrasi dan memastikan destinasi menu terdapat dalam cakupan audit screenshot. Ini merupakan **guard regresi struktur dan cakupan**, bukan penilai estetika.

**Tidak dapat disimpulkan hanya dari CI hijau:** konsistensi komposisi, pemilihan foto, proporsi whitespace, kualitas hierarchy, kontras dalam seluruh state, semua keyboard flows, atau apakah halaman benar-benar terasa sama. Peninjau **wajib** membandingkan screenshot desktop dan mobile sebelum menyebut UI “sudah seragam”.

Selalu pisahkan:
- **Observed:** temuan terukur/dilihat (contoh: elemen overflow 18 px pada 360 px).
- **Assessed:** penilaian visual manusia (contoh: banner terlalu dominan dibanding pilihan utama).
- **Planned:** target desain yang belum diimplementasikan.

## 8. Kebijakan pengecualian (ADR ringan)

Pengecualian boleh dibuat hanya jika ada kebutuhan pengguna yang tidak dapat dilayani oleh A/B/C.

PR pengecualian **wajib** mencatat:
- Rute dan alasan tugas pengguna mengapa A/B/C tidak cukup.
- Alternatif shared-component yang telah dicoba/dipertimbangkan.
- Cakupan pengecualian (satu modul, satu halaman, atau kelas halaman).
- Pengujian responsif/aksesibilitas untuk kasus baru.
- Penanggung jawab dan *trigger* untuk meninjau ulang (contoh: migrasi Page Intro).

Pengecualian tidak otomatis menjadi template baru. Jika pola berulang pada **setidaknya dua konteks berbeda**, tinjau apakah perlu merevisi Design System melalui keputusan terdokumentasi, bukan copy-paste.

## 9. Definition of Done — gerbang merge

Perubahan UI dinyatakan selesai **jika semua** berikut benar:

- [ ] Primary task dan template A/B/C teridentifikasi.
- [ ] Page Intro mengikuti visual contract; tidak ada shell kedua/heading ganda.
- [ ] Breadcrumb sesuai tingkat menu, bukan jumlah segmen URL.
- [ ] Aksi utama terlihat dan konten pendukung tidak mendahuluinya tanpa alasan.
- [ ] Komponen, token, spacing, cards, dan CTA menggunakan pola bersama.
- [ ] Tidak ada elemen berulang yang membuat navigasi ganda/rumit.
- [ ] Screenshot 390 dan 1280 px dibandingkan dengan halaman referensi; masalah di 360 dan 768 px diperiksa.
- [ ] Interaksi utama, keyboard, fokus, alt/kredit gambar, serta error/empty state sesuai tugas teruji.
- [ ] `check:theme`, `check:ui`, build, links, responsive audit lulus.
- [ ] Pengecualian atau visual debt (jika ada) dicatat secara eksplisit.
- [ ] Perubahan tidak secara tidak sengaja menimpa branch/PR agent lain.

## 10. Proses migrasi UI saat ini (belum otomatis selesai)

1. Kunci dokumen kebijakan ini sebagai rujukan tim dan agent.
2. Audit enam Page Intro level-1 dengan screenshot desktop/mobile; catat selisih nyata dan prioritas.
3. Migrasikan satu halaman per PR, mulai dari halaman Landing sederhana; periksa screenshot sebelum menjadi pola.
4. Satukan bahasa visual header lintas A/B tanpa merusak kontrak template; hapus breadcrumb sementara Kampus ketika nav-level sudah dipertimbangkan.
5. Terapkan pada menu lainnya, **tanpa menulis ulang konten**.
6. Perluas sistem ke halaman turunan A/C setelah enam menu utama stabil.

**Non-goals untuk dokumen ini:** tidak menambah konten, tidak meredesain halaman sekarang, tidak mengganti palet, tidak mengubah struktur organisasi, dan tidak menjanjikan otomatisasi penilaian visual yang belum ada.

---

**Aturan untuk seluruh coding agent dan kontributor:** sebelum menambah halaman atau mengubah UI, baca dokumen ini, identifikasi A/B/C, periksa implementasi shared yang sudah ada, dan tulis checklist di PR. **Jangan membuat header, template, card style, atau navigasi baru hanya karena satu halaman terlihat berbeda.**
