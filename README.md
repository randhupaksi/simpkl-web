# SIMPKL Web

SIMPKL Web is the browser application for a practical work placement management
platform. It gives school and institution staff a structured workspace for
planning, coordinating, verifying, monitoring, reporting, and archiving PKL
activities.

The product is primarily intended for vocational secondary schools (SMK), while
its workflow can also support other schools or educational institutions that
manage supervised workplace learning. The interface is deliberately focused on
administrative PKL operations. It does not currently implement attendance,
daily journals, GPS tracking, check-in/check-out, a student self-service portal,
or an employer operations portal.

## Product overview

SIMPKL Web connects staff-facing workflows to the SIMPKL API and provides:

- authenticated application access with persisted session state;
- permission-aware navigation and route protection;
- an operational dashboard with PKL summary indicators;
- academic and PKL period master-data management;
- student, major, class, company, contact, and supervisor administration;
- placement creation, status management, and placement transfer;
- administrative readiness monitoring and recalculation;
- private document upload, verification, download, and deletion;
- a Document Automation Center for individual or batch official letters,
  source-data validation, institution profile and signatory management,
  versioned templates, DOCX/PDF/XLSX generation, ZIP packages, and file history;
- placement reporting and export to Excel/PDF;
- period archiving;
- user, role, and permission administration;
- local appearance and accessibility preferences;
- consistent loading, error, empty, permission, and submission states.

## Main application areas

The current navigation is organized into the following areas.

### Main workspace

- **Dashboard** — high-level placement and administration indicators, quick
  actions, and operational notices.

### PKL management

- **PKL periods** — define academic/work-placement periods, date ranges,
  semester, cohort, status, and notes.
- **PKL placements** — connect students to companies, company contacts,
  supervisors, periods, dates, divisions, positions, work systems, and
  placement statuses.
- **Administrative readiness** — inspect required administrative checks,
  recalculate readiness, and apply authorized overrides.

### Master data

- **Students** — maintain student identity, school identifiers, class, major,
  cohort, contact details, guardian details, PKL status, and notes.
- **Majors** — manage vocational departments or competency areas.
- **Classes** — manage class groups, academic year, level, major, and homeroom
  teacher.
- **Companies** — maintain workplace partner profiles, industry, address,
  cooperation period, status, capacity, and major-specific capacity.
- **Supervisors** — maintain school supervisor identity, department, position,
  contact details, status, and supervision capacity.

### Administration

- **Documents** — upload and manage private PKL documents, metadata, dates,
  verification status, and document ownership.
- **Document Automation** — select a period or single placement, validate
  official source data, create editable Word letters, final PDFs, styled Excel
  recaps, and downloadable batch ZIP packages; manage institution identity,
  signatories, and template versions from the same workspace.
- **Reports** — view placement reports and export professionally styled Excel
  and PDF files.
- **Archives** — review archived periods and historical snapshots.

### System

- **Users** — manage staff accounts, status, and optional scope by major/class.
- **Roles and permissions** — manage RBAC reference data and available
  permission definitions.
- **Settings** — manage device-level density and reduced-motion preferences.
- **403 and 404 views** — provide explicit permission-denied and not-found
  experiences.

## Technology stack

| Concern               | Technology                              |
| --------------------- | --------------------------------------- |
| Language              | TypeScript                              |
| UI framework          | React 19                                |
| Build tool            | Vite 8                                  |
| Routing               | React Router 7                          |
| Server state          | TanStack Query 5                        |
| Client/session state  | Zustand 5                               |
| HTTP client           | Axios                                   |
| Form state            | React Hook Form                         |
| Validation            | Zod 4 and @hookform/resolvers           |
| Styling               | Tailwind CSS 4 with Vite integration    |
| Accessible primitives | Radix UI packages                       |
| Icons                 | Lucide React                            |
| Calendar              | React DayPicker 10 with Radix Popover   |
| Tables                | TanStack Table and TanStack Virtual     |
| Charts                | Recharts                                |
| Motion                | Framer Motion                           |
| Notifications         | Sonner                                  |
| File upload           | React Dropzone                          |
| Excel export          | SheetJS/XLSX                            |
| PDF export            | jsPDF and jsPDF AutoTable               |
| Testing               | Vitest, Testing Library, JSDOM, and MSW |
| Code quality          | ESLint, TypeScript, Prettier, and Husky |

## Architecture

The frontend follows a feature-based architecture.

