import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import Navigation from '@/components/navigation';
import { routeEvents } from '@/domain/constants/routes';
import PageTitle from '@/components/page-title';
import { getTranslations } from 'next-intl/server';
import { getCompetitions } from '@/infrastructure/clients/competition.client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { CompetitionsList } from './components/competitions-list';

const constrainedContentClass = 'mx-auto w-full max-w-3xl min-w-0 px-3 sm:px-4';

export default async function ManageCompetitions(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const [t, competitions] = await Promise.all([
    getTranslations('/events/eventid/comps'),
    getCompetitions(params.eventId, null),
  ]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className={constrainedContentClass}>
        <PageTitle title={t('pageTitle')} />
      </div>

      <div className={cn('mt-2 min-h-0 flex-1 overflow-y-auto', constrainedContentClass)}>
        <div className="flex flex-col gap-3 text-sm">
          <div className="min-h-0 min-w-0 overflow-x-auto">
            <CompetitionsList eventId={params.eventId} competitions={competitions} />
          </div>
        </div>
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
