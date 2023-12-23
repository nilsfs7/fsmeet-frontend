import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { routeEvents, routeLogin } from '@/types/consts/routes';
import CompetitionEditor from '@/components/events/CompetitionEditor';
import { EventCompetition } from '@/types/event-competition';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/types/enums/action';
import { Event } from '@/types/event';
import ErrorMessage from '@/components/ErrorMessage';
import Dialog from '@/components/Dialog';
import { getEvent } from '@/services/fsmeet-backend/get-event';
import { validateSession } from '@/types/funcs/validate-session';

const CompetitionEditing = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;
  const { compId } = router.query;

  const [comp, setComp] = useState<EventCompetition>();
  const [error, setError] = useState('');

  const handleSaveClicked = async () => {
    setError('');

    const body = JSON.stringify({
      id: compId,
      eventId: eventId,
      name: comp?.name.trim(),
      description: comp?.description.trim(),
      rules: comp?.rules.trim(),
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/competition`, {
      method: 'PATCH',
      body: body,
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

  const handleDeleteClicked = async () => {
    router.replace(`${routeEvents}/${eventId}/comps/${compId}/edit?delete=1`, undefined, { shallow: true });
  };

  const handleCancelDeleteClicked = async () => {
    router.replace(`${routeEvents}/${eventId}/comps/${compId}/edit`, undefined, { shallow: true });
  };

  const handleConfirmDeleteClicked = async () => {
    setError('');

    let url: string = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/competition`;
    let method: string = 'DELETE';

    const response = await fetch(url, {
      method: method,
      body: JSON.stringify({
        id: `${compId}`,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    if (response.status == 200) {
      console.info(`competition ${compId} removed`);
      router.push(`${routeEvents}/${eventId}/comps`);
    } else {
      const error = await response.json();
      setError(error.message);
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (eventId && typeof eventId === 'string' && compId && typeof compId === 'string') {
      getEvent(eventId).then((res: Event) => {
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
    <>
      <Dialog title="Delete Competition" queryParam="delete" onCancel={handleCancelDeleteClicked} onConfirm={handleConfirmDeleteClicked}>
        <p>Do you really want to delete this competition?</p>
      </Dialog>

      <div className={'flex columns-1 flex-col items-center'}>
        <h1 className="m-2 text-xl">Edit Competition</h1>
        <CompetitionEditor
          comp={comp}
          onCompUpdate={(comp: EventCompetition) => {
            setComp(comp);
          }}
        />

        <ErrorMessage message={error} />

        <div className="my-2 flex">
          <div className="px-1">
            <ActionButton action={Action.CANCEL} onClick={() => router.replace(`/events/${eventId}/comps`)} />
          </div>
          <div className="px-1">
            <ActionButton action={Action.DELETE} onClick={handleDeleteClicked} />
          </div>
          <div className="px-1">
            <ActionButton action={Action.SAVE} onClick={handleSaveClicked} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CompetitionEditing;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);

  if (!validateSession(session)) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }

  return {
    props: {
      session: session,
    },
  };
};
