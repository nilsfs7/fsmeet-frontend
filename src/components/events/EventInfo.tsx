import { useState } from 'react';
import { imgCompetition, imgMeeting } from '@/domain/constants/images';
import TextareaAutosize from 'react-textarea-autosize';
import Map from '../Map';
import Link from 'next/link';
import { getShortDateString } from '@/functions/time';
import Separator from '../Seperator';
import TextButton from '../common/TextButton';
import { Event } from '@/types/event';
import moment from 'moment';
import { EventType } from '@/domain/enums/event-type';
import { routeUsers } from '@/domain/constants/routes';

interface IEventProps {
  event: Event;
}

const EventInfo = ({ event }: IEventProps) => {
  const [showMap, setShowMap] = useState<boolean>(false);

  return (
    <div className={'h-fit rounded-lg border border-secondary-dark bg-secondary-light p-2 text-sm'}>
      {/* top */}
      <div className={'grid grid-cols-3 justify-end object-right p-2'}>
        <div className="col-span-2 text-base font-bold">{event.name}</div>
        <div className="row-span-3 flex h-20 justify-end">
          <img className="h-full" src={event.type === 'meet' ? imgMeeting : imgCompetition} alt={'event image'} />
        </div>

        <div className="col-span-2">
          {event.dateFrom && event.dateTo && (
            <div>
              {moment(event.dateFrom).isSame(moment(event.dateTo), 'day')
                ? `${getShortDateString(moment(event.dateFrom))}`
                : `${getShortDateString(moment(event.dateFrom), false)} - ${getShortDateString(moment(event.dateTo))}`}
            </div>
          )}
        </div>

        <div className="col-span-2">{event.type === EventType.COMPETITION_ONLINE ? 'online' : event.venueCity}</div>
      </div>

      <Separator />

      <div className={'grid grid-cols-3 justify-end object-right p-2'}>
        <div className="col-span-1">Participation fee</div>
        <div className="col-span-2">{event.participationFee > 0 ? `${event.participationFee.toString().replace('.', ',')}  €` : 'free'}</div>

        <div className="col-span-1">Registration open</div>
        {event.registrationOpen && <div className="col-span-2">{getShortDateString(moment(event.registrationOpen))}</div>}

        <div className="col-span-1">Registration end</div>
        {event.registrationDeadline && <div className="col-span-2">{getShortDateString(moment(event.registrationDeadline))}</div>}

        <div className="col-span-1">Event host</div>
        <div className="col-span-2 hover:underline">
          <Link href={`${routeUsers}/${event.admin}`}>{event.admin}</Link>
        </div>
      </div>

      {/* description */}
      {event.description && (
        <>
          <Separator />

          <div className="flex h-fit flex-col p-2">
            <TextareaAutosize readOnly className="h-full w-full resize-none overflow-hidden bg-transparent outline-none" value={event.description} />
          </div>
        </>
      )}

      {/* livestream */}
      {event.livestreamUrl && (
        <>
          <Separator />

          <div className={'p-2'}>
            <div className={'grid grid-cols-3'}>
              <div className="col-span-1">{`Livestream`}</div>
              <div className="col-span-2 hover:underline select-text">
                <a target="_blank" rel="noopener noreferrer" href={event.livestreamUrl}>
                  {event.livestreamUrl}
                </a>
              </div>
            </div>
          </div>
        </>
      )}

      {/* address */}
      {event.type !== EventType.COMPETITION_ONLINE && event.venueCity && (
        <>
          <Separator />

          <div className="p-2">Venue address:</div>
          <div className="select-text p-2">
            <p>{`${event.venueStreet} ${event.venueHouseNo}`}</p>
            <p>{`${event.venuePostCode} ${event.venueCity}`}</p>
            <p>{event.venueCountry}</p>
          </div>

          <TextButton
            text={showMap ? 'Hide Map' : 'Show Map'}
            onClick={() => {
              setShowMap(showMap ? false : true);
            }}
          />
          {showMap && (
            <div className="mt-2 flex w-full justify-center">
              <div className="w-full max-w-xl rounded-lg border border-secondary-dark hover:border-primary">
                <div className="aspect-square w-full">
                  <Map address={`${event.venueHouseNo} ${event.venueStreet} ${event.venuePostCode} ${event.venueCity}`} />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventInfo;
