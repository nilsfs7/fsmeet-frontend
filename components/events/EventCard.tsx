import { IEvent } from '@/interface/event';
import { useEffect, useState } from 'react';
import { imgCompetition, imgMeeting } from '@/types/consts/images';
import { shortDateString } from '@/types/funcs/time';

interface IEventProps {
  event: IEvent;
}

const EventCard = ({ event }: IEventProps) => {
  const [dateFrom, setDateFrom] = useState<number>();
  const [dateTo, setDateTo] = useState<number>();
  const [dateRegistrationDeadline, setDateRegistrationDeadline] = useState<number>();

  useEffect(() => {
    setDateFrom(event.dateFrom);
    setDateTo(event.dateTo);
    setDateRegistrationDeadline(event.registrationDeadline);
  }, []);

  return (
    <div className={'rounded-lg border border-black bg-primary-light p-2 text-sm hover:bg-primary'}>
      {/* top */}
      <div className={'max-h-24 p-2'}>
        <div className="28 flex ">
          <div className="w-full text-base font-bold">{event.name}</div>
        </div>
        <div className="flex justify-between">
          <div className="w-1/3 ">{event.venueCity}</div>
          {dateFrom && dateTo && (
            <div className="w-2/3 text-right">
              {dateFrom.toLocaleString() === dateTo.toLocaleString() ? `${shortDateString(dateFrom)}` : `${shortDateString(dateFrom, false)} - ${shortDateString(dateTo)}`}
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <div className="text-xs">by {event.owner}</div>
          <div>{dateRegistrationDeadline && <div className="text-right">Deadline: {shortDateString(dateRegistrationDeadline)}</div>}</div>
        </div>
      </div>

      {/* line */}
      <div className="flex h-1">
        <div className="w-1/3 bg-gray-400"></div>
        <div className="w-1/3 bg-gray-500"></div>
        <div className="w-1/3 bg-gray-400"></div>
      </div>

      {/* botton */}
      <div className="flex h-20 p-2">
        <p className="h-full w-2/3 overflow-hidden text-ellipsis">{event.description}</p>
        <div className="flex h-full w-1/3 items-center justify-end">
          <img className="h-full" src={event.type === 'comp' ? imgCompetition : imgMeeting} alt={'event image'}></img>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
