import { Competition } from '@/types/competition';
import CompetitionBadge from './CompetitionBadge';
import Link from 'next/link';
import { routeEvents } from '@/domain/constants/routes';

interface ICompetitionListListProps {
  competitions: Competition[];
  eventId: string;
}

const CompetitionList = ({ competitions, eventId }: ICompetitionListListProps) => {
  return (
    <div className={'rounded-lg border border-secondary-dark bg-secondary-light p-2 text-sm'}>
      <div className="text-base font-bold">{`Competitions`}</div>
      <div className="flex flex-wrap">
        {competitions.map((competition, i) => {
          let margin = 'my-1 mx-1';
          i === 0 ? (margin = 'm-1') : null;
          i === competitions.length - 1 ? (margin = 'ml-1') : null;

          return (
            <div key={i} className={`my-1 ${margin}`}>
              <Link href={`${routeEvents}/${eventId}/comps/${competition.id}`}>
                <CompetitionBadge competition={competition} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompetitionList;
