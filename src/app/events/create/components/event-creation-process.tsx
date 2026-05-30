'use client';

import { routeEventsCreate, routeEventsCreateSuccess, routeHome } from '@/domain/constants/routes';
import Navigation from '@/components/navigation';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import PageTitle from '@/components/page-title';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { Event } from '@/domain/types/event';
import { User } from '@/domain/types/user';
import { Toaster, toast } from 'sonner';
import { createEvent } from '@/infrastructure/clients/event.client';
import moment, { Moment } from 'moment';
import ActionButton from '@/components/common/action-button';
import { Action } from '@/domain/enums/action';
import TextInput from '@/components/common/text-input';
import { DatePicker } from '@/components/common/date-picker';
import { EventType } from '@/domain/enums/event-type';
import ComboBox from '@/components/common/combo-box';
import TextAndImageButton from '../../../../components/common/text-and-image-button';
import { imgCalender, imgCompetition, imgCompetitionOnline, imgCompetitionOnsite, imgLocation, imgMeeting } from '../../../../domain/constants/images';
import { CurrencyCode } from '../../../../domain/enums/currency-code';
import { EventCategory } from '../../../../domain/enums/event-category';
import { EventState } from '../../../../domain/enums/event-state';
import { menuCountries } from '../../../../domain/constants/menus/menu-countries';
import { getCountryNameByCode } from '../../../../functions/get-country-name-by-code';
import { menuEventCategories } from '../../../../domain/constants/menus/menu-event-categories';
import { getNameByEventType } from '../../../../functions/get-name-by-event-type';
import { toTitleCase } from '../../../../functions/string-manipulation';
import { getShortDateString } from '../../../../functions/time';
import { LicenseType } from '../../../../domain/enums/license-type';
import { cn } from '@/lib/utils';

const EDITOR_CARD_CLASS = cn(
  'flex w-full max-w-2xl min-w-0 flex-col overflow-y-auto scrollbar-none',
  'gap-3 rounded-xl border border-border/60 bg-secondary-light/85 p-2.5 shadow-xs backdrop-blur-sm',
  'supports-[backdrop-filter]:bg-secondary-light/70',
  'dark:border-border/50 dark:bg-background/60 dark:supports-[backdrop-filter]:bg-background/50',
);
const FIELD_ROW_CLASS = 'grid min-w-0 grid-cols-[minmax(0,1fr),minmax(0,1.5fr)] items-center gap-x-3 gap-y-1';
const FIELD_LABEL_CLASS = 'min-w-0 text-sm font-medium leading-none';
const FIELD_CONTROL_CLASS = 'min-w-0 w-full';
const FIELD_CONTROL_TALL_INNER = 'flex min-h-10 w-full min-w-0 items-center';
const SECTION_H2 = 'text-sm font-semibold leading-tight text-foreground/90';

function FieldRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={FIELD_ROW_CLASS}>
      <div className={FIELD_LABEL_CLASS}>{label}</div>
      <div className={FIELD_CONTROL_CLASS}>{children}</div>
    </div>
  );
}

/** Matches `MetaRow` on the event details page (`event-info.tsx`). */
function MetaRow({ icon, children, className }: { icon: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex min-w-0 items-center gap-2', className)}>
      <div className="flex h-7 w-7 shrink-0 items-center justify-center [&>img]:h-full [&>img]:w-full [&>img]:object-contain">{icon}</div>
      <div className="type-body-sm min-w-0 flex-1 break-words text-foreground/90 leading-snug">{children}</div>
    </div>
  );
}

interface IEventCreationProcess {
  eventAdmin: User;
  licenses: number;
}

enum CreationProcessPage {
  EVENT_TYPE = '1',
  COMP_TYPE = '2',
  GENERAL_DETAILS = '3',
  OVERVIEW = '4',
}

