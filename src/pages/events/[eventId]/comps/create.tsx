import TextButton from '@/components/common/TextButton';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { routeEvents, routeLogin } from '@/types/consts/routes';
import CompetitionEditor from '@/components/events/CompetitionEditor';
import { Competition } from '@/types/competition';
import { validateSession } from '@/types/funcs/validate-session';
import { EditorMode } from '@/domain/enums/editor-mode';
import { Toaster, toast } from 'sonner';
import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import { auth } from '@/auth';
import { createCompetition } from '@/infrastructure/clients/competition.client';
import NavigateBackButton from '@/components/NavigateBackButton';

const CompetitionCreation = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;

  const [comp, setComp] = useState<Competition>();

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

      <div className="h-[calc(100dvh)] flex flex-col">
        <PageTitle title="Create Competition" />

        <div className={'flex columns-1 flex-col items-center overflow-y-auto'}>
          <CompetitionEditor
            editorMode={EditorMode.CREATE}
            onCompUpdate={(comp: Competition) => {
              setComp(comp);
            }}
          />
        </div>

        <Navigation>
          <NavigateBackButton />
          <TextButton text={'Create'} onClick={handleCreateClicked} />
        </Navigation>
      </div>
    </>
  );
};

export default CompetitionCreation;

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
