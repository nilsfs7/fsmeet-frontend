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
import Dialog from '@/components/Dialog';
import { getEvent } from '@/services/fsmeet-backend/get-event';
import { validateSession } from '@/types/funcs/validate-session';
import { updateCompetition } from '@/services/fsmeet-backend/update-competition';
import { EditorMode } from '@/types/enums/editor-mode';
import { deleteCompetition } from '@/services/fsmeet-backend/delete-competition';
import { Toaster, toast } from 'sonner';
import Navigation from '@/components/Navigation';
import TextButton from '@/components/common/TextButton';
import PageTitle from '@/components/PageTitle';

const CompetitionEditing = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;
  const { compId } = router.query;

  const [comp, setComp] = useState<EventCompetition>();

  const handleSaveClicked = async () => {
    if (comp) {
      try {
        await updateCompetition(comp, session);
        toast.success(`Competition successfully updated`);
        router.replace(`${routeEvents}/${eventId}/comps`);
      } catch (error: any) {
        toast.error(error.message);
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
    if (compId) {
      try {
        await deleteCompetition(compId?.toString(), session);
        router.replace(`${routeEvents}/${eventId}/comps`);
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (eventId && typeof eventId === 'string' && compId && typeof compId === 'string') {
      getEvent(eventId, true, session).then((res: Event) => {
        const comp = res.eventCompetitions.filter((c) => c.id === compId)[0];

        const c: EventCompetition = {
          id: comp.id,
          eventId: eventId,
          name: comp.name,
          type: comp.type,
          gender: comp.gender,
          description: comp.description,
          rules: comp.rules,
        };

        setComp(c);
      });
    }
  }, []);

  return (
    <>
      <Toaster richColors />

      <Dialog title="Delete Competition" queryParam="delete" onCancel={handleCancelDeleteClicked} onConfirm={handleConfirmDeleteClicked}>
        <p>Do you really want to delete this competition?</p>
      </Dialog>

      <div className="absolute inset-0 flex flex-col">
        <PageTitle title="Edit Competition" />

        <div className={'flex columns-1 flex-col items-center overflow-y-auto'}>
          <CompetitionEditor
            editorMode={EditorMode.EDIT}
            comp={comp}
            onCompUpdate={(comp: EventCompetition) => {
              setComp(comp);
            }}
          />
        </div>

        <Navigation>
          <ActionButton action={Action.CANCEL} onClick={() => router.replace(`${routeEvents}/${eventId}/comps`)} />

          <div className="flex gap-1">
            <ActionButton action={Action.DELETE} onClick={handleDeleteClicked} />

            <TextButton text={'Save'} onClick={handleSaveClicked} />
          </div>
        </Navigation>
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
