import { useState } from 'react';
import { imgCalender, imgCompetition, imgHourglassEnd, imgHourglassStart, imgLocation, imgMeeting, imgUserDefaultImg } from '@/domain/constants/images';
import TextareaAutosize from 'react-textarea-autosize';
import Map from '../../../../components/Map';
import { getShortDateString } from '@/functions/time';
import Separator from '../../../../components/Seperator';
import TextButton from '../../../../components/common/TextButton';
import { Event } from '@/domain/types/event';
import moment from 'moment';
import { EventType } from '@/domain/enums/event-type';
import { User } from '@/domain/types/user';
import { useTranslations } from 'next-intl';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/domain/enums/action';
import VideoDialog from '@/components/VideoDialog';
import { useRouter } from 'next/navigation';
import { routeEvents, routeUsers } from '@/domain/constants/routes';
import { getCountryNameByCode } from '@/functions/get-country-name-by-code';
import { convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';
import { getCurrencySymbol } from '@/functions/get-currency-symbol';
import { isPublicEventState } from '@/functions/event-state';
import Link from 'next/link';

interface IEventProps {
  event: Event;
  eventAdmin: User;
  showMessangerInvitationUrl: boolean;
}

export const EventInfo = ({ event, eventAdmin, showMessangerInvitationUrl }: IEventProps) => {
  const t = useTranslations('/events/eventid');

  const router = useRouter();

  const [showMap, setShowMap] = useState<boolean>(false);

  let eventFee = event.participationFee > 0 ? `${convertCurrencyIntegerToDecimal(event.participationFee, event.currency).toFixed(2).replace('.', ',')} ${getCurrencySymbol(event.currency)}` : 'free';
  if (event.paymentMethodStripe.enabled && event.paymentMethodStripe.coverProviderFee) {
    eventFee = `${convertCurrencyIntegerToDecimal(event.participationFeeIncPaymentCosts, event.currency).toFixed(2).replace('.', ',')} ${getCurrencySymbol(event.currency)}`;
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

      <div className={'h-fit flex flex-col gap-2 rounded-lg border border-secondary-dark bg-secondary-light p-2 text-sm'}>
        <div className="flex justify-between">
          <div className="w-2/3 h-full flex flex-col justify-between">
            {/* Event Title */}
            <div className="w-full h-12 text-base font-bold">{`${!isPublicEventState(event.state) ? '[NOT LISTED] ' : ''}${event.name}`}</div>

            <div className="h-24 flex flex-col gap-1 text-sm">
              {/* Time */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5">
                  <img src={imgCalender} className="w-full h-full object-fill" />
                </div>

                <div className="truncate">
                  {moment(event.dateFrom).isSame(moment(event.dateTo), 'day')
                    ? `${getShortDateString(moment(event.dateFrom))}`
                    : `${getShortDateString(moment(event.dateFrom), false)} - ${getShortDateString(moment(event.dateTo))}`}
                </div>
              </div>

              {/* Location  */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5">
                  <img src={imgLocation} className="w-full h-full object-fill" />
                </div>

                <div className="truncate">{`${event.type === EventType.COMPETITION_ONLINE ? 'online' : event.venueCity}`}</div>
              </div>

              {/* Deadline  */}
              {/* {moment(event.dateFrom) > moment() && ( */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5">
                  <img src={moment(event.registrationDeadline) > moment() ? imgHourglassStart : imgHourglassEnd} className="w-full h-full object-fill" />
                </div>

                <div className="truncate">{`${getShortDateString(moment(event.registrationOpen), false)} - ${getShortDateString(moment(event.registrationDeadline))}`}</div>
              </div>
              {/* )} */}

              {/* Event Host  */}
              <div className="flex gap-2 items-center">
                <div className="w-5 h-5">
                  <Link href={`${routeUsers}/${event.admin}`}>
                    <img src={eventAdmin?.imageUrl || imgUserDefaultImg} className="w-full h-full object-cover rounded-full" />
                  </Link>
                </div>

                <div className="truncate hover:underline font-bold">
                  <Link href={`${routeUsers}/${event.admin}`}>
                    {eventAdmin?.lastName && `${eventAdmin?.firstName}  ${eventAdmin?.lastName}`}
                    {!eventAdmin?.lastName && `${eventAdmin?.firstName}`}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Event Type / Image */}
          <div className="w-1/3 flex flex-col items-end">
            {event.imageUrlPoster && <img className="h-36 aspect-[4/5] object-fill rounded-lg" src={event.imageUrlPoster} alt={'event image'} />}
            {!event.imageUrlPoster && <img className="h-36 aspect-[4/5] rounded-lg" src={event.type === EventType.MEETING ? imgMeeting : imgCompetition} alt={'event image'} />}
          </div>
        </div>

        {/* description */}
        {event.description && (
          <>
            <Separator />

            <div className="flex h-fit flex-col">
              <TextareaAutosize readOnly className="h-full w-full resize-none overflow-hidden bg-transparent outline-none" value={event.description} />
            </div>
          </>
        )}

        {/* urls */}
        {(event.trailerUrl || event.livestreamUrl || (event.messangerInvitationUrl && showMessangerInvitationUrl)) && (
          <>
            <Separator />

            <div className="flex flex-col gap-2">
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
          </>
        )}

        {/* address */}
        {event.type !== EventType.COMPETITION_ONLINE && event.venueCity && (
          <>
            <Separator />

            <div>{t('tabOverviewVenueAddress')}</div>
            <div className="select-text">
              <p>{event.venueName}</p>
              <p className="mt-1">{`${event.venueStreet} ${event.venueHouseNo}`}</p>
              <p>{`${event.venuePostCode} ${event.venueCity}`}</p>
              <p>{getCountryNameByCode(event.venueCountry)}</p>
            </div>

            <div className="flex gap-2">
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
