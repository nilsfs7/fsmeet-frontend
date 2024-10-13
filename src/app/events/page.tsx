import Link from 'next/link';
import { routeHome } from '@/domain/constants/routes';
import Navigation from '@/components/Navigation';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/domain/enums/action';
import { Header } from '@/components/Header';
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
