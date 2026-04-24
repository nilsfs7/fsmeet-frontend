## Tech stack

- **Framework:** Next.js 16+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI components:** shadcn/ui
- **Authentication:** NextAuth

## Important commands

- `yarn dev`: local dev server
- `yarn build`: create production build
- `yarn lint`: run ESLint

## Coding guidelines & conventions

- **Components:** Use `tsx` for components. Use the App Router (`app/` directory).

## Architecture

- `app/`: pages and layouts
- **App shell (P1):** `app/events/[eventId]/layout`, `app/account/layout`, and `app/admin/layout` wrap routes in `AppShellColumn` (`@/components/layout/app-shell-column`): full-height column, `relative` for `absolute` children, `min-h-0` for scroll. Pages under those trees use `className="min-h-0 flex-1 flex flex-col"` for the main column instead of repeating `h-[calc(100dvh)]` on every page.
- `components/ui/`: shadcn/ui components
- `components/shared/`: reusable components
- `components/layout/`: page chrome helpers (e.g. `PageInset`)
- `lib/`: helper utilities
- `actions/`: Next.js Server Actions

## Standardized components (P1)

- **Buttons:** Use `Button` from `@/components/ui/button`. App CTAs that need the legacy “filled primary / red” look use `variant="action" | "actionCritical" | "actionWarning"`, or use `TextButton` (wraps `Button` with the same styles).
- **Text fields:** Use `Input` from `@/components/ui/input` for single-line fields. The labeled `TextInput` in `components/common` composes `Input` for layout + label.
- **Modal UIs:** Prefer Radix `Dialog` from `@/components/ui/dialog` for state-driven modals. The custom `Dialog` in `components/dialog.tsx` is for **URL query–param** flows only.
- **Data tables:** Prefer `@/components/ui/table` with TanStack as used in list screens.

## Data states (P1)

- **Loading / empty / error** use shared building blocks: `AppDataStateListSkeleton`, `AppDataStateEmpty`, `AppDataStateError` from `@/components/shared/…`, with copy under `global/data-states` in messages.
- Primitives: `Skeleton` (`@/components/ui/skeleton`), `Alert` (`@/components/ui/alert`).
- Client fetches (e.g. `getEvents`) that fail should throw on non-OK HTTP so UIs can catch; server pages that batch calls should use `Promise.allSettled` or `try`/`catch` as needed.

## Spacing & layout contract (P0)

- **Rhythm:** Use the Tailwind spacing scale (4px base: `gap-2` = 8px, `p-4` = 16px, `mb-6` = 24px, etc.). Prefer 4/8/12/16/24px steps over arbitrary values.
- **Horizontal padding for main content:** `px-4` · `sm:px-6` · `md:px-8` (same on `PageTitle` and `PageInset`).
- **Max widths:** `max-w-content` (72rem) for default pages; `max-w-form` (40rem) for form-heavy screens; `max-w-prose` (or `PageInset` `prose` variant) for reading.
- **Implementation:** Wrap main scrollable content in `PageInset` from `@/components/layout/page-inset` (or use utility classes `page-inset` / `page-inset-narrow` / `page-inset-prose` in `globals.css`). Full-bleed or `h-[100dvh]` tool UIs can skip `PageInset` on the outer shell but should still use the same spacing scale inside.

## AI guidelines

- Before changing routes, read the existing layouts.
- If shadcn/ui components are missing, add them (`npx shadcn@latest add ...`).
