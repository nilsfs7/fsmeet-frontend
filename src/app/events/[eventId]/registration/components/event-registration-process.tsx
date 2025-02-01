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
import CheckBox from '@/components/common/CheckBox';
import { CompetitionGender } from '@/domain/enums/competition-gender';
import { Toaster, toast } from 'sonner';
import { EventRegistrationInfo } from '@/types/event-registration-info';
import Link from 'next/link';
import { EventRegistrationType } from '@/types/event-registration-type';
import { createEventRegistration_v2 } from '@/infrastructure/clients/event.client';
import { CompetitionCard } from './competition-card';

interface IEventRegistrationProcess {
  event: Event;
  user: User;
}

enum RegistrationProcessPages {
  REGISTRATION_TYPE = '1',
  COMPETITIONS = '2',
  OVERVIEW = '3',
}

export const EventRegistrationProcess = ({ event, user }: IEventRegistrationProcess) => {
  // const t = useTranslations('/...todo');

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

    const pageIndex = +page;

    if (pageIndex === 1 && !registrationType) {
      return true;
    }

    if (pageIndex === 2 && compSignUps.length === 0) {
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
        case RegistrationProcessPages.REGISTRATION_TYPE:
          router.replace(`${pageUrl}`);
          break;

        case RegistrationProcessPages.COMPETITIONS:
          previousPage = RegistrationProcessPages.REGISTRATION_TYPE;
          break;

        case RegistrationProcessPages.OVERVIEW:
          if (registrationType === EventRegistrationType.PARTICIPANT) {
            previousPage = RegistrationProcessPages.COMPETITIONS;
          } else {
            previousPage = RegistrationProcessPages.REGISTRATION_TYPE;
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
      router.replace(`${pageUrl}?page=${RegistrationProcessPages.REGISTRATION_TYPE}`);
    } else {
      let nextPage: string = '';

      switch (page) {
        case RegistrationProcessPages.REGISTRATION_TYPE:
          if (registrationType === EventRegistrationType.PARTICIPANT) {
            nextPage = RegistrationProcessPages.COMPETITIONS;
          } else {
            nextPage = RegistrationProcessPages.OVERVIEW;
          }
          break;

        case RegistrationProcessPages.COMPETITIONS:
          nextPage = RegistrationProcessPages.OVERVIEW;
          break;

        case RegistrationProcessPages.OVERVIEW:
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

      <div className="h-[calc(100dvh)] flex flex-col">
        {!page && <PageTitle title={'Registration Overview'} />}
        {page && <PageTitle title={`Registration: ${event.name}`} />}

        <div className="mx-2 overflow-hidden">
          <div className="flex justify-center border border-green-600">
            {/* Overview */}
            {!page && (
              <div>
                <div>{`Event: ${event.name}`}</div>

                <div className="flex items-center mt-2 gap-2">
                  <div>{`${'Event Registration Status'}:`}</div>
                  <div className="font-extrabold p-2 rounded-lg bg-secondary">{(registrationStatus.charAt(0).toUpperCase() + registrationStatus.slice(1)).replaceAll('_', ' ')}</div>
                </div>
              </div>
            )}

            {/* Page: Registration Type */}
            {page && +page === 1 && (
              <div className="flex flex-col items-center border border-blue-600">
                <div>{`Select Registration Type`}</div>

                <div className="mt-2">
                  <RadioGroup value={registrationType}>
                    <div className={'grid grid-cols-2 py-1 gap-1 border-red-600 border'}>
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
              </div>
            )}

            {/* Page: Competitions */}
            {page && +page === 2 && (
              <div className="flex flex-col items-center border border-blue-600">
                <div>{`Select Competitions`}</div>

                <div className="flex flex-col gap-2">
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
              <div className="flex flex-col items-center border border-blue-600">
                <div>{`Overview`}</div>

                <div className="mt-2 border-red-600 border">
                  <div className="flex gap-2">
                    <div>{`Enroll as:`}</div>
                    <div className="capitalize">{`${registrationType}`}</div>
                  </div>

                  {registrationType === EventRegistrationType.PARTICIPANT && (
                    <div>
                      <div className="mt-4">{`Participate in:`}</div>

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
                </div>
              </div>
            )}
          </div>
        </div>

        <Navigation>
          {!page && (
            <Link href={`${routeEvents}/${event.id}`}>
              <TextButton text={'Back To Event'} />
            </Link>
          )}
          {page && <TextButton text={'Back To Overview'} onClick={handleCancelClicked} />}

          <div className="flex gap-1">
            {page && <TextButton text={'Back'} onClick={handleBackClicked} />}

            {registrationStatus === 'Unregistered' && <TextButton text={page ? 'Next' : 'Register Now'} disabled={nextButtonDisabled()} onClick={handleNextClicked} />}
            {registrationStatus !== 'Unregistered' && (
              <TextButton
                text={'Unregister'}
                onClick={() => {
                  // todo
                }}
              />
            )}
          </div>
        </Navigation>
      </div>
    </>
  );
};
