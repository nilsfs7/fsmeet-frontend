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

      <div className="mt-auto w-full px-2">
        <div className="mx-auto w-full min-w-0 max-w-lg">
          <Navigation>
            <div className="flex min-w-0 flex-wrap justify-start gap-1">
              <Link href={routeHome}>
                <ActionButton action={Action.BACK} />
              </Link>
            </div>

            <div className="flex min-w-0 flex-wrap justify-end gap-1">
              <Button asChild variant="action" className={ctaActionButtonClassName}>
                <Link href={routeEventsCreate}>{t('btnCreateEvent')}</Link>
              </Button>
            </div>
          </Navigation>
        </div>
      </div>
    </div>
  );
}
