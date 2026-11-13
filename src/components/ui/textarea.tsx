import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground',
        'hover:border-neutral-400 focus-visible:outline-hidden focus-visible:border-brand focus-visible:ring-4 focus-visible:ring-brand/15',
        'disabled:cursor-not-allowed disabled:opacity-50 dark:hover:border-neutral-500',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
