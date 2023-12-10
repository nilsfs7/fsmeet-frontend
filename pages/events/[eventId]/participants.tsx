import { useRouter } from 'next/router';
import { Event } from '@/types/event';
import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { Action } from '@/types/enums/action';
import ActionButton from '@/components/common/ActionButton';
import Participant from '@/components/events/Participant';
import { EventRegistration } from '@/types/event-registration';
import { EventRegistrationStatus } from '@/types/enums/event-registration-status';
import Link from 'next/link';
import { routeEvents, routeLogin } from '@/types/consts/routes';
import Dialog from '@/components/Dialog';
import { getEvent } from '@/services/fsmeet-backend/get-event';

const EventParticipants = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;

  const [event, setEvent] = useState<Event>();

  const [userToRemove, setUserToRemove] = useState('');

  const isLoggedIn = () => {
    if (session) {
      return true;
    }

    return false;
  };

  const handleRemoveParticipantClicked = async (username: string) => {
    setUserToRemove(username);
    router.replace(`${routeEvents}/${eventId}/participants?delete=1`, undefined, { shallow: true });
  };

  const handleCancelRemoveParticipantClicked = async () => {
    router.replace(`${routeEvents}/${eventId}/participants`, undefined, { shallow: true });
  };

  const handleConfirmRemoveParticipantClicked = async (username: string) => {
    if (!isLoggedIn()) {
      router.push(routeLogin);
      return;
    }

    let url: string = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/registrations`;
    let method: string = 'DELETE';

    const response = await fetch(url, {
      method: method,
      body: JSON.stringify({
        username: `${username}`,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    if (response.status == 200) {
      console.info(`${username} removed`);
      router.reload();
    }
  };

  const handleApproveParticipantClicked = async (username: string, status: EventRegistrationStatus) => {
    if (!isLoggedIn()) {
      router.push(routeLogin);
      return;
    }

    let url: string = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/registrations/status`;
    let method: string = 'PATCH';

    const response = await fetch(url, {
      method: method,
      body: JSON.stringify({
        username: `${username}`,
        status: status,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    if (response.status == 200) {
      console.info(`Status for ${username} updated`);
      router.reload();
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
    return <>loading...</>;
  }

  return (
    <>
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
            {event.eventRegistrations.map((registration, index) => {
              const participant: EventRegistration = {
                username: registration.username,
                status: registration.status,
                imageUrl: registration.imageUrl,
              };

              return (
                <div key={index} className="m-1 flex items-center">
                  <div className="mx-1 flex w-1/2 justify-end">
                    <Link className="float-right" href={`/user/${participant.username}`}>
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
            <ActionButton action={Action.BACK} onClick={() => router.push(`/events/${eventId}?auth=1`)} />
          </div>
        </div>
      </div>
    </>
  );
};

export default EventParticipants;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);

  return {
    props: {
      session: session,
    },
  };
};
