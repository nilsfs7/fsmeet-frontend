'use client';

import { MenuItem } from '@/domain/types/menu-item';
import { User } from '@/domain/types/user';
import Link from 'next/link';
import { imgUserDefaultImg } from '@/domain/constants/images';
import { IconClock } from '@tabler/icons-react';
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
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('global/components/battle-grid');
  const playerMenu: MenuItem[] = [];
  playerMenu.push({ text: t('labelUnassigned'), value: '' });
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

  // Higher result wins (same rule as the results export). Only highlight a unique winner once every slot has a result.
  const results = [...Array(match.slots)].map((_, i) => match.matchSlots.find(slot => slot.slotIndex === i)?.result);
  const complete = match.slots > 1 && results.every(r => r !== undefined && r >= 0);
  const best = complete ? Math.max(...(results as number[])) : null;
  const winnerIndex = best !== null && results.filter(r => r === best).length === 1 ? results.indexOf(best) : -1;

  return (
    <div
      className={cn(
        'group min-w-0 overflow-hidden rounded-2xl border border-border bg-background shadow-xs transition-colors',
        !editingEnabled && !seedingEnabled && 'hover:border-brand/40',
        isEditSingleSlot && 'border-amber-300/70 bg-amber-50/60 dark:border-amber-500/30 dark:bg-amber-500/5',
        match.isExtraMatch && 'border-dashed',
      )}
    >
      <div className="flex min-w-0 items-center justify-between gap-2 border-b border-border/60 bg-muted/30 px-3 py-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <span
            className={cn(
              'min-w-0 truncate text-xs font-semibold uppercase tracking-wide text-muted-foreground',
              match.name.length === 0 && 'rounded-md bg-destructive/10 px-1.5 py-0.5 text-destructive',
            )}
          >
            {match.name || '—'}
          </span>
          {match.isExtraMatch && (
            <span className="shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 text-2xs font-semibold text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">{t('labelExtraMatch')}</span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {(showTime || editingEnabled) && (
            <span className="inline-flex items-center gap-1 text-xs tabular-nums text-muted-foreground">
              <IconClock className="h-3.5 w-3.5" stroke={1.75} aria-hidden />
              {match.time ? getTimeString(moment(match.time).utc()) : '--:--'}
            </span>
          )}
          {editingEnabled && (
            <span className="ml-1 flex gap-1">
              {onEditMatch && <ActionButton action={Action.EDIT} size={Size.S} onClick={() => onEditMatch(match.matchIndex)} />}
              {onDeleteMatch && <ActionButton action={Action.DELETE} size={Size.S} onClick={() => onDeleteMatch(match.matchIndex)} />}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 p-2">
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
              <img src={usersMap?.get(matchSlot?.name)?.imageUrl ? usersMap?.get(matchSlot.name)?.imageUrl : imgUserDefaultImg} className="h-full w-full rounded-full bg-muted object-cover" alt="" />
            )
          ) : (
            <img src={imgUserDefaultImg} className="h-full w-full rounded-full bg-muted object-cover opacity-50" alt="" />
          );

          const playerNameText = matchSlot?.name
            ? usersMap?.get(matchSlot.name)?.firstName && usersMap?.get(matchSlot.name)?.lastName
              ? `${usersMap?.get(matchSlot.name)?.firstName} ${usersMap?.get(matchSlot.name)?.lastName}`
              : usersMap?.get(matchSlot.name)?.firstName || matchSlot?.name || ''
            : '';

          const hasResult = matchSlot && matchSlot.result != undefined && matchSlot.result >= 0;
          const isWinner = i === winnerIndex;

          return (
            <div key={`slot-${i}`} className="flex items-center justify-between">
              {!seedingEnabled && (
                <div className={cn('flex w-full min-w-0 items-center justify-between gap-2 rounded-xl px-1.5 py-1', isWinner && 'bg-brand-soft')}>
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
                    <div className="min-w-0 flex-1 overflow-hidden">
                      {matchSlot?.name ? (
                        <Link
                          className={cn('block truncate text-sm text-foreground no-underline hover:underline', isWinner && 'font-semibold text-brand-strong')}
                          href={`${routeUsers}/${matchSlot.name}`}
                        >
                          {playerNameText}
                        </Link>
                      ) : (
                        <span className="block truncate text-sm italic text-muted-foreground">{t('labelTbd')}</span>
                      )}
                    </div>
                  </div>

                  <div
                    className={cn(
                      'flex h-7 min-w-7 shrink-0 items-center justify-center rounded-lg px-1.5 text-sm font-semibold tabular-nums',
                      isWinner ? 'bg-brand text-brand-foreground' : hasResult ? 'bg-muted text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {hasResult ? matchSlot.result : '–'}
                  </div>
                </div>
              )}

              {seedingEnabled && (
                <div className="flex w-full min-w-0 items-stretch justify-between gap-2">
                  <ComboBox
                    className="w-full min-w-0"
                    menus={playerMenu}
                    value={matchSlot && matchSlot?.name ? matchSlot.name : ''}
                    searchEnabled={true}
                    label={t('labelAssignSlot')}
                    onChange={(value: any) => {
                      handleSlotUpdateName(i, value);
                    }}
                  />

                  <Input
                    className="h-9 w-16 shrink-0 text-right text-sm font-semibold tabular-nums"
                    id={`input-max-passing-${match.id}-${i}`}
                    aria-label={t('labelResult')}
                    placeholder="–"
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
