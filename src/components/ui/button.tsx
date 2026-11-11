import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-foreground text-background shadow-xs hover:bg-foreground/90',
        destructive: 'bg-critical text-critical-foreground shadow-xs hover:bg-critical-dark',
        outline: 'border border-border bg-background text-foreground shadow-xs hover:border-foreground/20 hover:bg-muted',
        secondary: 'bg-muted text-foreground hover:bg-neutral-200 dark:hover:bg-neutral-700',
        ghost: 'text-foreground hover:bg-muted',
        link: 'text-foreground underline-offset-4 hover:underline',
        /** App CTA: design tokens (`variant="action" | "actionCritical" | "actionWarning"`) */
        action: 'bg-brand text-brand-foreground shadow-sm hover:bg-brand-strong hover:shadow-md focus-visible:ring-brand',
        actionCritical: 'bg-critical text-critical-foreground shadow-sm hover:bg-critical-dark focus-visible:ring-critical',
        actionWarning: 'border border-warning bg-background text-foreground shadow-xs hover:bg-warning/10 focus-visible:ring-warning',
        /** Bordered tool / toolbar icon (see `ActionButton`); pair with `size` icon / iconSm / iconXs. */
        actionIcon:
          'border border-border bg-background text-foreground shadow-xs transition-all duration-150 ease-in-out hover:border-foreground/25 hover:bg-muted hover:shadow-sm active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:bg-muted disabled:text-secondary-dark disabled:opacity-100 disabled:active:scale-100',
        actionIconWarning:
          'border border-border bg-background text-warning shadow-xs transition-all duration-150 ease-in-out hover:border-foreground/25 hover:bg-muted hover:shadow-sm active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:bg-muted disabled:text-secondary-dark disabled:opacity-100 disabled:active:scale-100',
        actionIconCritical:
          'border border-border bg-background text-critical shadow-xs transition-all duration-150 ease-in-out hover:border-critical/40 hover:bg-critical/5 hover:shadow-sm active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:bg-muted disabled:text-secondary-dark disabled:opacity-100 disabled:active:scale-100',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-lg px-3',
        lg: 'h-12 rounded-xl px-6 text-base',
        icon: 'h-10 w-10 rounded-xl p-0',
        iconSm: 'h-8 w-8 rounded-lg p-0',
        iconXs: 'h-4 w-4 rounded-lg p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = 'Button';

/** Sizing/animation for primary CTA-style `Button` variants (`action*`). */
export const ctaActionButtonClassName =
  'min-w-36 rounded-xl px-5 text-base font-semibold transition-all duration-150 ease-in-out active:scale-[0.98] disabled:active:scale-100';

export { Button, buttonVariants };
