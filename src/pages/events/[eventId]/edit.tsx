import EventEditor from '@/components/events/EventEditor';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Event } from '@/types/event';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/domain/enums/action';
import { routeEventNotFound, routeEventSubs, routeEvents, routeLogin } from '@/domain/constants/routes';
import Dialog from '@/components/Dialog';
import { validateSession } from '@/types/funcs/validate-session';
import { GetServerSidePropsContext } from 'next';
import { EditorMode } from '@/domain/enums/editor-mode';
import Navigation from '@/components/Navigation';
import TextButton from '@/components/common/TextButton';
import { Toaster, toast } from 'sonner';
import PageTitle from '@/components/PageTitle';
import { auth } from '@/auth';
import { deleteEvent, getEvent, updateEvent } from '@/infrastructure/clients/event.client';
import NavigateBackButton from '@/components/NavigateBackButton';

const EventEditing = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;

  const [event, setEvent] = useState<Event>();

  const handleSaveClicked = async () => {
    if (event) {
      try {
        await updateEvent(event, session);
        router.replace(`${routeEvents}/${eventId}`);
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  const handleDeleteClicked = async () => {
    router.replace(`${routeEvents}/${eventId}/edit?delete=1`, undefined, { shallow: true });
  };

  const handleConfirmDeleteClicked = async () => {
    if (eventId) {
      try {
        await deleteEvent(eventId.toString(), session);
        router.push(routeEventSubs);
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  const handleCancelDeleteClicked = async () => {
    router.replace(`${routeEvents}/${eventId}/edit`, undefined, { shallow: true });
  };

  useEffect(() => {
    if (eventId && typeof eventId === 'string') {
      getEvent(eventId, session)
        .then((event: Event) => {
          setEvent(event);
        })
        .catch(() => {
          router.push(routeEventNotFound);
        });
    }
  }, []);

  return (
    <>
      <Toaster richColors />

      <Dialog title="Delete Event" queryParam="delete" onCancel={handleCancelDeleteClicked} onConfirm={handleConfirmDeleteClicked}>
        <p>Do you really want to delete this event?</p>
      </Dialog>

      <div className="h-[calc(100dvh)] flex flex-col">
        <PageTitle title="Edit Event" />

        <div className={`mx-2 flex flex-col overflow-y-auto`}>
          <div className={'flex justify-center'}>
            <div>
              <EventEditor
                editorMode={EditorMode.EDIT}
                event={event}
                onEventUpdate={(event: Event) => {
                  setEvent(event);
                }}
              />
            </div>
          </div>
        </div>

        <Navigation>
          <div className="flex justify-start">
            <div className="mr-1">
              <NavigateBackButton />
            </div>
          </div>

          <div className="flex justify-end gap-1">
            <ActionButton action={Action.DELETE} onClick={handleDeleteClicked} />

            <TextButton text={`Save`} onClick={handleSaveClicked} />
          </div>
        </Navigation>
      </div>
    </>
  );
};

export default EventEditing;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await auth(context);

  if (!validateSession(session)) {
    return {
      redirect: {
        permanent: false,
        destination: routeLogin,
      },
    };
  }

  return {
    props: {
      session: session,
    },
  };
};
