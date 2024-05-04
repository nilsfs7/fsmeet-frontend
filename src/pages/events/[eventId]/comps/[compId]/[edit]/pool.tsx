import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { Action } from '@/types/enums/action';
import ActionButton from '@/components/common/ActionButton';
import Participant from '@/components/events/Participant';
import { EventRegistration } from '@/types/event-registration';
import Link from 'next/link';
import { routeEvents, routeLogin, routeUsers } from '@/types/consts/routes';
import Navigation from '@/components/Navigation';
import { validateSession } from '@/types/funcs/validate-session';
import LoadingSpinner from '@/components/animation/loading-spinner';
import { getEventRegistrations } from '@/services/fsmeet-backend/get-event-registrations';
import { getCompetitionParticipants } from '@/services/fsmeet-backend/get-competition-participants';
import { Toaster, toast } from 'sonner';
import PageTitle from '@/components/PageTitle';
import { createCompetitionParticipation } from '@/services/fsmeet-backend/create-competition-participation';
import { deleteCompetitionParticipation } from '@/services/fsmeet-backend/delete-competition-participation';

const CompetitionPool = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;
  const { compId } = router.query;

  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([]);
  const [competitionParticipants, setCompetitionParticipants] = useState<{ username: string }[]>([]);

  const handleRemoveParticipantClicked = async (compId: string, username: string) => {
    if (!validateSession(session)) {
      router.push(routeLogin);
      return;
    }

    try {
      await deleteCompetitionParticipation(compId, username, session);

      let newArray = Array.from(competitionParticipants);
      newArray = newArray.filter((registration) => {
        return registration.username != username;
      });
      setCompetitionParticipants(newArray);

      toast.success(`${username} removed`);
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  const handleAddParticipantClicked = async (compId: string, username: string) => {
    if (!validateSession(session)) {
      router.push(routeLogin);
      return;
    }

    try {
      await createCompetitionParticipation(compId, username, session);

      const newArray = Array.from(competitionParticipants);
      newArray.push({ username: username });
      setCompetitionParticipants(newArray);

      toast.success(`${username} added`);
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  useEffect(() => {
    async function fetchEventRegistrations() {
      if (eventId) {
        const registrations = await getEventRegistrations(eventId?.toString());
        setEventRegistrations(registrations);
      }
    }

    async function fetchCompetitionParticipants() {
      if (compId) {
        const participants = await getCompetitionParticipants(compId?.toString());
        setCompetitionParticipants(participants);
      }
    }

    fetchEventRegistrations();
    fetchCompetitionParticipants();
  }, [eventRegistrations == undefined, competitionParticipants == undefined]);

  if (!eventRegistrations || !competitionParticipants) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Toaster richColors />

      <div className="absolute inset-0 flex flex-col">
        <PageTitle title="Manage Player Pool" />

        <div className={'mx-2 rounded-lg border border-primary bg-secondary-light p-2 overflow-y-auto'}>
          <div className={'my-2 flex flex-col justify-center overflow-y-auto'}>
            {eventRegistrations.length === 0 && <div className="m-2 text-center">{`There are no registrations for your event, yet.`}</div>}
            {eventRegistrations.length > 0 && <div className="m-2 text-center">{`Number of players added to pool: ${competitionParticipants.length}`}</div>}

            {eventRegistrations.map((registration, index) => {
              const participant: EventRegistration = {
                username: registration.username,
                status: registration.status,
                imageUrl: registration.imageUrl,
              };

              return (
                <div key={index} className="m-1 flex items-center">
                  <div className="mx-1 flex w-1/2 justify-end">
                    <Link className="float-right" href={`${routeUsers}/${participant.username}`}>
                      <Participant participant={participant} />
                    </Link>
                  </div>
                  <div className="mx-1 flex w-1/2 justify-start">
                    <div className="flex">
                      {competitionParticipants.some((e) => e.username === participant.username) && (
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
                      {!competitionParticipants.some((e) => e.username === participant.username) && (
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

        <Navigation>
          <Link href={`${routeEvents}/${eventId}/comps`}>
            <ActionButton action={Action.BACK} />
          </Link>
        </Navigation>
      </div>
    </>
  );
};

export default CompetitionPool;

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
