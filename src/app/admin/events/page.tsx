import { Action } from '@/domain/enums/action';
import Link from 'next/link';
import { routeAdminOverview } from '@/domain/constants/routes';
import ActionButton from '@/components/common/ActionButton';
import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import { EventsEditor } from './components/events-editor';

export default async function EventAdministration() {
  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <PageTitle title="Manage Events" />

      <EventsEditor />

      <Navigation>
        <Link href={routeAdminOverview}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
}
