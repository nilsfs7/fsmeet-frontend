'use client';

import { imgCalender, imgCompetition, imgHourglassEnd, imgHourglassStart, imgMeeting, imgUserDefaultImg, imgWorld } from '@/domain/constants/images';
import { getShortDateString } from '@/functions/time';
import Separator from '../Seperator';
import { Event } from '@/types/event';
import moment from 'moment';
import { EventType } from '@/domain/enums/event-type';
import { isPublicEventState } from '@/functions/is-public-event-state';
import { useTranslations } from 'next-intl';
import { getUser } from '@/infrastructure/clients/user.client';
import { useEffect, useState } from 'react';
import { User } from '@/types/user';

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
    <div className={'flex flex-col gap-1 rounded-lg border border-secondary-dark bg-secondary-light p-2 text-sm hover:border-primary'}>
      {/* Event Title */}
      <div className="flex">
        <div className="w-full text-base font-bold">{`${!isPublicEventState(event.state) ? '[NOT LISTED] ' : ''}${event.name}`}</div>
      </div>

      <div className="flex justify-between items-center">
        <div className="w-2/3 flex flex-col gap-1">
          {/* Time */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 flex justify-center items-center">
              <img src={imgCalender} className="w-5 h-5 object-fill" />
            </div>
            {moment(event.dateFrom).isSame(moment(event.dateTo), 'day')
              ? `${getShortDateString(moment(event.dateFrom))}`
              : `${getShortDateString(moment(event.dateFrom), false)} - ${getShortDateString(moment(event.dateTo))}`}
          </div>

          {/* Location  */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 flex justify-center items-center">
              <img src={imgWorld} className="object-fill" />
            </div>
            {`${event.type === EventType.COMPETITION_ONLINE ? 'online' : event.venueCity}`}
          </div>

          {/* Event Host  */}
          <div className="flex gap-2 items-center">
            <div className="w-6 h-6 flex justify-center items-center">
              <img src={eventAdmin?.imageUrl || imgUserDefaultImg} className="w-5 h-5 object-cover rounded-full" />
            </div>

            {eventAdmin?.lastName && <div>{`${eventAdmin?.firstName}  ${eventAdmin?.lastName}`}</div>}
            {!eventAdmin?.lastName && <div>{`${eventAdmin?.firstName}`}</div>}
          </div>

          {/* Deadline  */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 flex justify-center items-center">
              <img src={moment(event.registrationDeadline) > moment() ? imgHourglassStart : imgHourglassEnd} className="w-5 h-5 object-fill" />
            </div>
            {`${getShortDateString(moment(event.registrationDeadline))}`}
          </div>
        </div>

        {/* Event Type / Image */}
        <div className="w-1/3 flex flex-col items-end">
          {event.imageUrlPoster && <img className="h-28 aspect-[4/5] object-fill" src={event.imageUrlPoster} alt={'event image'} />}
          {!event.imageUrlPoster && <img className="h-28 aspect-[4/5]" src={event.type === EventType.MEETING ? imgMeeting : imgCompetition} alt={'event image'} />}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
