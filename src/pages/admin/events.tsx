import { useEffect, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { Action } from '@/types/enums/action';
import Link from 'next/link';
import { routeAdminOverview, routeEvents, routeLogin, routeUsers } from '@/types/consts/routes';
import { validateSession } from '@/types/funcs/validate-session';
import ActionButton from '@/components/common/ActionButton';
import { Event } from '@/types/event';
import Navigation from '@/components/Navigation';
import moment from 'moment';
import { EventState } from '@/types/enums/event-state';
import { updateEventState } from '@/services/fsmeet-backend/update-event-state';
import { getEventsForManagement } from '@/services/fsmeet-backend/get-events-for-management';
import ComboBox from '@/components/common/ComboBox';
import { menuEventStates } from '@/types/consts/menus/menu-event-states';
import LoadingSpinner from '@/components/animation/loading-spinner';

const Events = (props: any) => {
  const session = props.session;

  const [events, setEvents] = useState<Event[]>([]);
  const defaultDateFrom = moment('2000').startOf('year');
  const defaultDateTo = moment('2099').endOf('year');

  const handlEventStateChanged = async (eventId: string, state: EventState) => {
    let evts = Array.from(events);
    evts = evts.map(evt => {
      if (evt.id === eventId) {
        evt.state = state;
      }

      return evt;
    });
    setEvents(evts);
  };

  const handleSaveEventClicked = async (eventId: string, state: EventState) => {
    const event = events.filter(evt => {
      if (evt.id === eventId) {
        return evt;
      }
    })[0];

    const response = await updateEventState(session, eventId, event.state);
    if (response.status == 200) {
      console.info(`State for ${eventId} updated`);
    }
  };

  useEffect(() => {
    getEventsForManagement(session, defaultDateFrom, defaultDateTo).then(events => {
      setEvents(events);
    });
  }, [events == undefined]);

  if (!events) {
    return <LoadingSpinner />;
  }

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      <div className="m-2 text-center text-base font-bold">Manage Events</div>

      <div className="m-2 overflow-y-auto">
        <div className={'rounded-lg border border-primary bg-secondary-light p-2 text-sm'}>
          <div className="flex flex-col">
            {events.map((event, index) => {
              return (
                <div key={index} className="m-1 flex items-center">
                  <div className="mx-1 flex w-1/2 justify-end gap-1">
                    <Link className="float-right" href={`${routeEvents}/${event.id}`}>
                      {event.name}
                    </Link>

                    <Link className="float-right" href={`${routeUsers}/${event.admin}`}>
                      {`(${event.admin})`}
                    </Link>
                  </div>
                  <div className="mx-1 flex w-1/2 justify-start">
                    <>
                      <ComboBox
                        menus={menuEventStates}
                        value={event.state}
                        searchEnabled={false}
                        onChange={(value: any) => {
                          if (event?.id) {
                            handlEventStateChanged(event.id, value);
                          }
                        }}
                      />

                      <div className="ml-1">
                        <ActionButton
                          action={Action.SAVE}
                          onClick={() => {
                            if (event?.id) {
                              handleSaveEventClicked(event.id, event.state);
                            }
                          }}
                        />
                      </div>
                    </>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Navigation>
        <Link href={routeAdminOverview}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
};

export default Events;

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
