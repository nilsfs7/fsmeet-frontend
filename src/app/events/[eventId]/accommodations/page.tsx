import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/ActionButton';
import Link from 'next/link';
import { routeEvents } from '@/domain/constants/routes';
import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import { getAccommodations } from '@/infrastructure/clients/accommodation.client';
import Separator from '@/components/Seperator';
import { getTranslations } from 'next-intl/server';

export default async function EventAccommodation(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const t = await getTranslations('/events/eventid/accommodations');

  const accommodations = await getAccommodations(params.eventId);

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <PageTitle title={t('pageTitle')} />

      <div className={'mx-2 rounded-lg border border-primary bg-secondary-light p-2 text-sm overflow-y-auto'}>
        <div className="flex flex-col">
          {accommodations.map((accommodation, index) => {
            return (
              <div key={index} className="m-1 flex items-center">
                <div className="mx-1 flex w-1/2 justify-end">
                  <div>{accommodation.description}</div>
                </div>

                <div className="mx-1 flex w-1/2 justify-start">
                  <Link href={`${routeEvents}/${params.eventId}/accommodations/${accommodation.id}/edit`}>
                    <ActionButton action={Action.EDIT} />
                  </Link>
                </div>
              </div>
            );
          })}

          {accommodations.length > 0 && (
            <div className="my-1">
              <Separator />
            </div>
          )}

          <div className="m-1 flex items-center gap-2">
            <div className="flex w-1/2 justify-end">{t('btnCreate')}</div>
            <div className="flex w-1/2">
              <Link href={`${routeEvents}/${params.eventId}/accommodations/create`}>
                <ActionButton action={Action.ADD} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Navigation>
        <Link href={`${routeEvents}/${params.eventId}`}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
}
