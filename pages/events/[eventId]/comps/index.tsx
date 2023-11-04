import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { Action } from '@/types/enums/action';
import ActionButton from '@/components/common/ActionButton';
import Link from 'next/link';
import { routeLogin } from '@/types/consts/routes';
import { IEvent } from '@/interface/event';
import Navigation from '@/components/Navigation';

const EventCompetitions = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;

  const [event, setEvent] = useState<IEvent>();

  const isLoggedIn = () => {
    if (session) {
      return true;
    }

    return false;
  };

  const handleRemoveCompetition = async (id: string) => {
    if (!isLoggedIn()) {
      router.push(routeLogin);
      return;
    }

    let url: string = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/competition`;
    let method: string = 'DELETE';

    const response = await fetch(url, {
      method: method,
      body: JSON.stringify({
        id: `${id}`,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    if (response.status == 200) {
      console.info(`${id} removed`);
      router.reload();
    }
  };

  useEffect(() => {
    async function fetchEvent() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}`);
      const event: IEvent = await response.json();
      setEvent(event);
    }

    fetchEvent();
  }, [event == undefined]);

  if (!event?.eventCompetitions) {
    return <>loading...</>;
  }

  return (
    <>
      <div className="m-2">
        <div className={'rounded-lg border border-primary bg-secondary-light p-2 text-sm'}>
          <div className="m-2 text-center text-base font-bold">Manage Competitions</div>
          <div className="flex flex-col">
            <>
              {event.eventCompetitions.map((comp, index) => {
                return (
                  <div key={index} className="m-1 flex items-center">
                    <div className="mx-1 flex w-1/2 justify-end">{comp.name}</div>
                    <div className="mx-1 flex w-1/2 justify-start">
                      <div className="ml-1">
                        <Link href={`/events/${eventId}/comps/${comp.id}/edit`}>
                          <ActionButton action={Action.EDIT} />
                        </Link>
                      </div>
                      <div className="ml-1">
                        <ActionButton
                          action={Action.DELETE}
                          onClick={() => {
                            if (!comp.id) {
                              throw Error('Competition id unknown');
                            }

                            handleRemoveCompetition(comp.id);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="m-1 flex items-center">
                <div className="mx-1 flex w-1/2 justify-end">Add new</div>
                <div className="mx-1 flex w-1/2 justify-start">
                  <div className="ml-1">
                    <Link href={`/events/${eventId}/comps/create`}>
                      <ActionButton action={Action.ADD} />
                    </Link>
                  </div>
                </div>
              </div>
            </>
          </div>
        </div>
      </div>

      <Navigation>
        <ActionButton action={Action.BACK} onClick={() => router.push(`/events/${eventId}`)} />
      </Navigation>
    </>
  );
};

export default EventCompetitions;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);

  return {
    props: {
      session: session,
    },
  };
};
