import { Round } from '@/types/round';
import MatchCard from './MatchCard';
import { User } from '@/types/user';

interface IBattleGridProps {
  rounds: Round[];
  editingEnabled?: boolean;
  seedingEnabled?: boolean;
  seedingList?: User[];
  onRenameMatch?: (roundIndex: number, matchIndex: number, matchId: string, name: string) => void;
  onUpdateSlot?: (roundIndex: number, matchId: string, slotIndex: number, username: string) => void;
}

const BattleGrid = ({ rounds, editingEnabled = false, seedingEnabled = false, seedingList = [], onRenameMatch, onUpdateSlot }: IBattleGridProps) => {
  return (
    <div className="flex">
      {rounds.map((round: Round, i: number) => {
        return (
          <div key={`rnd-${i}`} className={`${i > 0 ? 'ml-1' : ''} ${i < rounds.length - 1 ? 'mr-1' : ''}`}>
            <div className="flex h-full w-52 flex-col justify-center">
              {round.matches.map((match, j) => {
                return (
                  <div key={`match-${j}`} className={`${j > 0 ? 'mt-1' : ''} ${j < round.matches.length - 1 ? 'mb-1' : ''}`}>
                    <MatchCard
                      match={match}
                      editingEnabled={editingEnabled}
                      seedingEnabled={seedingEnabled}
                      seedingList={seedingList}
                      onRename={(matchIndex: number, matchId: string, name: string) => {
                        onRenameMatch && onRenameMatch(rounds[i].roundIndex, matchIndex, matchId, name);
                      }}
                      onUpdateSlot={(matchId: string, slotIndex: number, username: string) => {
                        onUpdateSlot && onUpdateSlot(rounds[i].roundIndex, matchId, slotIndex, username);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BattleGrid;
