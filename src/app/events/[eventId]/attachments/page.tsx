import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import Link from 'next/link';
import { routeEvents } from '@/domain/constants/routes';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import Separator from '@/components/seperator';
import { getTranslations } from 'next-intl/server';
import { getAttachments } from '@/infrastructure/clients/attachment.client';

export default async function EventAttachments(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const t = await getTranslations('/events/eventid/attachments');

  const attachments = await getAttachments(params.eventId);

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <PageTitle title={t('pageTitle')} />

      <div className={'mx-2 rounded-lg border border-primary bg-secondary-light p-2 text-sm overflow-y-auto'}>
        <div className="flex flex-col">
          {attachments.map((attachment, index) => {
            return (
              <div key={index} className="m-1 flex items-center">
                <div className="mx-1 flex w-1/2 justify-end">
                  <div>{attachment.name}</div>
                </div>

                <div className="mx-1 flex w-1/2 justify-start">
                  <Link href={`${routeEvents}/${params.eventId}/attachments/${attachment.id}/edit`}>
                    <ActionButton action={Action.EDIT} />
                  </Link>
                </div>
              </div>
            );
          })}

          {attachments.length > 0 && (
            <div className="my-1">
              <Separator />
            </div>
          )}

          <div className="m-1 flex items-center gap-2">
            <div className="flex w-1/2 justify-end">{t('btnCreate')}</div>
            <div className="flex w-1/2">
              <Link href={`${routeEvents}/${params.eventId}/attachments/create`}>
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
