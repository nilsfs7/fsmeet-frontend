import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { routeLogin } from '@/types/consts/routes';
import { EventCompetition } from '@/types/event-competition';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/types/enums/action';
import { Event } from '@/types/event';

const Competition = (props: any) => {
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
    <>
      <div className={'flex columns-1 flex-col items-center'}>
        <h1 className="m-2 text-xl">{comp?.name}</h1>

        <div>some infos...</div>
      </div>

      <div className="m-2 flex justify-between">
        <div className="flex justify-start">
          <div className="mr-1">
            <ActionButton action={Action.BACK} onClick={() => router.push(`/events/${eventId}`)} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Competition;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);

  return {
    props: {
      session: session,
    },
  };
};
