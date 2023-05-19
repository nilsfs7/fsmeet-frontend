import { IEvent } from '@/interface/event';
import { useEffect, useState } from 'react';
import moment from 'moment';

interface IEventProps {
  event: IEvent;
}

const imgMeeting = '/event/meeting.png';
const imgCompetition = '/event/competition.png';

const EventCard = ({ event }: IEventProps) => {
  const [dateFrom, setDateFrom] = useState<number>();
  const [dateTo, setDateTo] = useState<number>();
  const [dateRegistartionDeadline, setDateRegistartionDeadline] = useState<number>();

  useEffect(() => {
    setDateFrom(event.dateFrom);
    setDateTo(event.dateTo);
    setDateRegistartionDeadline(event.registrationDeadline);
  }, []);

  const shortDateString = (unixTs: number, appendYear: boolean = true): string => {
    const date = moment.unix(unixTs);

    if (appendYear) {
      return moment(date).format('DD.MM.YY');
    } else {
      return moment(date).format('DD.MM.');
    }
  };

  return (
    <div className={'rounded-lg border-2 border-black bg-zinc-300 p-2 text-sm hover:bg-zinc-400'}>
      {/* top */}
      <div className={'max-h-24 p-2'}>
        <div className="28 flex ">
          <div className="w-full text-base font-bold">{event.name}</div>
        </div>
        <div className="flex justify-between">
          <div className="w-1/3 ">{event.location}</div>
          {dateFrom && dateTo && (
            <div className="w-2/3 text-right">
              {dateFrom.toLocaleString() === dateTo.toLocaleString() ? `${shortDateString(dateFrom)}` : `${shortDateString(dateFrom, false)} - ${shortDateString(dateTo)}`}
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <div className="text-xs">by {event.owner}</div>
          <div>{dateRegistartionDeadline && <div className="text-right">Deadline: {shortDateString(dateRegistartionDeadline)}</div>}</div>
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
        <p className="h-full w-2/3 overflow-clip text-ellipsis ">{event.description}</p>
        <div className="flex h-full w-1/3 items-center justify-end">
          <img className="h-full" src={event.type === 'comp' ? imgCompetition : imgMeeting} alt={'event image'}></img>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
