import { roundContainsParticipant, roundMatchesAscending, type Round } from '@/domain/types/round';
import MatchCard from './match-card';
import { User } from '@/domain/types/user';
import { matchContainsParticipant } from '@/domain/types/match';
import { RoundHeader } from './round-header';

interface IBattleListProps {
  rounds: Round[];
  usersMap: Map<string, User>;
  filteredByUser?: string | null;
  showUserCountryFlag?: boolean;
}

const BattleList = ({ rounds, usersMap, filteredByUser = null, showUserCountryFlag = false }: IBattleListProps) => {
  return (
    <div className="flex w-full flex-col gap-4">
      {rounds.map((round: Round, i: number) => {
        if (filteredByUser && !roundContainsParticipant(round, filteredByUser)) {
          return null;
        }

        return (
          <section key={`rnd-${i}`} className="rounded-2xl border border-border bg-background/60 p-3 shadow-xs sm:p-4">
            <RoundHeader round={round} className="mb-3" />

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {roundMatchesAscending(round).map((match, j) => {
                if (filteredByUser && !matchContainsParticipant(match, filteredByUser)) return null;

                return <MatchCard key={`match-${j}`} match={match} usersMap={usersMap} showTime={true} showUserCountryFlag={showUserCountryFlag} />;
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default BattleList;
