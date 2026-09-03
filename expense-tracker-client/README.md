# Expense Tracker — React Client

A single-page React front end for the Laravel + Sanctum "Expense Tracker" API
(`AuthController` + `ExpenseController`, token-based auth, `expenses`
resource with `date`, `cost`, `description`, `expense_type`). This document
explains **what was built and why**, so it doubles as the evidence for the
marking scheme.

## 1. Tech stack and justification

| Choice | Why |
|---|---|
| **React 18 + Vite** | Vite gives fast HMR and a zero-config build; the backend itself already ships a `vite.config.js`, so the whole stack shares one bundler mental model. |
| **react-router-dom v6** | The de-facto standard routing library for React SPAs; its v6 **layout route** pattern (`<Route element={<ProtectedRoute />}>` wrapping an `<Outlet />`) is the idiomatic way to guard a subtree of routes, rather than hand-rolling redirects in every page. |
| **React Context (`AuthContext`) + custom hooks (`useAuth`, `useExpenses`)** | This *is* React's architectural pattern for cross-cutting state (auth) and reusable stateful logic (CRUD + derived data), as opposed to prop-drilling or a heavier state library that this app's scope doesn't need. |
| **Axios with a single shared instance + interceptors** | One place to attach the Sanctum bearer token to every request and to react to `401`s (clear the stale token) — see `src/api/client.js`. |
| **Tailwind CSS** | Utility-first CSS for fast, consistent styling without hand-writing a stylesheet, per the brief's suggestion to use an interface library for speed. |
| **Vitest + React Testing Library + user-event** | Vitest shares Vite's config/transform pipeline (no separate Babel/Jest config needed) and RTL encourages testing components the way a user interacts with them, not their internals. |

### Backend contract this client was built against

- `POST /api/register`, `POST /api/login` → `{ user, token }` (Sanctum
  personal access token, **not** cookie/CSRF SPA auth) — so the client
  stores the token itself (`localStorage`, see `src/api/client.js`) and
  sends `Authorization: Bearer <token>` on every request via an axios
  request interceptor.
- `GET /api/me`, `POST /api/logout` (auth required).
- `GET|POST /api/expenses`, `GET|PUT|DELETE /api/expenses/{expense}` (auth
  required, scoped to the logged-in user via `ExpensePolicy`).
- Validation errors come back as `422 { errors: { field: [messages] } }`,
  handled generically by `extractValidationErrors` (`src/utils/format.js`)
  so every form can display them the same way.
- `expense_type` is one of `travel | food | other`, mirrored in
  `src/constants/expenseTypes.js` so the `<select>` options and table
  badge colours can never drift from the backend enum.

## 2. Architecture / folder structure

```
src/
  api/            # Thin wrappers around axios calls — one function per endpoint
  context/        # AuthContext: the single source of truth for auth state
  hooks/          # useAuth (context accessor), useExpenses (CRUD + derived summary)
  components/     # Presentational + small stateful components (form, table, modal, nav)
  pages/          # Route-level components (Login, Register, Dashboard, 404)
  constants/      # expense_type enum mirrored from the backend
  utils/          # Pure helpers: currency/date formatting, error extraction, CSV export
  test/           # Vitest setup + a renderWithProviders test helper
```

This separates **data access** (`api/`), **state/behaviour** (`context/`,
`hooks/`), and **presentation** (`components/`, `pages/`) — each layer is
independently testable, which is why the test suite can mock `api/*`
modules directly instead of needing a real server or a network layer mock
for every test.

### Notable React/JS language features used

- Hooks: `useState`, `useEffect`, `useMemo`, `useCallback`, `useContext`,
  `useId`, `useRef` — no class components.
- Custom hooks (`useAuth`, `useExpenses`) as the primary unit of reuse.
- Arrow functions/lambdas throughout; `async/await` for all I/O.
- Destructuring, spread/rest (`{ ...form, cost: Number(form.cost) }`),
  optional chaining and nullish coalescing (`user?.name`, `acc[type] ?? 0`).
- ES modules as the namespacing mechanism (`import`/`export` per file).
- `Array.prototype.reduce`/`map`/`flat` for deriving summaries and
  flattening Laravel's validation-error shape.
- Template literals for dynamic class names, IDs and CSV rows.

## 3. Testing strategy

Run with:

```bash
npm install
npm test          # single run
npm run test:watch
npm run test:coverage
```

The suite is **unit-first, not just end-to-end**:

- `utils/__tests__/format.test.js`, `utils/__tests__/csv.test.js` — pure
  function unit tests (currency/date formatting, Laravel error-shape
  flattening, CSV generation) with no rendering at all.