```text
src/
├── app/
│   ├── config/               # env, navigation, permissions, capabilities
│   ├── providers/            # query, theme, error boundary, and toast setup
│   ├── router/               # route paths, lazy routes, guards
│   └── styles/               # globals, tokens, utilities, Tailwind theme
├── layouts/
│   ├── auth/                 # authentication shell
│   ├── dashboard/            # application shell, header, sidebar
│   └── error/                # error and fallback layouts
├── features/
│   └── <domain>/             # API, queries, schemas, components, pages, types
├── shared/
│   ├── components/           # reusable UI, forms, tables, feedback
│   ├── design-system/        # page, form, typography, status, data display
│   ├── hooks/                # shared interaction and list hooks
│   ├── services/             # Axios client and resource services
│   ├── types/                # API and domain types
│   ├── utils/                # formatting, labels, and shared helpers
│   └── constants/            # endpoint and application constants
└── tests/                    # test setup and MSW handlers
```

### Dependency direction

The app layer composes the application. Feature modules may depend on shared
components and services, but shared code does not import feature page
implementations. Domain-specific behavior remains in its feature folder.
Repeated, stable patterns are promoted into shared components only when that
reduces real duplication.

### Standard CRUD composition

Resource-oriented features define their own schema, fields, columns, labels,
permissions, and API endpoint, then reuse the shared CRUD foundation:

```text
Feature config/schema
  → ResourceManagementPage
  → DataTable + filter/search/pagination
  → ResourceForm in create/edit dialog
  → shared mutation, validation, toast, and invalidation behavior
```

This keeps page components focused on composition while preserving domain
ownership of labels and validation.

## State and data flow

- **TanStack Query** owns server state, cache, loading state, retries, and
  invalidation.
- **React Hook Form** owns form values, dirty state, validation, and submission
  state.
- **Zustand** owns the authenticated session and user context.
- **Local component state** owns dialogs, sidebar collapse, temporary filters,
  and other short-lived interactions.
- **localStorage** currently persists the SIMPKL session under the
  simpkl-auth-session key so a page refresh does not immediately log the user
  out. Tokens are still sensitive; a production deployment should prefer a
  secure HttpOnly refresh-token cookie architecture.
- API responses and errors are normalized through the shared Axios service layer.

## Authentication and authorization

The application uses the following flow:

```text
Login form
  → POST /auth/login
  → store user and access/refresh tokens
  → attach access token to API requests
  → on 401, perform one shared refresh request
  → update session and retry the original request
  → clear session only when refresh fails
```

Route access is controlled in two layers:

1. navigation items are filtered according to the current permission set;
2. protected routes and permission routes prevent direct unauthorized access.

The backend remains the final authorization authority. The frontend must never
be treated as a security boundary.

Permissions are grouped around periods, majors, classes, students, companies,
supervisors, placements, documents, readiness, reports, archives, users, roles,
permission definitions, and document automation. Wildcard permissions such as namespace-level
permissions are supported by the shared permission helper.

## UI system and interaction design

SIMPKL Web uses an enterprise administrative visual language for school
operations:

- clear hierarchy for dense operational data;
- comfortable but efficient form and table density;
- semantic design tokens instead of page-level color literals;
- dark navy navigation with green primary interaction states;
- strong, accessible focus treatment;
- consistent hover, pressed, selected, disabled, and error states;
- green-themed date pickers and dropdowns;
- colored action buttons: blue for view, yellow for edit, and red for delete;
- centered, symmetric table action columns;
- dark-green global scrollbars;
- responsive dialogs, tables, navigation, and form layouts.

The source of truth for visual tokens is
src/app/styles/tokens.css. Shared primitives are located in
src/shared/components/ui and include buttons, icon buttons, inputs, password
inputs, textareas, selects, comboboxes, multi-selects, checkboxes, radio groups,
switches, date pickers, dialogs, confirmation dialogs, sheets, popovers,
dropdown menus, tabs, alerts, badges, cards, progress, skeletons, and tooltips.

The design system also provides:

- PageHeader, PageTitle, SectionTitle, and page action patterns;
- FormField, FormSection, and FormActions;
- StatusBadge with human-readable Indonesian labels;
- DataTable, FilterToolbar, DescriptionList, StatCard;
- LoadingState, EmptyState, ErrorState, and PermissionState;
- FileDropzone and reusable resource form/select components.

Accessibility practices include connected labels, aria descriptions for errors,
aria labels for icon-only actions, keyboard-friendly Radix primitives,
focus-visible states, dialog focus management, reduced-motion support, and
touch targets sized for practical use.

## Data presentation and labels

The interface keeps system values inside API payloads while displaying
human-friendly labels to staff:

- status values are translated into operational language;
- related IDs are resolved to names in tables, details, and dropdowns;
- empty select controls display an explicit placeholder;
- date input uses the styled DayPicker component rather than browser-specific
  native calendar behavior;
- date values sent to the API remain compatible with the backend contract;
- UUIDs are not intended to be shown as primary user-facing labels.

## Reporting and exports

The reports area supports:

- server-provided placement report data;
- human-readable status labels;
- Excel workbooks with title/metadata rows, styled headers, filters, frozen
  panes, zebra rows, column sizing, and status color treatment;
- landscape PDF reports with structured headers, readable tables, pagination,
  status badges, and footer information.

