import Button from '@/components/common/Button';
import EventEditor from '@/components/events/EventEditor';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import router from 'next/router';
import { useState } from 'react';
import { Moment } from 'moment';

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

const EventCreation = (props: any) => {
  const session = props.session;

  const [event, setEvent] = useState<Event>();

  if (!session) {
    router.push('/login');
  }

  const handleCreateClicked = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events`, {
      method: 'POST',
      body: JSON.stringify({
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

  return (
    <div className={'flex columns-1 flex-col items-center'}>
      <h1 className="m-2 text-xl">Create Event</h1>
      <EventEditor
        onEventUpdate={(event: Event) => {
          setEvent(event);
        }}
      />
      <div className="my-2 flex">
        <div className="pr-1">
          <Button text={'Cancel'} onClick={() => router.back()} />
        </div>
        <div className="pl-1">
          <Button text={'Create Event'} onClick={handleCreateClicked} />
        </div>
      </div>
    </div>
  );
};

export default EventCreation;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);

  return {
    props: {
      session: session,
    },
  };
};
