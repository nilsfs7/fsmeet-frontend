'use client';

import { MenuItem } from '@/types/menu-item';
import { User } from '@/types/user';
import Link from 'next/link';
import { imgClock, imgUserDefaultImg } from '@/domain/constants/images';
import moment, { Moment } from 'moment';
import { getTimeString } from '@/functions/time';
import ComboBox from '../common/ComboBox';
import { routeUsers } from '@/domain/constants/routes';
import ActionButton from '../common/ActionButton';
import { Action } from '@/domain/enums/action';
import { Size } from '@/domain/enums/size';
import { Match } from '@/types/match';

interface IMatchProps {
  match: Match;
  usersMap: Map<string, User>;
  showTime?: boolean;
  editingEnabled?: boolean;
  seedingEnabled?: boolean;
  seedingList?: User[];
  onUpdateTime?: (matchIndex: number, matchId: string, time: Moment | null) => void;
  onEditMatch?: (matchIndex: number) => void; // matchId: string
  onDeleteMatch?: (matchIndex: number) => void;
  onUpdateSlot?: (matchId: string, slotIndex: number, username: string, result: number) => void;
}

const MatchCard = ({ match, usersMap, showTime = false, editingEnabled = false, seedingEnabled = false, seedingList = [], onEditMatch, onDeleteMatch, onUpdateSlot }: IMatchProps) => {
  const playerMenu: MenuItem[] = [];
  playerMenu.push({ text: 'unassigned', value: '' });
  seedingList.map(user => {
    playerMenu.push({ text: `${user.firstName} ${user.lastName} (${user.username})`, value: user.username });
  });

  const handleSlotUpdateName = (slotIndex: number, username: string) => {
    if (match.id) {
      onUpdateSlot && onUpdateSlot(match.id, slotIndex, username, -1);
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
      {/* Header */}
      <div className={`${editingEnabled && 'mb-2'}`}>
        <div className={`flex justify-between items-center`}>
          <div className={`w-full flex ${editingEnabled ? 'justify-between' : 'justify-center'} items-center`}>
            <div className={`flex px-1 ${match.name.length === 0 ? 'bg-critical' : 'bg-transparent'}`}>{match.name}</div>
            {editingEnabled && (
              <div className="flex gap-1 justify-end w-fit">
                {onEditMatch && <ActionButton action={Action.EDIT} size={Size.S} onClick={() => onEditMatch(match.matchIndex)} />}
                {onDeleteMatch && <ActionButton action={Action.DELETE} size={Size.S} onClick={() => onDeleteMatch(match.matchIndex)} />}
              </div>
            )}

            {!editingEnabled && showTime && <div className="text-sm flex items-center">{match.time && getTimeString(moment(match.time).utc())}</div>}
          </div>
        </div>

        {editingEnabled && (
          <div className="flex items-center">
            <img src={imgClock} className="mx-1 h-4 w-4 rounded-full object-cover" />
            <div className="text-xs flex px-1">{match.time ? getTimeString(moment(match.time).utc()) : '--:--'} </div>{' '}
          </div>
        )}
      </div>

      <hr />

      {/* Slots */}
      <div className="mt-2">
        {[...Array(match.slots)].map((val: number, i: number) => {
          const matchSlot = match.matchSlots.filter(slot => {
            if (slot.slotIndex === i) return slot;
          })[0];

          const playerImage = (
            <img
              src={matchSlot?.name && usersMap?.get(matchSlot.name)?.imageUrl ? usersMap?.get(matchSlot.name)?.imageUrl : imgUserDefaultImg}
              className="h-full w-full rounded-full bg-zinc-200 object-cover"
            />
          );

          const playerName = (
            <div className="text-sm">{`${matchSlot?.name ? (usersMap?.get(matchSlot.name)?.firstName && usersMap?.get(matchSlot.name)?.lastName ? `${usersMap?.get(matchSlot.name)?.firstName} ${usersMap?.get(matchSlot.name)?.lastName}` : usersMap?.get(matchSlot.name)?.firstName || matchSlot?.name) : ''}`}</div>
          );

          return (
            <div key={`slot-${i}`} className="flex items-center justify-between">
              {!seedingEnabled && (
                <div className="flex w-full justify-between">
                  <div className="flex w-full items-center">
                    <div className="h-8 w-8 p-1">
                      {matchSlot?.name && <Link href={`${routeUsers}/${matchSlot.name}`}>{playerImage}</Link>}
                      {!matchSlot?.name && playerImage}
                    </div>

                    <div className="flex h-full w-32 items-center overflow-hidden text-ellipsis px-1">
                      {matchSlot?.name && <Link href={`${routeUsers}/${matchSlot.name}`}>{playerName}</Link>}
                      {!matchSlot?.name && playerName}
                    </div>
                  </div>

                  <div className="flex w-4 items-center justify-end text-base font-bold">{matchSlot && matchSlot.result != undefined && matchSlot.result >= 0 ? matchSlot.result : '-'}</div>
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
                    value={matchSlot && matchSlot.result != undefined && matchSlot.result >= 0 ? matchSlot.result : ''}
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
    </div>
  );
};

export default MatchCard;
