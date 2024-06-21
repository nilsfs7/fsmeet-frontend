import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Action } from '@/types/enums/action';
import ActionButton from '@/components/common/ActionButton';
import Link from 'next/link';
import { Event } from '@/types/event';
import Navigation from '@/components/Navigation';
import Separator from '@/components/Seperator';
import { routeEventNotFound, routeEvents, routeLogin } from '@/types/consts/routes';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { getEvent } from '@/services/fsmeet-backend/get-event';
import { validateSession } from '@/types/funcs/validate-session';
import LoadingSpinner from '@/components/animation/loading-spinner';
import PageTitle from '@/components/PageTitle';

const ManageCompetitions = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;

  const [event, setEvent] = useState<Event>();

  useEffect(() => {
    if (eventId) {
      getEvent(eventId?.toString(), session)
        .then((event: Event) => {
          setEvent(event);
        })
        .catch(() => {
          router.push(routeEventNotFound);
        });
    }
  }, [event == undefined]);

  if (!event?.competitions) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <PageTitle title="Manage Competitions" />

      <div className="mx-2 overflow-y-auto">
        <div className={'rounded-lg border border-primary bg-secondary-light p-2 text-sm'}>
          <div className="flex flex-col">
            <>
              {event.competitions.map((comp, index) => {
                return (
                  <div key={index} className="m-1 flex flex-col gap-1">
                    <div className="flex items-center w-full gap-2">
                      <div className="flex w-1/2 justify-end">{comp.name}</div>
                      <div className="flex w-1/2">
                        <div className="gap-2 flex items-center">
                          <Link href={`${routeEvents}/${eventId}/comps/${comp.id}/edit`}>
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
                          <Link href={`${routeEvents}/${eventId}/comps/${comp.id}/edit/pool`}>
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
                          <Link href={`${routeEvents}/${eventId}/comps/${comp.id}/edit/mode`}>
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
                          <Link href={`${routeEvents}/${eventId}/comps/${comp.id}/edit/seeding`}>
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
                    <Link href={`${routeEvents}/${eventId}/comps/create`}>
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
        <ActionButton action={Action.BACK} onClick={() => router.push(`${routeEvents}/${eventId}`)} />
      </Navigation>
    </div>
  );
};

export default ManageCompetitions;

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
