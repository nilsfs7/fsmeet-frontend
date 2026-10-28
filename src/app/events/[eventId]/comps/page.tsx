import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import Navigation from '@/components/navigation';
import { routeEvents } from '@/domain/constants/routes';
import PageTitle from '@/components/page-title';
import { getTranslations } from 'next-intl/server';
import { getCompetitionParticipants, getCompetitions } from '@/infrastructure/clients/competition.client';
import { getEventRegistrations } from '@/infrastructure/clients/event.client';
import Link from 'next/link';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { PageInset } from '@/components/layout/page-inset';
import { AppDataStateError } from '@/components/shared/app-data-state-error';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { auth } from '@/auth';
import { EventRegistrationType } from '@/domain/types/event-registration-type';
import { buildPoolRows, countPool, PoolCounts } from '@/functions/competition-pool';
import { IconInfoCircle } from '@tabler/icons-react';
import { CompetitionsList } from './components/competitions-list';

export default async function ManageCompetitions(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const [t, session] = await Promise.all([getTranslations('/events/eventid/comps'), auth()]);

  const [competitionsResult, registrationsResult] = await Promise.allSettled([
    getCompetitions(params.eventId, null),
    getEventRegistrations(params.eventId, EventRegistrationType.PARTICIPANT, session),
  ]);

  const competitions = competitionsResult.status === 'fulfilled' ? competitionsResult.value : [];
  const registrations = registrationsResult.status === 'fulfilled' ? registrationsResult.value : null;

  const poolResults = await Promise.allSettled(competitions.map(comp => (comp.id ? getCompetitionParticipants(comp.id) : Promise.resolve([]))));

  const poolCounts: Record<string, PoolCounts | null> = {};
  competitions.forEach((comp, index) => {
    const pool = poolResults[index];
    if (!comp.id) return;
    poolCounts[comp.id] = registrations && pool.status === 'fulfilled' ? countPool(buildPoolRows(comp, registrations, pool.value)) : null;
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <PageTitle title={t('pageTitle')} />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageInset className="flex flex-col gap-4">
          <Alert>
            <IconInfoCircle className="h-4 w-4" stroke={2} aria-hidden />
            <AlertTitle>{t('introTitle')}</AlertTitle>
            <AlertDescription>
              <ol className="mt-2 list-decimal space-y-1 pl-4 text-muted-foreground">
                <li>{t('introStep1')}</li>
                <li>{t('introStep2')}</li>
                <li>{t('introStep3')}</li>
              </ol>
            </AlertDescription>
          </Alert>

          {competitionsResult.status === 'rejected' && <AppDataStateError title={t('errorLoadTitle')} message={t('errorLoadCompetitions')} className="max-w-none" />}
          {competitionsResult.status === 'fulfilled' && registrations === null && competitions.length > 0 && (
            <AppDataStateError message={t('errorLoadRegistrations')} className="max-w-none" />
          )}

          {competitionsResult.status === 'fulfilled' && <CompetitionsList eventId={params.eventId} competitions={competitions} poolCounts={poolCounts} />}
        </PageInset>
      </div>

      <Navigation>
        <ActionButton href={`${routeEvents}/${params.eventId}`} action={Action.BACK} />
        <Button asChild variant="action" className={ctaActionButtonClassName}>
          <Link href={`${routeEvents}/${params.eventId}/comps/create`}>{t('btnCreate')}</Link>
        </Button>
      </Navigation>
    </div>
  );
}
