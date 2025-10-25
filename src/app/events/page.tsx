import Link from 'next/link';
import { routeHome } from '@/domain/constants/routes';
import Navigation from '@/components/navigation';
import ActionButton from '@/components/common/action-button';
import { Action } from '@/domain/enums/action';
import { Header } from '@/components/header';
import { EventsList } from './components/events-list';

export default async function EventsOverview() {
  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <Header showMenu={true} />

      <EventsList />

      <Navigation>
        <Link href={routeHome}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
}
