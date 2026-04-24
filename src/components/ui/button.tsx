import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-zinc-900 text-zinc-50 ring-offset-white hover:bg-zinc-900/90 focus-visible:ring-zinc-950 dark:bg-zinc-50 dark:text-zinc-900 dark:ring-offset-zinc-950 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300',
        destructive: 'bg-red-500 text-zinc-50 ring-offset-white hover:bg-red-500/90 focus-visible:ring-red-500 dark:bg-red-900 dark:text-zinc-50 dark:ring-offset-zinc-950 dark:hover:bg-red-900/90 dark:focus-visible:ring-red-500',
        outline: 'border border-zinc-200 bg-white ring-offset-white hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-300',
        secondary: 'bg-zinc-100 text-zinc-900 ring-offset-white hover:bg-zinc-100/80 focus-visible:ring-zinc-950 dark:bg-zinc-800 dark:text-zinc-50 dark:ring-offset-zinc-950 dark:hover:bg-zinc-800/80 dark:focus-visible:ring-zinc-300',
        ghost: 'ring-offset-white hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-zinc-950 dark:ring-offset-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-300',
        link: 'text-zinc-900 underline-offset-4 ring-offset-white hover:underline focus-visible:ring-zinc-950 dark:text-zinc-50 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300',
        /** App CTA: design tokens (use via `TextButton` or `variant="action"`) */
        action:
          'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:ring-primary',
        actionCritical: 'bg-critical text-critical-foreground shadow-sm hover:bg-critical-dark focus-visible:ring-critical',
        actionWarning:
          'border border-warning bg-background text-foreground shadow-sm hover:bg-warning/10 focus-visible:ring-warning',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = 'Button';

export { Button, buttonVariants };
