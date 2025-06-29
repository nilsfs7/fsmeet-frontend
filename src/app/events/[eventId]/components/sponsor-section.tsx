'use client';

import { Sponsor } from '@/types/sponsor';
import SponsorCard from './sponsor-card';
import { useTranslations } from 'next-intl';

interface ISponsorSectionProps {
  eventSponsors: Sponsor[];
}

export const SponsorSection = ({ eventSponsors }: ISponsorSectionProps) => {
  const t = useTranslations('/events/eventid');

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

      <div className="mt-1 flex gap-2">
        {eventSponsors.map((sponsor, i) => {
          if (sponsor.isPublic) {
            return <SponsorCard key={i} sponsor={sponsor} />;
          }
        })}
      </div>
    </div>
  );
};
