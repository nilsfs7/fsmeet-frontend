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
    <div className={'m-4 rounded-lg border-2 border-black bg-zinc-300 p-2 hover:bg-zinc-400'}>
      {/* top */}
      <div className={'max-h-20 p-2'}>
        <div className="28 flex justify-end">
          <div className="w-1/3 text-left">{event.name}</div>
          <div className="w-1/3 text-left">{event.location}</div>
          <div className="w-1/3 text-right">{dateFrom === dateTo ? `${dateFrom}` : `${dateFrom} - ${dateTo}`}</div>
        </div>
        <div className="flex justify-end">
          <div className="w-full text-right">Deadline: {dateRegistartionDeadline}</div>
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
        <p className="h-full w-2/3 overflow-clip text-ellipsis text-left">{event.description}</p>
        <div className="flex h-full w-1/3 items-center justify-end">
          <img className="h-full" src={'https://whitesw6.elbenwald.de/media/23/f7/cd/1629854154/E1063427_1.jpg'} alt={'event image'}></img>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
