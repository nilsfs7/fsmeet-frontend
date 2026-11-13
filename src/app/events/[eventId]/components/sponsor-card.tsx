import { Sponsor } from '@/domain/types/sponsor';
import { IconExternalLink } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface ISponsorCardProps {
  sponsor: Sponsor;
  featured?: boolean;
  visitLabel?: string;
}

const getHostname = (website: string): string | null => {
  if (!website) return null;
  try {
    return new URL(website.includes('://') ? website : `https://${website}`).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
};

const getInitials = (name: string): string => {
  const words = name
    .replace(/\[[^\]]*\]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const source = words.length > 0 ? words : [name];
  return source
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase() ?? '')
    .join('');
};

const SponsorCard = ({ sponsor, featured = false, visitLabel }: ISponsorCardProps) => {
  const hostname = getHostname(sponsor.website);
  const hasLink = !!sponsor.website && !!hostname;

  const content = (
    <>
      <div className={cn('flex w-full items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-white', featured ? 'h-36 p-5 sm:h-44 sm:p-6' : 'h-24 p-3 sm:h-28 sm:p-4')}>
        {sponsor.imageUrlLogo ? (
          <img src={sponsor.imageUrlLogo} alt={sponsor.name} loading="lazy" className="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-[1.03]" />
        ) : (
          <span className={cn('flex items-center justify-center rounded-full bg-brand-soft font-bold text-brand-strong', featured ? 'h-20 w-20 text-2xl' : 'h-14 w-14 text-lg')} aria-hidden>
            {getInitials(sponsor.name)}
          </span>
        )}
      </div>

      <div className={cn('flex min-w-0 flex-col gap-0.5 px-1', featured ? 'items-center text-center' : '')}>
        <span className={cn('line-clamp-2 font-semibold text-foreground', featured ? 'text-base sm:text-lg' : 'text-sm')}>{sponsor.name}</span>
        {hasLink && (
          <span className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground transition-colors group-hover:text-brand-strong">
            <span className="truncate">{hostname}</span>
            <IconExternalLink className="h-3.5 w-3.5 shrink-0" stroke={1.75} aria-hidden />
          </span>
        )}
      </div>
    </>
  );

  const surface = cn(
    'group flex h-full min-w-0 flex-col gap-3 rounded-2xl border border-border bg-background p-2.5 shadow-xs sm:p-3',
    hasLink && 'transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-md',
    'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  );

  if (!hasLink) {
    return <div className={surface}>{content}</div>;
  }

  return (
    <a target="_blank" rel="noopener noreferrer" href={sponsor.website} className={cn(surface, 'no-underline')} aria-label={visitLabel ? `${sponsor.name} – ${visitLabel}` : sponsor.name}>
      {content}
    </a>
  );
};

export default SponsorCard;
