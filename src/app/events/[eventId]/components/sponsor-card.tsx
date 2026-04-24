import { Sponsor } from '@/domain/types/sponsor';
import { IconPhoto } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface ISponsorCardProps {
  sponsor: Sponsor;
}

const cardSurface = cn(
  'group min-w-0 overflow-hidden rounded-xl border border-border/60',
  'bg-secondary-light/85 shadow-xs backdrop-blur-sm',
  'supports-[backdrop-filter]:bg-secondary-light/70',
  'transition-all duration-200',
  'hover:border-primary/50 hover:shadow-md',
  'dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50 dark:hover:border-primary/40',
);

const SponsorCard = ({ sponsor }: ISponsorCardProps) => {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={sponsor.website || '#'}
      className={cn(
        'inline-block w-max max-w-full align-middle no-underline',
        'rounded-xl outline-none',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      )}
    >
      <div className={cardSurface}>
        <div className="inline-flex w-max min-w-0 max-w-full items-center gap-2.5 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border/50 bg-muted/20 ring-1 ring-border/30">
            {sponsor.imageUrlLogo ? (
              <img
                src={sponsor.imageUrlLogo}
                alt=""
                className="h-full w-full object-contain"
              />
            ) : (
              <IconPhoto className="h-4 w-4 text-muted-foreground" stroke={2} aria-hidden />
            )}
          </div>
          <span className="type-body-sm min-w-0 max-w-[min(18rem,calc(100vw-5rem))] truncate font-medium text-foreground">
            {sponsor.name}
          </span>
        </div>
      </div>
    </a>
  );
};

export default SponsorCard;
