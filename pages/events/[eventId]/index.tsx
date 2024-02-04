import { useRouter } from 'next/router';
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
import CashInfo from '@/components/payment/cash-info';
import PayPalInfo from '@/components/payment/paypal-info';
import SepaInfo from '@/components/payment/sepa-info';
import { useSearchParams } from 'next/navigation';
import { Event } from '@/types/event';
import { getEvent } from '@/services/fsmeet-backend/get-event';
import { validateSession } from '@/types/funcs/validate-session';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { switchTab } from '@/types/funcs/switch-tab';

const Event = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;

  const searchParams = useSearchParams();
  const needsAuthorization = searchParams.get('auth');
  const tab = searchParams.get('tab');

  const [event, setEvent] = useState<Event>();
  const [eventComments, setEventComments] = useState<EventComment[]>();
  const [approvedAndPendingRegistrations, setApprovedAndPendingRegistrations] = useState<EventRegistration[]>();

  const isRegistered = () => {
    if (validateSession(session)) {
      if (event && event.eventRegistrations.some(user => user.username === session.user.username)) {
        return true;
      }
    }

    return false;
  };

  const handleRegisterClicked = async () => {
    if (!validateSession(session)) {
      router.push(routeLogin);
      return;
    }

    if (event && moment(event?.registrationDeadline).unix() > moment().unix()) {
      router.replace(`${routeEvents}/${eventId}?register=1`, undefined, { shallow: true });
    } else {
      console.error('Registration deadline exceeded.');
    }
  };

  const handleConfirmRegisterClicked = async () => {
    if (!validateSession(session)) {
      router.push(routeLogin);
      return;
    }

    if (event && moment(event?.registrationDeadline).unix() > moment().unix()) {
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
    if (!validateSession(session)) {
      router.push(routeLogin);
      return;
    }

    if (event && moment(event?.registrationDeadline).unix() > moment().unix()) {
      router.replace(`${routeEvents}/${eventId}?unregister=1`, undefined, { shallow: true });
    } else {
      console.error('Registration deadline exceeded.');
    }
  };

  const handleCancelDialogClicked = async () => {
    router.replace(`${routeEvents}/${eventId}`, undefined, { shallow: true });
  };

  const handleConfirmUnregisterClicked = async () => {
    if (!validateSession(session)) {
      router.push(routeLogin);
      return;
    }

    if (event && moment(event?.registrationDeadline).unix() > moment().unix()) {
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
    if (!validateSession(session)) {
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
    if (!validateSession(session)) {
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
    let eventUrl: string;

    if (event?.alias) {
      eventUrl = `${window.location.host.toString()}/e/${event?.alias}`;
    } else {
      eventUrl = window.location.toString();
    }

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
    async function loadEventInfos() {
      let event: Event;
      if (eventId) {
        if (needsAuthorization) {
          if (!validateSession(session)) {
            router.push(routeLogin);
            return;
          }

          event = await getEvent(eventId?.toString(), JSON.parse(needsAuthorization), session);
          setEvent(event);
        } else {
          event = await getEvent(eventId?.toString());
          setEvent(event);
        }

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
    }

    async function fetchEventComments() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/comments`);
      const eventComments: EventComment[] = await response.json();
      setEventComments(eventComments);
    }

    fetchEventComments();
    loadEventInfos();
  }, [event == undefined]);

  if (!event || !approvedAndPendingRegistrations) {
    return <>loading...</>;
  }

  return (
    <>
      <Dialog title="Unregister From Event" queryParam="unregister" onCancel={handleCancelDialogClicked} onConfirm={handleConfirmUnregisterClicked} confirmText="Confirm">
        <p>Do you really want to unregister from this event?</p>
      </Dialog>

      <Dialog title="Confirm Registration" queryParam="register" onCancel={handleCancelDialogClicked} onConfirm={handleConfirmRegisterClicked} confirmText="Register now">
        <div>{`Do you want to register for ${event.name}`}?</div>

        {event.participationFee > 0 && (
          <>
            <div className="mt-4">
              Please take note of the participation fee of {event.participationFee.toString().replace('.', ',')}€. Your registration will be confirmed once your payment completed.
            </div>

            {event.paymentMethodCash.enabled && (
              <div className="mt-4">
                <CashInfo participationFee={event.participationFee} />
              </div>
            )}

            {event.paymentMethodPayPal.enabled && (
              <div className="mt-4">
                <PayPalInfo participationFee={event.participationFee} payPalInfo={event.paymentMethodPayPal} usernameForReference={session?.user?.username} />
              </div>
            )}

            {event.paymentMethodSepa.enabled && (
              <div className="mt-4">
                <SepaInfo participationFee={event.participationFee} sepaInfo={event.paymentMethodSepa} usernameForReference={session?.user?.username} />
              </div>
            )}

            <div className="mt-4">By confirming your registration we will also mail you the payment details.</div>
          </>
        )}
      </Dialog>

      <div className="absolute inset-0 flex flex-col overflow-hidden">
        {/* admin panel */}
        <div className="mx-2 my-2">
          {event.admin === session?.user?.username && (
            <div className="flex justify-between rounded-lg border border-primary bg-warning p-2">
              <div className="mr-8 flex items-center">Admin Panel</div>
              <div className="flex">
                {(event.type === EventType.COMPETITION || event.type === EventType.COMPETITION_ONLINE) && (
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

        <div className="mx-2 overflow-hidden">
          <Tabs defaultValue={tab || `overview`} className="flex flex-col h-full">
            <TabsList className="mb-2">
              <TabsTrigger
                value="overview"
                onClick={() => {
                  switchTab(router, 'overview');
                }}
              >
                Overview
              </TabsTrigger>
              {event.eventCompetitions.length > 0 && (
                <TabsTrigger
                  value="competitions"
                  onClick={() => {
                    switchTab(router, 'competitions');
                  }}
                >
                  Competitions
                </TabsTrigger>
              )}
              {approvedAndPendingRegistrations.length > 1 && (
                <TabsTrigger
                  value="registrations"
                  onClick={() => {
                    switchTab(router, 'registrations');
                  }}
                >
                  Registrations
                </TabsTrigger>
              )}
            </TabsList>

            {/* Details */}
            <TabsContent value="overview" className="overflow-hidden overflow-y-auto">
              <EventDetails event={event} />

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
            </TabsContent>

            {event.id && event.eventCompetitions.length > 0 && (
              <TabsContent value="competitions" className="overflow-hidden overflow-y-auto">
                <CompetitionList competitions={event.eventCompetitions} eventId={event.id} auth={needsAuthorization ? true : false} />
              </TabsContent>
            )}

            {/* Registrations */}
            {approvedAndPendingRegistrations.length > 1 && (
              <TabsContent value="registrations" className="overflow-hidden overflow-y-auto">
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
              </TabsContent>
            )}
          </Tabs>
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

            {moment(event.registrationOpen).unix() < moment().unix() && moment(event.registrationDeadline).unix() > moment().unix() && (
              <div className="ml-1">
                <TextButton text={isRegistered() ? 'Unregister' : 'Register'} onClick={isRegistered() ? handleUnregisterClicked : handleRegisterClicked} />
              </div>
            )}

            {isRegistered() && moment(event.dateTo).unix() < moment().unix() && (
              <div className="ml-1">
                <Link href={`/events/${eventId}/feedback`}>
                  <TextButton text={'Feedback'} />
                </Link>
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
