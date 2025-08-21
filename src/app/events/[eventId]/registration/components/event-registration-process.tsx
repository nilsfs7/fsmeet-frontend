'use client';

import { routeEvents } from '@/domain/constants/routes';
import Navigation from '@/components/Navigation';
import TextButton from '@/components/common/TextButton';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import PageTitle from '@/components/PageTitle';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Event } from '@/domain/types/event';
import { User } from '@/domain/types/user';
import { CompetitionGender } from '@/domain/enums/competition-gender';
import { Toaster, toast } from 'sonner';
import { EventRegistrationInfo } from '@/domain/types/event-registration-info';
import Link from 'next/link';
import { EventRegistrationType } from '@/domain/types/event-registration-type';
import { createEventRegistration_v2, createEventRegistrationCheckoutLink, deleteEventRegistration } from '@/infrastructure/clients/event.client';
import Label from '@/components/Label';
import Separator from '@/components/Seperator';
import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';
import moment, { Moment } from 'moment';
import Dialog from '@/components/Dialog';
import { ButtonStyle } from '@/domain/enums/button-style';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/domain/enums/action';
import { getShortDateString } from '@/functions/time';
import { CompetitionList } from './competition-list';
import { PaymentDetails } from './payment-details';
import { AccommodationList } from './accommodation-list';
import { AttendeeChoice } from './attendee-choice';
import { isCompetition } from '@/functions/is-competition';
import { OfferingList } from './offering-list';
import { menuTShirtSizesWithUnspecified } from '@/domain/constants/menus/menu-t-shirt-sizes';
import TextareaAutosize from 'react-textarea-autosize';
import { Accommodation } from '@/domain/types/accommodation';
import TextInput from '@/components/common/TextInput';
import { DatePicker } from '@/components/common/DatePicker';
import { prefixRequired } from '@/functions/prefix-required';
import { updateUser } from '@/infrastructure/clients/user.client';
import { EventType } from '@/domain/enums/event-type';
import { UserType } from '@/domain/enums/user-type';
import ComboBox from '@/components/common/ComboBox';
import { menuPhoneCountryCodesWithUnspecified } from '@/domain/constants/menus/menu-phone-county-codes';
import { toTitleCase } from '@/functions/string-manipulation';
import { Competition } from '@/domain/types/competition';
import { isNaturalPerson } from '@/functions/is-natural-person';
import { getCompetitionParticipants } from '@/infrastructure/clients/competition.client';

interface IEventRegistrationProcess {
  event: Event;
  competitions: Competition[];
  attendee: User;
}

enum RegistrationProcessPage {
  REGISTRATION_TYPE = '1',
  COMPETITIONS = '2',
  OFFERINGS = '3',
  ACCOMMODATIONS = '4',
  CHECKOUT_OVERVIEW = '5',
}

