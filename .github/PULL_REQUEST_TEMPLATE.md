## Ringkasan perubahan

Jelaskan apa yang berubah dan mengapa, termasuk apakah ini konten saja, perbaikan UI, atau fitur baru.

## UI/UX governance (isi jika halaman/komponen/layout berubah)

- **Primary user task:** Pengguna datang untuk ...
- **Template:** A (Landing) / B (Finder) / C (Detail) / Home/App/Utility / Tidak berlaku
- **Navigation level:** Menu utama / Turunan / Aplikasi
- **Aksi pertama setelah Page Intro:** ...
- **Komponen shared yang digunakan:** ...
- **Rute terpengaruh:** ...

### Checklist sebelum merge

- [ ] Saya sudah membaca pedoman di `docs/brand/DESIGN-SYSTEM-GOVERNANCE.md` (atau perubahan ini murni konten).
- [ ] Template mengikuti tujuan pengguna, bukan sekadar kedalaman URL.
- [ ] Page Intro, breadcrumb, heading, dan urutan modul konsisten dengan halaman **pembanding bertemplate sama**.
- [ ] Tidak membuat header, kartu, atau CSS ad-hoc jika komponen bersama bisa digunakan.
- [ ] Perubahan visual: screenshot **390 px dan 1280 px** sebelum/sesudah diperiksa; periksa 360, 430, 768 px apabila relevan.
- [ ] Aksi utama, keyboard/fokus, target sentuh, media/alt, dan empty/error states diuji sesuai dampak perubahan.
- [ ] `check:theme`, `check:ui`, build, links, dan responsive audit hijau (atau alasan kegagalan dijelaskan).
- [ ] Tidak ada perubahan tak terkait milik agent/PR lain.

**Screenshot / hasil audit:** (tautan GitHub Actions/artifact, atau alasan tidak berlaku)

**Pengecualian / visual debt:** (jelaskan alasan, cakupan, dan kapan ditinjau; tulis “Tidak ada” jika tidak ada)

> Perubahan data/teks yang tidak berdampak layout dapat menandai item UI tidak berlaku dengan alasan singkat. CI hijau tidak menggantikan pemeriksaan komposisi visual manusia.
