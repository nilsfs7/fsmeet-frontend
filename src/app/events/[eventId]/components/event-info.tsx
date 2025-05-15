import { useState } from 'react';
import { imgCompetition, imgMeeting } from '@/domain/constants/images';
import TextareaAutosize from 'react-textarea-autosize';
import Map from '../../../../components/Map';
import { getShortDateString } from '@/functions/time';
import Separator from '../../../../components/Seperator';
import TextButton from '../../../../components/common/TextButton';
import { Event } from '@/types/event';
import moment from 'moment';
import { EventType } from '@/domain/enums/event-type';
import { User } from '@/types/user';
import UserCard from '../../../../components/user/UserCard';
import { useTranslations } from 'next-intl';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/domain/enums/action';
import VideoDialog from '@/components/VideoDialog';
import { useRouter } from 'next/navigation';
import { routeEvents } from '@/domain/constants/routes';
import { getCountryNameByCode } from '@/functions/get-country-name-by-code';
import { convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';

interface IEventProps {
  event: Event;
  eventAdmin: User;
  showMessangerInvitationUrl: boolean;
}

export const EventInfo = ({ event, eventAdmin, showMessangerInvitationUrl }: IEventProps) => {
  const t = useTranslations('/events/eventid');

  const router = useRouter();

  const [showMap, setShowMap] = useState<boolean>(false);

  let eventFee = event.participationFee > 0 ? `${convertCurrencyIntegerToDecimal(event.participationFee, 'EUR').toString().replace('.', ',')}  €` : 'free';
  if (event.paymentMethodStripe.enabled && event.paymentMethodStripe.coverProviderFee) {
    eventFee = `${convertCurrencyIntegerToDecimal(event.participationFeeIncPaymentCosts, 'EUR').toString().replace('.', ',')}  €`;
  }

  const getMapsSearchUrl = (): string => {
    let url = `https://www.google.com/maps/search/`;

    if (event.venueStreet) url = `${url}${event.venueStreet}+`;
    if (event.venueHouseNo) url = `${url}${event.venueHouseNo}+`;
    if (event.venuePostCode) url = `${url}${event.venuePostCode}+`;
    if (event.venueCity) url = `${url}${event.venueCity}+`;
    if (event.venueCountry) url = `${url}${event.venueCountry}+`;

    return url;
  };

  const handleCancelDialogClicked = async () => {
    router.replace(`${routeEvents}/${event.id}`);
    router.refresh();
  };

  const onTrailerClicked = async () => {
    router.replace(`${routeEvents}/${event.id}?trailer=1`);
  };

  return (
    <>
      <VideoDialog queryParam="trailer" videoUrl={event.trailerUrl} onCancel={handleCancelDialogClicked} />

      <div className={'h-fit rounded-lg border border-secondary-dark bg-secondary-light p-2 text-sm'}>
        {/* top */}
        <div className={'grid grid-cols-3 p-2'}>
          <div className="col-span-2 flex flex-col">
            <div className="text-base font-bold mb-2">{event.name}</div>
            {event.dateFrom && event.dateTo && (
              <div>
                {moment(event.dateFrom).isSame(moment(event.dateTo), 'day')
                  ? `${getShortDateString(moment(event.dateFrom))}`
                  : `${getShortDateString(moment(event.dateFrom), false)} - ${getShortDateString(moment(event.dateTo))}`}
              </div>
            )}
            <div className="col-span-2">{event.type === EventType.COMPETITION_ONLINE ? 'online' : event.venueCity}</div>
          </div>

          <div className="row-span-3 flex justify-end">
            {event.imageUrlPoster && <img className="h-28 aspect-[4/5] object-fill" src={event.imageUrlPoster} alt={'event image'} />}
            {!event.imageUrlPoster && <img className="h-28 aspect-[4/5]" src={event.type === EventType.MEETING ? imgMeeting : imgCompetition} alt={'event image'} />}
          </div>
        </div>

        <Separator />

        <div className={'grid grid-cols-3 justify-end object-right p-2 gap-1'}>
          <div className="col-span-1">{t('tabOverviewRegistrationFrom')}</div>
          {event.registrationOpen && <div className="col-span-2">{getShortDateString(moment(event.registrationOpen))}</div>}

          <div className="col-span-1">{t('tabOverviewRegistrationTo')}</div>
          {event.registrationDeadline && <div className="col-span-2">{getShortDateString(moment(event.registrationDeadline))}</div>}

          <div className="col-span-1">{t('tabOverviewParticipationFee')}</div>
          <div className="col-span-2">{eventFee}</div>

          <div className="col-span-1 flex items-center">{t('tabOverviewEventHost')}</div>
          {eventAdmin && (
            <div className="col-span-2">
              <UserCard user={eventAdmin} />
            </div>
          )}
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

        {/* urls */}
        {(event.trailerUrl || event.livestreamUrl || (event.messangerInvitationUrl && showMessangerInvitationUrl)) && <Separator />}

        <div className="flex flex-col p-2 gap-2">
          {event.trailerUrl && (
            <div className={'grid grid-cols-3 items-center'}>
              <div className="col-span-1">{`Trailer`}</div>
              <ActionButton
                action={Action.PLAY}
                onClick={() => {
                  onTrailerClicked();
                }}
              />
            </div>
          )}

          {event.livestreamUrl && (
            <div className={'grid grid-cols-3 items-center'}>
              <div className="col-span-1">{`Livestream`}</div>
              <a target="_blank" rel="noopener noreferrer" href={event.livestreamUrl}>
                <ActionButton action={Action.GOTOEXTERNAL} />
              </a>
            </div>
          )}

          {event.messangerInvitationUrl && showMessangerInvitationUrl && (
            <div className={'grid grid-cols-3 items-center'}>
              <div className="col-span-1">{`Group chat invitation link`}</div>
              <div className="col-span-2 hover:underline select-text break-words">
                <a target="_blank" rel="noopener noreferrer" href={event.messangerInvitationUrl}>
                  <ActionButton action={Action.GOTOEXTERNAL} />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* address */}
        {event.type !== EventType.COMPETITION_ONLINE && event.venueCity && (
          <>
            <Separator />

            <div className="p-2">{t('tabOverviewVenueAddress')}</div>
            <div className="select-text p-2">
              <p>{event.venueName}</p>
              <p className="mt-1">{`${event.venueStreet} ${event.venueHouseNo}`}</p>
              <p>{`${event.venuePostCode} ${event.venueCity}`}</p>
              <p>{getCountryNameByCode(event.venueCountry)}</p>
            </div>

            <div className="flex p-2 gap-2">
              <TextButton
                text={showMap ? t('tabOverviewBtnHideVenueMap') : t('tabOverviewBtnShowVenueMap')}
                onClick={() => {
                  setShowMap(showMap ? false : true);
                }}
              />

              <a href={getMapsSearchUrl()} target="_blank" rel="noopener noreferrer">
                <ActionButton action={Action.GOTOEXTERNAL} />
              </a>
            </div>

            {showMap && (
              <div className="mt-2 flex w-full justify-center">
                <div className="w-full max-h-[60vh] aspect-square rounded-lg border border-secondary-dark hover:border-primary">
                  <Map address={`${event.venueHouseNo} ${event.venueStreet} ${event.venuePostCode} ${event.venueCity}`} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
