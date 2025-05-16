'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/ActionButton';
import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';
import { routeEvents } from '@/domain/constants/routes';
import Dialog from '@/components/Dialog';
import { Toaster, toast } from 'sonner';
import { deleteEventRegistration, updateEventRegistrationStatus } from '@/infrastructure/clients/event.client';
import UserCard from '@/components/user/UserCard';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { EventRegistration } from '@/types/event-registration';
import { Accommodation } from '@/types/accommodation';
import { Offering } from '@/types/offering';

interface IRegistrationsList {
  eventId: string;
  registrations: EventRegistration[];
  accommodations: Accommodation[];
  offerings: Offering[];
}

export const RegistrationsList = ({ eventId, registrations, accommodations, offerings }: IRegistrationsList) => {
  const t = useTranslations('/events/eventid/participants');

  const { data: session } = useSession();
  const router = useRouter();

  const [userSelected, setUserSelected] = useState('');
  const [registrationSelected, setRegistrationSelected] = useState<EventRegistration>();

  const getRegistrationByUsername = (username: string): EventRegistration | undefined => {
    const results = registrations.filter(registration => {
      return registration.user.username === username;
    });

    if (results.length > 0) {
      return results[0];
    }
  };

  const getAccommodationById = (id: string): Accommodation | undefined => {
    const results = accommodations.filter(acc => {
      return acc.id === id;
    });

    if (results.length > 0) {
      return results[0];
    }
  };

  const getOfferingById = (id: string): Offering | undefined => {
    const results = offerings.filter(off => {
      return off.id === id;
    });

    if (results.length > 0) {
      return results[0];
    }
  };

  const handleInfoClicked = async (username: string) => {
    setRegistrationSelected(getRegistrationByUsername(username));
    router.replace(`${routeEvents}/${eventId}/participants?info=1`);
  };

  const handleRemoveParticipantClicked = async (username: string) => {
    setUserSelected(username);
    router.replace(`${routeEvents}/${eventId}/participants?delete=1`);
  };

  const handleDenyParticipantClicked = async (username: string) => {
    setUserSelected(username);
    router.replace(`${routeEvents}/${eventId}/participants?deny=1`);
  };

  const handleCancelDialogClicked = async () => {
    router.replace(`${routeEvents}/${eventId}/participants`);
  };

  const handleConfirmRemoveParticipantClicked = async (username: string) => {
    if (eventId) {
      try {
        await deleteEventRegistration(eventId, username, session);
        toast.success(`${username} removed`);
        router.refresh(); // TODO: remove reload, but also remove user from ui
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  const handleApproveParticipantClicked = async (username: string, status: EventRegistrationStatus) => {
    if (eventId) {
      try {
        await updateEventRegistrationStatus(eventId, username, status, session);
        toast.success(`Status for ${username} updated`);
        router.refresh(); // TODO: remove reload, but also user status in ui
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  return (
    <>
      <Toaster richColors />

      <Dialog title={t('dlgRegistrationInfoTitle')} queryParam="info" onCancel={handleCancelDialogClicked}>
        <p className="grid grid-cols-2 gap-1">
          <p>{`${t('dlgRegistrationInfoType')}:`}</p>
          <p>{`${registrationSelected?.type}`}</p>
        </p>
        <p className="grid grid-cols-2 gap-1">
          <p>{`${t('dlgRegistrationInfoStatus')}:`}</p>
          <p>{`${registrationSelected?.status}`}</p>
        </p>

        {registrationSelected?.offeringOrders && registrationSelected?.offeringOrders.length > 0 && (
          <>
            <br />

            <p>{`${t('dlgRegistrationInfoOfferings')}:`}</p>
            {registrationSelected?.offeringOrders.map((id, index) => {
              const off = getOfferingById(id);
              return (
                <p key={`off-${index}`} className="grid grid-cols-2 gap-1">
                  <p>{`- ${off?.description}`}</p> <p>{`${off?.cost}€`}</p>
                </p>
              );
            })}

            <p className="grid grid-cols-2 gap-1">
              <p>{`${t('dlgRegistrationInfoShirtSize')}:`}</p>
              <p>{`${registrationSelected?.offeringTShirtSize}`}</p>
            </p>
          </>
        )}

        {registrationSelected?.accommodationOrders && registrationSelected?.accommodationOrders.length > 0 && (
          <>
            <br />

            <p>{`${t('dlgRegistrationInfoAccommodations')}:`}</p>
            {registrationSelected?.accommodationOrders.map((id, index) => {
              const acc = getAccommodationById(id);
              return (
                <p key={`acc-${index}`} className="grid grid-cols-2 gap-1">
                  <p>{`- ${acc?.description}`}</p> <p>{`${acc?.cost}€`}</p>
                </p>
              );
            })}
          </>
        )}

        {registrationSelected?.phoneNumber && (
          <p className="grid grid-cols-2 gap-1">
            <p>{`${t('dlgRegistrationInfoPhoneNumber')}:`}</p>
            <p>{`+${registrationSelected?.phoneCountryCode} ${registrationSelected?.phoneNumber}`}</p>
          </p>
        )}
      </Dialog>

      <Dialog
        title={t('dlgDenyParticipantTitle')}
        queryParam="deny"
        onCancel={handleCancelDialogClicked}
        onConfirm={() => {
          if (eventId) {
            handleApproveParticipantClicked(userSelected, EventRegistrationStatus.DENIED);
            setUserSelected('');
          }
        }}
      >
        <p>
          {t('dlgDenyParticipantText')} {userSelected}
        </p>
      </Dialog>

      <Dialog
        title={t('dlgRemoveParticipantTitle')}
        queryParam="delete"
        onCancel={handleCancelDialogClicked}
        onConfirm={() => {
          if (eventId) {
            handleConfirmRemoveParticipantClicked(userSelected);
            setUserSelected('');
          }
        }}
      >
        <p>
          {t('dlgRemoveParticipantText')} {userSelected}
        </p>
      </Dialog>

      <div className={'mx-2 rounded-lg border border-primary bg-secondary-light p-2 text-sm overflow-y-auto'}>
        <div className="flex flex-col">
          {registrations.length === 0 && <div className="m-1 flex justify-center">{t('textNoRegistrations')}</div>}
          {registrations.map((registration, index) => {
            return (
              <div key={index} className="m-1 flex items-center gap-1">
                <div className="mx-1 flex w-1/2 justify-end">
                  <UserCard user={registration.user} registrationStatus={registration.status} />
                </div>

                <div className="flex w-1/2 justify-start gap-1">
                  <ActionButton
                    action={Action.INFO}
                    onClick={() => {
                      handleInfoClicked(registration.user.username);
                    }}
                  />

                  {(registration.status === EventRegistrationStatus.APPROVED || registration.status === EventRegistrationStatus.DENIED) && (
                    <div className="flex gap-1">
                      <div className="flex w-24 items-center justify-center font-bold">{registration.status.toUpperCase()}</div>
                      <ActionButton
                        action={Action.DELETE}
                        onClick={() => {
                          handleRemoveParticipantClicked(registration.user.username);
                        }}
                      />
                    </div>
                  )}

                  {registration.status == EventRegistrationStatus.PENDING && (
                    <div className="flex gap-1">
                      <ActionButton
                        action={Action.ACCEPT}
                        onClick={() => {
                          handleApproveParticipantClicked(registration.user.username, EventRegistrationStatus.APPROVED);
                        }}
                      />

                      <ActionButton
                        action={Action.DENY}
                        onClick={() => {
                          handleDenyParticipantClicked(registration.user.username);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
