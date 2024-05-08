import { Match } from '@/types/match';
import { MenuItem } from '@/types/menu-item';
import { User } from '@/types/user';
import Link from 'next/link';
import { imgUserDefaultImg } from '@/types/consts/images';
import { useRouter } from 'next/router';
import moment, { Moment } from 'moment';
import { getTimeString } from '@/types/funcs/time';
import ComboBox from '../common/ComboBox';
// import dayjs from 'dayjs';
// import { TimePicker } from 'antd';
import { routeUsers } from '@/types/consts/routes';
import ActionButton from '../common/ActionButton';
import { Action } from '@/types/enums/action';
import { Size } from '@/types/enums/size';

interface IMatchProps {
  match: Match;
  usersMap: Map<string, User>;
  showTime?: boolean;
  editingEnabled?: boolean;
  seedingEnabled?: boolean;
  seedingList?: User[];
  onRename?: (matchIndex: number, matchId: string, name: string) => void;
  onUpdateTime?: (matchIndex: number, matchId: string, time: Moment | null) => void;
  onEditMatch?: (matchIndex: number) => void; // matchId: string
  onDeleteMatch?: (matchIndex: number) => void;
  onUpdateSlot?: (matchId: string, slotIndex: number, username: string, result?: number) => void;
}

const MatchCard = ({
  match,
  usersMap,
  showTime = false,
  editingEnabled = false,
  seedingEnabled = false,
  seedingList = [],
  onRename,
  onUpdateTime,
  onEditMatch,
  onDeleteMatch,
  onUpdateSlot,
}: IMatchProps) => {
  const router = useRouter();
  const self = `${router.asPath}`;

  const playerMenu: MenuItem[] = [];
  playerMenu.push({ text: 'unassigned', value: '' });
  seedingList.map((user) => {
    playerMenu.push({ text: user.username, value: user.username });
  });

  // const handleRename = (name: string) => {
  //   if (match.id) {
  //     onRename && onRename(match.matchIndex, match.id, name);
  //   } else {
  //     console.error('unknown match id');
  //   }
  // };

  const handleUpdateTime = (time: Moment | null) => {
    if (match.id) {
      onUpdateTime && onUpdateTime(match.matchIndex, match.id, time);
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
        onUpdateSlot && onUpdateSlot(match.id, slotIndex, username, -1);
        console.error('cannot set result for unknown player');
      }
    } else {
      console.error('unknown match id');
    }
  };

  return (
    <div className={`rounded-lg border border-secondary-dark ${!editingEnabled || match.slots > 1 ? 'bg-secondary-light' : 'bg-warning'} p-2`}>
      {/* Header */}
      <div className={`flex justify-between items-center ${editingEnabled && 'mb-2 gap-2'} `}>
        <div className={`w-full flex ${editingEnabled ? 'justify-between' : 'justify-center'} items-center`}>
          <div className={`flex px-1 ${match.name.length === 0 ? 'bg-critical' : 'bg-transparent'}`}>{match.name}</div>
          {editingEnabled && (
            <div className="flex gap-1 justify-end w-fit">
              {onEditMatch && <ActionButton action={Action.EDIT} size={Size.S} onClick={() => onEditMatch(match.matchIndex)} />}
              {onDeleteMatch && <ActionButton action={Action.DELETE} size={Size.S} onClick={() => onDeleteMatch(match.matchIndex)} />}

              {/* <div className="w-full flex items-center py-1"> */}
              {/* Todo: enable time picker again: requires diabling babel transpilation. or built own time picker -> remove antd */}

              {/* <TimePicker
              value={match.time !== undefined ? dayjs(match.time) : undefined}
              format={'HH:mm'}
              onChange={value => {
                if (value) {
                  const date = moment(value.toDate());
                  if (date && moment.isMoment(date)) {
                    handleUpdateTime(date);
                  }
                } else {
                  handleUpdateTime(null);
                }
              }}
            /> */}
              {/* </div> */}
            </div>
          )}
          {!editingEnabled && showTime && <div className="text-sm flex items-center">{match.time && getTimeString(moment(match.time))}</div>}
        </div>
      </div>

      <hr />

      {/* Slots */}
      <div className="mt-2">
        {[...Array(match.slots)].map((val: number, i: number) => {
          const matchSlot = match.matchSlots.filter((slot) => {
            if (slot.slotIndex === i) return slot;
          })[0];

          return (
            <div key={`slot-${i}`} className="flex items-center justify-between">
              {!seedingEnabled && (
                <div className="flex w-full justify-between">
                  <div className="flex w-full items-center">
                    <div className="h-8 w-8 p-1">
                      <Link href={matchSlot?.name ? `${routeUsers}/${matchSlot.name}` : self}>
                        <img
                          src={matchSlot?.name && usersMap?.get(matchSlot.name)?.imageUrl ? usersMap?.get(matchSlot.name)?.imageUrl : imgUserDefaultImg}
                          className="h-full w-full rounded-full bg-zinc-200 object-cover"
                        />
                      </Link>
                    </div>

                    <div className="flex h-full w-32 items-center overflow-hidden text-ellipsis px-1">
                      <Link href={matchSlot?.name ? `${routeUsers}/${matchSlot.name}` : self}>
                        <div className="text-sm">{`${matchSlot?.name ? matchSlot.name : ''}`}</div>
                      </Link>
                    </div>
                  </div>

                  <div className="flex w-4 items-center justify-end text-base font-bold">{matchSlot && matchSlot.result != undefined && matchSlot.result >= 0 ? matchSlot.result : '--'}</div>
                </div>
              )}

              {seedingEnabled && (
                <div className={`flex w-full justify-between ${i > 0 ? 'mt-1' : ''} gap-1`}>
                  <ComboBox
                    className="w-full"
                    menus={playerMenu}
                    value={matchSlot && matchSlot?.name ? matchSlot.name : ''}
                    searchEnabled={true}
                    label={'Assign slot'}
                    onChange={(value: any) => {
                      handleSlotUpdateName(i, value);
                    }}
                  />

                  <input
                    className="flex bg-transparent text-right border-secondary-dark border rounded-md hover:border-primary"
                    id={`input-max-passing-${match.id}-${i}`}
                    type="number"
                    min={-1}
                    max={99}
                    value={matchSlot && matchSlot.result != undefined && matchSlot.result >= 0 ? matchSlot.result : undefined}
                    onChange={(e) => {
                      handleSlotUpdateResult(i, matchSlot?.name, e.currentTarget.valueAsNumber);
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MatchCard;
