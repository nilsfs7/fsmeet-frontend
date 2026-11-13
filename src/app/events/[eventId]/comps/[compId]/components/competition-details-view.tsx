import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import ActionButton from '@/components/common/action-button';
import { Action } from '@/domain/enums/action';
import { routeEvents } from '@/domain/constants/routes';
import type { Competition } from '@/domain/types/competition';
import type { Event } from '@/domain/types/event';
import type { Round } from '@/domain/types/round';
import { TabsMenu } from './tabs-menu';
import { ActionButtonDownloadResults } from './action-button-download-results';
import { ActionButtonCopyCompUrl } from './action-button-copy-comp-url';

interface ICompetitionDetailsView {
  event: Event;
  comp: Competition;
  rounds: Round[];
}

/** Public competition page, shared by `/events/[eventId]/comps/[compId]` and `/e/[eventalias]/c/[compalias]`. */
export const CompetitionDetailsView = ({ event, comp, rounds }: ICompetitionDetailsView) => {
  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <PageTitle title={comp.name} description={event.name} />

      <TabsMenu comp={comp} event={event} />

      <Navigation>
        <ActionButton href={`${routeEvents}/${event.id ?? comp.eventId}?tab=competitions`} action={Action.BACK} />

        <div className="flex gap-1">
          <ActionButtonCopyCompUrl eventId={event.id ?? comp.eventId} eventAlias={event.alias} compId={comp.id} compAlias={comp.alias} />
          <ActionButtonDownloadResults event={event} comp={comp} rounds={rounds} />
        </div>
      </Navigation>
    </div>
  );
};