Browser-side export dependencies are used where the web experience owns the
export flow, while the API also provides report endpoints for server-generated
JSON, XLSX, and PDF output.

## API integration

The web client reads its base URL and timeout from environment configuration.
All requests go through the shared Axios client, which handles:

- base URL and timeout;
- bearer token attachment;
- response and network-error normalization;
- single-flight refresh behavior;
- session update after refresh;
- safe session clearing and redirect behavior after refresh failure.

The primary API contract is maintained in the sibling
simpkl-api/docs/openapi.yaml file and in the backend repository's endpoint
implementation. The web uses centralized endpoint constants and feature-level
query/mutation modules rather than constructing API URLs inside page components.

The main integrated resource groups are:

```text
auth, dashboard, periods, majors, classes, students, companies,
company contacts, supervisors, placements, readiness, documents,
document automation, reports, archives, users, roles, and permissions
```

## Document Automation Center

The `/document-automation` workspace is organized into five operational tabs:

- **Create Documents** — filter by period, class, major, company, supervisor, or
  one specific placement; select templates and DOCX/PDF formats; select the
  signing official and letter date; preview completeness; then generate.
- **History** — download complete ZIP packages or individual DOCX, PDF, and XLSX
  files with visible template version, letter number, student label, and size.
- **Institution Profile** — configure the reusable letterhead identity and
  official contact information.
- **Signatories** — maintain active signing officials and choose one default.
- **Templates** — review active templates and create a new immutable version
  when wording or numbering changes.

Generation is disabled until the server-side preview reports that all required
source data is ready. The frontend never creates official values itself; the
backend remains responsible for validation, numbering, snapshotting,
generation, storage, and authorization.

## Capability boundaries

Some UI capabilities remain intentionally unavailable until the backend contract
can provide safe, complete data:

- user role assignment editor;
- role permission assignment editor;
- document version-history browser;
- dashboard breakdown by major;
- recent activity feed;
- server-side sorting.

These are documented in src/app/config/capabilities.ts and the
docs/backend-handoff.md file. The application does not enable a mutation UI with
an incomplete initial assignment payload because an empty form could overwrite
existing assignments.

## Local development

### Prerequisites

- Node.js compatible with the current package-lock.
- npm.
- A running SIMPKL API instance, normally at
  http://localhost:8080/api/v1.

### Install and configure

```powershell
npm install
Copy-Item .env.example .env
```

Configure the public frontend variables:

```text
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_API_TIMEOUT_MS=15000
```

Any variable beginning with VITE_ is exposed to the browser bundle. Never put
database credentials, JWT secrets, private keys, or other secrets in VITE_
variables.

### Start the development server

```powershell
npm run dev
```

Vite prints the local URL in the terminal, usually
http://localhost:5173.

### Production preview

```powershell
npm run build
npm run preview
```

## Scripts

```text
npm run dev        Start the Vite development server
npm run build      Typecheck and create the production bundle
npm run preview    Preview the production bundle locally
npm run lint       Run ESLint
npm run lint:fix   Apply safe ESLint fixes
npm run format     Format source with Prettier
npm run format:check
                   Verify Prettier formatting
npm run typecheck  Run TypeScript without emitting application files
npm run test       Run Vitest interactively
npm run test:run   Run the test suite once
npm run prepare    Install Husky hooks
```

## Testing and validation

The project uses Vitest for unit/component behavior, Testing Library for DOM
interactions, JSDOM for browser simulation, and MSW for API request mocking.

Recommended checks before review:

```powershell
npm run typecheck
npm run lint
npm run test:run
npm run build
git diff --check
```

For UI changes, also manually verify loading, empty, error, permission-denied,
disabled, focused, active, and mobile/desktop states in the relevant screen.

## Working with the API repository

For a complete local stack:

1. Start MySQL and the API from simpkl-api.
2. Apply API migrations.
3. Run the API seed command with development-only fixture data.
4. Set VITE_API_BASE_URL to the API's versioned base URL.
5. Start the Vite application.
6. Sign in with the local seeded administrator account.

The frontend does not own database migrations or business-rule validation.
Changes to payloads, permissions, response shapes, or endpoint behavior must be
coordinated with the API contract and its consumers.

## Documentation map

- docs/architecture.md — feature-based frontend architecture.
- docs/design-system.md — tokens, primitives, accessibility, and composition.
- docs/api-integration.md — endpoint usage, response shape, auth refresh, and
  known contract boundaries.
- docs/backend-handoff.md — capabilities awaiting backend contract support.
- ../simpkl-api/docs/openapi.yaml — machine-readable API contract.

## Scope and roadmap boundary

The web application currently focuses on staff-facing PKL administration. Future
capabilities such as attendance, journals, notifications, student access,
employer access, or richer analytics should be introduced through an explicit
API contract and permission design rather than inferred from existing screens.

## License

See LICENSE.
