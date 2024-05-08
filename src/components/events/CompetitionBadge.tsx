import { imgCompetition } from '@/types/consts/images';
import { Competition } from '@/types/competition';

interface ICompetitionProps {
  competition: Competition;
}

const CompetitionBadge = ({ competition }: ICompetitionProps) => {
  return (
    <div className={'rounded-lg border border-secondary-dark bg-secondary-light p-2 hover:border-primary'}>
      <div className="grid grid-flow-col items-center justify-between ">
        <img src={imgCompetition} className="mx-1 h-6 w-6 rounded-full object-cover" />
        <div className="mx-1">{competition.name}</div>
      </div>
    </div>
  );
};

export default CompetitionBadge;
