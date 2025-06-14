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

      <div className="flex flex-wrap">
        {eventSponsors.map((sponsor, i) => {
          if (sponsor.isPublic) {
            let margin = 'my-1 mx-1';
            i === 0 ? (margin = 'm-1') : null;
            i === eventSponsors.length - 1 ? (margin = 'ml-1') : null;

            return (
              <div key={i} className={`my-1 ${margin}`}>
                {<SponsorCard sponsor={sponsor} />}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};
