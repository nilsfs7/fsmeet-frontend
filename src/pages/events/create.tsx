import TextButton from '@/components/common/TextButton';
import EventEditor from '@/components/events/EventEditor';
import router from 'next/router';
import { useState } from 'react';
import { Event } from '@/types/event';
import { routeEventSubs, routeLogin } from '@/domain/constants/routes';
import { validateSession } from '@/types/funcs/validate-session';
import { GetServerSidePropsContext } from 'next';
import { EditorMode } from '@/domain/enums/editor-mode';
import Navigation from '@/components/Navigation';
import { Toaster, toast } from 'sonner';
import PageTitle from '@/components/PageTitle';
import { auth } from '@/auth';
import { createEvent } from '@/infrastructure/clients/event.client';
import NavigateBackButton from '@/components/NavigateBackButton';

const EventCreation = (props: any) => {
  const session = props.session;

  const [event, setEvent] = useState<Event>();

  const handleCreateClicked = async () => {
    if (event) {
      try {
        await createEvent(event, session);
        router.replace(`${routeEventSubs}/?tab=myevents`);
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  return (
    <>
      <Toaster richColors />

      <div className="h-[calc(100dvh)] flex flex-col">
        <PageTitle title="Create Event" />

        <div className={`mx-2 flex flex-col overflow-y-auto`}>
          <div className={'flex justify-center'}>
            <div>
              <EventEditor
                editorMode={EditorMode.CREATE}
                onEventUpdate={(event: Event) => {
                  setEvent(event);
                }}
              />
            </div>
          </div>
        </div>

        <Navigation>
          <div className="mr-1">
            <NavigateBackButton />
          </div>

          <div className="ml-1">
            <TextButton text={'Create'} onClick={handleCreateClicked} />
          </div>
        </Navigation>
      </div>
    </>
  );
};

export default EventCreation;

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
