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

  const handleDeleteClicked = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events`, {
      method: 'DELETE',
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

  //   const openRegistration = () => {
  //     router.push(`/registration/${eventData.id}`);
  //   };

  return (
    <>
      {/* replace by event page with register option */}
      <EventCard event={event} />

      <div className="m-4 flex justify-between">
        <div className="m-4 flex justify-start">
          <Button text={'Back'} onClick={() => router.back()} />
        </div>
        {event.owner === session.user.username && (
          <div className="m-4 flex justify-end">
            <div className="mr-2">
              <Button text={'Edit'} onClick={() => console.log('edit clicked')} />
            </div>
            <div className="ml-2">
              <Button text="Delete" onClick={handleDeleteClicked} />
            </div>
          </div>
        )}
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
