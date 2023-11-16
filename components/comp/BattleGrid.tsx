import { Round } from '@/types/round';
import MatchCard from './MatchCard';
import { User } from '@/types/user';
import { Moment } from 'moment';

interface IBattleGridProps {
  rounds: Round[];
  usersMap?: Map<string, User>;
  editingEnabled?: boolean;
  seedingEnabled?: boolean;
  seedingList?: User[];
  onRenameMatch?: (roundIndex: number, matchIndex: number, matchId: string, name: string) => void;
  onUpdateTime?: (roundIndex: number, matchIndex: number, matchId: string, time: Moment) => void;
  onUpdateSlot?: (roundIndex: number, matchId: string, slotIndex: number, username: string, result?: number) => void;
}

const BattleGrid = ({ rounds, usersMap = new Map(), editingEnabled = false, seedingEnabled = false, seedingList = [], onRenameMatch, onUpdateTime, onUpdateSlot }: IBattleGridProps) => {
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
                      usersMap={usersMap}
                      editingEnabled={editingEnabled}
                      seedingEnabled={seedingEnabled}
                      seedingList={seedingList}
                      onRename={(matchIndex: number, matchId: string, name: string) => {
                        onRenameMatch && onRenameMatch(rounds[i].roundIndex, matchIndex, matchId, name);
                      }}
                      onUpdateTime={(matchIndex: number, matchId: string, time: Moment) => {
                        onUpdateTime && onUpdateTime(rounds[i].roundIndex, matchIndex, matchId, time);
                      }}
                      onUpdateSlot={(matchId: string, slotIndex: number, username: string, result?: number) => {
                        onUpdateSlot && onUpdateSlot(rounds[i].roundIndex, matchId, slotIndex, username, result);
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
