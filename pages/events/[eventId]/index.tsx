import { useRouter } from 'next/router';
import { IEvent } from '@/interface/event.js';
import EventCard from '@/components/events/EventCard';
import { useEffect, useState } from 'react';
import TextButton from '@/components/common/TextButton';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import ParticipantList from '@/components/events/ParticipantList';
import { User } from '@/types/user';
import { Action } from '@/types/enums/action';
import ActionButton from '@/components/common/ActionButton';
import { EventRegistrationStatus } from '@/types/enums/event-registration-status';
import { EventRegistration } from '@/types/event-registration';
import Link from 'next/link';
import { routeLogin } from '@/types/consts/routes';

const Event = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;

  const [event, setEvent] = useState<IEvent>();
  const [approvedAndPendingRegistrations, setApprovedAndPendingRegistrations] = useState<EventRegistration[]>();

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
      router.push(routeLogin);
      return;
    }

    let url: string = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/registration`;
    let method: string = 'POST';
    if (isRegistered()) {
      url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/registration`;
      method = 'DELETE';
    }

    const response = await fetch(url, {
      method: method,
      body: JSON.stringify({
        eventId: `${eventId}`,
        username: `${session.user.username}`,
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

  const handleShareClicked = async () => {
    const eventUrl = window.location.toString();

    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard.writeText(eventUrl);
    } else {
      unsecuredCopyToClipboard(eventUrl);
    }
  };

  const unsecuredCopyToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Unable to copy to clipboard', err);
    }
    document.body.removeChild(textArea);
  };

  useEffect(() => {
    async function fetchEvent() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}`);
      const event: IEvent = await response.json();
      setEvent(event);

      const approvedWithImage = event.eventRegistrations
        .filter((registration: EventRegistration) => registration.status == EventRegistrationStatus.APPROVED && registration.imageUrl)
        .sort((a, b) => (a.username > b.username ? 1 : -1));
      const approvedNoImage = event.eventRegistrations
        .filter((registration: EventRegistration) => registration.status == EventRegistrationStatus.APPROVED && !registration.imageUrl)
        .sort((a, b) => (a.username > b.username ? 1 : -1));
      const pendingWithImage = event.eventRegistrations
        .filter((registration: EventRegistration) => registration.status == EventRegistrationStatus.PENDING && registration.imageUrl)
        .sort((a, b) => (a.username > b.username ? 1 : -1));
      const pendingNoImage = event.eventRegistrations
        .filter((registration: EventRegistration) => registration.status == EventRegistrationStatus.PENDING && !registration.imageUrl)
        .sort((a, b) => (a.username > b.username ? 1 : -1));

      setApprovedAndPendingRegistrations(approvedWithImage.concat(approvedNoImage).concat(pendingWithImage).concat(pendingNoImage));
    }

    fetchEvent();
  }, [event == undefined]);

  if (!event || !approvedAndPendingRegistrations) {
    return 'loading...';
  }

  return (
    <>
      <div className="m-2 ">
        {event.owner === session?.user?.username && (
          <div className="flex justify-between rounded-lg border-2 border-black bg-amber-200 p-2">
            <div className="mr-8 flex items-center">Admin Panel</div>
            <div className="flex">
              <div className="ml-1">
                <Link href={`/events/${eventId}/participants`}>
                  <ActionButton action={Action.MANAGE_USERS} />
                </Link>
              </div>
              <div className="ml-1">
                <Link href={`/events/${eventId}/edit`}>
                  <ActionButton action={Action.EDIT} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* replace by event page with register option */}
      {/* event overview */}
      <div className="m-2">
        <EventCard event={event} />
      </div>

      {/* participants */}
      {approvedAndPendingRegistrations.length > 0 && (
        <div className="m-2">
          <ParticipantList
            participants={approvedAndPendingRegistrations.map(registration => {
              const user: User = {
                username: registration.username,
                imageUrl: registration.imageUrl,
              };

              return user;
            })}
            registrationStatus={approvedAndPendingRegistrations.map(registration => {
              return registration.status;
            })}
          />
        </div>
      )}

      <div className="m-2 flex justify-between">
        <div className="flex justify-start">
          <div className="mr-1">
            <ActionButton action={Action.BACK} onClick={() => router.back()} />
          </div>
        </div>

        <div className="flex justify-end">
          <div className="ml-1">
            <ActionButton action={Action.COPY} onClick={handleShareClicked} />
          </div>

          <div className="ml-1">
            <TextButton text={isRegistered() ? 'Unregister' : 'Register'} onClick={handleRegistrationClicked} />
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
