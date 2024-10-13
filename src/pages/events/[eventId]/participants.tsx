import { useRouter } from 'next/router';
import { Event } from '@/types/event';
import { useEffect, useState } from 'react';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/ActionButton';
import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';
import { routeEventNotFound, routeEvents, routeLogin } from '@/domain/constants/routes';
import Dialog from '@/components/Dialog';
import { validateSession } from '@/functions/validate-session';
import { GetServerSidePropsContext } from 'next';
import LoadingSpinner from '@/components/animation/loading-spinner';
import { Toaster, toast } from 'sonner';
import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import { auth } from '@/auth';
import { deleteEventRegistration, getEvent, updateEventRegistrationStatus } from '@/infrastructure/clients/event.client';
import UserBadge from '@/components/user/UserBadge';

const EventParticipants = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;

  const [event, setEvent] = useState<Event>();
  const [userToRemove, setUserToRemove] = useState('');

  const handleRemoveParticipantClicked = async (username: string) => {
    setUserToRemove(username);
    router.replace(`${routeEvents}/${eventId}/participants?delete=1`, undefined, { shallow: true });
  };

  const handleCancelRemoveParticipantClicked = async () => {
    router.replace(`${routeEvents}/${eventId}/participants`, undefined, { shallow: true });
  };

  const handleConfirmRemoveParticipantClicked = async (username: string) => {
    if (!validateSession(session)) {
      router.push(routeLogin);
      return;
    }

    if (eventId) {
      try {
        await deleteEventRegistration(eventId?.toString(), username, session);
        toast.success(`${username} removed`);
        router.reload(); // TODO: remove reload, but also remove user from ui
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

    if (eventId) {
      try {
        await updateEventRegistrationStatus(eventId?.toString(), username, status, session);
        toast.success(`Status for ${username} updated`);
        router.reload(); // TODO: remove reload, but also user status in ui
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (eventId) {
      getEvent(eventId?.toString(), session)
        .then((event: Event) => {
          setEvent(event);
        })
        .catch(() => {
          router.push(routeEventNotFound);
        });
    }
  }, [event == undefined]);

  if (!event) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Toaster richColors />

      <Dialog
        title="Remove Participant"
        queryParam="delete"
        onCancel={handleCancelRemoveParticipantClicked}
        onConfirm={() => {
          if (eventId) {
            handleConfirmRemoveParticipantClicked(userToRemove);
            setUserToRemove('');
          }
        }}
      >
        <p>Do you really want to remove {userToRemove}?</p>
      </Dialog>

      <div className="h-[calc(100dvh)] flex flex-col">
        <PageTitle title="Manage Participants" />

        <div className={'mx-2 rounded-lg border border-primary bg-secondary-light p-2 text-sm overflow-y-auto'}>
          <div className="flex flex-col">
            {event.eventRegistrations.length === 0 && <div className="m-1 flex justify-center">{`No registrations yet`}</div>}
            {event.eventRegistrations.map((registration, index) => {
              return (
                <div key={index} className="m-1 flex items-center">
                  <div className="mx-1 flex w-1/2 justify-end">
                    <UserBadge participant={registration.user} registrationStatus={registration.status} />
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
                                handleApproveParticipantClicked(registration.user.username, EventRegistrationStatus.DENIED);
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

        <Navigation>
          <ActionButton action={Action.BACK} onClick={() => router.push(`${routeEvents}/${eventId}`)} />
        </Navigation>
      </div>
    </>
  );
};

export default EventParticipants;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await auth(context);

  if (!validateSession(session)) {
    return {
      redirect: {
        permanent: false,
        destination: routeLogin,
      },
    };
  }

  return {
    props: {
      session: session,
    },
  };
};
