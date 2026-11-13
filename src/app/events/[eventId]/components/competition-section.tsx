'use client';

import { Competition } from '@/domain/types/competition';
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
    <div className="rounded-2xl border border-border bg-background p-4 text-sm shadow-xs sm:p-6">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('tabCompetitionsSectionCompetitions')}</div>
      <div className="mt-3 flex flex-wrap gap-2">
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
