import { Action } from '@/domain/enums/action';
import { routeAdminOverview } from '@/domain/constants/routes';
import ActionButton from '@/components/common/action-button';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { EventsEditor } from './components/events-editor';

export default async function EventAdministration() {
  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <PageTitle title="Manage Events" />

      <EventsEditor />

      <Navigation>
        <ActionButton href={routeAdminOverview} action={Action.BACK} />
      </Navigation>
    </div>
  );
}
