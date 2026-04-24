import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { routeEventsCreate, routeHome } from '@/domain/constants/routes';
import Navigation from '@/components/navigation';
import ActionButton from '@/components/common/action-button';
import { Action } from '@/domain/enums/action';
import { Header } from '@/components/header';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { EventsList } from './components/events-list';

export default async function EventsOverview() {
  const t = await getTranslations('/events');

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <Header showMenu={true} />

      <EventsList />

      <Navigation>
        <Link href={routeHome}>
          <ActionButton action={Action.BACK} />
        </Link>
        <Button asChild variant="action" className={ctaActionButtonClassName}>
          <Link href={routeEventsCreate}>{t('btnCreateEvent')}</Link>
        </Button>
      </Navigation>
    </div>
  );
}
