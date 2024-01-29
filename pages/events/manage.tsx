import { getSession } from 'next-auth/react';
import EventCard from '@/components/events/EventCard';
import { GetServerSideProps } from 'next';
import { Event } from '@/types/event';
import Link from 'next/link';
import TextButton from '@/components/common/TextButton';
import Navigation from '@/components/Navigation';
import { routeEventSubs, routeEventsCreate, routeHome, routeLogin } from '@/types/consts/routes';
import { Logo } from '@/components/Logo';
import { useRouter } from 'next/router';
import Dialog from '@/components/Dialog';
import { Action } from '@/types/enums/action';
import ActionButton from '@/components/common/ActionButton';
import { validateSession } from '@/types/funcs/validate-session';

const MyEventsOverview = ({ data, session }: { data: any; session: any }) => {
  const eventsOwning: Event[] = data.owning;
  const eventsSubscribed: Event[] = data.subs;

  const router = useRouter();

  const handlCreateEventClicked = async () => {
    router.replace(`${routeEventSubs}?create=1`, undefined, { shallow: true });
  };

  const handleCancelDialogClicked = async () => {
    router.replace(`${routeEventSubs}`, undefined, { shallow: true });
  };

  return (
    <>
      <Dialog title="Create New Event" queryParam="create" onCancel={handleCancelDialogClicked} onConfirm={handleCancelDialogClicked}>
        <p>{`Coming soon! :)`}</p>
      </Dialog>

      <div className="absolute inset-0 flex flex-col overflow-hidden">
        {/* Banner */}
        <div className="bg-secondary-light sm:block">
          <div className="mx-2 flex h-20 items-center justify-start">
            <Logo />
          </div>
        </div>

        {/* Event Subscriptions */}

        <div className="overflow-hidden overflow-y-auto">
          {eventsOwning.length > 0 && (
            <>
              <h1 className="mt-2 text-center text-xl">My Events</h1>
              <div className="mt-2 flex justify-center overflow-y-auto px-2">
                <div className="w-full">
                  {eventsOwning.map((item: any, i: number) => {
                    return (
                      <div key={i.toString()} className={i == 0 ? '' : `mt-2`}>
                        <Link href={`/events/${item.id}?auth=1`}>
                          <EventCard event={item} />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {eventsSubscribed.length > 0 && (
            <>
              <h1 className="mt-2 text-center text-xl">Event Subscriptions</h1>
              <div className="mt-2 flex max-h-full justify-center overflow-y-auto px-2">
                <div className="w-full">
                  {eventsSubscribed.map((item: any, i: number) => {
                    return (
                      <div key={i.toString()} className={i == 0 ? '' : `mt-2`}>
                        <Link href={`/events/${item.id}`}>
                          <EventCard event={item} />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        <Navigation>
          <Link href={routeHome}>
            <ActionButton action={Action.BACK} />
          </Link>

          {/* TODO: enable and remove dialog */}
          {/* <Link href={routeEventsCreate}> */}
          <TextButton text="Create Event" onClick={handlCreateEventClicked} />
          {/* </Link> */}
        </Navigation>
      </div>
    </>
  );
};
export default MyEventsOverview;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);

  if (!validateSession(session)) {
    return {
      redirect: {
        permanent: false,
        destination: routeLogin,
      },
    };
  }

  const urlMyEvents = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/manage?admin=${session?.user.username}`;
  const responseMyEvents = await fetch(urlMyEvents, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user.accessToken}`,
    },
  });
  const dataMyEvents = await responseMyEvents.json();

  const urlEventSubs = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events?participant=${session?.user.username}`;
  const responseEventSubs = await fetch(urlEventSubs);
  const dataEventSubs = await responseEventSubs.json();

  return {
    props: {
      data: { owning: dataMyEvents, subs: dataEventSubs },
      session: session,
    },
  };
};
