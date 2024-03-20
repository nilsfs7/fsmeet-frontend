import TextButton from '@/components/common/TextButton';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { routeEvents, routeLogin } from '@/types/consts/routes';
import CompetitionEditor from '@/components/events/CompetitionEditor';
import { EventCompetition } from '@/types/event-competition';
import ErrorMessage from '@/components/ErrorMessage';
import { validateSession } from '@/types/funcs/validate-session';
import { createCompetition } from '@/services/fsmeet-backend/create-competition';
import { EditorMode } from '@/types/enums/editor-mode';

const CompetitionCreation = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;

  const [comp, setComp] = useState<EventCompetition>();
  const [error, setError] = useState('');

  const handleCreateClicked = async () => {
    setError('');

    if (eventId && comp) {
      try {
        await createCompetition(eventId.toString(), comp, session);
        router.replace(`${routeEvents}/${eventId}/comps`);
      } catch (error: any) {
        setError(error.message);
        console.error(error.message);
      }
    }
  };

  return (
    <div className={'flex columns-1 flex-col items-center'}>
      <h1 className="m-2 text-xl">{`Create Competition`}</h1>
      <CompetitionEditor
        editorMode={EditorMode.CREATE}
        onCompUpdate={(comp: EventCompetition) => {
          setComp(comp);
        }}
      />

      <ErrorMessage message={error} />

      <div className="my-2 flex">
        <div className="pr-1">
          <TextButton text={'Cancel'} onClick={() => router.back()} />
        </div>
        <div className="pl-1">
          <TextButton text={'Create'} onClick={handleCreateClicked} />
        </div>
      </div>
    </div>
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
