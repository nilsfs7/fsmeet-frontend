import { Match } from '@/types/match';
import Dropdown from '../common/Dropdown';
import { MenuItem } from '@/types/menu-item';
import { User } from '@/types/user';

interface IMatchProps {
  match: Match;
  editingEnabled?: boolean;
  seedingEnabled?: boolean;
  seedingList?: User[];
  onRename?: (matchIndex: number, matchId: string, name: string) => void;
  onUpdateSlot?: (matchId: string, slotIndex: number, username: string, result?: number) => void;
}

const MatchCard = ({ match, editingEnabled = false, seedingEnabled = false, seedingList = [], onRename, onUpdateSlot }: IMatchProps) => {
  const playerMenu: MenuItem[] = [];
  playerMenu.push({ text: 'not set', value: '' });
  seedingList.map(user => {
    playerMenu.push({ text: user.username, value: user.username });
  });

  const handleRename = (name: string) => {
    if (match.id) {
      onRename && onRename(match.matchIndex, match.id, name);
    } else {
      console.error('unknown match id');
    }
  };

  const handleSlotUpdateName = (slotIndex: number, username: string) => {
    if (match.id) {
      onUpdateSlot && onUpdateSlot(match.id, slotIndex, username);
    } else {
      console.error('unknown match id');
    }
  };

  const handleSlotUpdateResult = (slotIndex: number, username: string, result: number) => {
    if (match.id) {
      if (username) {
        onUpdateSlot && onUpdateSlot(match.id, slotIndex, username, result);
      } else {
        console.error('cannot set result for unknown player');
      }
    } else {
      console.error('unknown match id');
    }
  };

  return (
    <div className={`rounded-lg border border-secondary-dark ${!editingEnabled || match.slots > 1 ? 'bg-secondary-light' : 'bg-warning'} p-2`}>
      <input
        className={`w-full rounded-lg text-center ${match.name.length === 0 ? 'bg-critical' : 'bg-transparent'}`}
        defaultValue={match.name}
        disabled={!editingEnabled}
        onChange={e => {
          handleRename(e.currentTarget.value);
        }}
      />
      <hr />
      {[...Array(match.slots)].map((val: number, i: number) => {
        const matchSlot = match.matchSlots.filter(slot => {
          if (slot.slotIndex === i) return slot;
        })[0];

        return (
          <div key={`slot-${i}`} className="flex items-center justify-between">
            {!seedingEnabled && (
              <div className="flex w-full justify-between">
                <div>{matchSlot && matchSlot.name !== playerMenu[0].value ? matchSlot.name : `Slot ${i + 1}`}</div>
                <div>{matchSlot && matchSlot.result ? matchSlot.result : '--'}</div>
              </div>
            )}

            {seedingEnabled && (
              <div className="flex w-full justify-between">
                <Dropdown
                  menus={playerMenu}
                  value={matchSlot && matchSlot.name ? matchSlot.name : 'not set'}
                  onChange={(value: any) => {
                    handleSlotUpdateName(i, value);
                  }}
                />

                <input
                  className="flex w-full bg-transparent text-right"
                  id={`input-max-passing-${i}`}
                  type="number"
                  min={0}
                  value={matchSlot && matchSlot.result ? matchSlot.result : 0}
                  onChange={e => {
                    handleSlotUpdateResult(i, matchSlot?.name, e.currentTarget.valueAsNumber);
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MatchCard;
