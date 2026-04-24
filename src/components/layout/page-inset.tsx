import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

const variantClass = {
  default: 'max-w-content',
  narrow: 'max-w-form',
  prose: 'max-w-prose',
} as const;

export type PageInsetVariant = keyof typeof variantClass;

type PageInsetProps = {
  children: ReactNode;
  /** default: main column (72rem); narrow: forms (40rem); prose: reading width */
  variant?: PageInsetVariant;
  className?: string;
};

/**
 * Default page content width + horizontal padding. Prefer this (or `.page-inset*`) over ad-hoc `mx-2` / `px-2` on every page.
 * Spacing scale: Tailwind defaults (4px steps) — see `CLAUDE.md` / `globals.css` `.page-inset` comment.
 */
export function PageInset({ children, variant = 'default', className }: PageInsetProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 pb-6 sm:px-6 sm:pb-8 md:px-8',
        variantClass[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}
