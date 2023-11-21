import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Action } from '@/types/enums/action';
import ActionButton from '@/components/common/ActionButton';
import Link from 'next/link';
import { IEvent } from '@/interface/event';
import Navigation from '@/components/Navigation';
import Separator from '@/components/Seperator';
import { routeLogin } from '@/types/consts/routes';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

const EventCompetitions = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;

  const [event, setEvent] = useState<IEvent>();

  if (!session) {
    router.push(routeLogin);
  }

  useEffect(() => {
    async function fetchEvent() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/manage`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      });
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
      <div className="mx-2 mt-2">
        <div className={'rounded-lg border border-primary bg-secondary-light p-2 text-sm'}>
          <div className="m-2 text-center text-base font-bold">Manage Competitions</div>
          <div className="flex flex-col">
            <>
              {event.eventCompetitions.map((comp, index) => {
                return (
                  <div key={index} className="m-1 flex flex-col gap-1">
                    <div className="flex items-center w-full gap-2">
                      <div className="flex w-1/2 justify-end">{comp.name}</div>
                      <div className="flex w-1/2">
                        <div className="gap-2 flex items-center">
                          <Link href={`/events/${eventId}/comps/${comp.id}/edit`}>
                            <ActionButton action={Action.EDIT} />
                          </Link>
                          <div>Edit</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center w-full gap-2">
                      <div className="flex w-1/2 justify-end"></div>
                      <div className="flex w-1/2">
                        <div className="gap-2 flex items-center">
                          <Link href={`/events/${eventId}/comps/${comp.id}/edit/pool`}>
                            <ActionButton action={Action.MANAGE_USERS} />
                          </Link>
                          <div>Pool</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center w-full gap-2">
                      <div className="flex w-1/2 justify-end"></div>
                      <div className="flex w-1/2">
                        <div className="gap-2 flex items-center">
                          <Link href={`/events/${eventId}/comps/${comp.id}/edit/mode`}>
                            <ActionButton action={Action.MANAGE_COMPETITIONS} />
                          </Link>
                          <div>Game Mode</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center w-full gap-2">
                      <div className="flex w-1/2 justify-end"></div>
                      <div className="flex w-1/2">
                        <div className="gap-2 flex items-center">
                          <Link href={`/events/${eventId}/comps/${comp.id}/edit/seeding`}>
                            <ActionButton action={Action.MANAGE_USERS} />
                          </Link>
                          <div>Seeding & Results</div>
                        </div>
                      </div>
                    </div>

                    <div className="my-1">
                      <Separator />
                    </div>
                  </div>
                );
              })}

              <div className="m-1 flex items-center gap-2">
                <div className="flex w-1/2 justify-end">Add new</div>
                <div className="flex w-1/2">
                  <div className="">
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
        <ActionButton action={Action.BACK} onClick={() => router.push(`/events/${eventId}?auth=1`)} />
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
