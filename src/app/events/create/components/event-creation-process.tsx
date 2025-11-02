'use client';

import { routeEvents, routeEventsCreate, routeHome } from '@/domain/constants/routes';
import Navigation from '@/components/navigation';
import TextButton from '@/components/common/text-button';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import PageTitle from '@/components/page-title';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
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
import { imgCalender, imgCelebration, imgCompetition, imgCompetitionOnline, imgCompetitionOnsite, imgLocation, imgMeeting } from '../../../../domain/constants/images';
import { CurrencyCode } from '../../../../domain/enums/currency-code';
import { EventCategory } from '../../../../domain/enums/event-category';
import { EventState } from '../../../../domain/enums/event-state';
import { menuCountriesWithUnspecified } from '../../../../domain/constants/menus/menu-countries';
import { getCountryNameByCode } from '../../../../functions/get-country-name-by-code';
import Image from 'next/image';
import Link from 'next/link';
import { menuEventCategories } from '../../../../domain/constants/menus/menu-event-categories';
import { getNameByEventType } from '../../../../functions/get-name-by-event-type';
import { toTitleCase } from '../../../../functions/string-manipulation';
import { getShortDateString } from '../../../../functions/time';

interface IEventCreationProcess {
  eventAdmin: User;
  licenses: number;
}

enum CreationProcessPage {
  EVENT_TYPE = '1',
  COMP_TYPE = '2',
  GENERAL_DETAILS = '3',
  OVERVIEW = '4',
  SUCCESS_PAGE = '5',
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
  const [venueCountry, setVenueCountry] = useState<string>();
  const [dateFrom, setDateFrom] = useState<string>();
  const [dateTo, setDateTo] = useState<string>();
  const [registrationDateFrom, setRegistrationDateFrom] = useState<string>(moment().startOf('day').utc().format());
  const [registrationDateTo, setRegistrationDateTo] = useState<string>();

  const pageUrl = `${routeEventsCreate}`;

