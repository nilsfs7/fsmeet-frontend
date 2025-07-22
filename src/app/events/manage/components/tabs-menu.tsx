'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { routeEventSubs, routeEvents } from '@/domain/constants/routes';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Dialog from '@/components/Dialog';
import { switchTab } from '@/functions/switch-tab';
import EventCard from '@/components/events/EventCard';
import { Event } from '@/domain/types/event';
import { useTranslations } from 'next-intl';
import { isEventAdmin } from '@/functions/is-event-admin';
import { useSession } from 'next-auth/react';
import { User } from '@/domain/types/user';
import { UserType } from '@/domain/enums/user-type';

interface ITabsMenu {
  actingUser: User;
  eventsOwning: Event[];
  eventsMaintaining: Event[];
  eventsSubscribed: Event[];
}

export const TabsMenu = ({ actingUser, eventsOwning, eventsMaintaining, eventsSubscribed }: ITabsMenu) => {
  const t = useTranslations('/events/manage');

  const { data: session } = useSession();
  const router = useRouter();

  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab');

  const handleCancelDialogClicked = async () => {
    router.replace(`${routeEventSubs}`);
  };

  return (
    <>
      <Dialog title="License Warning" queryParam="license" onCancel={handleCancelDialogClicked}>
        <p>Out of licenses to create new events. Contact us to get more.</p>
        <p>By deleting any event that is not listed publicly, you can reclaim 1 license. Note that once an event is public it is not eligible for a reclaim.</p>
      </Dialog>

      <Tabs defaultValue={tab || `registrations`} className="flex flex-col h-full">
        <TabsList className="mb-2">
          <TabsTrigger
            value="registrations"
            onClick={() => {
              switchTab(router, 'registrations');
            }}
          >
            {t('tabRegistrationsTitle')}
          </TabsTrigger>

          {actingUser.type !== UserType.FAN && (
            <TabsTrigger
              value="myevents"
              onClick={() => {
                switchTab(router, 'myevents');
              }}
            >
              {t('tabEventsHostedTitle')}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="registrations" className="overflow-y-auto">
          {eventsSubscribed.length === 0 && <div className="flex  justify-center">{t('tabRegistrationsTextNoEvents')}</div>}

          {eventsSubscribed.length > 0 && (
            <div className="grid gap-2 justify-center">
              <div className="grid gap-2">
                {eventsSubscribed.map((event: Event, i: number) => {
                  return (
                    <div key={`event-subscribed-${i.toString()}`}>
                      <Link href={`${routeEvents}/${event.id}`}>
                        <EventCard event={event} />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="myevents" className="overflow-y-auto">
          {eventsOwning.length === 0 && eventsMaintaining.length === 0 && <div className="flex justify-center">{t('tabEventsHostedTextNoEvents')}</div>}

          <div className="grid gap-2 justify-center">
            <div className="grid gap-2">
              {eventsOwning.map((event: Event, i: number) => {
                return (
                  <div key={`event-owning-${i.toString()}`}>
                    <Link href={`${routeEvents}/${event.id}`}>
                      <EventCard event={event} />
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="grid gap-2">
              {eventsMaintaining.map((event: Event, i: number) => {
                if (!isEventAdmin(event, session))
                  return (
                    <div key={`event-maintaining-${i.toString()}`}>
                      <Link href={`${routeEvents}/${event.id}`}>
                        <EventCard event={event} />
                      </Link>
                    </div>
                  );
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};
