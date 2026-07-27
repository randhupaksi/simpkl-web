# Backend Contract Handoff

Dokumen ini mencatat capability frontend yang sengaja belum diaktifkan. Ini
bukan perubahan kontrak API dan tidak menambahkan endpoint sementara.

## Assignment role pengguna

Operasi replace role sudah tersedia pada backend, tetapi response detail
pengguna belum mengisi `role_ids` aktual. Frontend tidak boleh membuka editor
assignment dengan nilai awal kosong karena dapat menghapus role yang sudah
tersimpan.

Kriteria siap:

- detail pengguna mengembalikan `role_ids` aktual;
- permission membaca dan mengubah assignment terdokumentasi;
- response dan error assignment ditambahkan ke OpenAPI;
- perilaku role sistem dan scope jurusan/kelas dijelaskan.

## Assignment permission role

Operasi replace permission sudah tersedia, tetapi response detail role belum
mengisi `permission_ids` aktual.

Kriteria siap:

- detail role mengembalikan `permission_ids` aktual;
- role sistem yang tidak boleh diubah ditandai secara eksplisit;
- authorization dan validation error ditambahkan ke OpenAPI.

## Riwayat versi dokumen

Metadata dokumen saat ini memiliki `version`, tetapi tidak menyediakan koleksi
versi terdahulu.

Kriteria siap:

- tersedia response daftar versi berdasarkan dokumen atau kombinasi pemilik;
- setiap item memuat ID, nama file, versi, status, pengunggah, dan waktu;
- aturan download versi lama dan permission terdokumentasi.

## Dashboard

Response dashboard belum memiliki distribusi siswa per jurusan dan aktivitas
terbaru.

Kriteria siap:

- breakdown jurusan mengembalikan identifier, label, dan jumlah;
- aktivitas terbaru mengembalikan waktu, actor yang aman ditampilkan, jenis
  aksi, resource, dan ringkasan;
- scope permission pengguna diterapkan pada agregasi dan aktivitas.

## Sorting server-side

Pagination list hanya menerima `page`, `per_page`, dan `search`.

Kriteria siap:

- daftar field yang boleh diurutkan ditetapkan per resource;
- direction hanya menerima nilai yang terdokumentasi;
- default order stabil agar perpindahan halaman tidak menghasilkan duplikasi;
- parameter dan error validation ditambahkan ke OpenAPI.

## Aktivasi frontend

Status capability terpusat pada
`src/app/config/capabilities.ts`. Setelah kontrak backend tersedia:

1. perbarui OpenAPI;
2. tambahkan type dan query/mutation pada feature terkait;
3. tambahkan test MSW untuk success, forbidden, dan validation error;
4. ubah capability menjadi tersedia setelah implementasi UI selesai;
5. hapus notice sementara dari halaman terkait.

Backend tetap menjadi otoritas authorization. Mengaktifkan UI tidak menggantikan
permission check pada server.
