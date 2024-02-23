import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { EventCompetition } from '@/types/event-competition';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/types/enums/action';
import { Event } from '@/types/event';
import Navigation from '@/components/Navigation';
import TabbedCompetitionDetailsMenu from '@/components/comp/TabbedCompetitionDetailsMenu';
import { User } from '@/types/user';
import { useSearchParams } from 'next/navigation';
import { validateSession } from '@/types/funcs/validate-session';
import { routeLogin } from '@/types/consts/routes';

const Competition = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;
  const { compId } = router.query;

  const searchParams = useSearchParams();
  const needsAuthorization = searchParams.get('auth');

  const [competitionParticipants, setCompetitionParticipants] = useState<User[]>([]);
  const [comp, setComp] = useState<EventCompetition>();

  const fetchEvent = async (eventId: string): Promise<Event> => {
    let response;

    if (!needsAuthorization) {
      response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}`);
    } else {
      if (!validateSession(session)) {
        router.push(routeLogin);
      }

      response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/manage`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      });
    }

    return await response.json();
  };

  const fetchCompetitionParticipants = async (compId: string): Promise<{ username: string }[]> => {
    const url: string = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/participants`;
    const response = await fetch(url);
    return await response.json();
  };

  useEffect(() => {
    if (eventId && typeof eventId === 'string' && compId && typeof compId === 'string') {
      fetchEvent(eventId).then(async (e: Event) => {
        const comp = e.eventCompetitions.filter(c => c.id === compId)[0];
        const c: EventCompetition = {
          id: comp.id,
          eventId: eventId,
          name: comp.name,
          description: comp.description,
          rules: comp.rules,
        };
        setComp(c);

        const participants = await fetchCompetitionParticipants(compId);
        const competitionParticipants = participants.map(participant => {
          const participantRegistrationPair = e.eventRegistrations.filter(registration => {
            if (registration.username === participant.username) {
              return registration.imageUrl;
            }
          });

          let profileImageUrl;
          participantRegistrationPair.length === 1 ? (profileImageUrl = participantRegistrationPair[0].imageUrl) : null;

          const user: User = {
            username: participant.username,
            imageUrl: profileImageUrl,
          };

          return user;
        });

        setCompetitionParticipants(competitionParticipants);
      });
    }
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      <h1 className="my-2 flex items-center justify-center text-xl">{comp?.name}</h1>

      <div className="mx-2 overflow-hidden">
        <TabbedCompetitionDetailsMenu competitionParticipants={competitionParticipants} description={comp?.description} rules={comp?.rules} />
      </div>

      <Navigation>
        <ActionButton
          action={Action.BACK}
          onClick={() => {
            let path = `/events/${eventId}`;
            if (needsAuthorization) {
              path = `${path}?auth=1`;
            }

            router.push(path);
          }}
        />
      </Navigation>
    </div>
  );
};

export default Competition;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);

  return {
    props: {
      session: session,
    },
  };
};
