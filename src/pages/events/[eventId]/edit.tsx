import EventEditor from '@/components/events/EventEditor';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Event } from '@/types/event';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/types/enums/action';
import { routeEventSubs, routeEvents, routeLogin } from '@/types/consts/routes';
import Dialog from '@/components/Dialog';
import { getEvent } from '@/services/fsmeet-backend/get-event';
import { validateSession } from '@/types/funcs/validate-session';
import { GetServerSidePropsContext } from 'next';
import { EditorMode } from '@/types/enums/editor-mode';
import Navigation from '@/components/Navigation';
import TextButton from '@/components/common/TextButton';
import { editEvent } from '@/services/fsmeet-backend/edit-event';
import { Toaster, toast } from 'sonner';
import { deleteEvent } from '@/services/fsmeet-backend/delete-event';

const EventEditing = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;

  const [event, setEvent] = useState<Event>();

  const handleSaveClicked = async () => {
    if (event) {
      try {
        await editEvent(event, session);
        router.replace(`${routeEvents}/${eventId}?auth=1`);
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
      getEvent(eventId, true, session).then((event: Event) => {
        setEvent(event);
      });
    }
  }, []);

  return (
    <>
      <Toaster richColors />

      <Dialog title="Delete Event" queryParam="delete" onCancel={handleCancelDeleteClicked} onConfirm={handleConfirmDeleteClicked}>
        <p>Do you really want to delete this event?</p>
      </Dialog>

      <div className="absolute inset-0 flex flex-col">
        <div className={`m-2 flex flex-col overflow-hidden`}>
          <div className={'flex flex-col items-center'}>
            <h1 className="mt-2 text-xl">{`Edit Event`}</h1>
          </div>

          <div className={'my-2 flex justify-center overflow-y-auto'}>
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
              <ActionButton action={Action.CANCEL} onClick={() => router.back()} />
            </div>
          </div>

          <div className="flex justify-end">
            <div className="ml-1">
              <ActionButton action={Action.DELETE} onClick={handleDeleteClicked} />
            </div>

            <div className="ml-1">
              <TextButton text={`Save`} onClick={handleSaveClicked} />
            </div>
          </div>
        </Navigation>
      </div>
    </>
  );
};

export default EventEditing;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);

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
