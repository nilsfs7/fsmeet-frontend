import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import NavigateBackButton from '@/components/NavigateBackButton';
import { TextButtonSaveEvent } from './components/text-button-save-event';
import { Editor } from './components/editor';
import { getTranslations } from 'next-intl/server';
import { ActionButtonDeleteEvent } from './components/action-button-delete-event';
import { getEvent } from '@/infrastructure/clients/event.client';
import { auth } from '@/auth';
import { isEventAdmin } from '@/functions/is-event-admin';

export default async function EventEditing({ params }: { params: { eventId: string } }) {
  const t = await getTranslations('/events/edit');
  const session = await auth();

  const event = await getEvent(params.eventId, session);

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <PageTitle title={t('pageTitle')} />

      <div className={`mx-2 flex flex-col overflow-y-auto`}>
        <div className={'flex justify-center'}>
          <Editor event={event} />
        </div>
      </div>

      <Navigation>
        <div className="flex justify-start">
          <div className="mr-1">
            <NavigateBackButton />
          </div>
        </div>

        <div className="flex justify-end gap-1">
          {isEventAdmin(event, session) && <ActionButtonDeleteEvent />}

          <TextButtonSaveEvent />
        </div>
      </Navigation>
    </div>
  );
}
