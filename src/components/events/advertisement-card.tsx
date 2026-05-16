import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { ReadAdvertisementResponseDto } from '@/infrastructure/clients/dtos/advertisement/read-advertisement-response-dto';

export interface AdvertisementCardProps {
  advertisement: ReadAdvertisementResponseDto;
  /** Localised label shown as a small disclosure (e.g. “Ad”). */
  badgeLabel: string;
  /** Cycle position when multiple creatives exist (stable ids). */
  slotIndex?: number;
  /**
   * `inline`: same row layout as EventCard (list / mobile).
   * `sidebar`: stacked layout for the desktop column beside the list.
   */
  variant?: 'inline' | 'sidebar';
}

const shellClassName = cn(
  'relative overflow-hidden rounded-xl border border-dashed border-border/70',
  'bg-secondary-light/85 shadow-xs backdrop-blur-sm',
  'supports-[backdrop-filter]:bg-secondary-light/70',
  'dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50',
);

/** Sponsored tile styled like EventCard (border, radius); not a navigable event row. */
const adLinkRel = 'noopener noreferrer sponsored';

export function AdvertisementCard({ advertisement, badgeLabel, slotIndex = 0, variant = 'inline' }: AdvertisementCardProps) {
  const slot = advertisement;
  const titleId = `advertisement-title-${slot.id}-${slotIndex}-${variant}`;

  const badge = (
    <div className="pointer-events-none absolute right-2 top-2 z-[1] rounded-md bg-muted/90 px-1.5 py-0.5 text-2xs font-medium uppercase tracking-wide text-muted-foreground shadow-xs">
      {badgeLabel}
    </div>
  );

  const visual = (
    <a
      href={`${slot.targetUrl}?ad=${slot.id}`}
      target="_blank"
      rel={adLinkRel}
      className={cn(
        'relative block overflow-hidden rounded-lg bg-muted/30 outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring',
        variant === 'sidebar' ? 'aspect-video w-full' : 'aspect-[4/5] h-full w-full',
      )}
      aria-label={`${slot.title} — sponsored`}
    >
      <Image src={slot.imageUrl} alt="" fill className="object-cover" sizes={variant === 'sidebar' ? '(max-width: 1024px) min(100vw, 42rem), 320px' : '(max-width: 640px) 112px, 128px'} />
    </a>
  );

  const cta = (
    <a href={slot.targetUrl} target="_blank" rel={adLinkRel} className="type-body-sm pt-0.5 font-medium text-primary underline-offset-4 hover:underline">
      Read more
    </a>
  );

  if (variant === 'sidebar') {
    return (
      <article className={cn(shellClassName, 'w-full max-w-lg lg:max-w-none')} aria-labelledby={titleId}>
        {badge}
        <div className="flex flex-col gap-2 p-2.5 pt-9 sm:gap-3 sm:p-3 sm:pt-10">
          {visual}
          <div className="flex min-w-0 flex-col gap-1.5">
            <h3 id={titleId} className="line-clamp-3 text-left text-base font-semibold leading-tight tracking-tight text-foreground sm:text-lg sm:leading-snug">
              {slot.title}
            </h3>
            <p className="type-body-sm line-clamp-4 break-words whitespace-pre-line text-foreground/85">{slot.description}</p>
            {cta}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={cn(shellClassName, 'max-w-lg')} aria-labelledby={titleId}>
      {badge}

      <div className="flex min-h-0 items-stretch gap-2 p-2.5 sm:gap-3 sm:p-3">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-1.5 sm:gap-2">
          <h3 id={titleId} className="line-clamp-2 pr-14 text-left text-base font-semibold leading-tight tracking-tight text-foreground sm:text-lg sm:leading-snug">
            {slot.title}
          </h3>
          <p className="type-body-sm line-clamp-3 break-words whitespace-pre-line text-foreground/85">{slot.description}</p>
          {cta}
        </div>

        <div className="flex w-28 shrink-0 flex-col justify-center self-stretch sm:w-32">{visual}</div>
      </div>
    </article>
  );
}
