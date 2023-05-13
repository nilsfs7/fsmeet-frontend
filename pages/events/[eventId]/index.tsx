import { useRouter } from 'next/router';
import { IEvent } from '@/interface/event.js';
import EventCard from '@/components/events/EventCard';
import { useEffect, useState } from 'react';
import Button from '@/components/common/Button';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

const Event = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;

  const [event, setEvent] = useState<IEvent>();

  const handleEnrollClicked = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/enroll`, {
      method: 'POST',
      body: JSON.stringify({
        id: `${eventId}`,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    if (response.status == 200) {
      router.back();
    }
  };

  const handleEditClicked = async () => {
    router.push(`/events/${eventId}/edit`);
  };

  useEffect(() => {
    async function fetchEvent() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}`);
      const event = await response.json();
      setEvent(event);
    }

    fetchEvent();
  }, [event == undefined]);

  if (!event) {
    return 'loading...';
  }

  return (
    <>
      {/* replace by event page with register option */}
      <div className="m-2">
        <EventCard event={event} />
      </div>

      <div className="m-2 flex justify-between">
        <div className="flex justify-start">
          <div className="mr-1">
            <Button text={'Back'} onClick={() => router.back()} />
          </div>
        </div>

        <div className="flex justify-end ">
          <div className="ml-1">
            {event.owner === session?.user?.username && <Button text={'Edit'} onClick={handleEditClicked} />}
            {event.owner !== session?.user?.username && <Button text="Enroll" onClick={handleEnrollClicked} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Event;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);

  return {
    props: {
      session: session,
    },
  };
};
