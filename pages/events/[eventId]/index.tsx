import { useRouter } from 'next/router';
import { IEvent } from '@/interface/event.js';
import EventCard from '@/components/events/EventCard';
import { useEffect, useState } from 'react';
import TextButton from '@/components/common/TextButton';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import ParticipantList from '@/components/events/ParticipantList';
import { User } from '@/types/user';

const Event = (props: any) => {
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

  const isRegistered = () => {
    if (isLoggedIn() && event) {
      if (event.eventRegistrations.some(user => user.username === session.user.username)) {
        return true;
      }
    }

    return false;
  };

  const handleRegistrationClicked = async () => {
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }

    let url: string = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/register`;
    let method: string = 'POST';
    if (isRegistered()) {
      url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/unregister`;
      method = 'DELETE';
    }

    const response = await fetch(url, {
      method: method,
      body: JSON.stringify({
        eventId: `${eventId}`,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    if (response.status == 200 || response.status == 201) {
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

      <div className="m-2">
        <ParticipantList
          participants={event.eventRegistrations.map(registration => {
            const user: User = {
              username: registration.username,
              imageUrl: registration.imageUrl,
              instagramHandle: registration.instagramHandle,
            };

            return user;
          })}
        />
      </div>

      <div className="m-2 flex justify-between">
        <div className="flex justify-start">
          <div className="mr-1">
            <TextButton text={'Back'} onClick={() => router.back()} />
          </div>
        </div>

        <div className="flex justify-end">
          <div className="ml-1">
            {event.owner === session?.user?.username && <TextButton text={'Edit'} onClick={handleEditClicked} />}
            {event.owner !== session?.user?.username && <TextButton text={isRegistered() ? 'Unregister' : 'Register'} onClick={handleRegistrationClicked} />}
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