export const EventRegistrationProcess = ({ event, competitions, attendee }: IEventRegistrationProcess) => {
  const t = useTranslations('/events/eventid/registration');

  const { data: session } = useSession();
  const router = useRouter();

  const searchParams = useSearchParams();
  const page = searchParams?.get('page');

  const [registrationStatus, setRegistrationStatus] = useState<string>('Unregistered');
  const [user, setUser] = useState<User>(attendee);
  const [userInfoChanged, setUserInfoChanged] = useState<boolean>(false);
  const [existingCompetitionRegistrations, setExistingCompetitionRegistrations] = useState<Map<string, number>>(new Map());
  const [phoneCountryCode, setPhoneCountryCode] = useState<number | undefined | null>(user.phoneCountryCode);
  const [phoneNumber, setPhoneNumber] = useState<string | null | undefined>(user.phoneNumber);
  const [registrationType, setRegistrationType] = useState<EventRegistrationType>();
  const [compSignUps, setCompSignUps] = useState<string[]>([]);
  const [accommodationOrders, setAccommodationOrders] = useState<string[]>([]);
  const [offeringOrders, setOfferingOrders] = useState<string[]>([]);
  const [offeringTShirtSize, setOfferingShirtSize] = useState<string>(user.tShirtSize || menuTShirtSizesWithUnspecified[0].value);
  const [donationAmount, setDonationAmount] = useState<number>(0);

  const pageUrl = `${routeEvents}/${event.id}/registration`;

  const handleFirstNameChanged = (value: string) => {
    const newUser = Object.assign({}, user);
    newUser.firstName = toTitleCase(value);
    setUser(newUser);
    setUserInfoChanged(true);
  };

  const handleLastNameChanged = (value: string) => {
    const newUser = Object.assign({}, user);
    newUser.lastName = toTitleCase(value);
    setUser(newUser);
    setUserInfoChanged(true);
  };

  const handleBirthdayChanged = (value: Moment) => {
    if (value) {
      const newUser = Object.assign({}, user);
      newUser.birthday = value.startOf('day').utc().format();
      newUser.age = moment(moment().diff(newUser.birthday)).year() - 1970;
      setUser(newUser);
      setUserInfoChanged(true);
    }
  };

  const handlePhoneCountryCodeChanged = (value: string) => {
    const newUser = Object.assign({}, user);
    newUser.phoneCountryCode = +value;

    setPhoneCountryCode(newUser.phoneCountryCode);
    setUser(newUser);
    setUserInfoChanged(true);
  };

  const handlePhoneNumberChanged = (value: string) => {
    const regex = new RegExp('^[0-9]+$');
    const newUser = Object.assign({}, user);

    if (value === '') {
      newUser.phoneNumber = null;
    } else if (regex.test(value)) {
      newUser.phoneNumber = value;
    }

    setPhoneNumber(newUser.phoneNumber);
    setUser(newUser);
    setUserInfoChanged(true);
  };

  const handleInstagramHandleChanged = (value: string) => {
    const newUser = Object.assign({}, user);
    newUser.instagramHandle = prefixRequired(value.toLowerCase(), '@');
    setUser(newUser);
    setUserInfoChanged(true);
  };

  const getActiveAccommodations = (): Accommodation[] => {
    return event.accommodations.filter(acc => {
      if (acc.enabled) return acc;
    });
  };

  const hasActiveAccommodations = (): boolean => {
    return event.accommodations.some(acc => {
      if (acc.enabled) return acc;
    });
  };

  const nextButtonDisabled = (): boolean => {
    if (!page) {
      return false;
    }

    if (page === RegistrationProcessPage.REGISTRATION_TYPE) {
      if (!user.firstName) return true;
      if (!user.lastName) return true;
      if (!user.birthday) return true;

      if (event.type === EventType.COMPETITION_ONLINE) {
        if (!phoneCountryCode) return true;
        if (!phoneNumber) return true;
      }

      if (!registrationType) return true;
    }

    if (page === RegistrationProcessPage.COMPETITIONS && compSignUps.length === 0) {
      return true;
    }

    if (
      page === RegistrationProcessPage.OFFERINGS &&
      event.offerings.some(off => {
        if (off.includesShirt && off.id && offeringOrders.includes(off.id)) {
          return off;
        }
      }) &&
      offeringTShirtSize &&
      offeringTShirtSize === menuTShirtSizesWithUnspecified[0].value
    ) {
      return true;
    }

    return false;
  };

  const addMandatoryOfferings = () => {
    // checks and adds a offerings to the orders when it's mandatory

    if (registrationType === EventRegistrationType.PARTICIPANT) {
      let offIds = Array.from(offeringOrders);

      event.offerings.forEach(offering => {
        if (offering.mandatoryForParticipant)
          if (offering.id && !offeringOrders.includes(offering.id)) {
            offIds.push(offering.id);
          }
      });

      setOfferingOrders(offIds);
    }
  };

  const handleCancelClicked = async () => {
    router.replace(pageUrl);
  };

  const handlePreviousClicked = async () => {
    if (page) {
      let previousPage: string = '';

      switch (page) {
        case RegistrationProcessPage.REGISTRATION_TYPE:
          router.replace(`${pageUrl}`);
          break;

        case RegistrationProcessPage.COMPETITIONS:
          previousPage = RegistrationProcessPage.REGISTRATION_TYPE;
          break;

        case RegistrationProcessPage.OFFERINGS:
          if (registrationType === EventRegistrationType.PARTICIPANT && isCompetition(event.type)) {
            previousPage = RegistrationProcessPage.COMPETITIONS;
          } else {
            previousPage = RegistrationProcessPage.REGISTRATION_TYPE;
          }
          break;

        case RegistrationProcessPage.ACCOMMODATIONS:
          if (event.offerings.length > 0) {
            previousPage = RegistrationProcessPage.OFFERINGS;
          } else {
            if (registrationType === EventRegistrationType.PARTICIPANT && isCompetition(event.type)) {
              previousPage = RegistrationProcessPage.COMPETITIONS;
            } else {
              previousPage = RegistrationProcessPage.REGISTRATION_TYPE;
            }
          }
          break;

        case RegistrationProcessPage.CHECKOUT_OVERVIEW:
          if (hasActiveAccommodations()) {
            previousPage = RegistrationProcessPage.ACCOMMODATIONS;
          } else {
            if (event.offerings.length > 0) {
              previousPage = RegistrationProcessPage.OFFERINGS;
            } else {
              if (registrationType === EventRegistrationType.PARTICIPANT && isCompetition(event.type)) {
                previousPage = RegistrationProcessPage.COMPETITIONS;
              } else {
                previousPage = RegistrationProcessPage.REGISTRATION_TYPE;
              }
            }
          }
          break;
      }

      if (previousPage) {
        router.replace(`${pageUrl}?page=${previousPage}`);
      }

      cacheRegistrationInfo();
    }
  };

  const handleNextClicked = async () => {
    if (!page) {
      if (event.waiver) {
        router.replace(`${pageUrl}?waiver=1`);
      } else {
        router.replace(`${pageUrl}?page=${RegistrationProcessPage.REGISTRATION_TYPE}`);
      }
    } else {
      let nextPage: string = '';
      switch (page) {
        case RegistrationProcessPage.REGISTRATION_TYPE:
          if (userInfoChanged) {
            // update user profile
            try {
              await updateUser(user, session);
            } catch (error: any) {
              console.error(error);
            } finally {
              setUserInfoChanged(false);
            }
          }

          if (registrationType === EventRegistrationType.PARTICIPANT && isCompetition(event.type)) {
            nextPage = RegistrationProcessPage.COMPETITIONS;
          } else {
            if (event.offerings.length > 0) {
              nextPage = RegistrationProcessPage.OFFERINGS;
            } else {
              if (hasActiveAccommodations()) {
                nextPage = RegistrationProcessPage.ACCOMMODATIONS;
              } else {
                nextPage = RegistrationProcessPage.CHECKOUT_OVERVIEW;
              }
            }
          }
          break;

        case RegistrationProcessPage.COMPETITIONS:
          if (event.offerings.length > 0) {
            nextPage = RegistrationProcessPage.OFFERINGS;
          } else {
            if (hasActiveAccommodations()) {
              nextPage = RegistrationProcessPage.ACCOMMODATIONS;
            } else {
              nextPage = RegistrationProcessPage.CHECKOUT_OVERVIEW;
            }
          }
          break;

        case RegistrationProcessPage.OFFERINGS:
          if (hasActiveAccommodations()) {
            nextPage = RegistrationProcessPage.ACCOMMODATIONS;
          } else {
            nextPage = RegistrationProcessPage.CHECKOUT_OVERVIEW;
          }
          break;

        case RegistrationProcessPage.ACCOMMODATIONS:
          nextPage = RegistrationProcessPage.CHECKOUT_OVERVIEW;
          break;

        case RegistrationProcessPage.CHECKOUT_OVERVIEW:
          break;
      }

      if (nextPage) {
        router.replace(`${pageUrl}?page=${nextPage}`);
      }
    }

    cacheRegistrationInfo();
  };

  const handleRegisterNowClicked = async () => {
    if (event.id && registrationType) {
      try {
        await createEventRegistration_v2(
          event.id,
          registrationType,
          compSignUps,
          accommodationOrders,
          offeringOrders,
          offeringTShirtSize,
          phoneCountryCode || null,
          phoneNumber || null,
          donationAmount,
          session
        );
        cleanupCacheRegistrationInfo();

        // todo: don't redirect when user is not paying directly
        const checkoutUrl = await createEventRegistrationCheckoutLink(event.id, `${window.location.origin}${pageUrl}/completed?checkout=1`, session);
        router.push(`${checkoutUrl}`);
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  const handleProceedPaymentClicked = async () => {
    if (event.id && registrationType) {
      try {
        const checkoutUrl = await createEventRegistrationCheckoutLink(event.id, `${window.location.origin}${pageUrl}/completed?checkout=1`, session);
        router.push(`${checkoutUrl}`);
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  const handleUnregisterClicked = async () => {
    if (registrationType === EventRegistrationType.PARTICIPANT && moment(event?.registrationDeadline).unix() < moment().unix()) {
      console.error('Registration deadline for participants exceeded.');
      return;
    } else {
      router.replace(`${routeEvents}/${event.id}/registration?unregister=1`);
    }
  };

  const handleConfirmWaiverClicked = async () => {
    router.replace(`${pageUrl}?page=${RegistrationProcessPage.REGISTRATION_TYPE}`);
  };

  const handleConfirmUnregisterClicked = async () => {
    if (session?.user?.username) {
      if (!event?.id || (registrationType === EventRegistrationType.PARTICIPANT && moment(event?.registrationDeadline).unix() < moment().unix())) {
        console.error('Registration deadline for participants exceeded.');
        return;
      } else {
        try {
          await deleteEventRegistration(event.id, session.user.username, session);
          router.replace(`${routeEvents}/${event.id}/registration`);
          router.refresh();
        } catch (error: any) {
          console.error(error.message);
        }
      }
    }
  };

  const handleCancelDialogClicked = async () => {
    router.replace(`${routeEvents}/${event.id}/registration`);
    router.refresh();
  };

  const handleRadioItemRegistrationTypeClicked = (type: EventRegistrationType) => {
    if (type === EventRegistrationType.VISITOR) {
      setCompSignUps([]);
    }
    setRegistrationType(type);
  };

  const handleCheckBoxSignUpForCompChanged = (compId: string) => {
    let compIds = Array.from(compSignUps);

    if (compIds.includes(compId)) {
      compIds = compIds.filter(item => item !== compId);
    } else {
      compIds.push(compId);
    }

    setCompSignUps(compIds);
  };

  const handleCheckBoxOrderAccommodationChanged = (accId: string) => {
    let accIds = Array.from(accommodationOrders);

    if (accIds.includes(accId)) {
      accIds = accIds.filter(item => item !== accId);
    } else {
      accIds.push(accId);
    }

    setAccommodationOrders(accIds);
  };

  const handleCheckBoxOrderOfferingChanged = (offeringId: string) => {
    let offIds = Array.from(offeringOrders);

    if (offIds.includes(offeringId)) {
      offIds = offIds.filter(item => item !== offeringId);
    } else {
      offIds.push(offeringId);
    }

    setOfferingOrders(offIds);
  };

  const cacheRegistrationInfo = async () => {
    try {
      const info: EventRegistrationInfo = {
        eventId: event.id,
        registrationType: registrationType,
        compSignUps: compSignUps,
        accommodationOrders: accommodationOrders,
        offeringOrders: offeringOrders,
        offeringTShirtSize: offeringTShirtSize,
      };

      sessionStorage.setItem('registrationInfo', JSON.stringify(info));
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  const cleanupCacheRegistrationInfo = async () => {
    try {
      sessionStorage.removeItem('registrationInfo');
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  useEffect(() => {
    const status = event.eventRegistrations.filter(registration => {
      if (registration.user.username === session?.user.username) {
        setRegistrationType(registration.type);
        return registration.status;
      }
    })[0]?.status;

    setRegistrationStatus(status || 'Unregistered');
  });

  useEffect(() => {
    const registrationInfoObject = sessionStorage.getItem('registrationInfo');
    if (registrationInfoObject) {
      const registrationInfo: EventRegistrationInfo = JSON.parse(registrationInfoObject);

      setRegistrationType(registrationInfo.registrationType);
      setCompSignUps(registrationInfo.compSignUps);
      setAccommodationOrders(registrationInfo.accommodationOrders);
      setOfferingOrders(registrationInfo.offeringOrders);
      setOfferingShirtSize(registrationInfo.offeringTShirtSize);
    }
  }, []);

  useEffect(() => {
    const fetchParticipants = async () => {
      const registrations: Map<string, number> = new Map();

      for (let i = 0; i < competitions.length; i++) {
        const compId = competitions[i].id;
        if (compId) {
          const participants = await getCompetitionParticipants(compId);
          registrations.set(compId, participants.length);
        }
      }

      setExistingCompetitionRegistrations(registrations);
    };

    fetchParticipants();
  }, []);

  useEffect(() => {
    addMandatoryOfferings();
  }, [event]);

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <Toaster richColors />

      <Dialog
        title={t('dlgEventWaiverTitle')}
        queryParam="waiver"
        onCancel={handleCancelDialogClicked}
        onConfirm={handleConfirmWaiverClicked}
        confirmText={t('dlgEventWaiverBtnConfirm')}
        executeCancelAfterConfirmClicked={false}
      >
        <TextareaAutosize readOnly className="h-[90vw] w-[90vw] resize-none overflow-hidden bg-transparent outline-none" value={event.waiver} />
      </Dialog>

      <Dialog
        title={t('dlgEventUnregisterTitle')}
        queryParam="unregister"
        onCancel={handleCancelDialogClicked}
        onConfirm={handleConfirmUnregisterClicked}
        confirmText={t('dlgEventUnregisterBtnConfirm')}
      >
        <p>{t('dlgEventUnregisterText')}</p>
      </Dialog>

      {!page && <PageTitle title={t('pageTitleOverview')} />}
      {page && <PageTitle title={`${t('pageTitleRegistrationFlow')}: ${event.name}`} />}

      <div className="mx-2 overflow-y-auto">
        <div className="flex justify-center">
          {/* Overview */}
          {!page && (
            <div className="p-2 bg-secondary-light border border-secondary-dark rounded-lg">
              <div>{`${t('pageOverviewEvent')}: ${event.name}`}</div>

              <div className="flex items-center mt-4 gap-2">
                {event?.id && moment(event?.registrationOpen).unix() > moment().unix() && (
                  <>
                    <div>{`${t('pageOverviewRegistrationStart')}:`}</div>
                    <div> {`${getShortDateString(moment(event?.registrationOpen))}  -  ${moment(event?.registrationOpen).diff(moment(), 'days')} day(s) left`}</div>
                  </>
                )}
                {event?.id && moment(event?.registrationOpen).unix() < moment().unix() && event?.id && moment(event?.registrationDeadline).unix() > moment().unix() && (
                  <>
                    <div>{`${t('pageOverviewRegistrationOpenUntil')}:`}</div>
                    <div> {`${getShortDateString(moment(event?.registrationDeadline))}  -  ${moment(event?.registrationDeadline).diff(moment(), 'days')} day(s) left`}</div>
                  </>
                )}
                {event?.id && moment(event?.registrationDeadline).unix() < moment().unix() && (
                  <>
                    <div>{`${t('pageOverviewRegistrationOver')}:`}</div>
                    <div> {`${getShortDateString(moment(event?.registrationDeadline))}`}</div>
                  </>
                )}
              </div>

              <div className="flex items-center mt-4 gap-2">
                <div>{`${t('pageOverviewRegistrationStatus')}:`}</div>
                <Label text={registrationStatus} />
              </div>
              {/* todo: visa requests can only be offered by wffa atm */}
              {event.visaInvitationRequestsEnabled &&
                event.type !== EventType.COMPETITION_ONLINE &&
                isNaturalPerson(user.type) &&
                user.type !== UserType.FAN &&
                moment(event.dateFrom) > moment() &&
                event.admin === 'wffa' && (
                  <div className="flex flex-col items-center mt-10 gap-2">
                    <div>{`${t('pageOverviewRequireVisa')}`}</div>
                    <Link href={`${routeEvents}/${event.id}/registration/visa`}>
                      <TextButton text={t('pageOverviewBtnRequestVisa')} />
                    </Link>
                  </div>
                )}
            </div>
          )}

          {/* Page: Personal Details and Registration Type */}
          {page && +page === 1 && (
            <div className="flex flex-col bg-secondary-light rounded-lg border border-secondary-dark p-2">
              <div className="m-2">{t('pageParticipantSectionUserInfoDescription')}</div>

              <div className="flex flex-col">
                <TextInput
                  id={'firstName'}
                  label={t('pageParticipantSectionUserInfoFirstName')}
                  value={user.firstName}
                  onChange={e => {
                    handleFirstNameChanged(e.currentTarget.value);
                  }}
                />

                <TextInput
                  id={'lastName'}
                  label={t('pageParticipantSectionUserInfoLastName')}
                  value={user.lastName}
                  onChange={e => {
                    handleLastNameChanged(e.currentTarget.value);
                  }}
                />

                <div className="m-2 flex justify-between items-center gap-2">
                  <div>{t('pageParticipantSectionUserInfoBirthday')}</div>
                  <DatePicker
                    date={moment(user.birthday)}
                    fromDate={moment(1970)}
                    toDate={moment().subtract(6, 'y')}
                    onChange={value => {
                      handleBirthdayChanged(value);
                    }}
                  />
                </div>

                {user.type !== UserType.FAN && (
                  <>
                    {event.type === EventType.COMPETITION_ONLINE && (
                      <div className="flex flex-col-2 items-end">
                        <div className="mx-2">
                          <div>{t('pageParticipantSectionUserPhoneNumber')}</div>
                          <div className="flex w-full">
                            <ComboBox
                              menus={menuPhoneCountryCodesWithUnspecified}
                              value={user.phoneCountryCode ? user.phoneCountryCode?.toString() : menuPhoneCountryCodesWithUnspecified[0].value}
                              searchEnabled={true}
                              onChange={(value: any) => {
                                handlePhoneCountryCodeChanged(value);
                              }}
                            />
                          </div>
                        </div>

                        <div className="h-fit">
                          <TextInput
                            id={'phoneNumber'}
                            label={''}
                            labelOnTop={true}
                            type="tel"
                            placeholder="1516 123456"
                            value={user.phoneNumber?.toString() || ''}
                            onChange={e => {
                              handlePhoneNumberChanged(e.currentTarget.value);
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <TextInput
                      id={'instagramHandle'}
                      label={t('pageParticipantSectionUserInfoInstagramHandle')}
                      placeholder="@fsmeet_com"
                      value={user.instagramHandle}
                      onChange={e => {
                        handleInstagramHandleChanged(e.currentTarget.value);
                      }}
                    />
                  </>
                )}
              </div>

              <div className="m-2 mt-6">{t('pageParticipantSectionRegistrationTypeDescription')}</div>
              <AttendeeChoice
                participantFee={event.paymentMethodStripe.enabled && event.paymentMethodStripe.coverProviderFee ? event.participationFeeIncPaymentCosts : event.participationFee}
                vistorFee={event.paymentMethodStripe.enabled && event.paymentMethodStripe.coverProviderFee ? event.visitorFeeIncPaymentCosts : event.visitorFee}
                eventType={event.type}
                userType={user.type}
                disabled={[moment().unix() > moment(event.registrationDeadline).unix(), moment().unix() > moment(event.dateTo).unix()]}
                currency={event.currency}
                checked={registrationType}
                selectable={true}
                onCheckedChange={registrationType => {
                  handleRadioItemRegistrationTypeClicked(registrationType);
                }}
              />
            </div>
          )}

          {/* Page: Competitions */}
          {page && +page === 2 && (
            <div className="flex flex-col bg-secondary-light rounded-lg border border-secondary-dark p-2">
              <div className="m-2">{t('pageCompetitionDescription')}</div>

              <CompetitionList
                competitions={competitions}
                amountRegistrations={Array.from(existingCompetitionRegistrations.values())}
                paymentFeeCover={event.paymentMethodStripe.enabled && event.paymentMethodStripe.coverProviderFee}
                currency={event.currency}
                disabled={competitions.map(comp => {
                  // validate competition
                  if (comp.isFollowUpCompetition) {
                    return true;
                  }

                  // check if gender does not fit
                  if (comp.gender !== CompetitionGender.MIXED && comp.gender !== user.gender) {
                    return true;
                  }

                  // check if age does not fit
                  if (comp.maxAge > 0 && (!user.age || comp.maxAge < user.age)) {
                    return true;
                  }

                  // check if comp is full
                  if (comp.id) {
                    const amountRegs = existingCompetitionRegistrations.get(comp.id);
                    if (comp.maxAmountParticipants > 0 && amountRegs && comp.maxAmountParticipants <= amountRegs) {
                      return true;
                    }
                  }

                  return false;
                })}
                checked={competitions.map(comp => {
                  return comp.id && compSignUps.includes(comp.id) ? true : false;
                })}
                selectable={true}
                onCheckedChange={(checked, comId) => {
                  if (comId) handleCheckBoxSignUpForCompChanged(comId);
                }}
              />
            </div>
          )}

          {/* Page: Offerings */}
          {page && +page === 3 && (
            <div className="flex flex-col bg-secondary-light rounded-lg border border-secondary-dark p-2">
              <div className="m-2">{t('pageOfferingDescription')}</div>

              <OfferingList
                offerings={event.offerings}
                paymentFeeCover={event.paymentMethodStripe.enabled && event.paymentMethodStripe.coverProviderFee}
                currency={event.currency}
                registrationType={registrationType}
                checked={event.offerings.map(off => {
                  return off.id && offeringOrders.includes(off.id) ? true : false;
                })}
                tShirtSize={offeringTShirtSize}
                selectable={true}
                onCheckedChange={(checked, offeringId) => {
                  if (offeringId) handleCheckBoxOrderOfferingChanged(offeringId);
                }}
                onShirtSizeChange={size => {
                  setOfferingShirtSize(size);
                }}
              />
            </div>
          )}

          {/* Page: Accommodations */}
          {page && +page === 4 && (
            <div className="flex flex-col bg-secondary-light rounded-lg border border-secondary-dark p-2">
              <div className="m-2">{t('pageAccommodationDescription')}</div>

              <AccommodationList
                accommodations={getActiveAccommodations()}
                paymentFeeCover={event.paymentMethodStripe.enabled && event.paymentMethodStripe.coverProviderFee}
                currency={event.currency}
                checked={getActiveAccommodations().map(acc => {
                  return acc.id && accommodationOrders.includes(acc.id) ? true : false;
                })}
                selectable={true}
                onCheckedChange={(checked, accommodationId) => {
                  if (accommodationId) handleCheckBoxOrderAccommodationChanged(accommodationId);
                }}
              />
            </div>
          )}

          {/* Page: Checkout Overview */}
          {page && +page === 5 && (
            <div className="flex flex-col bg-secondary-light rounded-lg border border-secondary-dark p-2">
              <div className="m-2">{t('pageCheckoutOverviewDescription')}</div>

              <div className="flex flex-col mt-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="m-2">{`${t('pageCheckoutOverviewSectionRegistrationType')}:`}</div>
                  {registrationType && <Label text={registrationType} />}
                </div>

                {registrationType === EventRegistrationType.PARTICIPANT && isCompetition(event.type) && (
                  <>
                    <Separator />

                    <div>
                      <div className="m-2 text-lg">{t('pageCheckoutOverviewSectionCompetitions')}</div>

                      <CompetitionList
                        competitions={competitions.filter(c => c.id && compSignUps.includes(c.id))}
                        amountRegistrations={[]}
                        paymentFeeCover={event.paymentMethodStripe.enabled && event.paymentMethodStripe.coverProviderFee}
                        currency={event.currency}
                        checked={competitions
                          .filter(c => c.id && compSignUps.includes(c.id))
                          .map(comp => {
                            return comp.id && compSignUps.includes(comp.id) ? true : false;
                          })}
                        selectable={false}
                      />
                    </div>
                  </>
                )}

                {event.offerings.length > 0 && offeringOrders.length > 0 && (
                  <>
                    <Separator />

                    <div>
                      <div className="m-2 text-lg">{t('pageCheckoutOverviewSectionOfferings')}</div>

                      <OfferingList
                        offerings={event.offerings.filter(o => o.id && offeringOrders.includes(o.id))}
                        paymentFeeCover={event.paymentMethodStripe.enabled && event.paymentMethodStripe.coverProviderFee}
                        currency={event.currency}
                        checked={event.offerings
                          .filter(o => o.id && offeringOrders.includes(o.id))
                          .map(off => {
                            return off.id && offeringOrders.includes(off.id) ? true : false;
                          })}
                        selectable={false}
                      />
                    </div>
                  </>
                )}

                {event.accommodations.length > 0 && accommodationOrders.length > 0 && (
                  <>
                    <Separator />

                    <div>
                      <div className="m-2 text-lg">{t('pageCheckoutOverviewSectionAccommodations')}</div>

                      <AccommodationList
                        accommodations={event.accommodations.filter(a => a.id && accommodationOrders.includes(a.id))}
                        paymentFeeCover={event.paymentMethodStripe.enabled && event.paymentMethodStripe.coverProviderFee}
                        currency={event.currency}
                        checked={event.accommodations
                          .filter(a => a.id && accommodationOrders.includes(a.id))
                          .map(acc => {
                            return acc.id && accommodationOrders.includes(acc.id) ? true : false;
                          })}
                        selectable={false}
                      />
                    </div>
                  </>
                )}

                <Separator />

                {registrationType && (
                  <PaymentDetails
                    event={event}
                    competitions={competitions}
                    registrationType={registrationType}
                    compSignUps={compSignUps}
                    accommodationOrders={accommodationOrders}
                    offeringOrders={offeringOrders}
                    paymentFeeCover={event.paymentMethodStripe.enabled && event.paymentMethodStripe.coverProviderFee}
                    onDonationCheckedChange={donationAmount => {
                      setDonationAmount(donationAmount);
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Navigation>
        {!page && (
          <Link href={`${routeEvents}/${event.id}`}>
            <ActionButton action={Action.BACK} />
          </Link>
        )}
        {page && <TextButton text={t('btnBackToOverview')} onClick={handleCancelClicked} />}

        <div className="flex gap-1">
          {page && <ActionButton action={Action.BACK} onClick={handlePreviousClicked} />}

          {page !== RegistrationProcessPage.CHECKOUT_OVERVIEW && registrationStatus === 'Unregistered' && (
            <TextButton
              text={page ? t('btnNextPage') : t('btnRegister')}
              disabled={nextButtonDisabled() || moment(event?.registrationOpen).unix() > moment().unix() || moment(event?.dateTo).unix() < moment().unix() || false}
              onClick={handleNextClicked}
            />
          )}

          {page === RegistrationProcessPage.CHECKOUT_OVERVIEW && registrationStatus === 'Unregistered' && <TextButton text={t('btnEnrollNow')} onClick={handleRegisterNowClicked} />}

          {!page && registrationStatus === EventRegistrationStatus.PENDING && (
            <TextButton
              text={t('btnUnregister')}
              style={ButtonStyle.CRITICAL}
              disabled={
                (registrationType === EventRegistrationType.PARTICIPANT && moment(event?.registrationDeadline).unix() < moment().unix()) ||
                (registrationType === EventRegistrationType.VISITOR && moment(event?.dateTo).unix() < moment().unix()) ||
                false
              }
              onClick={() => {
                handleUnregisterClicked();
              }}
            />
          )}

          {!page && registrationStatus === EventRegistrationStatus.PENDING && (
            <TextButton
              text={t('btnProceedPayment')}
              disabled={
                (registrationType === EventRegistrationType.PARTICIPANT && moment(event?.registrationDeadline).unix() < moment().unix()) ||
                (registrationType === EventRegistrationType.VISITOR && moment(event?.dateTo).unix() < moment().unix()) ||
                false
              }
              onClick={() => {
                handleProceedPaymentClicked();
              }}
            />
          )}
        </div>
      </Navigation>
    </div>
  );
};
