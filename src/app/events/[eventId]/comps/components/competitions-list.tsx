'use client';

import { useRef, useState } from 'react';
import { IconGripVertical } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { toast, Toaster } from 'sonner';
import ActionButton from '@/components/common/action-button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { routeEvents } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { Competition } from '@/domain/types/competition';
import { compareByIndex } from '@/functions/compare-by-index';
import { updateCompetitionOrder } from '@/infrastructure/clients/competition.client';
import { cn } from '@/lib/utils';

interface CompetitionsListProps {
  eventId: string;
  competitions: Competition[];
}

function moveItem<T>(items: T[], from: number, to: number) {
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export const CompetitionsList = ({ eventId, competitions }: CompetitionsListProps) => {
  const t = useTranslations('/events/eventid/comps');
  const { data: session } = useSession();
  const [items, setItems] = useState(() => [...competitions].sort(compareByIndex));
  const [isSaving, setIsSaving] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const dragFrom = useRef<number | null>(null);

  const reorder = async (from: number, to: number) => {
    if (from === to || isSaving || from < 0 || to < 0 || from >= items.length || to >= items.length) return;

    const previous = items;
    const next = moveItem(items, from, to).map((competition, index) => ({ ...competition, index }));
    setItems(next);
    setIsSaving(true);

    try {
      await updateCompetitionOrder(
        eventId,
        next.flatMap(competition => (competition.id ? [competition.id] : [])),
        session,
      );
    } catch (error: unknown) {
      setItems(previous);
      const message = error instanceof Error && error.message ? error.message : t('toastReorderFailed');
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const clearDrag = () => {
    dragFrom.current = null;
    setDraggingIndex(null);
    setDropIndex(null);
  };

  return (
    <>
      <Toaster richColors />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <span className="sr-only">{t('tooltipDragCompetition')}</span>
            </TableHead>
            <TableHead>{t('tableColName')}</TableHead>
            <TableHead className="w-[1%] whitespace-nowrap text-right">{t('tableColActions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="py-6 text-center text-muted-foreground">
                {t('textNoCompetitions')}
              </TableCell>
            </TableRow>
          ) : (
            items.map((comp, index) => (
              <TableRow
                key={comp.id ?? index}
                onDragOver={event => {
                  event.preventDefault();
                  if (dragFrom.current != null) setDropIndex(index);
                }}
                onDrop={event => {
                  event.preventDefault();
                  const from = dragFrom.current;
                  clearDrag();
                  if (from != null) void reorder(from, index);
                }}
                className={cn(dropIndex === index && draggingIndex !== index && 'bg-secondary-light', draggingIndex === index && 'opacity-60')}
              >
                <TableCell className="w-10 pr-0">
                  <button
                    type="button"
                    draggable={!isSaving}
                    aria-label={t('tooltipDragCompetition')}
                    title={t('tooltipDragCompetition')}
                    className="inline-flex h-10 w-10 cursor-grab items-center justify-center rounded-lg text-muted-foreground active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isSaving || items.length < 2}
                    onDragStart={event => {
                      dragFrom.current = index;
                      setDraggingIndex(index);
                      event.dataTransfer.effectAllowed = 'move';
                      event.dataTransfer.setData('text/plain', String(index));
                    }}
                    onDragEnd={clearDrag}
                  >
                    <IconGripVertical className="h-5 w-5" stroke={2} />
                  </button>
                </TableCell>
                <TableCell className="min-w-0">
                  <div className="wrap-break-word font-medium">{comp.name}</div>
                  <div className="text-xs capitalize text-muted-foreground">
                    {comp.type.replaceAll('_', ' ')} · {comp.gender}
                  </div>
                </TableCell>
                <TableCell className="w-[1%] text-right">
                  <div className="grid grid-cols-[repeat(2,auto)] justify-items-end gap-1 sm:grid-cols-[repeat(4,auto)]">
                    <ActionButton href={`${routeEvents}/${eventId}/comps/${comp.id}/edit`} action={Action.EDIT} tooltip={t('btnEdit')} />
                    <ActionButton href={`${routeEvents}/${eventId}/comps/${comp.id}/edit/pool`} action={Action.MANAGE_USERS} tooltip={t('btnPool')} />
                    <ActionButton href={`${routeEvents}/${eventId}/comps/${comp.id}/edit/mode`} action={Action.MANAGE_GAME_MODE} tooltip={t('btnGameMode')} />
                    <ActionButton href={`${routeEvents}/${eventId}/comps/${comp.id}/edit/seeding`} action={Action.MANAGE_SEEDING} tooltip={t('btnSeedingAndResults')} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}
