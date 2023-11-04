import { Round } from '@/types/round';
import MatchCard from './MatchCard';
import { User } from '@/types/user';

interface IBattleTreeProps {
  rounds: Round[];
  editingEnabled?: boolean;
  seedingEnabled?: boolean;
  seedingList?: User[];
  onRenameMatch?: (roundIndex: number, matchIndex: number, matchId: string, name: string) => void;
  onUpdateSlot?: (roundIndex: number, matchId: string, slotIndex: number, username: string) => void;
}

const BattleTree = ({ rounds, editingEnabled = false, seedingEnabled = false, seedingList = [], onRenameMatch, onUpdateSlot }: IBattleTreeProps) => {
  return (
    <div className={'mt-2 flex justify-center'}>
      {rounds.map((round: Round, i: number) => {
        return (
          <div key={`rnd-${i}`} className="mx-1 flex justify-center">
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

export default BattleTree;
