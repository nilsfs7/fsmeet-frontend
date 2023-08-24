import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { routeLogin } from '@/types/consts/routes';
import CompetitionEditor from '@/components/events/CompetitionEditor';
import { EventCompetition } from '@/types/event-competition';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/types/enums/action';
import { Event } from '@/types/event';

const CompetitionEditing = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;
  const { compId } = router.query;

  const [comp, setComp] = useState<EventCompetition>();

  if (!session) {
    router.push(routeLogin);
  }

  const fetchEvent = async (id: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${id}`);
    return await response.json();
  };

  const handleSaveClicked = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/competition`, {
      method: 'PATCH',
      body: JSON.stringify({
        id: compId,
        eventId: eventId,
        name: comp?.name,
      }),

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    if (response.status == 200) {
      router.replace(`/events/${eventId}/comps`);
    }
  };

  useEffect(() => {
    if (eventId && typeof eventId === 'string' && compId && typeof compId === 'string') {
      fetchEvent(eventId).then((res: Event) => {
        const comp = res.eventCompetitions.filter(c => c.id === compId)[0];

        const c: EventCompetition = {
          id: comp.id,
          eventId: eventId,
          name: comp.name,
        };

        setComp(c);
      });
    }
  }, []);

  return (
    <div className={'flex columns-1 flex-col items-center'}>
      <h1 className="m-2 text-xl">Edit Competition</h1>
      <CompetitionEditor
        comp={comp}
        onCompUpdate={(comp: EventCompetition) => {
          setComp(comp);
        }}
      />
      <div className="my-2 flex">
        <div className="pr-1">
          <ActionButton action={Action.CANCEL} onClick={() => router.back()} />
        </div>
        <div className="pl-1">
          <ActionButton action={Action.SAVE} onClick={handleSaveClicked} />
        </div>
      </div>
    </div>
  );
};

export default CompetitionEditing;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);

  return {
    props: {
      session: session,
    },
  };
};
