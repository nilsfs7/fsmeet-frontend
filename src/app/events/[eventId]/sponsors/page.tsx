import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import { routeEvents } from '@/domain/constants/routes';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { getSponsors } from '@/infrastructure/clients/sponsor.client';
import { getTranslations } from 'next-intl/server';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import SponsorsList from './components/sponsors-list';

const constrainedContentClass = 'mx-auto w-full max-w-3xl min-w-0 px-3 sm:px-4';

export default async function EventSponsors(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const [t, sponsors] = await Promise.all([getTranslations('/events/eventid/sponsors'), getSponsors(params.eventId)]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className={constrainedContentClass}>
        <PageTitle title={t('pageTitle')} />
      </div>

      <div className={cn('mt-2 min-h-0 flex-1 overflow-y-auto', constrainedContentClass)}>
        <div className="flex flex-col gap-3 text-sm">
          <div className="min-h-0 min-w-0 overflow-x-auto">
            <SponsorsList eventId={params.eventId} sponsors={sponsors} />
          </div>
        </div>
      </div>

      <Navigation>
        <ActionButton href={`${routeEvents}/${params.eventId}`} action={Action.BACK} />
        <Button asChild variant="action" className={ctaActionButtonClassName}>
          <Link href={`${routeEvents}/${params.eventId}/sponsors/create`}>{t('btnCreate')}</Link>
        </Button>
      </Navigation>
    </div>
  );
}
