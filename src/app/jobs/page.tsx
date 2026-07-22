import { auth } from '@/auth';
import ActionButton from '@/components/common/action-button';
import NavigateBackButton from '@/components/navigate-back-button';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { routeAccount } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { getTranslations } from 'next-intl/server';
import { BookingRequestsList } from './components/booking-requests-list';
import { getBookingRequests } from '@/infrastructure/clients/freestyleacts.client';
import { cn } from '@/lib/utils';

const constrainedContentClass = 'mx-auto w-full max-w-3xl min-w-0 px-3 sm:px-4';

export default async function Jobs() {
  const [t, session] = await Promise.all([getTranslations('/jobs'), auth()]);

  const bookingRequests = await getBookingRequests(session);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className={constrainedContentClass}>
        <PageTitle title={t('pageTitle')} />
      </div>

      <div className={cn('mt-2 flex-1 min-h-0 flex flex-col overflow-hidden', constrainedContentClass)}>
        <BookingRequestsList bookingRequests={bookingRequests} />
      </div>

      <Navigation>
        <NavigateBackButton />
        <ActionButton href={`${routeAccount}?tab=jobs`} action={Action.SETTINGS} />
      </Navigation>
    </div>
  );
}
