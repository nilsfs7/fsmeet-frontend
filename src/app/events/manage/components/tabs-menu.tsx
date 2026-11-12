'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { routeEvents } from '@/domain/constants/routes';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { switchTab } from '@/functions/switch-tab';
import EventCard from '@/components/events/event-card';
import { Event } from '@/domain/types/event';
import { useTranslations } from 'next-intl';
import { isEventAdmin } from '@/functions/is-event-admin';
import { useSession } from 'next-auth/react';
import { User } from '@/domain/types/user';
import { UserType } from '@/domain/enums/user-type';
import { EmptyState } from '@/components/common/empty-state';
import { CreateEventButton } from '@/components/events/create-event-button';
import { Button } from '@/components/ui/button';
import { IconCalendarPlus, IconTicket } from '@tabler/icons-react';

interface ITabsMenu {
  actingUser: User;
  eventsOwning: Event[];
  eventsMaintaining: Event[];
  eventsSubscribed: Event[];
}

function CountBadge({ count }: { count: number }) {
  return <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-2xs font-semibold text-muted-foreground">{count}</span>;
}

function EventGrid({ events, keyPrefix }: { events: Event[]; keyPrefix: string }) {
  return (
    <ul className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2">
      {events.map((event: Event, i: number) => (
        <li key={`${keyPrefix}-${i.toString()}`} className="min-w-0">
          <Link href={`${routeEvents}/${event.id}`} className="block rounded-2xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand">
            <EventCard event={event} />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export const TabsMenu = ({ actingUser, eventsOwning, eventsMaintaining, eventsSubscribed }: ITabsMenu) => {
  const t = useTranslations('/events/manage');

  const { data: session } = useSession();
  const router = useRouter();

  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab');

  const maintainingOnly = eventsMaintaining.filter(event => !isEventAdmin(event, session));

  return (
    <Tabs defaultValue={tab || `registrations`} className="flex h-full flex-col">
      <TabsList className="self-center">
        <TabsTrigger
          value="registrations"
          onClick={() => {
            switchTab(router, 'registrations');
          }}
        >
          {t('tabRegistrationsTitle')}
          <CountBadge count={eventsSubscribed.length} />
        </TabsTrigger>

        {actingUser.type !== UserType.FAN && (
          <TabsTrigger
            value="myevents"
            onClick={() => {
              switchTab(router, 'myevents');
            }}
          >
            {t('tabEventsHostedTitle')}
            <CountBadge count={eventsOwning.length + maintainingOnly.length} />
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="registrations" className="data-[state=active]:mt-5">
        {eventsSubscribed.length === 0 ? (
          <EmptyState
            icon={<IconTicket stroke={1.75} aria-hidden />}
            title={t('tabRegistrationsTextNoEvents')}
            action={
              <Button asChild variant="outline" className="h-10 rounded-xl px-4">
                <Link href={routeEvents}>{t('btnBrowseEvents')}</Link>
              </Button>
            }
          />
        ) : (
          <EventGrid events={eventsSubscribed} keyPrefix="event-subscribed" />
        )}
      </TabsContent>

      <TabsContent value="myevents" className="data-[state=active]:mt-5">
        {eventsOwning.length === 0 && maintainingOnly.length === 0 ? (
          <EmptyState icon={<IconCalendarPlus stroke={1.75} aria-hidden />} title={t('tabEventsHostedTextNoEvents')} action={<CreateEventButton label={t('btnCreate')} />} />
        ) : (
          <div className="flex flex-col gap-6">
            {eventsOwning.length > 0 && (
              <section className="flex flex-col gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t('sectionHosting')}</h2>
                <EventGrid events={eventsOwning} keyPrefix="event-owning" />
              </section>
            )}
            {maintainingOnly.length > 0 && (
              <section className="flex flex-col gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t('sectionCoOrganizing')}</h2>
                <EventGrid events={maintainingOnly} keyPrefix="event-maintaining" />
              </section>
            )}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