  const generateEvent = (): Event => {
    return {
      id: eventId,
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
      visitorFee: 0,
      visitorFeeIncPaymentCosts: 0,
      currency: CurrencyCode.EUR,
      description: '',
      venueName: '',
      venueHouseNo: '',
      venueStreet: '',
      venueCity: '',
      venuePostCode: '',
      venueCountry: venueCountry || '',
      category: eventCategory,
      isWffaRanked: false,
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
      showUserCountryFlag: false,
      registrationCollectPhoneNumber: false,
      autoApproveRegistrations: false,
      notifyOnRegistration: false,
      allowComments: false,
      notifyOnComment: false,
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

  const handleVenueCountryChanged = (value: string) => {
    setVenueCountry(value);
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

      // type
      if (eventType !== EventType.COMPETITION_ONLINE && (!venueCountry || venueCountry === menuCountriesWithUnspecified[0].value)) return true;

      //dates
      if (!dateFrom || !dateTo || !registrationDateFrom || !registrationDateTo) return true;
      if (dateFrom > dateTo) return true;
      if (registrationDateFrom > registrationDateTo) return true;
      if (registrationDateTo > dateFrom) return true;
    }

    return false;
  };

  const cancelButtonShown = (): boolean => {
    if (page && page && page !== CreationProcessPage.EVENT_TYPE && page !== CreationProcessPage.SUCCESS_PAGE) {
      return true;
    }

    return false;
  };

  const backButtonShown = (): boolean => {
    if (page && page !== CreationProcessPage.EVENT_TYPE && page !== CreationProcessPage.COMP_TYPE && page !== CreationProcessPage.SUCCESS_PAGE) {
      return true;
    }

    return false;
  };

  const nextButtonShown = (): boolean => {
    if (page !== CreationProcessPage.EVENT_TYPE && page !== CreationProcessPage.COMP_TYPE && page !== CreationProcessPage.OVERVIEW && page !== CreationProcessPage.SUCCESS_PAGE) {
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

      router.replace(`${pageUrl}?page=${CreationProcessPage.SUCCESS_PAGE}`);

      return response.id;
      router.push(`${routeEvents}/${response.id}`);
      // router.refresh();
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
      setVenueCountry(eventInfo?.venueCountry);
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
    <div className="h-[calc(100dvh)] flex flex-col">
      <Toaster richColors />

      {page && <PageTitle title={`${t('pageTitleEventCreationFlow')}`} />}

      <div className="mx-2 overflow-y-auto">
        <div className="flex justify-center">
          {/* Page: General Event Type Choice */}
          {page && page === CreationProcessPage.EVENT_TYPE && (
            <div className="flex flex-col p-2">
              <div className="flex justify-center m-2">{t('pageEventTypeDescription')}</div>

              <div className="p-2 h-full grid overflow-y-auto">
                <div className="h-full flex flex-col items-center justify-center gap-2">
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
            </div>
          )}

          {/* Page: Comp Type Choice */}
          {page && page === CreationProcessPage.COMP_TYPE && (
            <div className="flex flex-col p-2">
              <div className="flex justify-center m-2">{t('pageCompTypeDescription')}</div>

              <div className="p-2 h-full grid overflow-y-auto">
                <div className="h-full flex flex-col items-center justify-center gap-2">
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
            </div>
          )}

          {/* Page: General Details */}
          {page && page === CreationProcessPage.GENERAL_DETAILS && (
            <div className="flex flex-col bg-secondary-light rounded-lg border border-secondary-dark p-2">
              <div className="m-2">{t('pageGeneralDetailsDescription')}</div>

              <div className="flex flex-col">
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
                  <div className="m-2 grid grid-cols-2 items-center gap-2">
                    <div>{t('pageGeneralDetailsCbCategory')}</div>
                    <div className="flex w-full">
                      <ComboBox
                        menus={menuEventCategories(eventAdmin?.isWffaMember || false)}
                        value={eventCategory}
                        onChange={(value: EventCategory) => {
                          handleEventCatergoryChanged(value);
                        }}
                      />
                    </div>
                  </div>
                )}

                {eventType !== EventType.COMPETITION_ONLINE && (
                  <div className="m-2 grid grid-cols-2 items-center gap-2">
                    <div>{t('pageGeneralDetailsCbVenueCountry')}</div>
                    <div className="flex w-full">
                      <ComboBox
                        menus={menuCountriesWithUnspecified}
                        value={venueCountry || menuCountriesWithUnspecified[0].value} // todo: set user country, remove '--'
                        searchEnabled={true}
                        onChange={(value: any) => {
                          handleVenueCountryChanged(value);
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="m-2 grid grid-cols-2 items-center gap-2">
                  <div>{t('pageGeneralDetailsDatePickerFrom')}</div>
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

                <div className="m-2 grid grid-cols-2 items-center gap-2">
                  <div>{t('pageGeneralDetailsDatePickerTo')}</div>
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

                <div className="m-2 grid grid-cols-2 items-center gap-2">
                  <div>{t('pageGeneralDetailsDatePickerRegistrationFrom')}</div>
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

                <div className="m-2 grid grid-cols-2 items-center gap-2">
                  <div>{t('pageGeneralDetailsDatePickerRegistrationTo')}</div>
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
              </div>
            </div>
          )}

          {/* Page: Overview */}
          {page && page === CreationProcessPage.OVERVIEW && (
            <div className="flex flex-col bg-secondary-light rounded-lg border border-secondary-dark p-4 gap-2">
              <div className="">{t('pageCheckoutOverviewDescription')}</div>

              <div className="flex flex-col mt-4 gap-4">
                <div className="flex items-center gap-2">{<div>{eventName}</div>}</div>

                {eventType && (
                  <div className="flex items-center gap-2">
                    <img src={eventType === EventType.MEETING ? imgMeeting : imgCompetition} className=" h-6 w-6 object-fill" />

                    {eventType === EventType.MEETING && <>{getNameByEventType(eventType)}</>}
                    {eventType !== EventType.MEETING && <>{`${getNameByEventType(eventType)} (${toTitleCase(eventCategory)})`}</>}
                  </div>
                )}

                {eventType !== EventType.COMPETITION_ONLINE && (
                  <div className="flex items-center gap-2">
                    <img src={imgLocation} className="h-6 w-6 object-fill" />
                    {venueCountry && <>{getCountryNameByCode(venueCountry)}</>}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <img src={imgCalender} className="h-6 w-6 object-fill" />
                  {dateFrom && dateTo && <>{`${getShortDateString(moment(dateFrom), false)} -  ${getShortDateString(moment(dateTo))}`}</>}
                </div>
              </div>
            </div>
          )}

          {/* Page: Success Page */}
          {page && page === CreationProcessPage.SUCCESS_PAGE && (
            <div className={'absolute inset-0 flex flex-col'}>
              <div className="p-2 h-full grid overflow-y-auto">
                <div className={'h-full flex flex-col justify-center'}>
                  <div className="mx-2 text-center">
                    <Image src={imgCelebration} width={0} height={0} sizes="100vw" className={`h-12 w-full`} alt={''} />

                    <div className="mt-2">{t(`pageSuccessSuccessText1`)}</div>
                    <div className="">{t(`pageSuccessSuccessText2`)}</div>

                    <div className="mt-10 flex justify-center gap-2">
                      <Link href={`${routeEvents}/${eventId}/edit`}>
                        <TextButton text={t('pageSuccessBtnEditEvent')} />
                      </Link>

                      <Link href={`${routeEvents}/${eventId}`}>
                        <TextButton text={t('pageSuccessBtnShowEvent')} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Navigation>
        {!page && (
          <Link href={`${routeEventsCreate}`}>
            <ActionButton action={Action.BACK} />
          </Link>
        )}
        {/* Button Cancel Process */}
        {page && page === CreationProcessPage.EVENT_TYPE && (
          <Link href={`${routeHome}`}>
            <ActionButton action={Action.BACK} />
          </Link>
        )}

        {/* Button Cancel Process */}
        {cancelButtonShown() && <TextButton text={t('btnBackToOverview')} onClick={handleCancelClicked} />}

        <div className="flex gap-1">
          {/* Button Back One Page */}
          {backButtonShown() && <ActionButton action={Action.BACK} onClick={handlePreviousClicked} />}

          {/* Button Continue */}
          {nextButtonShown() && (
            <TextButton
              text={t('btnNextPage')}
              disabled={nextButtonDisabled() || false}
              onClick={() => {
                handleNextClicked();
              }}
            />
          )}

          {/* Button Create Event */}
          {page === CreationProcessPage.OVERVIEW && <TextButton text={t('btnCreateEvent')} onClick={handleCreateEventClicked} />}
        </div>
      </Navigation>
    </div>
  );
};
