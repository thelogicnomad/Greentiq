# Advanced CRM Dashboard

A production-grade Customer Relationship Management (CRM) dashboard built with **Next.js 15 (App Router)**, **TypeScript (strict mode)**, **Tailwind CSS**, **shadcn/ui**, **TanStack Query v5**, **dnd-kit**, **React Hook Form**, and **Zod**.

![Advanced CRM Dashboard](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-ff4154?logo=reactquery)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3.4-38bdf8?logo=tailwindcss)

---

## 🌟 Key Features

1. **Self-Contained Mock API Layer (`app/api/*`)**:
   - Real Next.js route handlers under `/api/customers/*` and `/api/saved-filters/*`.
   - Seeded with **150 customers** deterministically using `@faker-js/faker` (fixed seed `12345`) across 6+ companies and 5 statuses (`active`, `prospect`, `lead`, `inactive`, `archived`).
   - Artificial **300ms–600ms latency** on every handler to verify loading spinners and skeleton states.
   - Validation errors returned as `400 Bad Request` with field-level details to test error state UI.

2. **Customer List & Real-time Debounced Search**:
   - Real-time search across Name, Email, and Company with a **300ms debounce** via `use-debounce`.
   - Column sorting on `name`, `email`, and `lastContactDate`.
   - Pagination options (10, 25, 50 per page).
   - Fully responsive design: transforms to card layout on mobile viewports (`< sm` breakpoint).

3. **Advanced Filters Panel**:
   - **Status Filter**: Checkboxes for all five statuses.
   - **Company Filter**: Multi-select dropdown with removable chips.
   - **Last Contact Date Range**: From / To date pickers using `date-fns`.
   - **Phone & Email Filters**: Partial-match text inputs.
   - **Saved Filter Presets**: Named filter combinations pre-seeded with 4 defaults ("Active Customers", "Recent Contacts", "Inactive Leads", "High-value prospects").
   - **Drag & Drop Filter Reordering**: Reorder saved filters using `@dnd-kit/core` & `@dnd-kit/sortable`, persisted back to `/api/saved-filters/reorder`.

4. **Customer Details & Interactive Timeline**:
   - Slide-out drawer displaying full contact details, company, status badge, deal value, account owner, and account creation dates.
   - Notes & Interaction timeline with live note creation via TanStack Query mutations.

5. **Forms & Zod Validation**:
   - Add/Edit Customer modal powered by `react-hook-form` + `zod` (`customerSchema`).
   - Validates name required, email format, phone format, and positive deal value.
   - Inline field-level error messages and submit button disabled during mutation flight.
   - Toast notifications on success and failure powered by `sonner`.

6. **TanStack Query & Optimistic Updates**:
   - `useQuery` for reads with 5-minute `staleTime`.
   - `useMutation` for writes with automatic query cache invalidation.
   - **Optimistic Delete**: Deleting a customer instantly removes it from cache with rollback on failure.

7. **Bonus Features**:
   - **Bulk Selection & Actions**: Bulk status updates, bulk deletion, and bulk selection floating bar.
   - **CSV Export**: Export currently filtered customer dataset to CSV.
   - **Keyboard Shortcuts**: `Cmd+K` (focus search), `Cmd+F` (toggle filters), `Shift+A` (add customer), `?` (help dialog).
   - **Filter Composition Test Suite**: Automated verification script testing combined search + multi-status + multi-company AND logic.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (`strict: true`)
- **Styling**: Tailwind CSS, `clsx`, `tailwind-merge`, dark theme default
- **UI Primitives**: Custom accessible Radix UI / shadcn components (`Button`, `Input`, `Checkbox`, `Select`, `Dialog`, `Badge`, `DropdownMenu`, `Skeleton`)
- **State Management & Data Fetching**: TanStack Query v5 (`@tanstack/react-query`)
- **Drag & Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- **Form Validation**: `react-hook-form`, `@hookform/resolvers`, `zod`
- **Date Utilities**: `date-fns`
- **Notifications**: `sonner`

---

## ⚠️ Important Note on Mock Backend State

> **Server In-Memory Persistence**: Data and saved filters are stored in module-level in-memory arrays (`src/lib/api/db.ts`). State will reset to the initial seed (150 customers, 4 saved filters) upon server restart. No persistent disk database is required.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

```bash
# Clone repository
git clone https://github.com/thelogicnomad/Greentiq.git
cd greentiq

# Install dependencies
npm install --legacy-peer-deps
```

### Running the Application

```bash
# Development mode
npm run dev

# Open http://localhost:3000 in your browser
```

### Running Automated Filter Tests

To verify search, filter composition, Zod schemas, and saved filter reordering:

```bash
npx tsx src/scripts/test-filters.ts
```

---

## 🧪 Testing Filter Composition

The filter panel supports composing multiple criteria simultaneously using strict `AND` logic:
- **Search**: "Acme" + **Status**: `active` + **Company**: `Acme Corp` will return customers that satisfy **all three conditions**.
- Changing filters automatically resets page number to 1 while retaining sort criteria.
