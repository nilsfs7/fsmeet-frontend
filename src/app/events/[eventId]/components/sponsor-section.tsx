'use client';

import { Sponsor } from '@/domain/types/sponsor';
import SponsorCard from './sponsor-card';
import { useTranslations } from 'next-intl';
import { compareByIndex } from '@/functions/compare-by-index';

interface ISponsorSectionProps {
  eventSponsors: Sponsor[];
}

export const SponsorSection = ({ eventSponsors }: ISponsorSectionProps) => {
  const t = useTranslations('/events/eventid');
  const orderedSponsors = [...eventSponsors].sort(compareByIndex);

  if (
    !eventSponsors.some(sponsor => {
      if (sponsor.isPublic) return sponsor;
    })
  ) {
    return <></>;
  }

  return (
    <div className="rounded-2xl border border-border bg-background p-4 shadow-xs sm:p-6">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('tabOverviewSectionSponsors')}</div>

      <div className="mt-3 flex flex-wrap gap-2">
        {orderedSponsors.map((sponsor, i) => {
          if (sponsor.isPublic) {
            return <SponsorCard key={i} sponsor={sponsor} />;
          }
        })}
      </div>
    </div>
  );
};
