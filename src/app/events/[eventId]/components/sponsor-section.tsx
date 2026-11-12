'use client';

import { Sponsor } from '@/domain/types/sponsor';
import SponsorCard from './sponsor-card';
import { useTranslations } from 'next-intl';
import { compareByIndex } from '@/functions/compare-by-index';
import { IconHeartHandshake } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface ISponsorSectionProps {
  eventSponsors: Sponsor[];
}

export const SponsorSection = ({ eventSponsors }: ISponsorSectionProps) => {
  const t = useTranslations('/events/eventid');
  const publicSponsors = [...eventSponsors].sort(compareByIndex).filter(sponsor => sponsor.isPublic);

  if (publicSponsors.length === 0) {
    return <></>;
  }

  const isSingle = publicSponsors.length === 1;

  return (
    <section className="rounded-2xl border border-border bg-background p-4 shadow-xs sm:p-6" data-testid="sponsor-section">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-strong">
          <IconHeartHandshake className="h-5 w-5" stroke={1.75} aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground">{isSingle ? t('tabOverviewSectionSponsorsPresentedBy') : t('tabOverviewSectionSponsors')}</h2>
          <p className="text-sm text-muted-foreground">{t('tabOverviewSectionSponsorsHint')}</p>
        </div>
      </div>

      <div className={cn('mt-4 grid gap-3 sm:gap-4', isSingle ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3')}>
        {publicSponsors.map(sponsor => (
          <SponsorCard key={sponsor.id ?? sponsor.name} sponsor={sponsor} featured={isSingle} visitLabel={t('tabOverviewSectionSponsorsVisit')} />
        ))}
      </div>
    </section>
  );
};