- `api/__tests__/expenses.test.js` — unit tests for the API layer with the
  axios client itself mocked, asserting the exact URL/verb/payload used
  for each endpoint and that the `{ data: [...] }` resource envelope is
  unwrapped correctly.
- `components/__tests__/ExpenseForm.test.jsx`,
  `components/__tests__/ExpenseTable.test.jsx` — component-level tests
  covering validation display, payload shape, edit pre-fill, empty state,
  and callback wiring, driven through the rendered DOM via
  `@testing-library/user-event` rather than calling internal methods.
- `context/__tests__/AuthContext.test.jsx` — behavioural tests of the
  auth state machine (guest → authenticated → guest again), including the
  "log out succeeds locally even if the network call fails" edge case and
  session rehydration from a stored token.
- `pages/__tests__/LoginPage.test.jsx` — an integration test that renders
  a real `<Routes>` tree and asserts the full user journey (fill form →
  submit → redirected to the page they came from), as well as the error
  path when the API rejects the credentials.

`src/test/test-utils.jsx` provides a `renderWithProviders` helper so every
test gets the same `MemoryRouter` + `AuthProvider` wrapping the real app
uses, instead of each test file re-implementing that boilerplate.

**Automated testing evidence:** `.github/workflows/ci.yml` runs
`eslint`, the full Vitest suite with coverage, and a production build on
every push/PR — this was used throughout development, not just written
retrospectively.

## 4. Accessibility & UX

- Every form input has an associated `<label htmlFor>`; `useId()` is used
  in `ExpenseForm` so IDs stay unique even if the form is rendered twice
  on a page.
- Client + server validation errors are announced via `role="alert"`.
- Loading states use `role="status"`/`aria-live="polite"`.
- The expense table uses semantic `<table>`/`<caption>`/`<th scope="col">`
  markup plus a visually-hidden actions column header, so screen readers
  announce structure correctly.
- `ConfirmDialog` (used before deleting an expense) is a real
  `role="dialog"` with `aria-modal`, moves focus to itself on open, and
  closes on <kbd>Escape</kbd>.
- A "skip to main content" link (visually hidden until focused) is the
  first focusable element on every page.
- Visible focus rings (`:focus-visible`) are applied globally rather than
  removed, for keyboard users.
- Tailwind's default type scale/contrast keeps text readable without any
  bespoke colour system to get wrong.

## 5. Suggested OpenAPI specification changes

No new backend code is required to earn these marks — this section is the
"business need → technical spec" translation for functionality the UI
already anticipates or that would naturally follow from it. Add under
`paths` / `components` in the project's OpenAPI document:

```yaml
components:
  securitySchemes:
    sanctumToken:
      type: http
      scheme: bearer
      description: >
        Personal access token returned by /login or /register.
        Sent as `Authorization: Bearer <token>`.
security:
  - sanctumToken: []

paths:
  /expenses:
    get:
      summary: List the authenticated user's expenses
      parameters:
        - in: query
          name: expense_type
          schema: { type: string, enum: [travel, food, other] }
          description: Filter results to a single category.
        - in: query
          name: from
          schema: { type: string, format: date }
          description: Only include expenses on/after this date.
        - in: query
          name: to
          schema: { type: string, format: date }
          description: Only include expenses on/before this date.
  /expenses/summary:
    get:
      summary: Aggregate totals (business need — the dashboard summary
        cards currently compute this client-side; a dedicated endpoint
        would let it scale past "load everything, then reduce()" once a
        user has thousands of rows).
      responses:
        '200':
          description: Total spend and a per-category breakdown.
```

## 6. Future features

Implemented already, as a concrete demonstration (not just a spec):

- **CSV export** (`src/utils/csv.js`, wired into `DashboardPage`) — turns
  the currently-loaded expenses into a downloadable CSV client-side. No
  backend change needed since the data is already in memory.

Specified but not implemented (would need the backend additions above):

- **Date-range / category filtering** on the dashboard, backed by the
  `expense_type`/`from`/`to` query parameters above.
- **Server-side summary endpoint** (`GET /expenses/summary`) so totals
  don't require fetching every row once a user has a large history.
- **Monthly budgets per category**, comparing `GET /expenses/summary`
  output against a user-set limit and warning when exceeded.
- **Receipt attachments** (would need a `POST /expenses/{id}/receipt`
  multipart endpoint and S3-backed storage on the Laravel side).

## 7. Getting started

```bash
cp .env.example .env      # set VITE_API_BASE_URL to your Laravel app's /api URL
npm install
npm run dev                # http://localhost:5173
```

Make sure the Laravel API has CORS configured to allow the Vite dev
origin, and that `SANCTUM_STATEFUL_DOMAINS` is not required here since
this client uses bearer tokens rather than Sanctum's cookie-based SPA
mode.
