import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';
import type { ReactNode } from 'react';

interface ExternalTextLinkButtonProps {
  href: string;
  children: ReactNode;
  /** Accessible name when the visible label alone is insufficient (e.g. destination brand). */
  ariaLabel?: string;
  className?: string;
}

export function ExternalTextLinkButton({ href, children, ariaLabel, className }: ExternalTextLinkButtonProps) {
  return (
    <Button asChild variant="outline" size="sm" className={cn('w-fit gap-1.5', className)}>
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}>
        {children}
        <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
      </a>
    </Button>
  );
}
