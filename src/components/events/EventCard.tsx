'use client';

import { imgCalender, imgCompetition, imgHourglassEnd, imgHourglassStart, imgLocation, imgMeeting, imgUserDefaultImg, imgWorld } from '@/domain/constants/images';
import { getShortDateString } from '@/functions/time';
import { Event } from '@/domain/types/event';
import moment from 'moment';
import { EventType } from '@/domain/enums/event-type';
import { isPublicEventState } from '@/functions/event-state';
import { useTranslations } from 'next-intl';
import { getUser } from '@/infrastructure/clients/user.client';
import { useEffect, useState } from 'react';
import { User } from '@/domain/types/user';

interface IEventProps {
  event: Event;
}

const EventCard = ({ event }: IEventProps) => {
  const t = useTranslations('global/components/event-card');

  const [eventAdmin, setEventAdmin] = useState<User>();

  useEffect(() => {
    if (event.admin)
      getUser(event.admin).then(user => {
        setEventAdmin(user);
      });
  }, []);

  return (
    <div className={'max-w-lg h-40 flex flex-col gap-1 rounded-lg border border-secondary-dark bg-secondary-light p-2 hover:border-primary'}>
      <div className="flex justify-between">
        <div className="w-2/3 h-full flex flex-col justify-between">
          {/* Event Title */}
          <div className="w-full h-12 text-base font-bold">{`${!isPublicEventState(event.state) ? '[NOT LISTED] ' : ''}${event.name}`}</div>

          <div className="h-24 flex flex-col gap-1 text-sm">
            {/* Time */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5">
                <img src={imgCalender} className="w-full h-full object-fill" />
              </div>

              <div className="truncate">
                {moment(event.dateFrom).isSame(moment(event.dateTo), 'day')
                  ? `${getShortDateString(moment(event.dateFrom))}`
                  : `${getShortDateString(moment(event.dateFrom), false)} - ${getShortDateString(moment(event.dateTo))}`}
              </div>
            </div>

            {/* Location  */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5">
                <img src={imgLocation} className="w-full h-full object-fill" />
              </div>

              <div className="truncate">{`${event.type === EventType.COMPETITION_ONLINE ? 'online' : event.venueCity}`}</div>
            </div>

            {/* Deadline  */}
            {/* {moment(event.dateFrom) > moment() && ( */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5">
                <img src={moment(event.registrationDeadline) > moment() ? imgHourglassStart : imgHourglassEnd} className="w-full h-full object-fill" />
              </div>

              <div className="truncate">{`${getShortDateString(moment(event.registrationDeadline))}`}</div>
            </div>
            {/* )} */}

            {/* Event Host  */}
            <div className="flex gap-2 items-center">
              <div className="w-5 h-5">
                <img src={eventAdmin?.imageUrl || imgUserDefaultImg} className="w-full h-full object-cover rounded-full" />
              </div>

              <div className="truncate">
                {eventAdmin?.lastName && `${eventAdmin?.firstName}  ${eventAdmin?.lastName}`}
                {!eventAdmin?.lastName && `${eventAdmin?.firstName}`}
              </div>
            </div>
          </div>
        </div>

        {/* Event Type / Image */}
        <div className="w-1/3 flex flex-col items-end">
          {event.imageUrlPoster && <img className="h-36 aspect-[4/5] object-fill rounded-lg" src={event.imageUrlPoster} alt={'event image'} />}
          {!event.imageUrlPoster && <img className="h-36 aspect-[4/5] rounded-lg" src={event.type === EventType.MEETING ? imgMeeting : imgCompetition} alt={'event image'} />}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
