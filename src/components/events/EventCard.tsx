'use client';

import { imgCompetition, imgMeeting } from '@/domain/constants/images';
import { getShortDateString } from '@/functions/time';
import Separator from '../Seperator';
import { Event } from '@/types/event';
import moment from 'moment';
import { EventType } from '@/domain/enums/event-type';
import { isPublicEventState } from '@/functions/is-public-event-state';
import { useTranslations } from 'next-intl';

interface IEventProps {
  event: Event;
}

const EventCard = ({ event }: IEventProps) => {
  const t = useTranslations('global/components/event-card');

  return (
    <div className={'rounded-lg border border-secondary-dark bg-secondary-light p-2 text-sm hover:border-primary'}>
      <div className={'max-h-24 p-2'}>
        <div className="28 flex">
          <div className="w-full text-base font-bold">{`${!isPublicEventState(event.state) ? '[NOT LISTED] ' : ''}${event.name}`}</div>
        </div>
        <div className="flex justify-between">
          <div className="w-1/3">{event.type === EventType.COMPETITION_ONLINE ? 'online' : event.venueCity}</div>
          {event.dateFrom && event.dateTo && (
            <div>
              {moment(event.dateFrom).isSame(moment(event.dateTo), 'day')
                ? `${getShortDateString(moment(event.dateFrom))}`
                : `${getShortDateString(moment(event.dateFrom), false)} - ${getShortDateString(moment(event.dateTo))}`}
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <div className="text-xs">{`${t('lblHost')}: ${event.admin}`}</div>
          <div>{event.registrationDeadline && <div className="text-right">{`${t('lblDeadline')}: ${getShortDateString(moment(event.registrationDeadline))}`}</div>}</div>
        </div>
      </div>

      <Separator />

      <div className="flex h-20 p-2">
        <p className="h-full w-2/3 overflow-hidden text-ellipsis">{event.description}</p>
        <div className="flex h-full w-1/3 items-center justify-end">
          <img className="h-full" src={event.type === EventType.MEETING ? imgMeeting : imgCompetition} alt={'event image'} />
        </div>
      </div>
    </div>
  );
};

export default EventCard;
