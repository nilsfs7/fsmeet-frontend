'use client';

import { useState, type ReactNode } from 'react';
import {
  imgAccommodation,
  imgCompetition,
  imgMeeting,
  imgParticipantDrinks,
  imgParticipantDrinksAndSnacks,
  imgParticipantSnacks,
  imgPrizeMoney,
  imgRanked,
  imgUserDefaultImg,
} from '@/domain/constants/images';
import TextareaAutosize from 'react-textarea-autosize';
import { getShortDateString } from '@/functions/time';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { NotListedLabel } from '@/components/events/not-listed-label';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { IconCalendarEvent, IconHourglassHigh, IconHourglassOff, IconMapPin, IconWorld } from '@tabler/icons-react';
import { Size } from '@/domain/enums/size';

const cardSurface = cn('h-fit min-w-0 overflow-hidden rounded-2xl border border-border bg-background shadow-xs');

const sectionClass = 'border-t border-border/70 px-4 py-4 sm:px-6 sm:py-5';

const softButtonClass = 'h-8 gap-1 rounded-lg border border-border bg-background px-2.5 text-foreground shadow-xs transition-colors hover:bg-muted';

function MetaRow({ icon, children, className }: { icon: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex min-w-0 items-center gap-3', className)}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground/80 [&>svg]:h-[18px] [&>svg]:w-[18px]">{icon}</div>
      <div className="min-w-0 flex-1 wrap-break-word text-sm font-medium leading-snug text-foreground">{children}</div>
    </div>
  );
}

function Perk({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="inline-flex w-fit min-w-0 items-center gap-2 rounded-full border border-border bg-muted/60 py-1 pl-1.5 pr-3">
      <img src={icon} alt="" className="h-5 w-5 object-contain" />
      <div className="text-sm font-medium leading-snug text-foreground">{label}</div>
    </div>
  );
}

interface IEventProps {
  event: Event;
  eventAdmin: User;
  showMessengerInvitationUrl: boolean;
}

