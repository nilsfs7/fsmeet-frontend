'use client';

import type { Round } from '@/domain/types/round';
import MatchCard from './match-card';
import { User } from '@/domain/types/user';
import { Moment } from 'moment';
import ActionButton from '../common/action-button';
import { Action } from '@/domain/enums/action';
import { Size } from '@/domain/enums/size';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { RoundHeader } from './round-header';
import { useTranslations } from 'next-intl';

interface IBattleGridProps {
  rounds: Round[];
  usersMap?: Map<string, User>;
  editingEnabled?: boolean;
  seedingEnabled?: boolean;
  showUserCountryFlag?: boolean;
  onDeleteRound?: (roundIndex: number, name: string) => void;
  onAddMatch?: (roundIndex: number) => void;
  onEditRound?: (roundIndex: number) => void;
  onUpdateTime?: (roundIndex: number, matchIndex: number, matchId: string, time: Moment | null) => void;
  onEditMatch?: (roundIndex: number, matchIndex: number) => void;
  onDeleteMatch?: (roundIndex: number, matchIndex: number) => void;
  onUpdateSlot?: (roundIndex: number, matchId: string, slotIndex: number, username: string, result: number) => void;
}

const BattleGrid = ({
  rounds,
  usersMap = new Map<string, User>(),
  editingEnabled = false,
  seedingEnabled = false,
  showUserCountryFlag = false,
  onDeleteRound,
  onAddMatch,
  onEditRound,
  onUpdateTime,
  onEditMatch,
  onDeleteMatch,
  onUpdateSlot,
}: IBattleGridProps) => {
  const t = useTranslations('global/components/battle-grid');

  return (
    <div className="flex w-max min-w-full gap-3 pb-2">
      {rounds.map((round: Round, i: number) => {
        const editing = editingEnabled || seedingEnabled;
        return (
          <div key={`rnd-${round.roundIndex}`} className={cn('flex shrink-0 flex-col', seedingEnabled ? 'w-72' : 'w-60')}>
            <div className="mb-2 rounded-2xl border border-border bg-background px-3 py-2.5 shadow-xs">
              <RoundHeader
                round={round}
                actions={
                  (onEditRound || onDeleteRound) && (
                    <>
                      {onEditRound && <ActionButton action={Action.EDIT} size={Size.S} onClick={() => onEditRound(round.roundIndex)} />}
                      {onDeleteRound && <ActionButton action={Action.DELETE} size={Size.S} onClick={() => onDeleteRound(round.roundIndex, round.name)} />}
                    </>
                  )
                }
              />
            </div>

            <div className={cn('flex flex-1 flex-col gap-2', !editing && 'justify-around')}>
              {round.matches.map((match, j) => {
                return (
                  <MatchCard
                    key={`match-${j}`}
                    match={match}
                    usersMap={usersMap}
                    editingEnabled={editingEnabled}
                    seedingEnabled={seedingEnabled}
                    showUserCountryFlag={showUserCountryFlag}
                    onUpdateTime={(matchIndex: number, matchId: string, time: Moment | null) => {
                      onUpdateTime && onUpdateTime(rounds[i].roundIndex, matchIndex, matchId, time);
                    }}
                    onEditMatch={(matchIndex: number) => {
                      onEditMatch && onEditMatch(round.roundIndex, matchIndex);
                    }}
                    onDeleteMatch={(matchIndex: number) => {
                      onDeleteMatch && onDeleteMatch(round.roundIndex, matchIndex);
                    }}
                    onUpdateSlot={(matchId: string, slotIndex: number, username: string, result: number) => {
                      onUpdateSlot && onUpdateSlot(rounds[i].roundIndex, matchId, slotIndex, username, result);
                    }}
                  />
                );
              })}

              {editingEnabled && onAddMatch && (
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 w-full rounded-2xl border-dashed text-muted-foreground hover:border-brand/50 hover:text-brand-strong"
                  onClick={() => onAddMatch(round.roundIndex)}
                >
                  <IconPlus className="h-4 w-4" stroke={2} aria-hidden />
                  {t('btnAddMatch')}
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BattleGrid;
