import { imgCompetition } from '@/types/consts/images';
import { EventCompetition } from '@/types/event-competition';

interface ICompetitionProps {
  competition: EventCompetition;
}

const Competition = ({ competition }: ICompetitionProps) => {
  return (
    <div className={'rounded-lg border border-black bg-zinc-300 p-2 hover:bg-zinc-400'}>
      <div className="grid grid-flow-col items-center justify-between">
        <img src={imgCompetition} className="mx-1 h-6 w-6 rounded-full object-cover" />
        <div className="mx-1">{competition.name}</div>
      </div>
    </div>
  );
};

export default Competition;
