import { IEvent } from '@/interface/event';
import { useEffect, useState } from 'react';
import { imgCompetition, imgMeeting } from '@/types/consts/images';
import TextareaAutosize from 'react-textarea-autosize';
import Map from '../Map';
import Link from 'next/link';
import { shortDateString } from '@/types/funcs/time';
import Separator from '../Seperator';

interface IEventProps {
  event: IEvent;
}

const EventDetails = ({ event }: IEventProps) => {
  const [dateFrom, setDateFrom] = useState<number>();
  const [dateTo, setDateTo] = useState<number>();
  const [dateRegistrationOpen, setDateRegistrationOpen] = useState<number>();
  const [dateRegistrationDeadline, setDateRegistrationDeadline] = useState<number>();

  useEffect(() => {
    setDateFrom(event.dateFrom);
    setDateTo(event.dateTo);
    setDateRegistrationOpen(event.registrationOpen);
    setDateRegistrationDeadline(event.registrationDeadline);
  }, []);

  return (
    <div className={'h-fit rounded-lg border border-black bg-primary-light p-2 text-sm'}>
      {/* top */}
      <div className={'p-2'}>
        <div className={'grid grid-cols-3 justify-end object-right'}>
          <div className="col-span-2 text-base font-bold">{event.name}</div>
          <div className="row-span-3 flex h-20 justify-end">
            <img className="h-full" src={event.type === 'comp' ? imgCompetition : imgMeeting} alt={'event image'} />
          </div>

          <div className="col-span-2">
            {dateFrom && dateTo && (
              <div className="">{dateFrom.toLocaleString() === dateTo.toLocaleString() ? `${shortDateString(dateFrom)}` : `${shortDateString(dateFrom, false)} - ${shortDateString(dateTo)}`}</div>
            )}
          </div>

          <div className="col-span-2">{event.venueCity}</div>
        </div>
      </div>

      <Separator />

      <div className={'p-2'}>
        <div className={'grid grid-cols-3 justify-end object-right'}>
          <div className="col-span-1">Participation fee</div>
          <div className="col-span-2">{event.participationFee.toString().replace('.', ',')} €</div>

          <div className="col-span-1">Registration open</div>
          {dateRegistrationOpen && <div className="col-span-2">{shortDateString(dateRegistrationOpen)}</div>}

          <div className="col-span-1">Registration end</div>
          {dateRegistrationDeadline && <div className="col-span-2">{shortDateString(dateRegistrationDeadline)}</div>}

          <div className="col-span-1">Event host</div>
          <div className="col-span-2 hover:underline">
            <Link href={`/user/${event.owner}`}>{event.owner}</Link>
          </div>
        </div>
      </div>

      <Separator />

      {/* description */}
      <div className="flex h-fit flex-col p-2">
        <TextareaAutosize readOnly className="h-full w-full resize-none overflow-hidden bg-primary-light outline-none" value={event.description}></TextareaAutosize>
      </div>

      <Separator />

      {/* address */}
      <div className="mt-2 p-2">Venue address:</div>
      <div className="select-text p-2">
        <p>{`${event.venueStreet} ${event.venueHouseNo}`}</p>
        <p>{`${event.venuePostCode} ${event.venueCity}`}</p>
        <p>{event.venueCountry}</p>
      </div>

      <div className="mt-2 flex w-full justify-center">
        <div className="w-full max-w-xl rounded-lg border border-black">
          <div className="aspect-square w-full">
            <Map address={`${event.venueHouseNo} ${event.venueStreet} ${event.venuePostCode} ${event.venueCity}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
