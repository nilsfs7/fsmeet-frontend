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
import { CompetitionType } from '@/domain/enums/competition-type';
import { compareByIndex } from '@/functions/compare-by-index';

const constrainedContentClass = 'mx-auto w-full max-w-3xl min-w-0 px-3 sm:px-4';

export default async function ArenaScreen(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const [t, fetchedCompetitions] = await Promise.all([getTranslations('/events/eventid/arena-screen'), getCompetitions(params.eventId, CompetitionType.BATTLES)]);

  const options = [...fetchedCompetitions]
    .sort(compareByIndex)
    .filter((c): c is typeof c & { id: string } => Boolean(c.id))
    .map(c => ({ id: c.id, name: c.name }));

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className={constrainedContentClass}>
        <PageTitle title={t('pageTitle')} description={t('pageDescription')} />
      </div>

      <div className={cn('mt-2 min-h-0 flex-1 overflow-y-auto pb-6', constrainedContentClass)}>
        <div className="flex flex-col gap-4 text-sm">
          <section className="rounded-2xl border border-border bg-background p-4 shadow-xs sm:p-5">
            <div className="mb-1 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-soft text-xs font-bold text-brand-strong">1</span>
              <h2 className="text-base font-semibold text-foreground">{t('sectionLiveMatch')}</h2>
            </div>
            <p className="text-sm text-muted-foreground">{t('sectionLiveMatchHint')}</p>
            <ArenaCompetitionPicker eventId={params.eventId} competitions={options} />
          </section>

          <div>
            <ArenaScreenSettings eventId={params.eventId} />
          </div>

          <section className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-soft text-xs font-bold text-brand-strong">3</span>
                <h2 className="text-base font-semibold text-foreground">{t('sectionShow')}</h2>
              </div>
              <p className="text-sm text-muted-foreground">{t('sectionShowHint')}</p>
            </div>
            <div className="shrink-0">
              <OpenArenaPreviewButton eventId={params.eventId} />
            </div>
          </section>
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
