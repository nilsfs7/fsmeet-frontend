import { IEvent } from '@/interface/event';
import { useEffect, useState } from 'react';

interface IEventProps {
  event: IEvent;
}

const EventCard = ({ event }: IEventProps) => {
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [dateRegistartionDeadline, setDateRegistartionDeadline] = useState<string>('');

  useEffect(() => {
    setDateFrom(new Date(event.dateFrom * 1000).toLocaleDateString());
    setDateTo(new Date(event.dateTo * 1000).toLocaleDateString());
    setDateRegistartionDeadline(new Date(event.registrationDeadline * 1000).toLocaleDateString());
  }, [dateFrom, dateTo]);

  return (
    <div className={'m-4  rounded-lg border-2 border-black bg-zinc-300 p-2 hover:bg-zinc-400'}>
      <div className="flex justify-end">
        <div className="w-1/3 text-left">{event.name}</div>
        <div className="w-1/3 text-left">{event.location}</div>
        <div className="w-1/3 text-right">{dateFrom === dateTo ? `${dateFrom}` : `${dateFrom} - ${dateTo}`}</div>
      </div>
      <div className="flex">
        <div className="h-1 w-1/3 bg-gray-400"></div>
        <div className="h-1 w-1/3 bg-gray-500"></div>
        <div className="h-1 w-1/3 bg-gray-400"></div>
      </div>
      <div className="flex justify-between pt-4">
        <div className="w-2/3 text-left">{event.description}</div>
        <div className="w-1/3 text-right">Deadline: {dateRegistartionDeadline}</div>
      </div>
    </div>
  );
};

export default EventCard;
