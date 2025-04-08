'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { routeEvents } from '@/domain/constants/routes';
import Navigation from '@/components/Navigation';
import TextButton from '@/components/common/TextButton';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import PageTitle from '@/components/PageTitle';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Event } from '@/types/event';
import { User } from '@/types/user';
import { CompetitionGender } from '@/domain/enums/competition-gender';
import { Toaster, toast } from 'sonner';
import { EventRegistrationInfo } from '@/types/event-registration-info';
import Link from 'next/link';
import { EventRegistrationType } from '@/types/event-registration-type';
import { createEventRegistration_v2, createEventRegistrationCheckoutLink, deleteEventRegistration } from '@/infrastructure/clients/event.client';
import Label from '@/components/Label';
import Separator from '@/components/Seperator';
import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';
import moment from 'moment';
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

interface IEventRegistrationProcess {
  event: Event;
  user: User;
}

enum RegistrationProcessPage {
  REGISTRATION_TYPE = '1',
  COMPETITIONS = '2',
  ACCOMMODATIONS = '3',
  CHECKOUT_OVERVIEW = '4',
}

export const EventRegistrationProcess = ({ event, user }: IEventRegistrationProcess) => {
  const t = useTranslations('/events/eventid/registration');

  const { data: session } = useSession();
  const router = useRouter();

  const searchParams = useSearchParams();
  const page = searchParams?.get('page');

  const [registrationType, setRegistrationType] = useState<EventRegistrationType>();
  const [compSignUps, setCompSignUps] = useState<string[]>([]);
  const [accommodationOrders, setAccommodationOrders] = useState<string[]>([]);
  const [registrationStatus, setRegistrationStatus] = useState<string>('Unregistered');

  const pageUrl = `${routeEvents}/${event.id}/registration`;

  useEffect(() => {
    const status = event.eventRegistrations.filter(registration => {
      if (registration.user.username === session?.user.username) {
        setRegistrationType(registration.type);
        return registration.status;
      }
    })[0]?.status;

    setRegistrationStatus(status || 'Unregistered');
  });

  const nextButtonDisabled = (): boolean => {
    if (!page) {
      return false;
    }

    if (page === RegistrationProcessPage.REGISTRATION_TYPE && !registrationType) {
      return true;
    }

    if (page === RegistrationProcessPage.COMPETITIONS && compSignUps.length === 0) {
      return true;
    }

    return false;
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

        case RegistrationProcessPage.ACCOMMODATIONS:
          if (registrationType === EventRegistrationType.PARTICIPANT && isCompetition(event.type)) {
            previousPage = RegistrationProcessPage.COMPETITIONS;
          } else {
            previousPage = RegistrationProcessPage.REGISTRATION_TYPE;
          }
          break;

        case RegistrationProcessPage.CHECKOUT_OVERVIEW:
          if (event.accommodations.length > 0) {
            previousPage = RegistrationProcessPage.ACCOMMODATIONS;
          } else {
            if (registrationType === EventRegistrationType.PARTICIPANT && isCompetition(event.type)) {
              previousPage = RegistrationProcessPage.COMPETITIONS;
            } else {
              previousPage = RegistrationProcessPage.REGISTRATION_TYPE;
            }
          }

          break;
      }

      if (previousPage) {
        router.replace(`${pageUrl}?page=${previousPage}`);
      }
    }
  };

  const handleNextClicked = async () => {
    if (!page) {
      router.replace(`${pageUrl}?page=${RegistrationProcessPage.REGISTRATION_TYPE}`);
    } else {
      let nextPage: string = '';

      switch (page) {
        case RegistrationProcessPage.REGISTRATION_TYPE:
          if (registrationType === EventRegistrationType.PARTICIPANT && isCompetition(event.type)) {
            nextPage = RegistrationProcessPage.COMPETITIONS;
          } else {
            if (event.accommodations.length > 0) {
              nextPage = RegistrationProcessPage.ACCOMMODATIONS;
            } else {
              nextPage = RegistrationProcessPage.CHECKOUT_OVERVIEW;
            }
          }
          break;

        case RegistrationProcessPage.COMPETITIONS:
          if (event.accommodations.length > 0) {
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
        await createEventRegistration_v2(event.id, registrationType, compSignUps, accommodationOrders, session);
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
    if (event && moment(event?.registrationDeadline).unix() > moment().unix()) {
      router.replace(`${routeEvents}/${event.id}/registration?unregister=1`);
    } else {
      console.error('Registration deadline exceeded.');
    }
  };

  const handleConfirmUnregisterClicked = async () => {
    if (session?.user?.username) {
      if (event?.id && moment(event?.registrationDeadline).unix() > moment().unix()) {
        try {
          await deleteEventRegistration(event.id, session.user.username, session);
          router.replace(`${routeEvents}/${event.id}/registration`);
          router.refresh();
        } catch (error: any) {
          console.error(error.message);
        }
      } else {
        console.error('Registration deadline exceeded.');
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

  const cacheRegistrationInfo = async () => {
    try {
      const info: EventRegistrationInfo = {
        eventId: event.id,
        registrationType: registrationType,
        compSignUps: compSignUps,
        accommodationOrders: accommodationOrders,
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
    const registrationInfoObject = sessionStorage.getItem('registrationInfo');
    if (registrationInfoObject) {
      const registrationInfo: EventRegistrationInfo = JSON.parse(registrationInfoObject);

      setRegistrationType(registrationInfo.registrationType);
      setCompSignUps(registrationInfo.compSignUps);
      setAccommodationOrders(registrationInfo.accommodationOrders);
    }
  }, []);

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <Toaster richColors />

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
      {page && <PageTitle title={`Registration: ${event.name}`} />}

      <div className="mx-2 overflow-y-auto">
        <div className="flex justify-center">
          {/* Overview */}
          {!page && (
            <div className="p-2 bg-secondary-light border border-secondary-dark rounded-lg">
              <div>{`Event: ${event.name}`}</div>

              <div className="flex items-center mt-4 gap-2">
                {event?.id && moment(event?.registrationOpen).unix() > moment().unix() && (
                  <>
                    <div>{`${'Registration period start'}:`}</div>
                    <div> {`${getShortDateString(moment(event?.registrationOpen))}  -  ${moment(event?.registrationOpen).diff(moment(), 'days')} day(s) left`}</div>
                  </>
                )}
                {event?.id && moment(event?.registrationOpen).unix() < moment().unix() && event?.id && moment(event?.registrationDeadline).unix() > moment().unix() && (
                  <>
                    <div>{`${'Registration open until'}:`}</div>
                    <div> {`${getShortDateString(moment(event?.registrationDeadline))}  -  ${moment(event?.registrationDeadline).diff(moment(), 'days')} day(s) left`}</div>
                  </>
                )}
                {event?.id && moment(event?.registrationDeadline).unix() < moment().unix() && (
                  <>
                    <div>{`${'Registration period ended'}:`}</div>
                    <div> {`${getShortDateString(moment(event?.registrationDeadline))}`}</div>
                  </>
                )}
              </div>

              <div className="flex items-center mt-4 gap-2">
                <div>{`${'Your Status'}:`}</div>
                <Label text={registrationStatus} />
              </div>
            </div>
          )}

          {/* Page: Registration Type */}
          {page && +page === 1 && (
            <div className="flex flex-col bg-secondary-light rounded-lg border border-secondary-dark p-2">
              <div className="m-2">{`Select registration type.`}</div>

              <AttendeeChoice
                fees={[event.participationFee, event.visitorFee]}
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
              <div className="m-2">{`Select competitions to participate in.`}</div>

              <CompetitionList
                comps={event.competitions}
                disabled={event.competitions.map(comp => {
                  return comp.gender !== CompetitionGender.MIXED && comp.gender !== user.gender;
                })}
                checked={event.competitions.map(comp => {
                  return comp.id && compSignUps.includes(comp.id) ? true : false;
                })}
                selectable={true}
                onCheckedChange={(checked, comId) => {
                  if (comId) handleCheckBoxSignUpForCompChanged(comId);
                }}
              />
            </div>
          )}

          {/* Page: Accommodations */}
          {page && +page === 3 && (
            <div className="flex flex-col bg-secondary-light rounded-lg border border-secondary-dark p-2">
              <div className="m-2">{`Select accommodation. Skip if you don't need any.`}</div>

              <AccommodationList
                accommodations={event.accommodations}
                checked={event.accommodations.map(acc => {
                  return acc.id && accommodationOrders.includes(acc.id) ? true : false;
                })}
                selectable={true}
                onCheckedChange={(checked, accommodationId) => {
                  if (accommodationId) handleCheckBoxOrderAccommodationChanged(accommodationId);
                }}
              />
            </div>
          )}

          {/* Page: Overview */}
          {page && +page === 4 && (
            <div className="flex flex-col bg-secondary-light rounded-lg border border-secondary-dark p-2">
              <div className="m-2">{`Please review your selection before proceeding with checkout.`}</div>

              <div className="flex flex-col mt-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="m-2">{`Enroll as:`}</div>
                  {registrationType && <Label text={registrationType} />}
                </div>

                {registrationType === EventRegistrationType.PARTICIPANT && isCompetition(event.type) && (
                  <>
                    <Separator />

                    <div>
                      <div className="m-2 text-lg">{`Competitions`}</div>

                      <CompetitionList
                        comps={event.competitions.filter(c => c.id && compSignUps.includes(c.id))}
                        disabled={event.competitions
                          .filter(c => c.id && compSignUps.includes(c.id))
                          .map(comp => {
                            return comp.gender !== CompetitionGender.MIXED && comp.gender !== user.gender;
                          })}
                        checked={event.competitions
                          .filter(c => c.id && compSignUps.includes(c.id))
                          .map(comp => {
                            return comp.id && compSignUps.includes(comp.id) ? true : false;
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
                      <div className="m-2 text-lg">{`Accommodation`}</div>

                      <AccommodationList
                        accommodations={event.accommodations.filter(a => a.id && accommodationOrders.includes(a.id))}
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

                {registrationType && <PaymentDetails event={event} registrationType={registrationType} compSignUps={compSignUps} accommodationOrders={accommodationOrders} />}
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
              disabled={nextButtonDisabled() || moment(event?.registrationOpen).unix() > moment().unix() || moment(event?.registrationDeadline).unix() < moment().unix() || false}
              onClick={handleNextClicked}
            />
          )}

          {page === RegistrationProcessPage.CHECKOUT_OVERVIEW && registrationStatus === 'Unregistered' && <TextButton text={t('btnEnrollNow')} onClick={handleRegisterNowClicked} />}

          {!page && registrationStatus === EventRegistrationStatus.PENDING && (
            <TextButton
              text={t('btnUnregister')}
              style={ButtonStyle.CRITICAL}
              disabled={(event?.id && moment(event?.registrationDeadline).unix() < moment().unix()) || false}
              onClick={() => {
                handleUnregisterClicked();
              }}
            />
          )}

          {!page && registrationStatus === EventRegistrationStatus.PENDING && (
            <TextButton
              text={t('btnProceedPayment')}
              disabled={(event?.id && moment(event?.registrationDeadline).unix() < moment().unix()) || false}
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
