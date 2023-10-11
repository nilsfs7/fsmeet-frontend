import { EventCompetition } from '@/types/event-competition';
import Competition from './Competition';
import Link from 'next/link';

interface ICompetitionListListProps {
  competitions: EventCompetition[];
  eventId: string;
}

const CompetitionList = ({ competitions, eventId }: ICompetitionListListProps) => {
  return (
    <div className={'rounded-lg border border-secondary-dark bg-secondary-light p-2 text-sm'}>
      <div className="text-base font-bold">Competitions</div>
      <div className="flex flex-wrap">
        {competitions.map((competition, i) => {
          let margin = 'my-1 mx-1';
          i === 0 ? (margin = 'm-1') : null;
          i === competitions.length - 1 ? (margin = 'ml-1') : null;

          return (
            <div key={i} className={`my-1 ${margin}`}>
              {/* TODO: enable link once useful information in comp*/}
              {/* <Link href={`/events/${eventId}/comps/${competition.id}`}> */}
              <Competition competition={competition} />
              {/* </Link> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompetitionList;
