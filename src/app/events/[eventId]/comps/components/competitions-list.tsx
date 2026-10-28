'use client';

import { useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { IconAlertTriangle, IconCircleCheck, IconGripVertical, IconPencil, IconScoreboard, IconTournament, IconUsers } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { toast, Toaster } from 'sonner';
import { Button } from '@/components/ui/button';
import { AppDataStateEmpty } from '@/components/shared/app-data-state-empty';
import { routeEvents } from '@/domain/constants/routes';
import { MaxAge } from '@/domain/enums/max-age';
import { Competition } from '@/domain/types/competition';
import { compareByIndex } from '@/functions/compare-by-index';
import { PoolCounts } from '@/functions/competition-pool';
import { updateCompetitionOrder } from '@/infrastructure/clients/competition.client';
import { cn } from '@/lib/utils';

interface CompetitionsListProps {
  eventId: string;
  competitions: Competition[];
  /** `null` when sign-ups or the pool could not be loaded for that competition. */
  poolCounts: Record<string, PoolCounts | null>;
}

const cardSurface = cn(
  'min-w-0 rounded-xl border border-border/60 bg-secondary-light/85 shadow-xs backdrop-blur-xs',
  'supports-backdrop-filter:bg-secondary-light/70',
  'dark:border-border/50 dark:bg-background/60 dark:supports-backdrop-filter:bg-background/50',
);

const secondaryActionClassName = 'h-9 gap-1.5 rounded-lg border-border/60 px-3';

function moveItem<T>(items: T[], from: number, to: number) {
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function Stat({ label, value, tone = 'default' }: { label: string; value: number; tone?: 'default' | 'warning' }) {
  return (
    <div className={cn('flex min-w-0 flex-col rounded-lg border px-3 py-2', tone === 'warning' ? 'border-warning/50 bg-warning/10' : 'border-border/60 bg-background/60')}>
      <span className="text-lg font-semibold leading-tight tabular-nums">{value}</span>
      <span className="truncate text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function StatusNote({ icon, children, tone }: { icon: ReactNode; children: ReactNode; tone: 'warning' | 'success' }) {
  return (
    <p className={cn('flex items-start gap-1.5 text-xs', tone === 'warning' ? 'text-amber-700 dark:text-amber-400' : 'text-success')}>
      <span className="mt-px shrink-0">{icon}</span>
      <span>{children}</span>
    </p>
  );
}

export const CompetitionsList = ({ eventId, competitions, poolCounts }: CompetitionsListProps) => {
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

  if (items.length === 0) {
    return (
      <div className="flex justify-center py-6">
        <AppDataStateEmpty title={t('textNoCompetitions')} description={t('textNoCompetitionsDescription')}>
          <Button asChild variant="action" className="mt-2 rounded-lg">
            <Link href={`${routeEvents}/${eventId}/comps/create`}>{t('btnCreate')}</Link>
          </Button>
        </AppDataStateEmpty>
      </div>
    );
  }

  return (
    <>
      <Toaster richColors />
      <ol className="flex flex-col gap-3">
        {items.map((comp, index) => {
          const counts = comp.id ? poolCounts[comp.id] : null;
          const compBase = `${routeEvents}/${eventId}/comps/${comp.id}`;
          const meta = [comp.type.replaceAll('_', ' '), comp.gender, comp.maxAge !== MaxAge.NONE ? t('labelMaxAge', { age: comp.maxAge }) : null].filter(Boolean).join(' · ');

          return (
            <li
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
              className={cn(cardSurface, 'p-3 sm:p-4', dropIndex === index && draggingIndex !== index && 'border-primary/60', draggingIndex === index && 'opacity-60')}
            >
              <div className="flex min-w-0 items-start gap-2">
                <button
                  type="button"
                  draggable={!isSaving}
                  aria-label={t('tooltipDragCompetition')}
                  title={t('tooltipDragCompetition')}
                  className="-ml-1 inline-flex h-9 w-8 shrink-0 cursor-grab items-center justify-center rounded-lg text-muted-foreground active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40"
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

                <div className="min-w-0 flex-1">
                  <h2 className="wrap-break-word text-base font-semibold leading-snug">{comp.name}</h2>
                  <p className="text-xs capitalize text-muted-foreground">{meta}</p>
                </div>
              </div>

              {counts && (
                <div className="mt-3 flex flex-col gap-2">
                  <div className="grid grid-cols-3 gap-2">
                    <Stat label={t('statSignedUp')} value={counts.signedUp} />
                    <Stat label={t('statPool')} value={counts.inPool} />
                    <Stat label={t('statNotAdded')} value={counts.signedUpNotInPool} tone={counts.signedUpNotInPool > 0 ? 'warning' : 'default'} />
                  </div>

                  {counts.inPoolWithoutSignUp > 0 && (
                    <StatusNote tone="warning" icon={<IconAlertTriangle className="h-4 w-4" stroke={2} aria-hidden />}>
                      {t('noteWithoutSignUp', { count: counts.inPoolWithoutSignUp })}
                    </StatusNote>
                  )}
                  {counts.signedUpNotInPool > 0 && (
                    <StatusNote tone="warning" icon={<IconAlertTriangle className="h-4 w-4" stroke={2} aria-hidden />}>
                      {t('noteMissingSignUps', { count: counts.signedUpNotInPool })}
                    </StatusNote>
                  )}
                  {counts.signedUp > 0 && counts.signedUpNotInPool === 0 && counts.inPoolWithoutSignUp === 0 && (
                    <StatusNote tone="success" icon={<IconCircleCheck className="h-4 w-4" stroke={2} aria-hidden />}>
                      {t('notePoolComplete')}
                    </StatusNote>
                  )}
                </div>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                <Button asChild variant="action" size="sm" className="h-9 gap-1.5 rounded-lg px-3">
                  <Link href={`${compBase}/edit/pool`}>
                    <IconUsers className="h-4 w-4" stroke={2} aria-hidden />
                    {counts ? t('btnPoolWithCount', { count: counts.inPool }) : t('btnPool')}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className={secondaryActionClassName}>
                  <Link href={`${compBase}/edit`}>
                    <IconPencil className="h-4 w-4" stroke={2} aria-hidden />
                    {t('btnEdit')}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className={secondaryActionClassName}>
                  <Link href={`${compBase}/edit/mode`}>
                    <IconTournament className="h-4 w-4" stroke={2} aria-hidden />
                    {t('btnGameMode')}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className={secondaryActionClassName}>
                  <Link href={`${compBase}/edit/seeding`}>
                    <IconScoreboard className="h-4 w-4" stroke={2} aria-hidden />
                    {t('btnSeedingAndResults')}
                  </Link>
                </Button>
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
};
