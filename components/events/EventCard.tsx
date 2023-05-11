import { IEvent } from '@/interface/event';
import { useEffect, useState } from 'react';

interface IEventProps {
  event: IEvent;
}

const EventCard = ({ event }: IEventProps) => {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [dateRegistartionDeadline, setDateRegistartionDeadline] = useState<Date>();

  useEffect(() => {
    setDateFrom(new Date(event.dateFrom * 1000));
    setDateTo(new Date(event.dateTo * 1000));
    setDateRegistartionDeadline(new Date(event.registrationDeadline * 1000));
  }, []);

  const shortDateString = (date: Date, yearLength: number = 2): string => {
    const day = date.getDay().toString().padStart(2, '0');
    const month = date.getMonth().toString().padStart(2, '0');
    const year = date
      .getFullYear()
      .toString()
      .substring(date.getFullYear().toString().length - yearLength);

    return `${day}.${month}.${year}`;
  };

  return (
    <div className={'m-4 rounded-lg border-2 border-black bg-zinc-300 p-2 text-sm hover:bg-zinc-400'}>
      {/* top */}
      <div className={'max-h-24 p-2'}>
        <div className="28 flex ">
          <div className="w-full text-base font-bold">{event.name}</div>
        </div>
        <div className="flex justify-between">
          <div className="w-1/3 ">{event.location}</div>
          {dateFrom && dateTo && (
            <div className="w-2/3 text-right">
              {dateFrom.toLocaleString() === dateTo.toLocaleString() ? `${shortDateString(dateFrom)}` : `${shortDateString(dateFrom, 0)} - ${shortDateString(dateTo)}`}
            </div>
          )}
        </div>
        <div className="flex justify-end">{dateRegistartionDeadline && <div className="w-2/3 text-right">Deadline: {shortDateString(dateRegistartionDeadline, 2)}</div>}</div>
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
          <img className="h-full" src={'https://whitesw6.elbenwald.de/media/23/f7/cd/1629854154/E1063427_1.jpg'} alt={'event image'}></img>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
