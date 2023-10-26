import TextButton from '@/components/common/TextButton';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { routeLogin } from '@/types/consts/routes';
import CompetitionEditor from '@/components/events/CompetitionEditor';
import { EventCompetition } from '@/types/event-competition';
import ErrorMessage from '@/components/ErrorMessage';

const CompetitionCreation = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;

  const [comp, setComp] = useState<EventCompetition>();
  const [error, setError] = useState('');

  if (!session) {
    router.push(routeLogin);
  }

  const handleCreateClicked = async () => {
    setError('');

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/competition`, {
      method: 'POST',
      body: JSON.stringify({
        eventId: eventId,
        name: comp?.name.trim(),
      }),

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    if (response.status == 201) {
      router.replace(`/events/${eventId}/comps`);
    } else {
      const error = await response.json();
      setError(error.message);
      console.error(error.message);
    }
  };

  return (
    <div className={'flex columns-1 flex-col items-center'}>
      <h1 className="m-2 text-xl">Create Competition</h1>
      <CompetitionEditor
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

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);

  return {
    props: {
      session: session,
    },
  };
};
