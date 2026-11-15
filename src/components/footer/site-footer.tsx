import { cn } from '@/lib/utils';
import { LegalLinks } from './legal-links';
import { StoreBadges } from './store-badges';

/**
 * Compact site footer: store badges + legal links in one row.
 * Opt-in: render it as the LAST child of a page's scroll container, so it scrolls with the content and sits right above the
 * bottom action bar (`Navigation`). Not rendered on forms, auth flows, embeds, arena screen or admin pages.
 * In a flex-column scroll container `mt-auto` pushes it to the bottom on short pages.
 */
export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer className={cn('mt-auto w-full shrink-0 pt-8', className)}>
      <div className="flex flex-col items-center gap-3 border-t border-border/60 pt-4 sm:flex-row sm:justify-between sm:gap-4">
        <StoreBadges size="sm" className="justify-center" />
        <LegalLinks className="justify-center sm:justify-end" />
      </div>
    </footer>
  );
}
