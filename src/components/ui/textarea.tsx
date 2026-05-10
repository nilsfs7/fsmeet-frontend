import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-20 w-full rounded-lg border border-secondary-dark bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500',
        'focus-visible:outline-none focus-visible:border-primary focus-visible:ring-primary focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300',
        'hover:border-primary',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
