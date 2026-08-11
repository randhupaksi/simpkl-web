# Integrasi API

## Sumber kontrak

Kontrak utama tetap `simpkl-api/docs/openapi.yaml`. Karena sebagian route CRUD
belum dirinci pada OpenAPI, integrasi lanjutan hanya dibuat setelah route,
entity, request struct, permission, dan response handler backend yang aktif
diperiksa secara read-only. Frontend tidak mengubah backend dan tidak membuat
URL atau payload baru.

Konvensi response:

```ts
interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta: unknown | null
}
```

List memakai `page`, `per_page`, `search`, dan meta snake_case:
`page`, `per_page`, `total`, `total_pages`.

## Client

Axios client berada di `shared/services/api` dan mengelola:

- base URL dan timeout dari env;
- bearer access token;
- normalisasi response error dan network error;
- single-flight refresh agar beberapa 401 tidak memicu refresh paralel;
- rotasi token;
- clear session dan redirect login setelah refresh benar-benar gagal.

Token hanya berada di memory. Solusi produksi ideal adalah refresh token cookie
`HttpOnly`, `Secure`, dan `SameSite` yang dikelola backend.

## Endpoint terintegrasi

| Area           | Endpoint                                                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Auth           | `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me`                                                        |
| Periode        | `GET/POST /periods`, `GET/PUT/DELETE /periods/{id}`                                                                                  |
| Jurusan        | `GET/POST /majors`, `GET/PUT/DELETE /majors/{id}`                                                                                    |
| Kelas          | `GET/POST /classes`, `GET/PUT/DELETE /classes/{id}`                                                                                  |
| Siswa          | `GET/POST /students`, `GET/PUT/DELETE /students/{id}`, `POST /students/import`                                                       |
| Perusahaan     | `GET/POST /companies`, `GET/PUT/DELETE /companies/{id}`                                                                              |
| PIC perusahaan | `GET/POST /company-contacts`, `PUT/DELETE /company-contacts/{id}`                                                                    |
| Kuota jurusan  | `GET/PUT /companies/{id}/major-capacities`                                                                                           |
| Pembimbing     | `GET/POST /supervisors`, `GET/PUT/DELETE /supervisors/{id}`                                                                          |
| Penempatan     | `GET/POST /placements`, `GET/PUT/DELETE /placements/{id}`, `POST /placements/{id}/transfer`                                          |
| Dokumen        | `GET/POST /documents`, `PUT /documents/{id}/verify`, `GET /documents/{id}/download`, `DELETE /documents/{id}`, `GET /document-types` |
| Readiness      | `GET /readiness`, `POST /readiness/recalculate`, `POST /readiness/override`                                                          |
| Laporan        | `GET /reports/dashboard?period_id={id}` untuk pusat operasional, `GET /reports/placements` untuk JSON/XLSX/PDF                      |
| Arsip          | `GET /archives`, `POST /archives`, `GET /archives/{id}`                                                                              |
| RBAC           | CRUD `/users`, `/roles`, dan `/permissions`                                                                                          |

Semua list memakai pagination server-side dan filter yang memang terdaftar pada
handler backend. Import siswa melakukan preview dengan `commit=false`, lalu
commit eksplisit. Upload dokumen memakai multipart privat. Tanggal entity Go
`time.Time` dikirim sebagai RFC 3339; field tanggal multipart memakai
`YYYY-MM-DD` sesuai binder handler.

## Batasan kontrak saat ini

- Assignment `PUT /users/{id}/roles` dan
  `PUT /roles/{id}/permissions` belum diaktifkan di UI karena endpoint GET
  current assignment tidak tersedia; menampilkan daftar kosong sebagai kondisi
  awal dapat menghapus assignment yang sudah ada.
- Riwayat versi dokumen belum memiliki endpoint list khusus.
- Dashboard operasional mengembalikan konteks periode, status peserta yang
  eksklusif, progres per jurusan, kesiapan administrasi, kapasitas perusahaan,
  prioritas, agenda, dan aktivitas audit terbaru. Parameter `period_id` bersifat
  opsional; tanpa parameter, backend memilih periode aktif terbaru.
- Backend list tidak menerima parameter sort, sehingga frontend tidak mengirim
  sort rekaan. DataTable tetap menyediakan visibility, search, filter, dan
  pagination.
- Settings adalah preferensi perangkat lokal; backend tidak menyediakan
  endpoint pengaturan.

Atas instruksi user, integrasi pada sesi ini diverifikasi secara statis melalui
source, TypeScript, test MSW, dan build. Runtime API check tidak dijalankan.
Kriteria backend yang dibutuhkan untuk membuka capability tertunda tersedia di
[Backend Contract Handoff](backend-handoff.md).

## Menambah endpoint

1. Perbarui OpenAPI terlebih dahulu.
2. Tambahkan URL terpusat di `shared/constants/api-endpoints.ts`.
3. Tambahkan type request/response tanpa `any`.
4. Buat query key pada feature.
5. Tulis API call di `api`, bukan page.
6. Invalidasi list/detail yang tepat setelah mutation.
7. Map validation errors backend ke field React Hook Form.
8. Tambahkan test MSW untuk success dan error penting.
