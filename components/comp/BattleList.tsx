import { Round } from '@/types/round';
import MatchCard from './MatchCard';
import Separator from '../Seperator';
import { User } from '@/types/user';

interface IBattleListProps {
  rounds: Round[];
  usersMap: Map<string, User>;
}

const BattleList = ({ rounds, usersMap }: IBattleListProps) => {
  return (
    <div className={'mt-2 flex w-full flex-col justify-center'}>
      {rounds.map((round: Round, i: number) => {
        return (
          <div key={`rnd-${i}`} className="mx-1 flex justify-center">
            <div className="flex h-full w-52 flex-col justify-center">
              <div className="text-center text-lg"> {round.name}</div>
              {round.matchesAscending.map((match, j) => {
                return (
                  <div key={`match-${j}`} className={`${i > 0 || j > 0 ? 'mt-1' : ''} ${i < rounds.length - 1 ? 'mb-1' : ''} `}>
                    <MatchCard match={match} usersMap={usersMap} showTime={true} />
                  </div>
                );
              })}

              {i < rounds.length - 1 ? (
                <div className="my-2">
                  <Separator />
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BattleList;
