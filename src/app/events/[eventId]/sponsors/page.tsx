import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import { routeEvents } from '@/domain/constants/routes';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { getSponsors } from '@/infrastructure/clients/sponsor.client';
import Separator from '@/components/separator';
import { getTranslations } from 'next-intl/server';

export default async function EventSponsors(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const t = await getTranslations('/events/eventid/sponsors');

  const sponsors = await getSponsors(params.eventId);

  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <PageTitle title={t('pageTitle')} />

      <div className={'mx-2 rounded-lg border border-primary bg-secondary-light p-2 text-sm overflow-y-auto'}>
        <div className="flex flex-col">
          {sponsors.map((sponsor, index) => {
            return (
              <div key={index} className="m-1 flex items-center">
                <div className="mx-1 flex w-1/2 justify-end">
                  <div>{sponsor.name}</div>
                </div>

                <div className="mx-1 flex w-1/2 justify-start">
                  <ActionButton
                    href={`${routeEvents}/${params.eventId}/sponsors/${sponsor.id}/edit`}
                    action={Action.EDIT}
                  />
                </div>
              </div>
            );
          })}

          {sponsors.length > 0 && (
            <div className="my-1">
              <Separator />
            </div>
          )}

          <div className="m-1 flex items-center gap-2">
            <div className="flex w-1/2 justify-end">{t('btnCreate')}</div>
            <div className="flex w-1/2">
              <ActionButton href={`${routeEvents}/${params.eventId}/sponsors/create`} action={Action.ADD} />
            </div>
          </div>
        </div>
      </div>

      <Navigation>
        <ActionButton href={`${routeEvents}/${params.eventId}`} action={Action.BACK} />
      </Navigation>
    </div>
  );
}
