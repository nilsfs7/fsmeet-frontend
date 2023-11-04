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
import ErrorMessage from '@/components/ErrorMessage';

const CompetitionEditing = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;
  const { compId } = router.query;

  const [comp, setComp] = useState<EventCompetition>();
  const [error, setError] = useState('');

  if (!session) {
    router.push(routeLogin);
  }

  const fetchEvent = async (id: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${id}`);
    return await response.json();
  };

  const handleSaveClicked = async () => {
    setError('');

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/competition`, {
      method: 'PATCH',
      body: JSON.stringify({
        id: compId,
        eventId: eventId,
        name: comp?.name.trim(),
        description: comp?.description.trim(),
        rules: comp?.rules.trim(),
      }),

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    if (response.status == 200) {
      router.replace(`/events/${eventId}/comps`);
    } else {
      const error = await response.json();
      setError(error.message);
      console.error(error.message);
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
          description: comp.description,
          rules: comp.rules,
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
          <div className="flex h-full items-center">Player Pool</div>
        </div>
        <div className="pl-1">
          <ActionButton action={Action.MANAGE_USERS} onClick={() => router.push(`/events/${eventId}/comps/${compId}/edit/pool`)} />
        </div>
      </div>

      <div className="my-2 flex">
        <div className="pr-1">
          <div className="flex h-full items-center">Game Mode</div>
        </div>
        <div className="pl-1">
          <ActionButton action={Action.MANAGE_COMPETITIONS} onClick={() => router.push(`/events/${eventId}/comps/${compId}/edit/mode`)} />
        </div>
      </div>

      <div className="my-2 flex">
        <div className="pr-1">
          <div className="flex h-full items-center">Seeding</div>
        </div>
        <div className="pl-1">
          <ActionButton action={Action.MANAGE_USERS} onClick={() => router.push(`/events/${eventId}/comps/${compId}/edit/seeding`)} />
        </div>
      </div>

      <ErrorMessage message={error} />

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
