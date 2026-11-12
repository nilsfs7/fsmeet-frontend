'use client';

import type { Round } from '@/domain/types/round';
import MatchCard from './match-card';
import { User } from '@/domain/types/user';
import { Moment } from 'moment';
import ActionButton from '../common/action-button';
import { Action } from '@/domain/enums/action';
import { Size } from '@/domain/enums/size';
import { Button } from '@/components/ui/button';
import { IconChevronDown, IconChevronUp, IconGripVertical, IconPlus } from '@tabler/icons-react';
import { useState, type DragEvent } from 'react';
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
  /** Enables reordering matches within a round (drag & drop plus up/down buttons). `to` is the new position in the round. */
  onMoveMatch?: (roundIndex: number, from: number, to: number) => void;
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
  onMoveMatch,
}: IBattleGridProps) => {
  const t = useTranslations('global/components/battle-grid');
  const reorderEnabled = editingEnabled && !!onMoveMatch;
  const [drag, setDrag] = useState<{ round: number; from: number } | null>(null);
  // Insertion point while dragging: the match will be placed before this position.
  const [dropAt, setDropAt] = useState<{ round: number; before: number } | null>(null);

  const endDrag = () => {
    setDrag(null);
    setDropAt(null);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, roundIndex: number, position: number) => {
    if (!drag || drag.round !== roundIndex) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const rect = e.currentTarget.getBoundingClientRect();
    const before = e.clientY < rect.top + rect.height / 2 ? position : position + 1;
    if (dropAt?.round !== roundIndex || dropAt.before !== before) setDropAt({ round: roundIndex, before });
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, roundIndex: number) => {
    e.preventDefault();
    if (drag && dropAt && drag.round === roundIndex && onMoveMatch) {
      const to = dropAt.before > drag.from ? dropAt.before - 1 : dropAt.before;
      if (to !== drag.from) onMoveMatch(roundIndex, drag.from, to);
    }
    endDrag();
  };

  return (
    <div className="flex w-max min-w-full gap-3 pb-2">
      {rounds.map((round: Round, i: number) => {
        const editing = editingEnabled || seedingEnabled;
        return (
          <div key={`rnd-${round.roundIndex}`} className={cn('flex shrink-0 flex-col', seedingEnabled ? 'w-72' : reorderEnabled ? 'w-80' : 'w-60')}>
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
                const card = (
                  <MatchCard
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

                if (!reorderEnabled || round.matches.length < 2) {
                  return <div key={`match-${j}`}>{card}</div>;
                }

                const isDragged = drag?.round === round.roundIndex && drag.from === j;
                const showLineBefore = dropAt?.round === round.roundIndex && dropAt.before === j && drag && drag.from !== j && drag.from !== j - 1;
                const showLineAfter = dropAt?.round === round.roundIndex && dropAt.before === j + 1 && j === round.matches.length - 1 && drag && drag.from !== j;

                return (
                  <div
                    key={`match-${j}`}
                    draggable
                    onDragStart={e => {
                      e.dataTransfer.effectAllowed = 'move';
                      e.dataTransfer.setData('text/plain', String(j));
                      setDrag({ round: round.roundIndex, from: j });
                    }}
                    onDragOver={e => handleDragOver(e, round.roundIndex, j)}
                    onDrop={e => handleDrop(e, round.roundIndex)}
                    onDragEnd={endDrag}
                    className={cn('relative flex items-stretch gap-1', isDragged && 'opacity-40')}
                    data-testid="reorderable-match"
                  >
                    {showLineBefore && <span className="pointer-events-none absolute -top-1.5 left-0 right-0 h-1 rounded-full bg-brand" aria-hidden />}
                    {showLineAfter && <span className="pointer-events-none absolute -bottom-1.5 left-0 right-0 h-1 rounded-full bg-brand" aria-hidden />}

                    <div className="flex w-7 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl border border-border bg-background py-1 shadow-xs">
                      <button
                        type="button"
                        className="flex h-7 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                        disabled={j === 0}
                        aria-label={t('btnMoveMatchUp', { name: match.name })}
                        title={t('btnMoveMatchUp', { name: match.name })}
                        onClick={() => onMoveMatch && onMoveMatch(round.roundIndex, j, j - 1)}
                      >
                        <IconChevronUp className="h-4 w-4" stroke={2} aria-hidden />
                      </button>
                      <span className="flex h-6 w-6 cursor-grab items-center justify-center text-muted-foreground active:cursor-grabbing" title={t('labelDragToReorder')} aria-hidden>
                        <IconGripVertical className="h-4 w-4" stroke={1.75} />
                      </span>
                      <button
                        type="button"
                        className="flex h-7 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                        disabled={j === round.matches.length - 1}
                        aria-label={t('btnMoveMatchDown', { name: match.name })}
                        title={t('btnMoveMatchDown', { name: match.name })}
                        onClick={() => onMoveMatch && onMoveMatch(round.roundIndex, j, j + 1)}
                      >
                        <IconChevronDown className="h-4 w-4" stroke={2} aria-hidden />
                      </button>
                    </div>

                    <div className="min-w-0 flex-1">{card}</div>
                  </div>
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
