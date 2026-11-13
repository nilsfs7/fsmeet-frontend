'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { IconCheck, IconExternalLink, IconPencil, IconScoreboard, IconTournament, IconUsers, type Icon } from '@tabler/icons-react';
import { routeEvents } from '@/domain/constants/routes';
import { getCompetitionParticipants, getRounds } from '@/infrastructure/clients/competition.client';
import { cn } from '@/lib/utils';

export type CompWorkflowStep = 'details' | 'pool' | 'mode' | 'seeding';

interface CompWorkflowStepsProps {
  eventId: string;
  compId: string;
  current: CompWorkflowStep;
  /** Bump to re-read pool / rounds after a change on the current page. */
  refreshKey?: number;
}

/** Organizer step navigation shared by the competition management pages: details → pool → game mode → seeding & results. */
export function CompWorkflowSteps({ eventId, compId, current, refreshKey = 0 }: CompWorkflowStepsProps) {
  const t = useTranslations('global/components/comp-workflow');
  const [poolCount, setPoolCount] = useState<number | null>(null);
  const [roundsCount, setRoundsCount] = useState<number | null>(null);
  const [seededCount, setSeededCount] = useState<number | null>(null);

  useEffect(() => {
    getCompetitionParticipants(compId)
      .then(p => setPoolCount(p.length))
      .catch(() => setPoolCount(null));
    getRounds(compId)
      .then(rounds => {
        setRoundsCount(rounds.length);
        setSeededCount(rounds.reduce((sum, r) => sum + r.matches.reduce((m, match) => m + match.matchSlots.filter(slot => slot.name).length, 0), 0));
      })
      .catch(() => setRoundsCount(null));
  }, [compId, refreshKey]);

  const base = `${routeEvents}/${eventId}/comps/${compId}`;
  // The public page opens on the tab that matches the current step.
  const viewTab: Record<CompWorkflowStep, string> = { details: 'info', pool: 'participants', mode: 'grid', seeding: 'grid' };
  const steps: { id: CompWorkflowStep; href: string; label: string; status: string | null; done: boolean; Icon: Icon }[] = [
    { id: 'details', href: `${base}/edit`, label: t('stepDetails'), status: null, done: true, Icon: IconPencil },
    { id: 'pool', href: `${base}/edit/pool`, label: t('stepPool'), status: poolCount === null ? null : t('statusPool', { count: poolCount }), done: (poolCount ?? 0) >= 2, Icon: IconUsers },
    {
      id: 'mode',
      href: `${base}/edit/mode`,
      label: t('stepGameMode'),
      status: roundsCount === null ? null : roundsCount > 0 ? t('statusRounds', { count: roundsCount }) : t('statusOpen'),
      done: (roundsCount ?? 0) > 0,
      Icon: IconTournament,
    },
    {
      id: 'seeding',
      href: `${base}/edit/seeding`,
      label: t('stepSeeding'),
      status: seededCount === null || !roundsCount ? null : seededCount > 0 ? t('statusSeeded', { count: seededCount }) : t('statusOpen'),
      done: (seededCount ?? 0) > 0,
      Icon: IconScoreboard,
    },
  ];

  return (
    <nav aria-label={t('ariaLabel')} className="flex flex-col gap-2">
      <ol className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {steps.map((step, index) => {
          const active = step.id === current;
          return (
            <li key={step.id} className="min-w-0">
              <Link
                href={step.href}
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'flex h-full min-w-0 flex-col items-center gap-1 rounded-2xl border px-1.5 py-2 text-center transition-colors sm:flex-row sm:items-center sm:gap-3 sm:px-3 sm:text-left',
                  active ? 'border-brand/50 bg-brand-soft shadow-xs' : 'border-border bg-background hover:border-brand/30',
                )}
              >
                <span
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold',
                    active ? 'bg-brand text-brand-foreground' : step.done && step.id !== 'details' ? 'bg-brand-soft text-brand-strong' : 'bg-muted text-muted-foreground',
                  )}
                >
                  {step.done && step.id !== 'details' && !active ? <IconCheck className="h-4 w-4" stroke={2.5} aria-hidden /> : <step.Icon className="h-4 w-4" stroke={2} aria-hidden />}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className={cn('text-2xs leading-tight font-semibold break-words hyphens-auto sm:truncate sm:text-sm', active ? 'text-brand-strong' : 'text-foreground')}>
                    <span className="hidden sm:inline">{index + 1}. </span>
                    {step.label}
                  </span>
                  {step.status && <span className="hidden truncate text-xs text-muted-foreground sm:block">{step.status}</span>}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
      <div className="flex justify-end">
        <Link href={`${base}?tab=${viewTab[current]}`} className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-brand-strong">
          {t('btnViewCompetition')}
          <IconExternalLink className="h-3.5 w-3.5" stroke={1.75} aria-hidden />
        </Link>
      </div>
    </nav>
  );
}
