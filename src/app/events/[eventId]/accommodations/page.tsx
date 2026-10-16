import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import { routeEvents } from '@/domain/constants/routes';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { getAccommodations } from '@/infrastructure/clients/accommodation.client';
import { getTranslations } from 'next-intl/server';
import { cn } from '@/lib/utils';
import { getEvent } from '@/infrastructure/clients/event.client';
import { auth } from '@/auth';
import Link from 'next/link';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import AccommodationsList from './components/accommodations-list';

const constrainedContentClass = 'mx-auto w-full max-w-3xl min-w-0 px-3 sm:px-4';

export default async function EventAccommodation(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const [t, session] = await Promise.all([getTranslations('/events/eventid/accommodations'), auth()]);

  const [event, accommodations] = await Promise.all([
    getEvent(params.eventId, session),
    getAccommodations(params.eventId),
  ]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className={constrainedContentClass}>
        <PageTitle title={t('pageTitle')} />
      </div>

      <div className={cn('mt-2 min-h-0 flex-1 overflow-y-auto', constrainedContentClass)}>
        <div className="flex flex-col gap-3 text-sm">
          <div className="min-h-0 min-w-0 overflow-x-auto">
            <AccommodationsList eventId={params.eventId} currency={event.currency} accommodations={accommodations} />
          </div>
        </div>
      </div>

      <Navigation>
        <ActionButton href={`${routeEvents}/${params.eventId}`} action={Action.BACK} />
        <Button asChild variant="action" className={ctaActionButtonClassName}>
          <Link href={`${routeEvents}/${params.eventId}/accommodations/create`}>{t('btnCreate')}</Link>
        </Button>
      </Navigation>
    </div>
  );
}
