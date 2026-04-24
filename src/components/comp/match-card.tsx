'use client';

import { MenuItem } from '@/domain/types/menu-item';
import { User } from '@/domain/types/user';
import Link from 'next/link';
import { imgClock, imgUserDefaultImg } from '@/domain/constants/images';
import moment, { Moment } from 'moment';
import { getTimeString } from '@/functions/time';
import ComboBox from '../common/combo-box';
import { routeUsers } from '@/domain/constants/routes';
import ActionButton from '../common/action-button';
import { Action } from '@/domain/enums/action';
import { Size } from '@/domain/enums/size';
import { Match } from '@/domain/types/match';
import ReactCountryFlag from 'react-country-flag';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const cardSurface = cn(
  'group min-w-0 overflow-hidden rounded-xl border border-border/60',
  'bg-secondary-light/85 shadow-xs backdrop-blur-sm',
  'supports-[backdrop-filter]:bg-secondary-light/70',
  'transition-all duration-200',
  'hover:border-primary/50 hover:shadow-md',
  'dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50 dark:hover:border-primary/40',
);

interface IMatchProps {
  match: Match;
  usersMap: Map<string, User>;
  showTime?: boolean;
  editingEnabled?: boolean;
  seedingEnabled?: boolean;
  showUserCountryFlag?: boolean;
  onUpdateTime?: (matchIndex: number, matchId: string, time: Moment | null) => void;
  onEditMatch?: (matchIndex: number) => void; // matchId: string
  onDeleteMatch?: (matchIndex: number) => void;
  onUpdateSlot?: (matchId: string, slotIndex: number, username: string, result: number) => void;
}

const MatchCard = ({ match, usersMap, showTime = false, editingEnabled = false, seedingEnabled = false, showUserCountryFlag = false, onEditMatch, onDeleteMatch, onUpdateSlot }: IMatchProps) => {
  const playerMenu: MenuItem[] = [];
  playerMenu.push({ text: 'unassigned', value: '' });
  usersMap.forEach(user => {
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
        onUpdateSlot && onUpdateSlot(match.id, slotIndex, username, !Number.isNaN(result) ? result : -1);
      } else {
        console.error('cannot set result for unknown player');
      }
    } else {
      console.error('unknown match id');
    }
  };

  const isEditSingleSlot = editingEnabled && match.slots === 1;

  return (
    <div
      className={cn(
        cardSurface,
        isEditSingleSlot && 'border-warning/50 bg-warning/20 supports-[backdrop-filter]:bg-warning/15 dark:border-warning/40 dark:bg-warning/10 dark:supports-[backdrop-filter]:bg-warning/10',
      )}
    >
      <div className="p-2.5 sm:p-3">
        <div className={cn('min-w-0', editingEnabled && 'mb-2')}>
          <div
            className={cn(
              'flex w-full min-w-0 items-center gap-2',
              !editingEnabled && !showTime && 'justify-center',
              (editingEnabled || showTime) && 'justify-between',
            )}
          >
            <div
              className={cn(
                'type-body-sm min-w-0 font-medium text-foreground',
                !editingEnabled && !showTime && 'text-center',
                !editingEnabled && showTime && 'flex-1',
                match.name.length === 0 && 'rounded-md border border-destructive/50 bg-destructive/10 px-1.5 py-0.5 text-destructive dark:border-destructive/40 dark:bg-destructive/15',
              )}
            >
              {match.name}
            </div>
            {editingEnabled && (
              <div className="flex w-fit shrink-0 gap-1">
                {onEditMatch && <ActionButton action={Action.EDIT} size={Size.S} onClick={() => onEditMatch(match.matchIndex)} />}
                {onDeleteMatch && <ActionButton action={Action.DELETE} size={Size.S} onClick={() => onDeleteMatch(match.matchIndex)} />}
              </div>
            )}
            {!editingEnabled && showTime && (
              <div className="shrink-0 type-body-sm tabular-nums text-muted-foreground">{match.time && getTimeString(moment(match.time).utc())}</div>
            )}
          </div>

          {editingEnabled && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center [&>img]:h-full [&>img]:w-full [&>img]:object-contain">
                <img src={imgClock} alt="" />
              </div>
              <div className="type-body-sm tabular-nums text-foreground/90">
                {match.time ? getTimeString(moment(match.time).utc()) : '--:--'}
              </div>
            </div>
          )}
        </div>

        <div className="mt-2 border-t border-border/50 pt-2.5 sm:pt-3">
        {[...Array(match.slots)].map((val: number, i: number) => {
          const matchSlot = match.matchSlots.filter(slot => {
            if (slot.slotIndex === i) return slot;
          })[0];

          const playerImage = matchSlot?.name ? (
            showUserCountryFlag ? (
              <ReactCountryFlag
                className="w-full h-full"
                countryCode={usersMap?.get(matchSlot?.name)?.countryCode || ''}
                svg
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '9999px',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <img
                src={usersMap?.get(matchSlot?.name)?.imageUrl ? usersMap?.get(matchSlot.name)?.imageUrl : imgUserDefaultImg}
                className="h-full w-full rounded-full bg-muted object-cover"
                alt=""
              />
            )
          ) : (
            <img src={imgUserDefaultImg} className="h-full w-full rounded-full bg-muted object-cover" alt="" />
          );

          const playerNameText = matchSlot?.name
            ? usersMap?.get(matchSlot.name)?.firstName && usersMap?.get(matchSlot.name)?.lastName
              ? `${usersMap?.get(matchSlot.name)?.firstName} ${usersMap?.get(matchSlot.name)?.lastName}`
              : usersMap?.get(matchSlot.name)?.firstName || matchSlot?.name || ''
            : '';

          return (
            <div key={`slot-${i}`} className={cn('flex items-center justify-between', i > 0 && 'mt-1.5')}>
              {!seedingEnabled && (
                <div className="flex w-full min-w-0 items-center justify-between gap-2">
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full">
                      {matchSlot?.name ? (
                        <Link className="block h-full w-full" href={`${routeUsers}/${matchSlot.name}`}>
                          {playerImage}
                        </Link>
                      ) : (
                        playerImage
                      )}
                    </div>
                    <div className="min-w-0 flex-1 items-center overflow-hidden text-ellipsis">
                      {matchSlot?.name ? (
                        <Link
                          className="type-body-sm min-w-0 truncate text-foreground/90 no-underline hover:underline"
                          href={`${routeUsers}/${matchSlot.name}`}
                        >
                          {playerNameText}
                        </Link>
                      ) : (
                        <span className="type-body-sm min-w-0 text-foreground/90">{playerNameText}</span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 min-w-[1.5ch] text-right text-base font-semibold tabular-nums text-foreground">
                    {matchSlot && matchSlot.result != undefined && matchSlot.result >= 0 ? matchSlot.result : '-'}
                  </div>
                </div>
              )}

              {seedingEnabled && (
                <div className={cn('flex w-full min-w-0 items-stretch justify-between gap-2', i > 0 && 'mt-1')}>
                  <ComboBox
                    className="w-full min-w-0"
                    menus={playerMenu}
                    value={matchSlot && matchSlot?.name ? matchSlot.name : ''}
                    searchEnabled={true}
                    label={'Assign slot'}
                    onChange={(value: any) => {
                      handleSlotUpdateName(i, value);
                    }}
                  />

                  <Input
                    className={cn(
                      'h-9 w-[4.5rem] shrink-0 text-right text-sm font-medium tabular-nums',
                      'border-border/60 bg-background/80 shadow-sm hover:border-primary/50 dark:bg-background/50',
                    )}
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
    </div>
  );
};

export default MatchCard;
