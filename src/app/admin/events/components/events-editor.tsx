'use client';

import LoadingSpinner from '@/components/animation/loading-spinner';
import ActionButton from '@/components/common/ActionButton';
import { routeEvents, routeUsers } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { getEvents, updateEventState } from '@/infrastructure/clients/event.client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import moment from 'moment';
import { EventState } from '@/domain/enums/event-state';
import { Event } from '@/domain/types/event';
import { menuEventStates } from '@/domain/constants/menus/menu-event-states';
import ComboBox from '@/components/common/ComboBox';

export const EventsEditor = () => {
  const { data: session } = useSession();
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

  const handleSaveEventClicked = async (eventId: string) => {
    const event = events.filter(evt => {
      if (evt.id === eventId) {
        return evt;
      }
    })[0];

    try {
      await updateEventState(session, eventId, event.state);
      toast.success(`State for ${event.name} (${eventId}) updated.`);
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (session) {
      getEvents(null, null, null, defaultDateFrom, defaultDateTo, session).then(events => {
        setEvents(events);
      });
    }
  }, [session]);

  if (!events) {
    return <LoadingSpinner text="Loading..." />; // todo
  }

  return (
    <>
      <Toaster richColors />

      <div className="mx-2 overflow-y-auto">
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
                              handleSaveEventClicked(event.id);
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
    </>
  );
};