export const EventCreationProcess = ({ eventAdmin, licenses }: IEventCreationProcess) => {
  const t = useTranslations(routeEventsCreate);

  const { data: session } = useSession();
  const router = useRouter();

  const searchParams = useSearchParams();
  const page = searchParams?.get('page');

  // event vars
  const [eventId, setEventId] = useState<string>();
  const [eventName, setEventName] = useState<string>();
  const [eventType, setEventType] = useState<EventType>();
  const [eventCategory, setEventCategory] = useState<EventCategory>(EventCategory.INTERNATIONAL);
  const [venueCountryCode, setVenueCountryCode] = useState<string>(eventAdmin?.countryCode || '');
  const [dateFrom, setDateFrom] = useState<string>();
  const [dateTo, setDateTo] = useState<string>();
  const [registrationDateFrom, setRegistrationDateFrom] = useState<string>(moment().startOf('day').utc().format());
  const [registrationDateTo, setRegistrationDateTo] = useState<string>();

  const pageUrl = `${routeEventsCreate}`;

  const generateEvent = (): Event => {
    return {
      id: eventId,
      licenseType: LicenseType.FREE,
      type: eventType || EventType.COMPETITION,
      name: eventName || '',
      alias: '',
      maintainers: [],
      dateFrom: dateFrom || '',
      dateTo: dateTo || '',
      registrationOpen: registrationDateFrom || '',
      registrationDeadline: registrationDateTo || '',
      participationFee: 0,
      participationFeeIncPaymentCosts: 0,
      enableVisitorRegistration: eventType !== EventType.COMPETITION_ONLINE,
      visitorFee: 0,
      visitorFeeIncPaymentCosts: 0,
      currency: CurrencyCode.EUR,
      description: '',
      venueName: '',
      venueHouseNo: '',
      venueStreet: '',
      venueCity: '',
      venuePostCode: '',
      venueCountryCode: venueCountryCode || '',
      category: eventCategory,
      isWffaRanked: false,
      priceMoney: 0,
      participantDrinks: false,
      participantSnacks: false,
      trailerUrl: null,
      livestreamUrl: null,
      messangerInvitationUrl: null,
      paymentMethodCash: {
        enabled: false,
      },
      paymentMethodPayPal: {
        enabled: false,
        payPalHandle: '',
      },
      paymentMethodSepa: {
        enabled: false,
        bank: '',
        recipient: '',
        iban: '',
        reference: '',
      },
      paymentMethodStripe: {
        enabled: false,
        coverProviderFee: false,
      },
      showUserCountryFlag: true,
      registrationCollectPhoneNumber: false,
      autoApproveRegistrations: false,
      notifyOnRegistration: true,
      allowComments: true,
      notifyOnComment: true,
      waiver: '',
      visaInvitationRequestsEnabled: false,
      accommodations: [],
      offerings: [],
      state: EventState.CREATED,
      imageUrlPoster: '',
    };
  };

  const handleEventNameChanged = (value: string) => {
    setEventName(value);
  };

  const handleVenueCountryCodeChanged = (value: string) => {
    setVenueCountryCode(value);
  };

  const handleEventCatergoryChanged = (value: EventCategory) => {
    setEventCategory(value);
  };

  const handleDateFromChanged = (value: Moment) => {
    setDateFrom(value.startOf('day').utc().format());

    if (!dateTo) {
      setDateTo(value.endOf('day').utc().format()); // set dateTo to same date when dateFrom from was changed (convenience)
    }

    if (!registrationDateTo) {
      setRegistrationDateTo(value.subtract(1, 'day').endOf('day').utc().format()); // set RegistrationDateTo to previous day when dateFrom from was changed (convenience)
    }
  };

  const handleDateToChanged = (value: Moment) => {
    setDateTo(value.endOf('day').utc().format());
  };

  const handleDateRegistrationFromChanged = (value: Moment) => {
    setRegistrationDateFrom(value.startOf('day').utc().format());
  };

  const handleDateRegistrationToChanged = (value: Moment) => {
    setRegistrationDateTo(value.endOf('day').utc().format());
  };

  const nextButtonDisabled = (): boolean => {
    if (page === CreationProcessPage.GENERAL_DETAILS) {
      // event name
      if (!eventName || eventName.length < 3) return true;

      // event type
      if (eventType !== EventType.COMPETITION_ONLINE && (!venueCountryCode || venueCountryCode === '')) return true;

      // dates
      if (!dateFrom || !dateTo || !registrationDateFrom || !registrationDateTo) return true;
      if (dateFrom > dateTo) return true;
      if (registrationDateFrom > registrationDateTo) return true;
      if (registrationDateTo > dateFrom) return true;
    }

    return false;
  };

  const cancelButtonShown = (): boolean => {
    if (page && page && page !== CreationProcessPage.EVENT_TYPE) {
      return true;
    }

    return false;
  };

  const backButtonShown = (): boolean => {
    if (page && page !== CreationProcessPage.EVENT_TYPE && page !== CreationProcessPage.COMP_TYPE) {
      return true;
    }

    return false;
  };

  const nextButtonShown = (): boolean => {
    if (page !== CreationProcessPage.EVENT_TYPE && page !== CreationProcessPage.COMP_TYPE && page !== CreationProcessPage.OVERVIEW) {
      return true;
    }

    return false;
  };

  const handleCancelClicked = async () => {
    router.replace(pageUrl);
  };

  const handleEventTypeChoiceClicked = async (eventType: EventType.COMPETITION | EventType.MEETING) => {
    setEventType(eventType);
    if (eventType === EventType.MEETING) {
      setEventCategory(EventCategory.INTERNATIONAL);
    }

    handleNextClicked(eventType);
  };

  const handleCompTypeChoiceClicked = async (eventType: EventType.COMPETITION | EventType.COMPETITION_ONLINE) => {
    setEventType(eventType);

    handleNextClicked(eventType);
  };

  const handlePreviousClicked = async () => {
    if (page) {
      let previousPage: string = '';

      switch (page) {
        case CreationProcessPage.EVENT_TYPE:
          router.replace(`${pageUrl}`);
          break;

        case CreationProcessPage.COMP_TYPE:
          previousPage = CreationProcessPage.EVENT_TYPE;
          break;

        case CreationProcessPage.GENERAL_DETAILS:
          if (eventType === EventType.MEETING) {
            previousPage = CreationProcessPage.EVENT_TYPE;
          } else {
            previousPage = CreationProcessPage.COMP_TYPE;
          }
          break;

        case CreationProcessPage.OVERVIEW:
          previousPage = CreationProcessPage.GENERAL_DETAILS;
          break;
      }

      if (previousPage) {
        router.replace(`${pageUrl}?page=${previousPage}`);
      }

      cacheEventInfo();
    }
  };

  const handleNextClicked = async (eventType?: EventType) => {
    if (!page) {
      router.replace(`${pageUrl}?page=${CreationProcessPage.EVENT_TYPE}`);
    } else {
      let nextPage: string = '';
      switch (page) {
        case CreationProcessPage.EVENT_TYPE:
          if (eventType !== EventType.MEETING) {
            nextPage = CreationProcessPage.COMP_TYPE;
          } else {
            nextPage = CreationProcessPage.GENERAL_DETAILS;
          }

          break;

        case CreationProcessPage.COMP_TYPE:
          nextPage = CreationProcessPage.GENERAL_DETAILS;

          break;

        case CreationProcessPage.GENERAL_DETAILS:
          nextPage = CreationProcessPage.OVERVIEW;

          break;
      }

      if (nextPage) {
        router.replace(`${pageUrl}?page=${nextPage}`);
      }
    }

    cacheEventInfo(eventType);
  };

  const handleCreateEventClicked = async (): Promise<string | void> => {
    try {
      const response = await createEvent(generateEvent(), session);

      setEventId(response.id);

      cacheEventInfo(undefined, response.id);

      router.replace(`${routeEventsCreateSuccess}?eventId=${encodeURIComponent(response.id)}`);

      return response.id;
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  const cacheEventInfo = async (eventType?: EventType, eventId?: string) => {
    try {
      const event = generateEvent();

      // synchronous overrides
      if (eventId) event.id = eventId;
      if (eventType) event.type = eventType;

      sessionStorage.setItem('eventInfo', JSON.stringify(event));
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  useEffect(() => {
    const eventInfoObject = sessionStorage.getItem('eventInfo');
    if (eventInfoObject) {
      const eventInfo: Event = JSON.parse(eventInfoObject);

      setEventId(eventInfo?.id);
      setEventName(eventInfo?.name);
      setEventType(eventInfo?.type);
      setDateFrom(eventInfo?.dateFrom);
      setDateTo(eventInfo?.dateFrom);
      setRegistrationDateFrom(eventInfo?.registrationOpen);
      setRegistrationDateTo(eventInfo?.registrationDeadline);
      setVenueCountryCode(eventInfo?.venueCountryCode);
    } else {
      router.push(`${routeEventsCreate}`);
    }
  }, []);

  useEffect(() => {
    // force setting the first page if none is set
    const params = new URLSearchParams(searchParams.toString());
    if (!params.has('page')) {
      params.set('page', CreationProcessPage.EVENT_TYPE);
      router.push(`?${params.toString()}`);
    }
  });

  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <Toaster richColors />

      {page && <PageTitle title={`${t('pageTitleEventCreationFlow')}`} />}

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-content flex-col items-center px-4 py-4 sm:px-6 md:px-8">
          {/* Page: General Event Type Choice */}
          {page && page === CreationProcessPage.EVENT_TYPE && (
            <div className="flex w-full max-w-2xl min-w-0 flex-col items-center gap-4">
              <p className="w-full text-balance text-center text-foreground">{t('pageEventTypeDescription')}</p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
                <TextAndImageButton
                  text={t('pageEventTypeCompetition')}
                  image={imgCompetition}
                  onClick={() => {
                    handleEventTypeChoiceClicked(EventType.COMPETITION);
                  }}
                />
                <TextAndImageButton
                  text={t('pageEventTypeMeeting')}
                  image={imgMeeting}
                  onClick={() => {
                    handleEventTypeChoiceClicked(EventType.MEETING);
                  }}
                />
              </div>
            </div>
          )}

          {/* Page: Comp Type Choice */}
          {page && page === CreationProcessPage.COMP_TYPE && (
            <div className="flex w-full max-w-2xl min-w-0 flex-col items-center gap-4">
              <p className="w-full text-balance text-center text-foreground">{t('pageCompTypeDescription')}</p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
                <TextAndImageButton
                  text={t('pageCompTypeOnsite')}
                  image={imgCompetitionOnsite}
                  onClick={() => {
                    handleCompTypeChoiceClicked(EventType.COMPETITION);
                  }}
                />
                <TextAndImageButton
                  text={t('pageCompTypeOnline')}
                  image={imgCompetitionOnline}
                  onClick={() => {
                    handleCompTypeChoiceClicked(EventType.COMPETITION_ONLINE);
                  }}
                />
              </div>
            </div>
          )}

          {/* Page: General Details */}
          {page && page === CreationProcessPage.GENERAL_DETAILS && (
            <div className={EDITOR_CARD_CLASS}>
              <h2 className={cn(SECTION_H2, 'text-center sm:text-left')}>{t('pageGeneralDetailsDescription')}</h2>

              <div className="flex flex-col gap-3">
                <TextInput
                  id={'name'}
                  label={t('pageGeneralDetailsInputName')}
                  placeholder="German Freestyle Football Championship 2023"
                  value={eventName}
                  onChange={e => {
                    handleEventNameChanged(e.currentTarget.value);
                  }}
                />

                {eventType !== EventType.MEETING && (
                  <FieldRow label={t('pageGeneralDetailsCbCategory')}>
                    <ComboBox
                      menus={menuEventCategories(eventAdmin?.isWffaMember || false)}
                      value={eventCategory}
                      onChange={(value: EventCategory) => {
                        handleEventCatergoryChanged(value);
                      }}
                    />
                  </FieldRow>
                )}

                {eventType !== EventType.COMPETITION_ONLINE && (
                  <FieldRow label={t('pageGeneralDetailsCbVenueCountry')}>
                    <ComboBox
                      menus={menuCountries}
                      value={venueCountryCode || eventAdmin?.countryCode || ''}
                      searchEnabled={true}
                      onChange={(value: any) => {
                        handleVenueCountryCodeChanged(value);
                      }}
                    />
                  </FieldRow>
                )}

                <FieldRow label={t('pageGeneralDetailsDatePickerFrom')}>
                  <div className={FIELD_CONTROL_TALL_INNER}>
                    <DatePicker
                      date={dateFrom ? moment(dateFrom) : undefined}
                      fromDate={moment('2020')}
                      toDate={moment().add(2, 'y')}
                      onChange={value => {
                        if (value) {
                          handleDateFromChanged(value);
                        }
                      }}
                    />
                  </div>
                </FieldRow>

                <FieldRow label={t('pageGeneralDetailsDatePickerTo')}>
                  <div className={FIELD_CONTROL_TALL_INNER}>
                    <DatePicker
                      date={dateTo ? moment(dateTo) : undefined}
                      fromDate={moment('2020')}
                      toDate={moment().add(2, 'y')}
                      onChange={value => {
                        if (value) {
                          handleDateToChanged(value);
                        }
                      }}
                    />
                  </div>
                </FieldRow>

                <FieldRow label={t('pageGeneralDetailsDatePickerRegistrationFrom')}>
                  <div className={FIELD_CONTROL_TALL_INNER}>
                    <DatePicker
                      date={registrationDateFrom ? moment(registrationDateFrom) : undefined}
                      fromDate={moment('2020')}
                      toDate={moment().add(2, 'y')}
                      onChange={value => {
                        if (value) {
                          handleDateRegistrationFromChanged(value);
                        }
                      }}
                    />
                  </div>
                </FieldRow>

                <FieldRow label={t('pageGeneralDetailsDatePickerRegistrationTo')}>
                  <div className={FIELD_CONTROL_TALL_INNER}>
                    <DatePicker
                      date={registrationDateTo ? moment(registrationDateTo) : undefined}
                      fromDate={moment('2020')}
                      toDate={moment().add(2, 'y')}
                      onChange={value => {
                        if (value) {
                          handleDateRegistrationToChanged(value);
                        }
                      }}
                    />
                  </div>
                </FieldRow>
              </div>
            </div>
          )}

          {/* Page: Overview */}
          {page && page === CreationProcessPage.OVERVIEW && (
            <div className={EDITOR_CARD_CLASS}>
              <h2 className={cn(SECTION_H2, 'text-center sm:text-left')}>{t('pageCheckoutOverviewDescription')}</h2>

              <div className="flex flex-col gap-4">
                <div className="min-w-0 text-base font-medium text-foreground">{eventName}</div>

                {eventType && (
                  <MetaRow icon={<img src={eventType === EventType.MEETING ? imgMeeting : imgCompetition} alt="" />}>
                    {eventType === EventType.MEETING ? getNameByEventType(eventType) : `${getNameByEventType(eventType)} (${toTitleCase(eventCategory)})`}
                  </MetaRow>
                )}

                {eventType !== EventType.COMPETITION_ONLINE && venueCountryCode && <MetaRow icon={<img src={imgLocation} alt="" />}>{getCountryNameByCode(venueCountryCode)}</MetaRow>}

                {dateFrom && dateTo && <MetaRow icon={<img src={imgCalender} alt="" />}>{`${getShortDateString(moment(dateFrom), false)} – ${getShortDateString(moment(dateTo))}`}</MetaRow>}
              </div>
            </div>
          )}
        </div>
      </div>

      <Navigation>
        {!page && <ActionButton href={`${routeEventsCreate}`} action={Action.BACK} />}
        {/* Button Cancel Process */}
        {page && page === CreationProcessPage.EVENT_TYPE && <ActionButton href={`${routeHome}`} action={Action.BACK} />}

        {/* Button Cancel Process */}
        {cancelButtonShown() && (
          <Button type="button" variant="action" className={ctaActionButtonClassName} onClick={handleCancelClicked}>
            {t('btnBackToOverview')}
          </Button>
        )}

        <div className="flex gap-1">
          {/* Button Back One Page */}
          {backButtonShown() && <ActionButton action={Action.BACK} onClick={handlePreviousClicked} />}

          {/* Button Continue */}
          {nextButtonShown() && (
            <Button
              type="button"
              variant="action"
              className={ctaActionButtonClassName}
              disabled={nextButtonDisabled() || false}
              onClick={() => {
                handleNextClicked();
              }}
            >
              {t('btnNextPage')}
            </Button>
          )}

          {/* Button Create Event */}
          {page === CreationProcessPage.OVERVIEW && (
            <Button type="button" variant="action" className={ctaActionButtonClassName} onClick={handleCreateEventClicked}>
              {t('btnCreateEvent')}
            </Button>
          )}
        </div>
      </Navigation>
    </div>
  );
};
