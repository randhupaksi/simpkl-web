# SIMPKL Citra Negara Web

Frontend internal staf sekolah untuk manajemen administrasi Praktik Kerja
Lapangan. Aplikasi mencakup periode, siswa, perusahaan, penempatan, dokumen
privat, kesiapan administrasi, laporan, arsip, dan RBAC. Aplikasi ini tidak
memuat absensi harian, jurnal PKL, GPS, check-in/out, portal siswa, atau portal
operasional perusahaan.

## Menjalankan lokal

Prasyarat: Node.js yang kompatibel dengan dependency project dan npm.

```bash
npm install
copy .env.example .env
npm run dev
```

Environment publik frontend:

```text
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_API_TIMEOUT_MS=15000
```

Jangan menaruh secret di variable berawalan `VITE_` karena nilainya dikirim ke
browser.

## Scripts

```text
npm run dev        Menjalankan Vite development server
npm run build      TypeScript build dan bundle produksi
npm run lint       Audit ESLint
npm run lint:fix   Perbaikan ESLint yang aman
npm run format     Format source dengan Prettier
npm run typecheck  Pemeriksaan TypeScript tanpa emit
npm run test       Menjalankan Vitest dalam mode interaktif
npm run test:run   Menjalankan seluruh test satu kali
```

## Arsitektur singkat

- `src/app`: environment, permission, navigation, provider, router, dan token.
- `src/layouts`: shell auth, dashboard, sidebar, header, breadcrumb, dan error.
- `src/features`: API, query key, schema, komponen, dan halaman per domain.
- `src/shared`: primitives UI, design system, table, feedback, service, type,
  hook, dan utility lintas fitur.
- `tests`: setup dan MSW server.

Server state dikelola TanStack Query. Zustand hanya menyimpan sesi dalam memori;
token tidak dipersist ke `localStorage`. Seluruh request melalui Axios client
terpusat dengan bearer token, normalisasi error, single-flight refresh, dan
pengakhiran sesi aman.

Dokumentasi lebih lengkap:

- [Arsitektur](docs/architecture.md)
- [Design system](docs/design-system.md)
- [Integrasi API](docs/api-integration.md)
- [Backend contract handoff](docs/backend-handoff.md)

## Cakupan implementasi

Route dashboard, periode, jurusan, kelas, siswa, impor siswa, perusahaan, PIC
perusahaan, kuota jurusan, pembimbing, penempatan, transfer, dokumen, readiness,
laporan, arsip, pengguna, role, permission, settings, 403, dan 404 tersedia.

`simpkl-api/docs/openapi.yaml` tetap menjadi kontrak utama. Route CRUD yang belum
rinci di OpenAPI hanya diintegrasikan setelah implementasi route/entity/request
backend diperiksa secara read-only. Keterbatasan kontrak dan endpoint yang belum
aman digunakan dicatat pada
[Integrasi API](docs/api-integration.md).
