import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { routeLogin } from '@/types/consts/routes';
import { EventCompetition } from '@/types/event-competition';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/types/enums/action';
import { Event } from '@/types/event';
import Navigation from '@/components/Navigation';
import TabbedCompetitionDetailsMenu from '@/components/comp/TabbedCompetitionDetailsMenu';
import 'react-tabs/style/react-tabs.css'; // TODO: migrate to tailwind
import { User } from '@/types/user';

const Competition = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;
  const { compId } = router.query;

  const [competitionParticipants, setCompetitionParticipants] = useState<User[]>([]);
  const [comp, setComp] = useState<EventCompetition>();

  if (!session) {
    router.push(routeLogin);
  }

  const fetchEvent = async (eventId: string): Promise<Event> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}`);
    return await response.json();
  };

  const fetchCompetitionParticipants = async (compId: string): Promise<{ username: string }[]> => {
    const url: string = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/participants`;
    const response = await fetch(url);
    return await response.json();
  };

  useEffect(() => {
    if (eventId && typeof eventId === 'string' && compId && typeof compId === 'string') {
      fetchEvent(eventId).then(async (res: Event) => {
        const comp = res.eventCompetitions.filter(c => c.id === compId)[0];
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
          const participantRegistrationPair = res.eventRegistrations.filter(registration => {
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
      <div className="mx-2 flex max-h-full flex-col overflow-y-auto">
        <h1 className="mt-2 flex items-center justify-center text-xl">{comp?.name}</h1>

        <div className="mt-2">
          <TabbedCompetitionDetailsMenu competitionParticipants={competitionParticipants} description={comp?.description} rules={comp?.rules} />
        </div>
      </div>

      <Navigation>
        <ActionButton action={Action.BACK} onClick={() => router.push(`/events/${eventId}`)} />
      </Navigation>
    </div>
  );
};

export default Competition;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);

  return {
    props: {
      session: session,
    },
  };
};
