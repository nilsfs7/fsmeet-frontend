import ActionButton from '@/components/common/action-button';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { routeEvents } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { getCompetitions } from '@/infrastructure/clients/competition.client';
import { ArenaCompetitionPicker } from './components/arena-competition-picker';
import { ArenaScreenSettings } from './components/arena-screen-settings';
import { OpenArenaPreviewButton } from './components/open-arena-preview-button';
import { getTranslations } from 'next-intl/server';
import { cn } from '@/lib/utils';

const constrainedContentClass = 'mx-auto w-full max-w-3xl min-w-0 px-3 sm:px-4';

export default async function ArenaScreen(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const t = await getTranslations('/events/eventid/arena-screen');
  const competitions = await getCompetitions(params.eventId);

  const options = competitions.filter((c): c is typeof c & { id: string } => Boolean(c.id)).map(c => ({ id: c.id, name: c.name }));

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className={cn('mt-2', constrainedContentClass)}>
        <PageTitle title={t('pageTitle')} />
      </div>

      <div className={cn('mt-2 min-h-0 flex-1 overflow-y-auto', constrainedContentClass)}>
        <div className="text-sm">
          <p className="text-muted-foreground">{t('pageDescription')}</p>
          <div className="mt-2">
            <ArenaCompetitionPicker eventId={params.eventId} competitions={options} />
          </div>
          <div className="mt-6">
            <ArenaScreenSettings eventId={params.eventId} />
          </div>
        </div>
      </div>

      <Navigation>
        <div className="flex min-w-0 flex-wrap justify-start gap-1">
          <ActionButton href={`${routeEvents}/${params.eventId}`} action={Action.BACK} />
        </div>

        <div className="flex min-w-0 flex-wrap justify-end gap-1">
          <OpenArenaPreviewButton eventId={params.eventId} />
        </div>
      </Navigation>
    </div>
  );
}
