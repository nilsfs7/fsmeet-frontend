'use client';

import { imgUserDefaultImg } from '@/domain/constants/images';
import { EventPosterPlaceholder } from '@/components/events/event-type-icon';
import { IconCalendarEvent, IconHourglassHigh, IconHourglassOff, IconMapPin, IconWorld } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { getShortDateString } from '@/functions/time';
import { Event } from '@/domain/types/event';
import moment from 'moment';
import { EventType } from '@/domain/enums/event-type';
import { isPublicEventState } from '@/functions/event-state';
import { getUser } from '@/infrastructure/clients/user.client';
import { useEffect, useState, type ReactNode } from 'react';
import { User } from '@/domain/types/user';
import { NotListedLabel } from '@/components/events/not-listed-label';
import { cn } from '@/lib/utils';

interface IEventProps {
  event: Event;
}

function MetaRow({ icon, children, className }: { icon: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex min-w-0 items-center gap-2 text-sm text-muted-foreground', className)}>
      <span className="flex h-4 w-4 shrink-0 items-center justify-center [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      <span className="min-w-0 flex-1 truncate leading-snug">{children}</span>
    </div>
  );
}

const typeBadgeClass: Record<EventType, string> = {
  [EventType.COMPETITION]: 'bg-brand-soft text-brand-strong',
  [EventType.COMPETITION_ONLINE]: 'bg-sky-50 text-sky-700',
  [EventType.MEETING]: 'bg-amber-50 text-amber-700',
};

const EventCard = ({ event }: IEventProps) => {
  const t = useTranslations('/events');
  const tCard = useTranslations('global/components/event-card');
  const [eventAdmin, setEventAdmin] = useState<User>();

  useEffect(() => {
    if (event.admin) {
      getUser(event.admin).then(user => {
        setEventAdmin(user);
      });
    }
  }, [event.admin]);

  const poster = event.imageUrlPoster;
  const registrationOpen = moment(event.registrationDeadline) > moment();
  const typeLabel = event.type === EventType.MEETING ? t('eventTypeMeet') : event.type === EventType.COMPETITION_ONLINE ? t('eventTypeCompOnline') : t('eventTypeComp');

  return (
    <div
      className={cn(
        'group h-full w-full overflow-hidden rounded-2xl border border-border bg-background shadow-xs',
        'transition-all duration-150',
        'hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-md',
      )}
    >
      <div className="flex h-full min-h-0 items-stretch gap-4 p-3 sm:p-4">
        <div className="relative w-24 shrink-0 self-start overflow-hidden rounded-xl bg-muted sm:w-28">
          <div className="aspect-4/5 w-full">
            {poster && <img className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]" src={poster} alt={event.name} />}
            {!poster && <EventPosterPlaceholder eventType={event.type} />}
          </div>
        </div>

        <div className="flex min-w-0 min-h-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold', typeBadgeClass[event.type] ?? 'bg-muted text-foreground')}>{typeLabel}</span>
            {!isPublicEventState(event.state) && <NotListedLabel />}
          </div>

          <h3 className="line-clamp-2 min-h-0 text-left text-base font-semibold leading-snug text-foreground sm:text-lg">{event.name}</h3>

          <div className="flex min-h-0 flex-col gap-1.5">
            <MetaRow icon={<IconCalendarEvent stroke={1.75} />}>
              {moment(event.dateFrom).isSame(moment(event.dateTo), 'day')
                ? getShortDateString(moment(event.dateFrom))
                : `${getShortDateString(moment(event.dateFrom), false)} – ${getShortDateString(moment(event.dateTo))}`}
            </MetaRow>

            <MetaRow icon={event.type === EventType.COMPETITION_ONLINE ? <IconWorld stroke={1.75} /> : <IconMapPin stroke={1.75} />}>
              {event.type === EventType.COMPETITION_ONLINE ? 'online' : event.venueCity || '\u2014'}
            </MetaRow>

            <MetaRow icon={registrationOpen ? <IconHourglassHigh stroke={1.75} /> : <IconHourglassOff stroke={1.75} />} className={registrationOpen ? undefined : 'opacity-70'}>
              {tCard('lblDeadline')} {getShortDateString(moment(event.registrationDeadline))}
            </MetaRow>
          </div>

          <div className="mt-auto flex min-w-0 items-center gap-2 border-t border-border/70 pt-2">
            <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-muted">
              <img src={eventAdmin?.imageUrl || imgUserDefaultImg} className="h-full w-full object-cover" alt="" />
            </div>
            <div className="min-w-0 flex-1 truncate text-xs font-medium text-muted-foreground">
              {eventAdmin?.lastName && `${eventAdmin?.firstName} ${eventAdmin?.lastName}`}
              {!eventAdmin?.lastName && eventAdmin?.firstName && `${eventAdmin?.firstName}`}
              {!eventAdmin && '\u00a0'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