export const EventInfo = ({ event, eventAdmin, showMessengerInvitationUrl }: IEventProps) => {
  const t = useTranslations('/events/eventid');

  const router = useRouter();

  const [showMap, setShowMap] = useState<boolean>(false);
  const [posterPreviewOpen, setPosterPreviewOpen] = useState(false);
  const [donationQrOpen, setDonationQrOpen] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  const posterSrc = event.imageUrlPoster || (event.type === EventType.MEETING ? imgMeeting : imgCompetition);
  const isCustomPoster = Boolean(event.imageUrlPoster);
  const isDescriptionLong = (event.description?.length || 0) > 320;

  let eventFee = event.participationFee > 0 ? `${convertCurrencyIntegerToDecimal(event.participationFee, event.currency).toFixed(2).replace('.', ',')} ${getCurrencySymbol(event.currency)}` : t('tabOverviewFeeFree');
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
      <VideoDialog queryParam="trailer" videoUrl={event.trailerUrl || ''} title={t('dlgVideoTitle')} onCancel={handleCancelDialogClicked} />

      <Dialog open={posterPreviewOpen} onOpenChange={setPosterPreviewOpen}>
        <DialogContent aria-describedby={undefined} className="w-auto max-w-[min(100vw-2rem,64rem)]">
          <DialogHeader className="sr-only">
            <DialogTitle>{event.name}</DialogTitle>
          </DialogHeader>
          <img src={posterSrc} alt="" className={cn('max-h-[min(70dvh,100%)] w-full object-contain', !isCustomPoster && 'p-8')} />
        </DialogContent>
      </Dialog>

      {event.donationUrl && (
        <Dialog open={donationQrOpen} onOpenChange={setDonationQrOpen}>
          <DialogContent aria-describedby={undefined} className="max-w-sm">
            <DialogHeader className="items-center text-center sm:text-center">
              <DialogTitle>{t('tabOverviewDonation')}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-lg bg-white p-3">
                <QRCodeSVG value={event.donationUrl} size={208} level="M" title={t('tabOverviewDonation')} />
              </div>
              <Button asChild variant="action" className={ctaActionButtonClassName}>
                <a href={event.donationUrl} target="_blank" rel="noopener noreferrer">
                  {t('tabOverviewDonationOpenLink')}
                </a>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className={cardSurface}>
        <div className="p-4 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6 md:gap-8">
            <div className="order-2 flex min-w-0 flex-1 flex-col gap-4 sm:order-1">
              <div className="flex flex-col gap-2">
                {!isPublicEventState(event.state) && <NotListedLabel className="w-fit" />}
                <h1 className="min-w-0 text-balance text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">{event.name}</h1>
              </div>

              <div className="flex flex-col gap-2.5">
                <MetaRow icon={<IconCalendarEvent stroke={1.75} />}>
                  {moment(event.dateFrom).isSame(moment(event.dateTo), 'day')
                    ? getShortDateString(moment(event.dateFrom))
                    : `${getShortDateString(moment(event.dateFrom), false)} – ${getShortDateString(moment(event.dateTo))}`}
                </MetaRow>
                <MetaRow icon={event.type === EventType.COMPETITION_ONLINE ? <IconWorld stroke={1.75} /> : <IconMapPin stroke={1.75} />}>{event.type === EventType.COMPETITION_ONLINE ? t('tabOverviewOnline') : event.venueCity}</MetaRow>
                <MetaRow
                  icon={moment(event.registrationDeadline) > moment() ? <IconHourglassHigh stroke={1.75} /> : <IconHourglassOff stroke={1.75} />}
                >{`${getShortDateString(moment(event.registrationOpen), false)} – ${getShortDateString(moment(event.registrationDeadline))}`}</MetaRow>
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
                    <Link className="block h-full w-full" href={`${routeUsers}/${event.admin}`}>
                      <img src={eventAdmin?.imageUrl || imgUserDefaultImg} className="h-full w-full object-cover" alt="" />
                    </Link>
                  </div>
                  <div className="min-w-0 flex-1 text-sm font-medium text-foreground">
                    <Link className="hover:underline" href={`${routeUsers}/${event.admin}`}>
                      {eventAdmin?.lastName && `${eventAdmin?.firstName} ${eventAdmin?.lastName}`}
                      {!eventAdmin?.lastName && eventAdmin?.firstName && `${eventAdmin?.firstName}`}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className={cn('order-1 w-full shrink-0 sm:order-2 sm:w-48 md:w-56 lg:w-64', !isCustomPoster && 'hidden sm:block')}>
              <div className="mx-auto w-full max-w-sm overflow-hidden rounded-xl shadow-sm sm:mx-0 sm:max-w-none">
                <button
                  type="button"
                  onClick={() => setPosterPreviewOpen(true)}
                  className="group relative w-full text-left outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label={t('tabOverviewPosterPreview')}
                >
                  <div className={cn('relative w-full aspect-4/5 overflow-hidden rounded-xl', !isCustomPoster && 'bg-muted')}>
                    <img
                      src={posterSrc}
                      alt=""
                      className={cn(
                        'h-full w-full transition-transform duration-200 group-hover:scale-[1.02] group-focus-visible:scale-[1.02]',
                        isCustomPoster ? 'object-cover object-center' : 'object-contain object-center p-4 sm:p-5',
                      )}
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {(event.isWffaRanked || event.prizeMoney > 0 || event.accommodations.length > 0 || event.participantDrinks || event.participantSnacks) && (
          <div className={sectionClass}>
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              {event.isWffaRanked && <Perk icon={imgRanked} label={t('tabOverviewPerkWffaRanked')} />}
              {event.prizeMoney > 0 && <Perk icon={imgPrizeMoney} label={t('tabOverviewPerkPrizeMoney')} />}
              {event.accommodations.length > 0 && <Perk icon={imgAccommodation} label={t('tabOverviewPerkAccommodation')} />}
              {event.participantDrinks && !event.participantSnacks && <Perk icon={imgParticipantDrinks} label={t('tabOverviewPerkParticipantDrinks')} />}
              {event.participantSnacks && !event.participantDrinks && <Perk icon={imgParticipantSnacks} label={t('tabOverviewPerkParticipantSnacks')} />}
              {event.participantDrinks && event.participantSnacks && <Perk icon={imgParticipantDrinksAndSnacks} label={t('tabOverviewPerkParticipantDrinksAndSnacks')} />}
            </div>
          </div>
        )}

        {event.description && (
          <div className={sectionClass}>
            <div className="flex h-fit min-w-0 flex-col text-sm leading-relaxed text-foreground/90">
              <TextareaAutosize
                readOnly
                className={cn('h-full w-full resize-none bg-transparent text-foreground/90 outline-hidden', !descriptionExpanded && isDescriptionLong && 'max-h-28 overflow-hidden')}
                value={event.description}
              />
              {isDescriptionLong && (
                <div className="mt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={softButtonClass}
                    onClick={() => setDescriptionExpanded(prev => !prev)}
                    aria-label={descriptionExpanded ? t('tabOverviewBtnShowLessDescription') : t('tabOverviewBtnShowMoreDescription')}
                  >
                    <span className="text-sm font-medium">{descriptionExpanded ? t('tabOverviewBtnShowLessDescription') : t('tabOverviewBtnShowMoreDescription')}</span>
                    {descriptionExpanded ? <ChevronUp className="h-4 w-4" aria-hidden /> : <ChevronDown className="h-4 w-4" aria-hidden />}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {(event.trailerUrl || event.livestreamUrl || event.donationUrl || (event.messengerInvitationUrl && showMessengerInvitationUrl)) && (
          <div className={sectionClass}>
            <div className="flex flex-col gap-2 text-sm font-medium text-foreground">
              {event.trailerUrl && (
                <div className={'grid grid-cols-3 items-center'}>
                  <div className="col-span-1">{t('tabOverviewTrailer')}</div>
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
                  <div className="col-span-1">{t('tabOverviewLivestream')}</div>
                  <a target="_blank" rel="noopener noreferrer" href={event.livestreamUrl}>
                    <ActionButton action={Action.GOTOEXTERNAL} />
                  </a>
                </div>
              )}

              {event.messengerInvitationUrl && showMessengerInvitationUrl && (
                <div className={'grid grid-cols-3 items-center'}>
                  <div className="col-span-1">{t('tabOverviewGroupChat')}</div>
                  <div className="col-span-2 hover:underline select-text wrap-break-word">
                    <a target="_blank" rel="noopener noreferrer" href={event.messengerInvitationUrl}>
                      <ActionButton action={Action.GOTOEXTERNAL} />
                    </a>
                  </div>
                </div>
              )}

              {event.donationUrl && (
                <div className={'grid grid-cols-3 items-center'}>
                  <div className="col-span-1">{t('tabOverviewDonation')}</div>
                  <ActionButton
                    action={Action.DONATE}
                    onClick={() => {
                      setDonationQrOpen(true);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {event.type !== EventType.COMPETITION_ONLINE && event.venueCity && (
          <div className={sectionClass}>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('tabOverviewVenueAddress')}</div>
            <div className="mt-1 flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end sm:gap-2">
              <div className="min-w-0 select-text text-sm text-foreground/90">
                <p className="mb-1 font-semibold text-foreground">{event.venueName}</p>
                <p>{`${event.venueStreet} ${event.venueHouseNo}`}</p>
                <p>{`${event.venuePostCode} ${event.venueCity}`}</p>
                <p>{getCountryNameByCode(event.venueCountryCode)}</p>
              </div>

              <div className="flex shrink-0 gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={softButtonClass}
                  onClick={() => {
                    setShowMap(prev => !prev);
                  }}
                  aria-label={showMap ? t('tabOverviewBtnHideVenueMap') : t('tabOverviewBtnShowVenueMap')}
                >
                  <span className="text-sm font-medium">{showMap ? t('tabOverviewBtnHideVenueMap') : t('tabOverviewBtnShowVenueMap')}</span>
                  {showMap ? <ChevronUp className="h-4 w-4" aria-hidden /> : <ChevronDown className="h-4 w-4" aria-hidden />}
                </Button>

                <a href={getMapsSearchUrl()} target="_blank" rel="noopener noreferrer">
                  <ActionButton action={Action.GOTOEXTERNAL} size={Size.S} />
                </a>
              </div>
            </div>

            {showMap && (
              <div className="mt-2 flex w-full justify-center">
                <div className="w-full max-h-[60vh] aspect-square overflow-hidden rounded-xl border border-border">
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
