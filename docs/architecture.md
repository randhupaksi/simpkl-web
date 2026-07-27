# Arsitektur Frontend

## Prinsip

SIMPKL Web memakai arsitektur feature-based. Page bertugas menyusun komponen dan
konfigurasi; request API, query key, schema, mapping, dan business rule tidak
ditulis langsung di page.

```text
src/
├── app/
│   ├── config/       env, navigation, permissions
│   ├── providers/    query, theme, error boundary, toast
│   ├── router/       route paths, protected/permission route
│   └── styles/       global, token, utilities
├── layouts/          auth, dashboard, error
├── features/         domain-specific API/components/pages/schemas/types
└── shared/           reusable UI, design system, services, hooks, types
```

## Dependency direction

`app` menyusun seluruh aplikasi. Feature boleh memakai `shared`, tetapi shared
tidak boleh mengimpor implementasi page feature. Komponen khusus domain tetap di
feature. Komponen yang terbukti dipakai lintas domain dipindahkan ke shared.

Semua import source memakai alias `@/`. Named export digunakan untuk komponen,
hook, schema, service, dan type domain.

## Menambahkan fitur

1. Buat folder `src/features/<feature>`.
2. Tambahkan query key pada `api/<feature>.keys.ts`.
3. Tambahkan request pada file API/query/mutation, bukan page.
4. Definisikan type payload/response dari OpenAPI.
5. Buat schema Zod di `schemas`.
6. Letakkan table/form/status domain di `components`.
7. Page hanya menyusun `PageHeader`, state, table/form, dan permission action.
8. Tambahkan lazy import dan route dengan `ProtectedRoute` serta
   `PermissionRoute`.
9. Tambahkan test request atau behavior penting.

Untuk resource CRUD standar, feature mendefinisikan schema dan konfigurasi
field/column sendiri lalu menyusun `ResourceManagementPage`,
`ResourceEditorPage`, atau `ResourceDetailPage`. Fondasi ini menangani query,
mutation, invalidation, dialog, state, dan error yang konsisten tanpa
memindahkan aturan domain keluar dari feature.

## State

- TanStack Query: semua server state, cache, loading, retry, dan invalidation.
- React Hook Form: state form dan dirty/submission state.
- Zustand: sesi autentikasi dalam memori.
- Local state: sidebar, dialog, filter sementara, dan interaksi lokal.
- Local storage: hanya preferensi perangkat non-sensitif seperti density dan
  reduced motion; tidak pernah untuk token.

Token akses dan refresh tidak dipersist ke storage browser. Konsekuensinya sesi
berakhir ketika tab dimuat ulang; pilihan ini disengaja sampai backend
menyediakan refresh token melalui cookie `HttpOnly`.

## Routing dan permission

Navigation berasal dari `app/config/navigation.ts`. Permission berasal dari
profil `/auth/me` atau hasil login. Navigation filtering meningkatkan UX, tetapi
backend tetap menjadi otoritas keamanan. Direct access yang tidak diizinkan
dialihkan ke `/403`.

## Error dan state

Setiap server view wajib menyediakan loading, error, empty, dan permission
state. Error boundary menangani crash React global. Error API dinormalisasi
menjadi `ApiError` dan tidak menampilkan detail internal backend.
