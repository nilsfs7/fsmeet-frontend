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
import { createEventRegistration_v2, deleteEventRegistration } from '@/infrastructure/clients/event.client';
import { CompetitionCard } from './competition-card';
import Label from '@/components/Label';
import { PayPalInfo } from '../../components/payment/paypal-info';
import { SepaInfo } from '../../components/payment/sepa-info';
import { CashInfo } from '../../components/payment/cash-info';
import Separator from '@/components/Seperator';
import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';
import moment from 'moment';
import Dialog from '@/components/Dialog';

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

  const handleBackClicked = async () => {
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
          if (event.id && registrationType) {
            createEventRegistration_v2(event.id, registrationType, compSignUps, session);
          }
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
        router.replace(`${pageUrl}/completed`);
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

                {registrationStatus === EventRegistrationStatus.APPROVED ||
                  registrationStatus === EventRegistrationStatus.DENIED ||
                  (registrationStatus === EventRegistrationStatus.PENDING && (
                    <div className="mt-4">
                      <div>{`Payment details:`}</div>

                      <div className="flex flex-col gap-2">
                        {event.paymentMethodCash.enabled && <CashInfo participationFee={event.participationFee} />}

                        {event.paymentMethodPayPal.enabled && (
                          <PayPalInfo participationFee={event.participationFee} payPalInfo={event.paymentMethodPayPal} usernameForReference={session?.user.username || ''} />
                        )}

                        {event.paymentMethodSepa.enabled && (
                          <SepaInfo participationFee={event.participationFee} sepaInfo={event.paymentMethodSepa} usernameForReference={session?.user.username || ''} />
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Page: Registration Type */}
            {page && +page === 1 && (
              <div className="flex flex-col bg-secondary-light rounded-lg border border-secondary-dark p-2">
                <div>{`Select registration type.`}</div>

                <RadioGroup className="mt-4" value={registrationType}>
                  <div className={'grid grid-cols-2 py-1 gap-1'}>
                    <div className="capitalize">
                      {EventRegistrationType.PARTICIPANT} {`(${event.participationFee}€)`}
                    </div>

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
                        disabled={true}
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
                <div>{`Select competitions to participate in.`}</div>

                <div className="flex flex-col mt-4 gap-2 ">
                  {event.competitions.map((comp, index) => {
                    return (
                      <div key={`comp-card-${index}`}>
                        <CompetitionCard
                          comp={comp}
                          disabled={comp.gender !== CompetitionGender.MIXED && comp.gender !== user.gender}
                          selectable={true}
                          checked={comp.id && compSignUps.includes(comp.id) ? true : false}
                          onCheckedChange={checked => {
                            if (comp.id) handleCheckBoxSignUpForCompChanged(comp.id);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Page: Overview */}
            {page && +page === 3 && (
              <div className="flex flex-col bg-secondary-light rounded-lg border border-secondary-dark p-2">
                <div>{`Overview`}</div>

                <div className="flex flex-col mt-4 gap-4">
                  <div className="flex items-center gap-2">
                    <div>{`Enroll as:`}</div>
                    {registrationType && <Label text={registrationType} />}
                  </div>

                  <Separator />

                  {registrationType === EventRegistrationType.PARTICIPANT && (
                    <div className="">
                      <div>{`Participate in:`}</div>

                      <div className="flex flex-col gap-2">
                        {event.competitions.map((comp, index) => {
                          if (comp.id && compSignUps.includes(comp.id))
                            return (
                              <div key={`comp-card-${index}`}>
                                <CompetitionCard comp={comp} />
                              </div>
                            );
                        })}
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="">
                    <div>{`Payment details:`}</div>

                    <div className="flex flex-col gap-2">
                      {event.paymentMethodCash.enabled && <CashInfo participationFee={event.participationFee} />}

                      {event.paymentMethodPayPal.enabled && (
                        <PayPalInfo participationFee={event.participationFee} payPalInfo={event.paymentMethodPayPal} usernameForReference={session?.user.username || ''} />
                      )}

                      {event.paymentMethodSepa.enabled && <SepaInfo participationFee={event.participationFee} sepaInfo={event.paymentMethodSepa} usernameForReference={session?.user.username || ''} />}
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
            {page && <TextButton text={t('btnPreviousPage')} onClick={handleBackClicked} />}
            {page !== RegistrationProcessPage.OVERVIEW && registrationStatus === 'Unregistered' && (
              <TextButton text={page ? t('btnNextPage') : t('btnRegister')} disabled={nextButtonDisabled()} onClick={handleNextClicked} />
            )}
            {page === RegistrationProcessPage.OVERVIEW && registrationStatus === 'Unregistered' && <TextButton text={t('btnEnrollNow')} onClick={handleRegisterNowClicked} />}
            {registrationStatus !== 'Unregistered' && (
              <TextButton
                text={t('btnUnregister')}
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
