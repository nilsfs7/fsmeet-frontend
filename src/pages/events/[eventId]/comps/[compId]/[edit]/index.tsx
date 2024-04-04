import { GetServerSidePropsContext } from 'next';
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
import { updateCompetition } from '@/services/fsmeet-backend/update-competition';
import { EditorMode } from '@/types/enums/editor-mode';
import { deleteCompetition } from '@/services/fsmeet-backend/delete-competition';

const CompetitionEditing = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;
  const { compId } = router.query;

  const [comp, setComp] = useState<EventCompetition>();
  const [error, setError] = useState('');

  const handleSaveClicked = async () => {
    setError('');

    if (comp) {
      try {
        await updateCompetition(comp, session);
        router.replace(`${routeEvents}/${eventId}/comps`);
      } catch (error: any) {
        setError(error.message);
        console.error(error.message);
      }
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

    if (compId) {
      try {
        await deleteCompetition(compId?.toString(), session);
        router.push(`${routeEvents}/${eventId}/comps`);
      } catch (error: any) {
        setError(error.message);
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (eventId && typeof eventId === 'string' && compId && typeof compId === 'string') {
      getEvent(eventId).then((res: Event) => {
        const comp = res.eventCompetitions.filter((c) => c.id === compId)[0];

        const c: EventCompetition = {
          id: comp.id,
          eventId: eventId,
          name: comp.name,
          type: comp.type,
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
        <h1 className="m-2 text-xl">{`Edit Competition`}</h1>
        <CompetitionEditor
          editorMode={EditorMode.EDIT}
          comp={comp}
          onCompUpdate={(comp: EventCompetition) => {
            setComp(comp);
          }}
        />

        <ErrorMessage message={error} />

        <div className="my-2 flex">
          <div className="px-1">
            <ActionButton action={Action.CANCEL} onClick={() => router.replace(`${routeEvents}/${eventId}/comps`)} />
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
