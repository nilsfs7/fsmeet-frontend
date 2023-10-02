import { Match } from '@/types/match';

interface IMatchProps {
  match: Match;
}

const MatchCard = ({ match }: IMatchProps) => {
  return (
    <div className={`rounded-lg border border-primary ${match.slots > 1 ? 'bg-secondary-light' : 'bg-attention'} p-2`}>
      <div className="text-center">{match.name}</div>
      <hr />
      {[...Array(match.slots)].map((val: any, i: number) => {
        val = i + 1;
        return <div key={`slot-${i}`}>{`slot ${val}`}</div>;
      })}
    </div>
  );
};

export default MatchCard;
