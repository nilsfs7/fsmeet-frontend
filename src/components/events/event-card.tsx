'use client';

import { imgCalender, imgCompetition, imgHourglassEnd, imgHourglassStart, imgLocation, imgMeeting, imgUserDefaultImg } from '@/domain/constants/images';
import { getShortDateString } from '@/functions/time';
import { Event } from '@/domain/types/event';
import moment from 'moment';
import { EventType } from '@/domain/enums/event-type';
import { isPublicEventState } from '@/functions/event-state';
import { getUser } from '@/infrastructure/clients/user.client';
import { useEffect, useState, type ReactNode } from 'react';
import { User } from '@/domain/types/user';
import { cn } from '@/lib/utils';

interface IEventProps {
  event: Event;
}

function MetaRow({ icon, children, className }: { icon: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex min-w-0 items-center gap-2.5', className)}>
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border/40 bg-muted/50 [&>img]:h-4 [&>img]:w-4 [&>img]:object-contain">
        {icon}
      </div>
      <div className="type-body-sm min-w-0 flex-1 break-words text-foreground/90 leading-snug">{children}</div>
    </div>
  );
}

const EventCard = ({ event }: IEventProps) => {
  const [eventAdmin, setEventAdmin] = useState<User>();

  useEffect(() => {
    if (event.admin) {
      getUser(event.admin).then(user => {
        setEventAdmin(user);
      });
    }
  }, [event.admin]);

  const poster = event.imageUrlPoster;
  const fallback = event.type === EventType.MEETING ? imgMeeting : imgCompetition;

  return (
    <div
      className={cn(
        'group max-w-lg overflow-hidden rounded-xl border border-border/60',
        'bg-secondary-light/85 shadow-xs backdrop-blur-sm',
        'supports-[backdrop-filter]:bg-secondary-light/70',
        'transition-all duration-200',
        'hover:border-primary/50 hover:shadow-md',
        'dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50 dark:hover:border-primary/40',
      )}
    >
      <div className="flex min-h-0 items-stretch gap-3 p-3 sm:gap-4 sm:p-4">
        <div className="flex min-w-0 min-h-0 flex-1 flex-col justify-between gap-3">
          <h3 className="line-clamp-2 min-h-0 text-left text-base font-semibold leading-snug tracking-tight text-foreground sm:text-body">
            {!isPublicEventState(event.state) && (
              <span className="mb-0.5 mr-1.5 inline-block align-middle rounded-md border border-border/50 bg-muted/40 px-1.5 py-0.5 text-2xs text-muted-foreground sm:text-xs">
                [NOT LISTED]{' '}
              </span>
            )}
            <span className="align-middle">{event.name}</span>
          </h3>

          <div className="flex min-h-0 flex-col gap-2">
            <MetaRow icon={<img src={imgCalender} alt="" />}>
              {moment(event.dateFrom).isSame(moment(event.dateTo), 'day')
                ? getShortDateString(moment(event.dateFrom))
                : `${getShortDateString(moment(event.dateFrom), false)} – ${getShortDateString(moment(event.dateTo))}`}
            </MetaRow>

            <MetaRow icon={<img src={imgLocation} alt="" />}>
              {event.type === EventType.COMPETITION_ONLINE ? 'online' : event.venueCity}
            </MetaRow>

            <MetaRow
              icon={
                <img
                  src={moment(event.registrationDeadline) > moment() ? imgHourglassStart : imgHourglassEnd}
                  alt=""
                />
              }
            >
              {getShortDateString(moment(event.registrationDeadline))}
            </MetaRow>

            <div className="flex min-w-0 items-center gap-2.5">
              <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full border border-border/50 bg-muted/30 ring-1 ring-border/30">
                <img
                  src={eventAdmin?.imageUrl || imgUserDefaultImg}
                  className="h-full w-full object-cover"
                  alt=""
                />
              </div>
              <div className="type-body-sm min-w-0 flex-1 leading-snug text-foreground/90">
                {eventAdmin?.lastName && `${eventAdmin?.firstName} ${eventAdmin?.lastName}`}
                {!eventAdmin?.lastName && eventAdmin?.firstName && `${eventAdmin?.firstName}`}
                {!eventAdmin && '\u00a0'}
              </div>
            </div>
          </div>
        </div>

        <div className="relative h-32 w-[5.5rem] shrink-0 overflow-hidden rounded-lg border border-border/50 bg-muted/20 shadow-inner sm:h-36 sm:w-28">
          {poster && (
            <img
              className="h-full w-full object-cover object-center transition-transform duration-200 group-hover:scale-[1.02]"
              src={poster}
              alt={event.name}
            />
          )}
          {!poster && (
            <img
              className="h-full w-full object-cover object-center transition-transform duration-200 group-hover:scale-[1.02]"
              src={fallback}
              alt=""
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
