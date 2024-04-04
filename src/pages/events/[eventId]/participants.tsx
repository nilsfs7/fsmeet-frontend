import { useRouter } from 'next/router';
import { Event } from '@/types/event';
import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import { Action } from '@/types/enums/action';
import ActionButton from '@/components/common/ActionButton';
import Participant from '@/components/events/Participant';
import { EventRegistration } from '@/types/event-registration';
import { EventRegistrationStatus } from '@/types/enums/event-registration-status';
import Link from 'next/link';
import { routeEvents, routeLogin, routeUsers } from '@/types/consts/routes';
import Dialog from '@/components/Dialog';
import { getEvent } from '@/services/fsmeet-backend/get-event';
import { validateSession } from '@/types/funcs/validate-session';
import { GetServerSidePropsContext } from 'next';
import LoadingSpinner from '@/components/animation/loading-spinner';
import { deleteEventRegistration } from '@/services/fsmeet-backend/delete-event-registration';
import { Toaster, toast } from 'sonner';
import { updateEventRegistrationStatus } from '@/services/fsmeet-backend/update-event-registration-status';

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
      getEvent(eventId?.toString(), true, session).then((event: Event) => {
        setEvent(event);
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

      <div className="m-2">
        <div className={'rounded-lg border border-primary bg-secondary-light p-2 text-sm'}>
          <div className="m-2 text-center text-base font-bold">Manage Participants</div>
          <div className="flex flex-col">
            {event.eventRegistrations.length === 0 && <div className="m-1 flex justify-center">No registrations yet</div>}
            {event.eventRegistrations.map((registration, index) => {
              const participant: EventRegistration = {
                username: registration.username,
                status: registration.status,
                imageUrl: registration.imageUrl,
              };

              return (
                <div key={index} className="m-1 flex items-center">
                  <div className="mx-1 flex w-1/2 justify-end">
                    <Link className="float-right" href={`${routeUsers}/${participant.username}`}>
                      <Participant participant={participant} registrationStatus={registration.status} />
                    </Link>
                  </div>
                  <div className="mx-1 flex w-1/2 justify-start">
                    {(participant.status === EventRegistrationStatus.APPROVED || participant.status === EventRegistrationStatus.DENIED) && (
                      <>
                        <div className="mr-1 flex w-24 items-center justify-center font-bold ">{participant.status.toUpperCase()}</div>
                        <div className="ml-1">
                          <ActionButton
                            action={Action.DELETE}
                            onClick={() => {
                              handleRemoveParticipantClicked(participant.username);
                            }}
                          />
                        </div>
                      </>
                    )}

                    <div className="flex">
                      {participant.status == EventRegistrationStatus.PENDING && (
                        <>
                          <div className="mr-1">
                            <ActionButton
                              action={Action.ACCEPT}
                              onClick={() => {
                                handleApproveParticipantClicked(participant.username, EventRegistrationStatus.APPROVED);
                              }}
                            />
                          </div>
                          <div className="ml-1">
                            <ActionButton
                              action={Action.DENY}
                              onClick={() => {
                                handleApproveParticipantClicked(participant.username, EventRegistrationStatus.DENIED);
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
      </div>

      <div className="m-2 flex justify-between">
        <div className="flex justify-start">
          <div className="mr-1">
            <ActionButton action={Action.BACK} onClick={() => router.push(`${routeEvents}/${eventId}?auth=1`)} />
          </div>
        </div>
      </div>
    </>
  );
};

export default EventParticipants;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);

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
