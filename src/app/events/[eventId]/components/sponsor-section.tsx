'use client';

import { Sponsor } from '@/domain/types/sponsor';
import SponsorCard from './sponsor-card';
import { useTranslations } from 'next-intl';

interface ISponsorSectionProps {
  eventSponsors: Sponsor[];
}

function compareSponsorIndex(a: Sponsor, b: Sponsor): number {
  if (a.index == null && b.index == null) return 0;
  if (a.index == null) return 1;
  if (b.index == null) return -1;
  return a.index - b.index;
}

export const SponsorSection = ({ eventSponsors }: ISponsorSectionProps) => {
  const t = useTranslations('/events/eventid');
  const orderedSponsors = [...eventSponsors].sort(compareSponsorIndex);

  if (
    !eventSponsors.some(sponsor => {
      if (sponsor.isPublic) return sponsor;
    })
  ) {
    return <></>;
  }

  return (
    <div className={'rounded-lg border border-secondary-dark bg-secondary-light p-2'}>
      <div className="text-base font-bold">{t('tabOverviewSectionSponsors')}</div>

      <div className="mt-1 flex flex-wrap gap-2">
        {orderedSponsors.map((sponsor, i) => {
          if (sponsor.isPublic) {
            return <SponsorCard key={i} sponsor={sponsor} />;
          }
        })}
      </div>
    </div>
  );
};
