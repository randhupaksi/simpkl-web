# Design System

## Arah visual

Design system memakai gaya enterprise administrasi sekolah: density nyaman,
hierarki kuat, kontras jelas, warna terkendali, dan interaksi fungsional.
Seluruh warna komponen memakai token semantik; komponen dan page tidak menulis
warna literal.

## Token

`src/app/styles/tokens.css` adalah sumber tunggal:

- foundation: brand, neutral, feedback;
- surface: background, raised, sunken, hover, pressed, selected, disabled;
- content: primary, subtle, muted, inverse, disabled, link;
- border: subtle, strong, hover, selected, disabled;
- interactive: primary/secondary beserta hover dan pressed;
- feedback: success, warning, danger, info;
- navigation: sidebar background, foreground, hover, pressed, active;
- visualization: enam warna chart dan grid;
- radius, control height, shadow, spacing, duration, easing, dan z-index.

State wajib pada control interaktif:

```text
default → hover → pressed/clicked → focus-visible
                   ↘ selected/active
disabled
```

`prefers-reduced-motion` dihormati secara global. Pengguna juga dapat memilih
density nyaman/ringkas dan reduced motion dari halaman pengaturan; preferensi
non-sensitif ini disimpan per perangkat.

## Primitives UI

Komponen tersedia pada `src/shared/components/ui`:

- Button, IconButton, Input, PasswordInput, Textarea;
- Select, Combobox, MultiSelect, Checkbox, RadioGroup, Switch;
- DatePicker dan DateRangePicker;
- Dialog, ConfirmationDialog, Sheet/Drawer;
- DropdownMenu, Popover, Tooltip, Tabs;
- Badge, Alert, Card, Skeleton, Progress;
- primitives menggunakan Radix untuk focus management, keyboard behavior,
  portal, dan semantic state.

Komponen komposisi:

- Typography, PageTitle, SectionTitle;
- PageHeader dan PageActionLink;
- StatusBadge;
- FormField, FormSection, FormActions;
- StatCard dan DescriptionList;
- EmptyState, ErrorState, LoadingState, PermissionState;
- FileDropzone;
- DataTable dan FilterToolbar.
- ResourceForm, ResourceSelectField, ResourceManagementPage,
  ResourceEditorPage, dan ResourceDetailPage sebagai fondasi CRUD
  terkonfigurasi.

## Penggunaan

Halaman list memakai `PageHeader + DataTable`. Column definition berada di
feature, bukan shared table. Halaman form memakai
`PageHeader + FormSection + FormField + FormActions`. Aksi berisiko memakai
`ConfirmationDialog`. Status domain memakai `StatusBadge`; jangan membedakan
status hanya melalui warna.

Jangan menyalin class button, field, modal, card, table, loading, atau heading ke
page. Jika pola baru berulang lintas dua feature, evaluasi penambahan komponen
shared yang kecil dan mudah dipahami.

## Accessibility

- Satu `h1` per page melalui `PageHeader`.
- Label terhubung ke control dengan `htmlFor`/`id`.
- Error memakai `role="alert"` dan `aria-describedby`.
- Semua icon-only action memiliki `aria-label`.
- Focus-visible memakai token global.
- Radix mengelola focus trap, Escape, keyboard navigation, dan portal.
- Target sentuh control utama minimal 44 px.
