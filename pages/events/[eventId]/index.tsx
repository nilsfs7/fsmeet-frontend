import { useRouter } from 'next/router';
import { IEvent } from '@/interface/event.js';
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
import { routeEvents, routeLogin } from '@/types/consts/routes';
import moment from 'moment';
import CompetitionList from '@/components/events/CompetitionList';
import EventDetails from '@/components/events/EventDetails';
import CommentSection from '@/components/events/comment/CommentSection';
import { EventComment } from '@/types/event-comment';
import { EventType } from '@/types/enums/event-type';
import Navigation from '@/components/Navigation';
import Dialog from '@/components/Dialog';

const Event = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;

  const [event, setEvent] = useState<IEvent>();
  const [eventComments, setEventComments] = useState<EventComment[]>();
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

  const handleRegisterClicked = async () => {
    if (!isLoggedIn()) {
      router.push(routeLogin);
      return;
    }

    if (event && event?.registrationDeadline > moment().unix()) {
      router.replace(`${routeEvents}/${eventId}?register=1`, undefined, { shallow: true });
    } else {
      console.error('Registration deadline exceeded.');
    }
  };

  const handleConfirmRegisterClicked = async () => {
    if (!isLoggedIn()) {
      router.push(routeLogin);
      return;
    }

    if (event && event?.registrationDeadline > moment().unix()) {
      const url: string = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/registrations`;
      const method: string = 'POST';

      const response = await fetch(url, {
        method: method,
        body: JSON.stringify({
          username: `${session.user.username}`,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });

      if (response.status == 201) {
        router.reload();
      }
    } else {
      console.error('Registration deadline exceeded.');
    }
  };

  const handleUnregisterClicked = async () => {
    if (!isLoggedIn()) {
      router.push(routeLogin);
      return;
    }

    if (event && event?.registrationDeadline > moment().unix()) {
      router.replace(`${routeEvents}/${eventId}?unregister=1`, undefined, { shallow: true });
    } else {
      console.error('Registration deadline exceeded.');
    }
  };

  const handleCancelDialogClicked = async () => {
    router.replace(`${routeEvents}/${eventId}`, undefined, { shallow: true });
  };

  const handleConfirmUnregisterClicked = async () => {
    if (!isLoggedIn()) {
      router.push(routeLogin);
      return;
    }

    if (event && event?.registrationDeadline > moment().unix()) {
      const url: string = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/registrations`;
      const method: string = 'DELETE';

      const response = await fetch(url, {
        method: method,
        body: JSON.stringify({
          username: `${session.user.username}`,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });

      if (response.status == 200) {
        router.reload();
      }
    } else {
      console.error('Registration deadline exceeded.');
    }
  };

  const handlePostCommentClicked = async (message: string) => {
    if (!isLoggedIn()) {
      router.push(routeLogin);
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/comments`, {
      method: 'POST',
      body: JSON.stringify({
        eventId: eventId,
        message: message,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    if (response.status == 201) {
      router.replace(`${routeEvents}/${eventId}`, undefined, { shallow: true });
      router.reload();
    }
  };

  const handlePostSubCommentClicked = async (commentId: string, message: string) => {
    if (!isLoggedIn()) {
      router.push(routeLogin);
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/comments/subs`, {
      method: 'POST',
      body: JSON.stringify({
        rootCommentId: commentId,
        message: message,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    if (response.status == 201) {
      router.reload();
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

    async function fetchEventComments() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/comments`);
      const eventComments: EventComment[] = await response.json();
      setEventComments(eventComments);
    }

    fetchEventComments();
    fetchEvent();
  }, [event == undefined]);

  if (!event || !approvedAndPendingRegistrations) {
    return <>loading...</>;
  }

  return (
    <>
      <Dialog title="Unregister From Event" queryParam="unregister" onClose={handleCancelDialogClicked} onOk={handleConfirmUnregisterClicked}>
        <p>Do you really want to unregister from this event?</p>
      </Dialog>

      <Dialog title="Confirm Registration" queryParam="register" onClose={handleCancelDialogClicked} onOk={handleConfirmRegisterClicked}>
        <div>{`Do you want to register for ${event.name}`}?</div>

        <div>Please take note of the participation fee ({event.participationFee.toString().replace('.', ',')} €). We will confirm your registration once we received your payment.</div>

        <div className="">
          <div className="mt-4 grid grid-cols-1 justify-between">
            <div>Bank transfer (SEPA)</div>

            <div className="grid grid-cols-2 justify-between">
              <div>Bank</div>
              <div className="select-text">{event.paymentMethodSepa.bank}</div>
            </div>

            <div className="grid grid-cols-2 justify-between">
              <div>Recipient</div>
              <div className="select-text">{event.paymentMethodSepa.recipient}</div>
            </div>

            <div className="grid grid-cols-2 justify-between">
              <div>IBAN</div>
              <div className="select-text">{event.paymentMethodSepa.iban}</div>
            </div>

            <div className="grid grid-cols-2 justify-between">
              <div>Amount</div>
              <div className="select-text">{event.participationFee.toString().replace('.', ',')} €</div>
            </div>

            <div className="grid grid-cols-2 justify-between">
              <div>Reference</div>
              <div className="select-text">
                {event.paymentMethodSepa.reference}-{session?.user?.username}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">By confirming your registration we will also mail you the payment details.</div>
      </Dialog>

      <div className="absolute inset-0 flex flex-col overflow-hidden">
        {/* admin panel */}
        <div className="mx-2 mt-2">
          {event.owner === session?.user?.username && (
            <div className="flex justify-between rounded-lg border border-primary bg-warning p-2">
              <div className="mr-8 flex items-center">Admin Panel</div>
              <div className="flex">
                {event.type === EventType.COMPETITION && (
                  <div className="ml-1">
                    <Link href={`/events/${eventId}/comps`}>
                      <ActionButton action={Action.MANAGE_COMPETITIONS} />
                    </Link>
                  </div>
                )}

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

        <div className="mx-2 mt-2 flex max-h-full flex-col overflow-y-auto">
          {/* event overview */}
          <div className="">
            <EventDetails event={event} />
          </div>

          {/* competitions */}
          {event.eventCompetitions.length > 0 && (
            <div className="mt-2">
              <CompetitionList competitions={event.eventCompetitions} eventId={event.id} />
            </div>
          )}

          {/* participants */}
          {approvedAndPendingRegistrations.length > 0 && (
            <div className="mt-2">
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

          {/* comments */}
          <div className="mt-2">
            <CommentSection
              username={session?.user.username}
              userProfileImageUrl={session?.user.imageUrl}
              eventComments={eventComments || []}
              onPostComment={(message: string) => {
                handlePostCommentClicked(message);
              }}
              onPostReply={(commentId: string, message: string) => {
                handlePostSubCommentClicked(commentId, message);
              }}
            />
          </div>
        </div>

        <Navigation>
          <div className="flex justify-start">
            <div className="mr-1">
              <Link href={routeEvents}>
                <ActionButton action={Action.BACK} />
              </Link>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="ml-1">
              <ActionButton action={Action.COPY} onClick={handleShareClicked} />
            </div>

            {event.registrationOpen < moment().unix() && event.registrationDeadline > moment().unix() && (
              <div className="ml-1">
                <TextButton text={isRegistered() ? 'Unregister' : 'Register'} onClick={isRegistered() ? handleUnregisterClicked : handleRegisterClicked} />
              </div>
            )}
          </div>
        </Navigation>
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
