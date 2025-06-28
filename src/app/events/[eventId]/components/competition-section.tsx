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
      <div className="mt-1 flex flex-wrap gap-2">
        {competitions.map((competition, i) => {
          return (
            <Link key={i} href={`${routeEvents}/${eventId}/comps/${competition.id}`}>
              <CompetitionCard competition={competition} />
            </Link>
          );
        })}
      </div>
    </div>
  );
};
