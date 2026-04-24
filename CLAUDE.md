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
- `components/ui/`: shadcn/ui components
- `components/shared/`: reusable components
- `components/layout/`: page chrome helpers (e.g. `PageInset`)
- `lib/`: helper utilities
- `actions/`: Next.js Server Actions

## Spacing & layout contract (P0)

- **Rhythm:** Use the Tailwind spacing scale (4px base: `gap-2` = 8px, `p-4` = 16px, `mb-6` = 24px, etc.). Prefer 4/8/12/16/24px steps over arbitrary values.
- **Horizontal padding for main content:** `px-4` · `sm:px-6` · `md:px-8` (same on `PageTitle` and `PageInset`).
- **Max widths:** `max-w-content` (72rem) for default pages; `max-w-form` (40rem) for form-heavy screens; `max-w-prose` (or `PageInset` `prose` variant) for reading.
- **Implementation:** Wrap main scrollable content in `PageInset` from `@/components/layout/page-inset` (or use utility classes `page-inset` / `page-inset-narrow` / `page-inset-prose` in `globals.css`). Full-bleed or `h-[100dvh]` tool UIs can skip `PageInset` on the outer shell but should still use the same spacing scale inside.

## AI guidelines

- Before changing routes, read the existing layouts.
- If shadcn/ui components are missing, add them (`npx shadcn@latest add ...`).
