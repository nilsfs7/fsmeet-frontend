import EventCard from '@/components/events/EventCard';
import { Event } from '@/types/event';
import Link from 'next/link';
import TextButton from '@/components/common/TextButton';
import Navigation from '@/components/Navigation';
import { routeEventSubs, routeEvents, routeEventsCreate, routeHome, routeLogin } from '@/types/consts/routes';
import { Action } from '@/types/enums/action';
import ActionButton from '@/components/common/ActionButton';
import { validateSession } from '@/types/funcs/validate-session';
import { License } from '@/types/license';
import { useRouter } from 'next/router';
import Dialog from '@/components/Dialog';
import { GetServerSidePropsContext } from 'next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { switchTab_pages } from '@/types/funcs/switch-tab';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import PageTitle from '@/components/PageTitle';
import { auth } from '@/auth';
import { getLicense } from '@/infrastructure/clients/license.client';
import { getEvents } from '@/infrastructure/clients/event.client';

const MyEventsOverview = ({ data, session }: { data: any; session: any }) => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab');

  const eventsOwning: Event[] = data.owning;
  const eventsSubscribed: Event[] = data.subs;
  const license: License = data.license;

  const handleCreateEventClicked = async () => {
    if (license.amountEventLicenses > 0) {
      router.push(routeEventsCreate);
    } else {
      router.replace(`${routeEventSubs}/?license=1`, undefined, { shallow: true });
    }
  };

  const handleCancelDialogClicked = async () => {
    router.replace(`${routeEventSubs}`, undefined, { shallow: true });
  };

  return (
    <>
      <Dialog title="License Warning" queryParam="license" onCancel={handleCancelDialogClicked}>
        <p>Out of licenses to create new events.</p>
        <p>
          Users can create a maximum of 2 events for now. By deleting any event that is not listed publicly, you can reclaim 1 license. Note that once an event is public it is not eligible for a
          reclaim.
        </p>
      </Dialog>

      <div className="h-[calc(100dvh)] flex flex-col">
        <Header />

        <PageTitle title="Manage Events" />

        <div className="mx-2 flex flex-col overflow-auto">
          <div className={'w-full overflow-auto'}>
            <Tabs defaultValue={tab || `registrations`} className="flex flex-col h-full">
              <TabsList className="mb-2">
                <TabsTrigger
                  value="registrations"
                  onClick={() => {
                    switchTab_pages(router, 'registrations');
                  }}
                >
                  Registrations
                </TabsTrigger>

                <TabsTrigger
                  value="myevents"
                  onClick={() => {
                    switchTab_pages(router, 'myevents');
                  }}
                >
                  My Events
                </TabsTrigger>
              </TabsList>

              <TabsContent value="registrations" className="overflow-y-auto">
                {eventsSubscribed.length === 0 && <div className="flex justify-center">{`You have not signed up for any event, yet.`}</div>}

                {eventsSubscribed.length > 0 &&
                  eventsSubscribed.map((item: any, i: number) => {
                    return (
                      <div key={i.toString()} className={i == 0 ? '' : `mt-2`}>
                        <Link href={`${routeEvents}/${item.id}`}>
                          <EventCard event={item} />
                        </Link>
                      </div>
                    );
                  })}
              </TabsContent>

              <TabsContent value="myevents" className="overflow-y-auto">
                {eventsOwning.length === 0 && <div className="flex justify-center">{`You have not created any events, yet.`}</div>}

                {eventsOwning.length > 0 &&
                  eventsOwning.map((item: any, i: number) => {
                    return (
                      <div key={i.toString()} className={i == 0 ? '' : `mt-2`}>
                        <Link href={`${routeEvents}/${item.id}`}>
                          <EventCard event={item} />
                        </Link>
                      </div>
                    );
                  })}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <Navigation>
          <Link href={routeHome}>
            <ActionButton action={Action.BACK} />
          </Link>

          <TextButton text="Create Event" onClick={handleCreateEventClicked} />
        </Navigation>
      </div>
    </>
  );
};
export default MyEventsOverview;

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

  if (!session) {
    throw new Error('Validating session failed');
  }

  const myEvents = await getEvents(session?.user.username, null, null, null, session);
  const eventSubs = await getEvents(null, session?.user.username, null, null);
  const license = await getLicense(session, session.user.username);

  return {
    props: {
      data: { owning: myEvents, subs: eventSubs, license: license },
      session: session,
    },
  };
};
