import TextButton from '@/components/common/TextButton';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { routeEvents, routeLogin } from '@/types/consts/routes';
import CompetitionEditor from '@/components/events/CompetitionEditor';
import { EventCompetition } from '@/types/event-competition';
import { validateSession } from '@/types/funcs/validate-session';
import { createCompetition } from '@/services/fsmeet-backend/create-competition';
import { EditorMode } from '@/types/enums/editor-mode';
import { Toaster, toast } from 'sonner';
import Navigation from '@/components/Navigation';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/types/enums/action';
import PageTitle from '@/components/PageTitle';

const CompetitionCreation = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;

  const [comp, setComp] = useState<EventCompetition>();

  const handleCreateClicked = async () => {
    if (eventId && comp) {
      try {
        await createCompetition(eventId.toString(), comp, session);
        router.replace(`${routeEvents}/${eventId}/comps`);
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  return (
    <>
      <Toaster richColors />

      <div className="absolute inset-0 flex flex-col">
        <PageTitle title="Create Competition" />

        <div className={'flex columns-1 flex-col items-center overflow-y-auto'}>
          <CompetitionEditor
            editorMode={EditorMode.CREATE}
            onCompUpdate={(comp: EventCompetition) => {
              setComp(comp);
            }}
          />
        </div>

        <Navigation>
          <ActionButton action={Action.CANCEL} onClick={() => router.back()} />
          <TextButton text={'Create'} onClick={handleCreateClicked} />
        </Navigation>
      </div>
    </>
  );
};

export default CompetitionCreation;

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
