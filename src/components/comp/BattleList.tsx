import { Round } from '@/domain/classes/round';
import MatchCard from './MatchCard';
import Separator from '../Seperator';
import { User } from '@/domain/types/user';
import moment from 'moment';

interface IBattleListProps {
  rounds: Round[];
  usersMap: Map<string, User>;
  filteredByUser?: string | null;
  showUserCountryFlag?: boolean;
}

const BattleList = ({ rounds, usersMap, filteredByUser = null, showUserCountryFlag = false }: IBattleListProps) => {
  return (
    <div className={'flex w-full flex-col justify-center'}>
      {rounds.map((round: Round, i: number) => {
        if (filteredByUser && !round.containsParticipant(filteredByUser)) {
          return;
        }

        return (
          <div key={`rnd-${i}`} className="mx-1 flex justify-center">
            <div className="flex h-full w-52 flex-col justify-center">
              <div className="flex items-center justify-center gap-1">
                <div className="text-center text-lg">{round.name}</div>
                {round.timeLimit && <div className="text-center text-sm">{`(time limit)`}</div>}
              </div>

              <div className={`px-2 h-6`}>
                <div className={`text-center text-sm`}>{moment(round.date).isValid() && moment(round.date).locale('en').format(`dddd, MMMM D`)}</div>
              </div>

              {round.matchesAscending.map((match, j) => {
                if (filteredByUser) {
                  if (!match.containsParticipant(filteredByUser)) return;
                }

                return (
                  <div key={`match-${j}`} className={`${i > 0 || j > 0 ? 'mt-1' : ''} ${i < rounds.length - 1 ? 'mb-1' : ''} `}>
                    <MatchCard match={match} usersMap={usersMap} showTime={true} showUserCountryFlag={showUserCountryFlag} />
                  </div>
                );
              })}

              {i < rounds.length - 1 && (
                <>
                  {!filteredByUser && (
                    <div className="my-2">
                      <Separator />
                    </div>
                  )}

                  {filteredByUser && rounds[i + 1].containsParticipant(filteredByUser) && (
                    <div className="my-2">
                      <Separator />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BattleList;
