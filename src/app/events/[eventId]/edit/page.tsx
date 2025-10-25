import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import NavigateBackButton from '@/components/navigate-back-button';
import { TextButtonSaveEvent } from './components/text-button-save-event';
import { Editor } from './components/editor';
import { getTranslations } from 'next-intl/server';
import { ActionButtonDeleteEvent } from './components/action-button-delete-event';
import { getEvent } from '@/infrastructure/clients/event.client';
import { auth } from '@/auth';
import { isEventAdmin } from '@/functions/is-event-admin';
import { getUsers } from '@/infrastructure/clients/user.client';
import { UserType } from '@/domain/enums/user-type';

export default async function EventEditing(props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const t = await getTranslations('/events/edit');
  const session = await auth();

  const users = await getUsers().then(users => {
    return users.filter(user => {
      if (user.type !== UserType.ADMINISTRATIVE) return user;
    });
  });
  const event = await getEvent(params.eventId, session);

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <PageTitle title={t('pageTitle')} />

      <div className={`mx-2 flex flex-col overflow-y-auto`}>
        <div className={'flex justify-center'}>
          <Editor users={users} event={event} />
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
