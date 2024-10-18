import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { routeEventNotFound, routeEvents, routeLogin } from '@/domain/constants/routes';
import CompetitionEditor from '@/components/events/CompetitionEditor';
import { Competition } from '@/types/competition';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/domain/enums/action';
import { Event } from '@/types/event';
import Dialog from '@/components/Dialog';
import { validateSession } from '@/functions/validate-session';
import { EditorMode } from '@/domain/enums/editor-mode';
import { Toaster, toast } from 'sonner';
import Navigation from '@/components/Navigation';
import TextButton from '@/components/common/TextButton';
import PageTitle from '@/components/PageTitle';
import { auth } from '@/auth';
import { getEvent } from '@/infrastructure/clients/event.client';
import { deleteCompetition, updateCompetition } from '@/infrastructure/clients/competition.client';

const CompetitionEditing = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;
  const { compId } = router.query;

  const [comp, setComp] = useState<Competition>();

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
      getEvent(eventId, session)
        .then((res: Event) => {
          const comp = res.competitions.filter((c) => c.id === compId)[0];

          const c: Competition = {
            id: comp.id,
            eventId: eventId,
            name: comp.name,
            type: comp.type,
            gender: comp.gender,
            maxAge: comp.maxAge,
            description: comp.description,
            rules: comp.rules,
            judges: comp.judges,
          };

          setComp(c);
        })
        .catch(() => {
          router.push(routeEventNotFound);
        });
    }
  }, []);

  return (
    <>
      <Toaster richColors />

      <Dialog title="Delete Competition" queryParam="delete" onCancel={handleCancelDeleteClicked} onConfirm={handleConfirmDeleteClicked}>
        <p>Do you really want to delete this competition?</p>
      </Dialog>

      <div className="h-[calc(100dvh)] flex flex-col">
        <PageTitle title="Edit Competition" />

        <div className={'flex columns-1 flex-col items-center overflow-y-auto'}>
          <CompetitionEditor
            editorMode={EditorMode.EDIT}
            comp={comp}
            onCompUpdate={(comp: Competition) => {
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
  const session = await auth(context);

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
