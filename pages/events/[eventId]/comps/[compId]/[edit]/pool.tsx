import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { Action } from '@/types/enums/action';
import ActionButton from '@/components/common/ActionButton';
import Participant from '@/components/events/Participant';
import { EventRegistration } from '@/types/event-registration';
import Link from 'next/link';
import { routeLogin } from '@/types/consts/routes';

const CompetitionPool = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;
  const { compId } = router.query;

  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([]);
  const [eventCompetitionParticipants, setCompetitionParticipants] = useState<{ username: string }[]>([]);

  const isLoggedIn = () => {
    if (session) {
      return true;
    }

    return false;
  };

  const handleRemoveParticipantClicked = async (compId: string, username: string) => {
    if (!isLoggedIn()) {
      router.push(routeLogin);
      return;
    }

    const url: string = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/participants`;
    const method: string = 'DELETE';

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
      let newArray = Array.from(eventCompetitionParticipants);
      newArray = newArray.filter(registration => {
        return registration.username != username;
      });
      setCompetitionParticipants(newArray);

      console.info(`${username} removed`);
    }
  };

  const handleAddParticipantClicked = async (compId: string, username: string) => {
    if (!isLoggedIn()) {
      router.push(routeLogin);
      return;
    }

    const url: string = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/participants`;
    const method: string = 'POST';

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

    if (response.status == 201) {
      const newArray = Array.from(eventCompetitionParticipants);
      newArray.push({ username: username });
      setCompetitionParticipants(newArray);

      console.info(`${username} added`);
    }
  };

  useEffect(() => {
    async function fetchEventRegistrations() {
      const url: string = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/registrations`;
      const response = await fetch(url);
      const registrations = await response.json();
      setEventRegistrations(registrations);
    }

    async function fetchCompetitionParticipants() {
      const url: string = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/participants`;
      const response = await fetch(url);
      const participants = await response.json();
      setCompetitionParticipants(participants);
    }

    fetchEventRegistrations();
    fetchCompetitionParticipants();
  }, [eventRegistrations == undefined, eventCompetitionParticipants == undefined]);

  if (!eventRegistrations || !eventCompetitionParticipants) {
    return <>loading...</>;
  }

  return (
    <>
      <div className="m-2">
        <div className={'rounded-lg border border-primary bg-secondary-light p-2 text-sm'}>
          <h1 className="m-2 text-center text-xl font-bold">Manage Player Pool</h1>
          <div className="flex flex-col">
            <div className="m-2 text-center text-sm">Number of players in pool: {eventCompetitionParticipants.length}</div>
            {eventRegistrations.map((registration, index) => {
              const participant: EventRegistration = {
                username: registration.username,
                status: registration.status,
                imageUrl: registration.imageUrl,
              };

              return (
                <div key={index} className="m-1 flex items-center">
                  <div className="mx-1 flex w-1/2 justify-end">
                    <Link className="float-right" href={`/user/${participant.username}`}>
                      <Participant participant={participant} />
                    </Link>
                  </div>
                  <div className="mx-1 flex w-1/2 justify-start">
                    <div className="flex">
                      {eventCompetitionParticipants.some(e => e.username === participant.username) && (
                        <>
                          <div className="flex h-full w-16 items-center justify-center">assigned</div>
                          <div className="ml-1">
                            <ActionButton
                              action={Action.DELETE}
                              onClick={() => {
                                // @ts-ignore
                                handleRemoveParticipantClicked(compId, participant.username);
                              }}
                            />
                          </div>
                        </>
                      )}
                      {!eventCompetitionParticipants.some(e => e.username === participant.username) && (
                        <>
                          <div className="flex h-full w-16 items-center justify-center">free</div>
                          <div className="mx-1">
                            <ActionButton
                              action={Action.ADD}
                              onClick={() => {
                                // @ts-ignore
                                handleAddParticipantClicked(compId, participant.username);
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
            <ActionButton action={Action.BACK} onClick={() => router.replace(`/events/${eventId}/comps/${compId}/edit`)} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CompetitionPool;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);

  return {
    props: {
      session: session,
    },
  };
};
