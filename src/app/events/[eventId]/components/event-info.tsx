'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { imgCalender, imgCompetition, imgHourglassEnd, imgHourglassStart, imgLocation, imgMeeting, imgUserDefaultImg } from '@/domain/constants/images';
import TextareaAutosize from 'react-textarea-autosize';
import { getShortDateString } from '@/functions/time';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { Event } from '@/domain/types/event';
import moment from 'moment';
import { EventType } from '@/domain/enums/event-type';
import { User } from '@/domain/types/user';
import { useTranslations } from 'next-intl';
import ActionButton from '@/components/common/action-button';
import { Action } from '@/domain/enums/action';
import VideoDialog from '@/components/video-dialog';
import { useRouter } from 'next/navigation';
import { routeEvents, routeUsers } from '@/domain/constants/routes';
import { getCountryNameByCode } from '@/functions/get-country-name-by-code';
import { convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';
import { getCurrencySymbol } from '@/functions/get-currency-symbol';
import { isPublicEventState } from '@/functions/event-state';
import Link from 'next/link';
import { LocationMap } from '../../../../components/location-map';
import { cn } from '@/lib/utils';

const cardSurface = cn(
  'h-fit min-w-0 overflow-hidden rounded-xl border border-border/60',
  'bg-secondary-light/85 shadow-xs backdrop-blur-sm',
  'supports-[backdrop-filter]:bg-secondary-light/70',
  'dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50',
);

function MetaRow({ icon, children, className }: { icon: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex min-w-0 items-center gap-2', className)}>
      <div className="flex h-7 w-7 shrink-0 items-center justify-center [&>img]:h-full [&>img]:w-full [&>img]:object-contain">{icon}</div>
      <div className="type-body-sm min-w-0 flex-1 break-words text-foreground/90 leading-snug">{children}</div>
    </div>
  );
}

interface IEventProps {
  event: Event;
  eventAdmin: User;
  showMessangerInvitationUrl: boolean;
}

export const EventInfo = ({ event, eventAdmin, showMessangerInvitationUrl }: IEventProps) => {
  const t = useTranslations('/events/eventid');

  const router = useRouter();

  const [showMap, setShowMap] = useState<boolean>(false);
  const [posterPreviewOpen, setPosterPreviewOpen] = useState(false);

  const posterSrc = event.imageUrlPoster || (event.type === EventType.MEETING ? imgMeeting : imgCompetition);

  useEffect(() => {
    if (!posterPreviewOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [posterPreviewOpen]);

  useEffect(() => {
    if (!posterPreviewOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPosterPreviewOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [posterPreviewOpen]);

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
    if (event.venueCountryCode) url = `${url}${event.venueCountryCode}+`;

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
      <VideoDialog queryParam="trailer" videoUrl={event.trailerUrl || ''} onCancel={handleCancelDialogClicked} />

      {posterPreviewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black/75 p-4" onClick={() => setPosterPreviewOpen(false)}>
          <img src={posterSrc} alt="" className="max-h-[min(100dvh-2rem,100%)] max-w-[min(100vw-2rem,100%)] object-contain" onClick={e => e.stopPropagation()} />
        </div>
      )}

      <div className={cardSurface}>
        <div className="p-2.5 sm:p-3 md:p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5 md:gap-6">
            <div className="order-2 flex min-w-0 flex-1 flex-col gap-2.5 sm:order-1 sm:gap-3">
              <h1 className="min-w-0 text-balance text-lg font-semibold leading-tight tracking-tight text-foreground sm:text-xl">
                {!isPublicEventState(event.state) && (
                  <span className="mb-1 mr-1.5 inline-block align-middle rounded-md border border-border/50 bg-muted/50 px-1.5 py-0.5 text-2xs font-medium text-muted-foreground sm:mb-0 sm:text-xs">
                    NOT LISTED
                  </span>
                )}
                <span className="align-middle">{event.name}</span>
              </h1>

              <div className="flex flex-col gap-1.5 sm:gap-2">
                <MetaRow icon={<img src={imgCalender} alt="" />}>
                  {moment(event.dateFrom).isSame(moment(event.dateTo), 'day')
                    ? getShortDateString(moment(event.dateFrom))
                    : `${getShortDateString(moment(event.dateFrom), false)} – ${getShortDateString(moment(event.dateTo))}`}
                </MetaRow>
                <MetaRow icon={<img src={imgLocation} alt="" />}>{event.type === EventType.COMPETITION_ONLINE ? 'online' : event.venueCity}</MetaRow>
                <MetaRow
                  icon={<img src={moment(event.registrationDeadline) > moment() ? imgHourglassStart : imgHourglassEnd} alt="" />}
                >{`${getShortDateString(moment(event.registrationOpen), false)} – ${getShortDateString(moment(event.registrationDeadline))}`}</MetaRow>
                <div className="flex min-w-0 items-center gap-2">
                  <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full">
                    <Link className="block h-full w-full" href={`${routeUsers}/${event.admin}`}>
                      <img src={eventAdmin?.imageUrl || imgUserDefaultImg} className="h-full w-full object-cover" alt="" />
                    </Link>
                  </div>
                  <div className="type-body-sm min-w-0 flex-1 font-medium text-foreground/90">
                    <Link className="hover:underline" href={`${routeUsers}/${event.admin}`}>
                      {eventAdmin?.lastName && `${eventAdmin?.firstName} ${eventAdmin?.lastName}`}
                      {!eventAdmin?.lastName && eventAdmin?.firstName && `${eventAdmin?.firstName}`}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 w-full shrink-0 sm:order-2 sm:w-48 md:w-56 lg:w-64">
              <div className="mx-auto w-full max-w-sm overflow-hidden rounded-lg sm:mx-0 sm:max-w-none">
                <button
                  type="button"
                  onClick={() => setPosterPreviewOpen(true)}
                  className="group relative w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label="Event poster, open preview"
                >
                  <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg">
                    <img className="h-full w-full object-cover object-center transition-transform duration-200 group-hover:scale-[1.02] group-focus-visible:scale-[1.02]" src={posterSrc} alt="" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {event.description && (
          <div className="border-t border-border/50 px-2.5 sm:px-3 md:px-4 py-2.5 sm:py-3">
            <div className="flex h-fit min-w-0 flex-col type-body-sm text-foreground/90">
              <TextareaAutosize readOnly className="h-full w-full resize-none overflow-hidden bg-transparent text-foreground/90 outline-none" value={event.description} />
            </div>
          </div>
        )}

        {(event.trailerUrl || event.livestreamUrl || (event.messangerInvitationUrl && showMessangerInvitationUrl)) && (
          <div className="border-t border-border/50 px-2.5 sm:px-3 md:px-4 py-2.5 sm:py-3">
            <div className="flex flex-col gap-2 type-body-sm text-foreground">
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
          </div>
        )}

        {event.type !== EventType.COMPETITION_ONLINE && event.venueCity && (
          <div className="border-t border-border/50 px-2.5 sm:px-3 md:px-4 py-2.5 sm:py-3">
            <div className="type-body-sm font-medium text-foreground">{t('tabOverviewVenueAddress')}</div>
            <div className="type-body-sm mt-1 select-text text-foreground/90">
              <p>{event.venueName}</p>
              <p className="mt-1">{`${event.venueStreet} ${event.venueHouseNo}`}</p>
              <p>{`${event.venuePostCode} ${event.venueCity}`}</p>
              <p>{getCountryNameByCode(event.venueCountryCode)}</p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="action"
                className={ctaActionButtonClassName}
                onClick={() => {
                  setShowMap(showMap ? false : true);
                }}
              >
                {showMap ? t('tabOverviewBtnHideVenueMap') : t('tabOverviewBtnShowVenueMap')}
              </Button>

              <a href={getMapsSearchUrl()} target="_blank" rel="noopener noreferrer">
                <ActionButton action={Action.GOTOEXTERNAL} />
              </a>
            </div>

            {showMap && (
              <div className="mt-2 flex w-full justify-center">
                <div className="w-full max-h-[60vh] aspect-square overflow-hidden rounded-lg border border-border/60 transition-colors hover:border-primary/50">
                  <LocationMap address={`${event.venueHouseNo} ${event.venueStreet} ${event.venuePostCode} ${event.venueCity}`} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
