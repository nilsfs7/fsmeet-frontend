import { IEvent } from '@/interface/event';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { imgCompetition, imgMeeting } from '@/types/consts/images';
import TextareaAutosize from 'react-textarea-autosize';
import Map from '../Map';

interface IEventProps {
  event: IEvent;
}

const EventDetails = ({ event }: IEventProps) => {
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
    <div className={'h-fit rounded-lg border border-black bg-zinc-300 p-2 text-sm'}>
      {/* top */}
      <div className={'p-2'}>
        <div className={'grid grid-cols-3 justify-end object-right'}>
          <div className="text-base font-bold">{event.name}</div>
          <div className="col-span-2 row-span-3 flex h-20 justify-end">
            <img className="h-full" src={event.type === 'comp' ? imgCompetition : imgMeeting} alt={'event image'} />
          </div>
          <div className="">
            {dateFrom && dateTo && (
              <div className="w-1/3 text-left">
                {dateFrom.toLocaleString() === dateTo.toLocaleString() ? `${shortDateString(dateFrom)}` : `${shortDateString(dateFrom, false)} - ${shortDateString(dateTo)}`}
              </div>
            )}
          </div>
          <div className="">{event.venueCity}</div>
          <div className=""></div>
          <div className=""></div>
          <div className=""></div>
        </div>
      </div>

      {/* line */}
      <div className="flex h-1">
        <div className="w-1/3 bg-gray-400"></div>
        <div className="w-1/3 bg-gray-500"></div>
        <div className="w-1/3 bg-gray-400"></div>
      </div>

      {/* botton */}
      <div className="flex h-fit flex-col p-2">
        <TextareaAutosize readOnly className="h-full w-full resize-none overflow-hidden bg-zinc-300 outline-none">
          {event.description}
        </TextareaAutosize>
      </div>

      <div className="mt-2 flex w-full justify-center">
        <div className="w-full max-w-xl rounded-lg border border-black">
          <div className="aspect-square w-full">
            <Map address={`${event.venueHouseNo} ${event.venueStreet} ${event.venueCity}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
