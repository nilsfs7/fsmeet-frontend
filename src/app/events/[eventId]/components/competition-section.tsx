'use client';

import { Competition } from '@/types/competition';
import CompetitionCard from './competition-card';
import Link from 'next/link';
import { routeEvents } from '@/domain/constants/routes';
import { useTranslations } from 'next-intl';

interface ICompetitionSectionProps {
  competitions: Competition[];
  eventId: string;
}

export const CompetitionSection = ({ competitions, eventId }: ICompetitionSectionProps) => {
  const t = useTranslations('/events/eventid');

  return (
    <div className={'rounded-lg border border-secondary-dark bg-secondary-light p-2 text-sm'}>
      <div className="text-base font-bold">{t('tabCompetitionsSectionCompetitions')}</div>
      <div className="flex flex-wrap">
        {competitions.map((competition, i) => {
          let margin = 'my-1 mx-1';
          i === 0 ? (margin = 'm-1') : null;
          i === competitions.length - 1 ? (margin = 'ml-1') : null;

          return (
            <div key={i} className={`my-1 ${margin}`}>
              <Link href={`${routeEvents}/${eventId}/comps/${competition.id}`}>
                <CompetitionCard competition={competition} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
