'use client';

import { useRouter } from 'next/navigation';
import { Event } from '@/types/event';
import { useState } from 'react';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/ActionButton';
import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';
import { routeEvents, routeLogin } from '@/domain/constants/routes';
import Dialog from '@/components/Dialog';
import { validateSession } from '@/functions/validate-session';
import { Toaster, toast } from 'sonner';
import { deleteEventRegistration, updateEventRegistrationStatus } from '@/infrastructure/clients/event.client';
import UserCard from '@/components/user/UserCard';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

interface IParticipantsList {
  event: Event;
}

export const ParticipantsList = ({ event }: IParticipantsList) => {
  const t = useTranslations('/events/eventid/participants');

  const { data: session } = useSession();
  const router = useRouter();

  const [userSelected, setUserSelected] = useState('');

  const handleRemoveParticipantClicked = async (username: string) => {
    setUserSelected(username);
    router.replace(`${routeEvents}/${event.id}/participants?delete=1`);
  };

  const handleDenyParticipantClicked = async (username: string) => {
    setUserSelected(username);
    router.replace(`${routeEvents}/${event.id}/participants?deny=1`);
  };

  const handleCancelRemoveParticipantClicked = async () => {
    router.replace(`${routeEvents}/${event.id}/participants`);
  };

  const handleConfirmRemoveParticipantClicked = async (username: string) => {
    if (!validateSession(session)) {
      router.push(routeLogin);
      return;
    }

    if (event.id) {
      try {
        await deleteEventRegistration(event.id, username, session);
        toast.success(`${username} removed`);
        router.refresh(); // TODO: remove reload, but also remove user from ui
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  const handleApproveParticipantClicked = async (username: string, status: EventRegistrationStatus) => {
    if (!validateSession(session)) {
      router.push(routeLogin);
      return;
    }

    if (event.id) {
      try {
        await updateEventRegistrationStatus(event.id, username, status, session);
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

      <Dialog
        title={t('dlgDenyParticipantTitle')}
        queryParam="deny"
        onCancel={handleCancelRemoveParticipantClicked}
        onConfirm={() => {
          if (event.id) {
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
        onCancel={handleCancelRemoveParticipantClicked}
        onConfirm={() => {
          if (event.id) {
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
          {event.eventRegistrations.length === 0 && <div className="m-1 flex justify-center">{t('textNoRegistrations')}</div>}
          {event.eventRegistrations.map((registration, index) => {
            return (
              <div key={index} className="m-1 flex items-center">
                <div className="mx-1 flex w-1/2 justify-end">
                  <UserCard user={registration.user} registrationStatus={registration.status} />
                </div>

                <div className="mx-1 flex w-1/2 justify-start">
                  {(registration.status === EventRegistrationStatus.APPROVED || registration.status === EventRegistrationStatus.DENIED) && (
                    <>
                      <div className="mr-1 flex w-24 items-center justify-center font-bold ">{registration.status.toUpperCase()}</div>
                      <div className="ml-1">
                        <ActionButton
                          action={Action.DELETE}
                          onClick={() => {
                            handleRemoveParticipantClicked(registration.user.username);
                          }}
                        />
                      </div>
                    </>
                  )}

                  <div className="flex">
                    {registration.status == EventRegistrationStatus.PENDING && (
                      <>
                        <div className="mr-1">
                          <ActionButton
                            action={Action.ACCEPT}
                            onClick={() => {
                              handleApproveParticipantClicked(registration.user.username, EventRegistrationStatus.APPROVED);
                            }}
                          />
                        </div>
                        <div className="ml-1">
                          <ActionButton
                            action={Action.DENY}
                            onClick={() => {
                              handleDenyParticipantClicked(registration.user.username);
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
