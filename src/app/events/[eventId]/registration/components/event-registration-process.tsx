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
import {} from '@/infrastructure/clients/event.client';
import Label from '@/components/Label';
import { PayPalInfo } from '../../components/payment/paypal-info';
import { SepaInfo } from '../../components/payment/sepa-info';
import { CashInfo } from '../../components/payment/cash-info';
import Separator from '@/components/Seperator';
import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';
import moment from 'moment';
import Dialog from '@/components/Dialog';
import { StripeInfo } from '../../components/payment/stripe-info';
import { ButtonStyle } from '@/domain/enums/button-style';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/domain/enums/action';
import { getShortDateString } from '@/functions/time';
import { CompetitionList } from './competition-list';

interface IEventRegistrationProcess {
  event: Event;
  user: User;
}

enum RegistrationProcessPage {
  REGISTRATION_TYPE = '1',
  COMPETITIONS = '2',
  OVERVIEW = '3',
}

export const EventRegistrationProcess = ({ event, user }: IEventRegistrationProcess) => {
  const t = useTranslations('/events/eventid/registration');

  const { data: session } = useSession();
  const router = useRouter();

  const searchParams = useSearchParams();
  const page = searchParams?.get('page');

  const [registrationType, setRegistrationType] = useState<EventRegistrationType>();
  const [compSignUps, setCompSignUps] = useState<string[]>([]);

  const pageUrl = `${routeEvents}/${event.id}/registration`;

  const registrationStatus: string =
    event.eventRegistrations.filter(registration => {
      if (registration.user.username === session?.user.username) {
        return registration.status;
      }
    })[0]?.status || 'Unregistered';

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

        case RegistrationProcessPage.OVERVIEW:
          if (registrationType === EventRegistrationType.PARTICIPANT) {
            previousPage = RegistrationProcessPage.COMPETITIONS;
          } else {
            previousPage = RegistrationProcessPage.REGISTRATION_TYPE;
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
          if (registrationType === EventRegistrationType.PARTICIPANT) {
            nextPage = RegistrationProcessPage.COMPETITIONS;
          } else {
            nextPage = RegistrationProcessPage.OVERVIEW;
          }
          break;

        case RegistrationProcessPage.COMPETITIONS:
          nextPage = RegistrationProcessPage.OVERVIEW;
          break;

        case RegistrationProcessPage.OVERVIEW:
          // handleRegisterNowClicked is used for this

          // if (event.id && registrationType) {
          //   // await createEventRegistration_v2(event.id, registrationType, compSignUps, session);
          //   await createEventRegistrationCheckoutLink(event.id, `${routeEvents}/${event.id}/registration?checkout=1`, session);
          // }
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
        await createEventRegistration_v2(event.id, registrationType, compSignUps, session);
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

  const cacheRegistrationInfo = async () => {
    try {
      const info: EventRegistrationInfo = {
        eventId: event.id,
        registrationType: registrationType,
        compSignUps: compSignUps,
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
    }
  }, []);

  return (
    <>
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

      <div className="h-[calc(100dvh)] flex flex-col">
        {!page && <PageTitle title={t('pageTitleOverview')} />}
        {page && <PageTitle title={`Registration: ${event.name}`} />}

        <div className="mx-2 overflow-hidden">
          <div className="flex justify-center">
            {/* Overview */}
            {!page && (
              <div>
                <div>{`Event: ${event.name}`}</div>

                <div className="flex items-center mt-4 gap-2">
                  <div>{`${'Registration Status'}:`}</div>
                  <Label text={registrationStatus} />
                </div>

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

                {(registrationStatus === EventRegistrationStatus.APPROVED || registrationStatus === EventRegistrationStatus.DENIED || registrationStatus === EventRegistrationStatus.PENDING) && (
                  <div className="mt-4">
                    <div>{`Payment details:`}</div>

                    <div className="flex flex-col gap-2">
                      {event.paymentMethodCash.enabled && <CashInfo participationFee={event.participationFee} />}

                      {event.paymentMethodPayPal.enabled && (
                        <PayPalInfo participationFee={event.participationFee} payPalInfo={event.paymentMethodPayPal} usernameForReference={session?.user.username || ''} />
                      )}

                      {event.paymentMethodSepa.enabled && <SepaInfo participationFee={event.participationFee} sepaInfo={event.paymentMethodSepa} usernameForReference={session?.user.username || ''} />}

                      {event.paymentMethodStripe.enabled && <StripeInfo participationFee={event.participationFee} />}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Page: Registration Type */}
            {page && +page === 1 && (
              <div className="flex flex-col bg-secondary-light rounded-lg border border-secondary-dark p-2">
                <div className="m-2">{`Select registration type.`}</div>

                <RadioGroup className="mx-2" value={registrationType}>
                  <div className={'grid grid-cols-2 py-1 gap-1'}>
                    <div className="capitalize">{EventRegistrationType.PARTICIPANT}</div>

                    <div className="flex items-center gap-1">
                      <RadioGroupItem
                        value={EventRegistrationType.PARTICIPANT}
                        id={`option-${EventRegistrationType.PARTICIPANT}`}
                        onClick={e => {
                          handleRadioItemRegistrationTypeClicked(EventRegistrationType.PARTICIPANT);
                        }}
                      />
                    </div>

                    <div className="capitalize">{EventRegistrationType.VISITOR}</div>

                    <div className="flex items-center gap-1">
                      <RadioGroupItem
                        value={EventRegistrationType.VISITOR}
                        id={`option-${EventRegistrationType.VISITOR}`}
                        onClick={e => {
                          handleRadioItemRegistrationTypeClicked(EventRegistrationType.VISITOR);
                        }}
                      />
                    </div>
                  </div>
                </RadioGroup>
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

            {/* Page: Overview */}
            {page && +page === 3 && (
              <div className="flex flex-col bg-secondary-light rounded-lg border border-secondary-dark p-2">
                <div className="m-2">{`Overview`}</div>

                <div className="flex flex-col mt-4 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="m-2">{`Enroll as:`}</div>
                    {registrationType && <Label text={registrationType} />}
                  </div>

                  {registrationType === EventRegistrationType.PARTICIPANT && (
                    <>
                      <Separator />

                      <div>
                        <div className="m-2">{`Participate in:`}</div>

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
                          onCheckedChange={(checked, comId) => {
                            if (comId) handleCheckBoxSignUpForCompChanged(comId);
                          }}
                        />
                      </div>
                    </>
                  )}

                  <Separator />

                  <div>
                    <div className="m-2">{`Payment details:`}</div>

                    <div className="m-2 flex flex-col gap-2 text-sm">
                      {/* {event.paymentMethodCash.enabled && <CashInfo participationFee={event.participationFee} />}

                      {event.paymentMethodPayPal.enabled && (
                        <PayPalInfo participationFee={event.participationFee} payPalInfo={event.paymentMethodPayPal} usernameForReference={session?.user.username || ''} />
                      )}

                      {event.paymentMethodSepa.enabled && <SepaInfo participationFee={event.participationFee} sepaInfo={event.paymentMethodSepa} usernameForReference={session?.user.username || ''} />} */}

                      {/* <div className="flex justify-between">
                        <div>{`Method`}</div>
                        <div>{`online checkout`}</div>
                      </div> */}

                      <div className="flex justify-between">
                        <div>{`Event fee`}</div>
                        <div>{event.participationFee.toString().replace('.', ',')} €</div>
                      </div>

                      {registrationType === EventRegistrationType.PARTICIPANT && (
                        <div className="flex justify-between">
                          <div>{`Competition fee(s)`}</div>
                          <div>
                            {event.competitions
                              .filter(c => c.id && compSignUps.includes(c.id))
                              .reduce((acc, c) => acc + c.participationFee, 0)
                              .toString()
                              .replace('.', ',')}{' '}
                            €
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <div>{`Total`}</div>
                        <div>
                          {(event.participationFee + event.competitions.filter(c => c.id && compSignUps.includes(c.id)).reduce((acc, c) => acc + c.participationFee, 0)).toString().replace('.', ',')} €
                        </div>
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
            <Link href={`${routeEvents}/${event.id}`}>
              <TextButton text={t('btnBackToEvent')} />
            </Link>
          )}
          {page && <TextButton text={t('btnBackToOverview')} onClick={handleCancelClicked} />}

          <div className="flex gap-1">
            {page && <ActionButton action={Action.BACK} onClick={handlePreviousClicked} />}
            {page !== RegistrationProcessPage.OVERVIEW && registrationStatus === 'Unregistered' && (
              <TextButton
                text={page ? t('btnNextPage') : t('btnRegister')}
                disabled={nextButtonDisabled() || moment(event?.registrationOpen).unix() > moment().unix() || moment(event?.registrationDeadline).unix() < moment().unix() || false}
                onClick={handleNextClicked}
              />
            )}
            {page === RegistrationProcessPage.OVERVIEW && registrationStatus === 'Unregistered' && <TextButton text={t('btnEnrollNow')} onClick={handleRegisterNowClicked} />}
            {registrationStatus !== 'Unregistered' && (
              <TextButton
                text={t('btnUnregister')}
                style={ButtonStyle.CRITICAL}
                disabled={(event?.id && moment(event?.registrationDeadline).unix() < moment().unix()) || false}
                onClick={() => {
                  handleUnregisterClicked();
                }}
              />
            )}
          </div>
        </Navigation>
      </div>
    </>
  );
};
