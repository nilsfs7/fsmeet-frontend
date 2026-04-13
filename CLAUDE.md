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
- `lib/`: helper utilities
- `actions/`: Next.js Server Actions

## AI guidelines

- Before changing routes, read the existing layouts.
- If shadcn/ui components are missing, add them (`npx shadcn@latest add ...`).
