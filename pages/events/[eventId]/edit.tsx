import Button from '@/components/common/Button';
import EventEditor from '@/components/events/EventEditor';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import moment, { Moment } from 'moment';

export type Event = {
  id: string | undefined;
  name: string | undefined;
  dateFrom: Moment;
  dateTo: Moment;
  registrationCosts: number | undefined;
  registrationDeadline: Moment;
  description: string | undefined;
  location: string | undefined;
  type: string | undefined;
};

const EventEditing = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;

  const [event, setEvent] = useState<Event>();

  if (!session) {
    router.push('/login');
  }

  const fetchEvent = async (id: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${id}`);
    return await response.json();
  };

  const handleSaveClicked = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events`, {
      method: 'PUT',
      body: JSON.stringify({
        id: eventId,
        name: event?.name,
        dateFrom: event?.dateFrom.unix(),
        dateTo: event?.dateTo.unix(),
        registrationCosts: event?.registrationCosts,
        registrationDeadline: event?.registrationDeadline.unix(),
        description: event?.description,
        location: event?.location,
        type: event?.type,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    if (response.status == 201) {
      router.replace('/events/subs');
    }
  };

  const handleDeleteClicked = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events`, {
      method: 'DELETE',
      body: JSON.stringify({
        id: eventId,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    if (response.status == 200) {
      router.push('/events/subs');
    }
  };

  useEffect(() => {
    if (eventId && typeof eventId === 'string') {
      fetchEvent(eventId).then((res: Event) => {
        const e: Event = {
          id: res.id,
          name: res.name,
          // @ts-ignore
          dateFrom: moment.unix(res.dateFrom),
          // @ts-ignore
          dateTo: moment.unix(res.dateTo),
          registrationCosts: res.registrationCosts,
          // @ts-ignore
          registrationDeadline: moment.unix(res.registrationDeadline),
          description: res.description,
          location: res.location,
          type: res.type,
        };

        setEvent(e);
      });
    }
  }, []);

  return (
    <div className={'flex columns-1 flex-col items-center'}>
      <h1 className="m-2 text-xl">Edit Event</h1>
      <EventEditor
        event={event}
        onEventUpdate={(res: Event) => {
          const e: Event = {
            id: res.id,
            name: res.name,
            dateFrom: res.dateFrom,
            dateTo: res.dateTo,
            registrationCosts: res.registrationCosts,
            registrationDeadline: res.registrationDeadline,
            description: res.description,
            location: res.location,
            type: res.type,
          };

          setEvent(e);
        }}
      />

      <div className="my-2 flex">
        <div className="pr-1">
          <Button text={'Cancel'} onClick={() => router.back()} />{' '}
        </div>
        <div className="px-1">
          <Button text={'Delete'} onClick={handleDeleteClicked} />
        </div>
        <div className="pl-1">
          <Button text={'Save'} onClick={handleSaveClicked} />
        </div>
      </div>
    </div>
  );
};

export default EventEditing;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);

  return {
    props: {
      session: session,
    },
  };
};
