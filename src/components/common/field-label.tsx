'use client';

import { useState, type PointerEvent } from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function FieldLabel({
  id,
  label,
  tooltip,
  className,
}: {
  id: string;
  label: string;
  tooltip?: string;
  className: string;
}) {
  const [open, setOpen] = useState(false);

  if (!tooltip) {
    return (
      <label htmlFor={id} className={className}>
        {label}
      </label>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={label}
            aria-expanded={open}
            className={cn(
              className,
              'w-fit max-w-full self-start justify-self-start text-left',
              'cursor-help underline decoration-dotted decoration-muted-foreground underline-offset-2',
            )}
            onClick={e => {
              e.preventDefault();
              setOpen(o => !o);
            }}
            onPointerEnter={(e: PointerEvent<HTMLButtonElement>) => {
              if (e.pointerType !== 'touch') setOpen(true);
            }}
            onPointerLeave={(e: PointerEvent<HTMLButtonElement>) => {
              if (e.pointerType !== 'touch') setOpen(false);
            }}
          >
            {label}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" align="start" sideOffset={6} className="max-w-xs text-left">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
