import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { Action } from '@/types/enums/action';
import ActionButton from '@/components/common/ActionButton';
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
import { UserType } from '@/types/enums/user-type';
import { getCompetition } from '@/services/fsmeet-backend/get-competition';
import { Competition } from '@/types/competition';
import { CompetitionGender } from '@/types/enums/competition-gender';
import ParticipantBadge from '@/components/events/ParticipantBadge';

const CompetitionPool = (props: any) => {
  const session = props.session;
  const competition: Competition = props.data.competition;

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
        let registrations = await getEventRegistrations(eventId?.toString());

        // remove non-freestylers
        registrations = registrations.filter((registration) => {
          if (registration.user.type === UserType.FREESTYLER) {
            return registration;
          }
        });

        // remove wrong gender
        if (competition.gender !== CompetitionGender.MIXED) {
          registrations = registrations.filter((registration) => {
            if (registration.user.gender === competition.gender.toString()) {
              return registration;
            }
          });
        }

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

      <div className="h-[calc(100dvh)] flex flex-col">
        <PageTitle title="Manage Player Pool" />

        <div className={'mx-2 rounded-lg border border-primary bg-secondary-light p-2 overflow-y-auto'}>
          <div className={'my-2 flex flex-col justify-center overflow-y-auto'}>
            {eventRegistrations.length === 0 && <div className="m-2 text-center">{`There are no registrations for your event, yet.`}</div>}
            {eventRegistrations.length > 0 && <div className="m-2 text-center">{`Number of players added to pool: ${competitionParticipants.length}`}</div>}

            {eventRegistrations.map((registration, index) => {
              return (
                <div key={index} className="m-1 flex items-center">
                  <div className="mx-1 flex w-1/2 justify-end">
                    <Link className="float-right" href={`${routeUsers}/${registration.user.username}`}>
                      <ParticipantBadge participant={registration.user} />
                    </Link>
                  </div>
                  <div className="mx-1 flex w-1/2 justify-start">
                    <div className="flex">
                      {competitionParticipants.some((e) => e.username === registration.user.username) && (
                        <>
                          <div className="flex h-full w-16 items-center justify-center">assigned</div>
                          <div className="ml-1">
                            <ActionButton
                              action={Action.DELETE}
                              onClick={() => {
                                // @ts-ignore
                                handleRemoveParticipantClicked(compId, registration.user.username);
                              }}
                            />
                          </div>
                        </>
                      )}
                      {!competitionParticipants.some((e) => e.username === registration.user.username) && (
                        <>
                          <div className="flex h-full w-16 items-center justify-center">free</div>
                          <div className="mx-1">
                            <ActionButton
                              action={Action.ADD}
                              onClick={() => {
                                // @ts-ignore
                                handleAddParticipantClicked(compId, registration.user.username);
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

  const compId = context.query.compId;

  let data: { competition: Competition | null } = { competition: null };

  if (compId) {
    try {
      data.competition = JSON.parse(JSON.stringify(await getCompetition(compId?.toString())));
    } catch (error: any) {
      console.error('Error fetching competiton.');
    }
  }

  return {
    props: {
      session: session,
      data: data,
    },
  };
};
