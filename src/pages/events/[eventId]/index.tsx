import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import TextButton from '@/components/common/TextButton';
import ParticipantList from '@/components/events/ParticipantList';
import { Action } from '@/types/enums/action';
import ActionButton from '@/components/common/ActionButton';
import { EventRegistrationStatus } from '@/types/enums/event-registration-status';
import { EventRegistration } from '@/types/event-registration';
import Link from 'next/link';
import { routeEventNotFound, routeEvents, routeLogin } from '@/types/consts/routes';
import moment from 'moment';
import CompetitionList from '@/components/events/CompetitionList';
import EventInfo from '@/components/events/EventInfo';
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
import { validateSession } from '@/types/funcs/validate-session';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { switchTab_pages } from '@/types/funcs/switch-tab';
import { isPublicEventState } from '@/types/funcs/is-public-event-state';
import { EventState } from '@/types/enums/event-state';
import { GetServerSidePropsContext } from 'next';
import LoadingSpinner from '@/components/animation/loading-spinner';
import { copyToClipboard } from '@/types/funcs/copy-to-clipboard';
import { Toaster, toast } from 'sonner';
import { auth } from '@/auth';
import { createComment, createEventRegistration, createSubComment, deleteEventRegistration, getComments, getEvent, updateEventState } from '@/infrastructure/clients/event.client';

const EventDetails = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;

  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab');

  const [event, setEvent] = useState<Event>();
  const [eventComments, setEventComments] = useState<EventComment[]>();
  const [approvedAndPendingRegistrations, setApprovedAndPendingRegistrations] = useState<EventRegistration[]>();

  const isRegistered = () => {
    if (validateSession(session)) {
      if (event && event.eventRegistrations.some((registration) => registration.user.username === session.user.username)) {
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

  const handleStateActionClicked = async () => {
    if (!validateSession(session)) {
      router.push(routeLogin);
      return;
    }

    router.replace(`${routeEvents}/${eventId}?state=1`, undefined, { shallow: true });
  };

  const handleSendToReviewClicked = async () => {
    if (!validateSession(session)) {
      router.push(routeLogin);
      return;
    }

    if (event?.id) {
      try {
        await updateEventState(session, event?.id, EventState.WAITING_FOR_APPROVAL);

        // toast.success(`todo`);
        router.reload();
      } catch (error: any) {
        // toast.error(error.message);
      }
    }
  };

  const handleConfirmRegisterClicked = async () => {
    if (!validateSession(session)) {
      router.push(routeLogin);
      return;
    }

    if (event?.id && moment(event?.registrationDeadline).unix() > moment().unix()) {
      try {
        await createEventRegistration(event.id, session?.user?.username, session);
        router.reload();
      } catch (error: any) {
        console.error(error.message);
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
    let url = `${routeEvents}/${eventId}`;
    router.replace(url, undefined, { shallow: true });
  };

  const handleConfirmUnregisterClicked = async () => {
    if (!validateSession(session)) {
      router.push(routeLogin);
      return;
    }

    if (event?.id && moment(event?.registrationDeadline).unix() > moment().unix()) {
      try {
        await deleteEventRegistration(event.id, session?.user?.username, session);
        router.reload();
      } catch (error: any) {
        console.error(error.message);
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

    if (eventId) {
      try {
        await createComment(eventId.toString(), message, session);
        router.reload();
      } catch (error: any) {
        console.error(error.message);
      }
    }
  };

  const handlePostSubCommentClicked = async (commentId: string, message: string) => {
    if (!validateSession(session)) {
      router.push(routeLogin);
      return;
    }

    if (eventId) {
      try {
        await createSubComment(eventId.toString(), commentId, message, session);
        router.reload();
      } catch (error: any) {
        console.error(error.message);
      }
    }
  };

  const handleShareClicked = async () => {
    let eventUrl: string;

    if (event?.alias) {
      eventUrl = `${window.location.host.toString()}/e/${event?.alias}`;
    } else {
      eventUrl = window.location.toString();
    }

    copyToClipboard(eventUrl);
    toast.info('Event URL copied to clipboard.');
  };

  useEffect(() => {
    async function loadEventInfos() {
      if (eventId) {
        getEvent(eventId?.toString(), session)
          .then((event: Event) => {
            setEvent(event);

            const approvedWithImage = event.eventRegistrations
              .filter((registration: EventRegistration) => registration.status == EventRegistrationStatus.APPROVED && registration.user.imageUrl)
              .sort((a, b) => (a.user.username > b.user.username ? 1 : -1));
            const approvedNoImage = event.eventRegistrations
              .filter((registration: EventRegistration) => registration.status == EventRegistrationStatus.APPROVED && !registration.user.imageUrl)
              .sort((a, b) => (a.user.username > b.user.username ? 1 : -1));
            const pendingWithImage = event.eventRegistrations
              .filter((registration: EventRegistration) => registration.status == EventRegistrationStatus.PENDING && registration.user.imageUrl)
              .sort((a, b) => (a.user.username > b.user.username ? 1 : -1));
            const pendingNoImage = event.eventRegistrations
              .filter((registration: EventRegistration) => registration.status == EventRegistrationStatus.PENDING && !registration.user.imageUrl)
              .sort((a, b) => (a.user.username > b.user.username ? 1 : -1));

            setApprovedAndPendingRegistrations(approvedWithImage.concat(approvedNoImage).concat(pendingWithImage).concat(pendingNoImage));
          })
          .catch(() => {
            router.push(routeEventNotFound);
          });
      }
    }

    async function fetchEventComments() {
      if (eventId) {
        const eventComments = await getComments(eventId?.toString());
        setEventComments(eventComments);
      }
    }

    fetchEventComments();
    loadEventInfos();
  }, [event == undefined]);

  if (!event || !approvedAndPendingRegistrations) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Toaster richColors />

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

      <Dialog title="Event Visibility" queryParam="state" onCancel={handleCancelDialogClicked}>
        <>
          <div className="flex gap-2 items-center">
            <div>{`Event state:`}</div>
            <div className="font-extrabold p-2 rounded-lg bg-secondary">{(event?.state.charAt(0).toUpperCase() + event?.state.slice(1)).replaceAll('_', ' ')}</div>
          </div>

          {!isPublicEventState(event.state) && (
            <>
              {event.state !== EventState.WAITING_FOR_APPROVAL && (
                <>
                  <p className="mt-2">Your event is not listed publicly, yet.</p>
                  <p>Do you want to publish your event? Please complete your event info with as many details as possible before sending for review.</p>
                  <div className="mt-2 flex justify-between">
                    <Link href={`${routeEvents}/${eventId}/edit`}>
                      <TextButton text="Edit Event" />
                    </Link>

                    <TextButton text="Send to review" onClick={handleSendToReviewClicked} />
                  </div>

                  {/* <p>why is a review necessary? todo</p> */}
                </>
              )}
              {event.state === EventState.WAITING_FOR_APPROVAL && (
                <>
                  <p className="mt-2">Your event is not listed publicly but currently being reviewed.</p>
                  <p>In case you have any updates for your event you can still adapt the event info.</p>
                  <div className="mt-2 flex justify-between">
                    <Link href={`${routeEvents}/${eventId}/edit`}>
                      <TextButton text="Edit Event" />
                    </Link>
                  </div>

                  {/* <p>why is a review necessary? todo</p> */}
                </>
              )}
            </>
          )}
          {isPublicEventState(event.state) && (
            <>
              <p className="mt-2">Your event is listed publicly. Nothing to do here.</p>
              <p>In case you have any updates for your event you can still adapt the event info.</p>
              <div className="mt-2 flex justify-between">
                <Link href={`${routeEvents}/${eventId}/edit`}>
                  <TextButton text="Edit Event" />
                </Link>
              </div>
            </>
          )}
        </>
      </Dialog>

      <div className="h-[calc(100dvh)] flex flex-col">
        {/* admin panel */}
        <div className="mx-2 my-2">
          {event.admin === session?.user?.username && (
            <div className="flex justify-between rounded-lg border border-primary bg-warning p-2">
              <div className="mr-8 flex items-center">{`Admin Panel`}</div>
              <div className="flex">
                <div className="ml-1">
                  <Link href={`${routeEvents}/${eventId}/edit`}>
                    <ActionButton action={Action.EDIT} />
                  </Link>
                </div>

                <div className="ml-1">
                  <Link href={`${routeEvents}/${eventId}/participants`}>
                    <ActionButton action={Action.MANAGE_USERS} />
                  </Link>
                </div>

                {(event.type === EventType.COMPETITION || event.type === EventType.COMPETITION_ONLINE) && (
                  <div className="ml-1">
                    <Link href={`${routeEvents}/${eventId}/comps`}>
                      <ActionButton action={Action.MANAGE_COMPETITIONS} />
                    </Link>
                  </div>
                )}

                <div className="ml-1">
                  <Link href={`${routeEvents}/${eventId}/sponsors`}>
                    <ActionButton action={Action.MANAGE_SPONSORS} />
                  </Link>
                </div>

                <div className="ml-1">
                  <ActionButton action={isPublicEventState(event.state) ? Action.SHOW : Action.HIDE} onClick={handleStateActionClicked} />
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
                  switchTab_pages(router, 'overview');
                }}
              >
                Overview
              </TabsTrigger>
              {event.competitions.length > 0 && (
                <TabsTrigger
                  value="competitions"
                  onClick={() => {
                    switchTab_pages(router, 'competitions');
                  }}
                >
                  Competitions
                </TabsTrigger>
              )}
              {approvedAndPendingRegistrations.length > 0 && (
                <TabsTrigger
                  value="registrations"
                  onClick={() => {
                    switchTab_pages(router, 'registrations');
                  }}
                >
                  Registrations
                </TabsTrigger>
              )}
            </TabsList>

            {/* Details */}
            <TabsContent value="overview" className="overflow-hidden overflow-y-auto">
              <EventInfo event={event} />

              {event.allowComments && (
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
              )}
            </TabsContent>

            {event.id && event.competitions.length > 0 && (
              <TabsContent value="competitions" className="overflow-hidden overflow-y-auto">
                <CompetitionList competitions={event.competitions} eventId={event.id} />
              </TabsContent>
            )}

            {/* Registrations */}
            {approvedAndPendingRegistrations.length > 0 && (
              <TabsContent value="registrations" className="overflow-hidden overflow-y-auto">
                <ParticipantList
                  participants={approvedAndPendingRegistrations.map((registration) => {
                    return registration.user;
                  })}
                  registrationStatus={approvedAndPendingRegistrations.map((registration) => {
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

          <div className="flex justify-end gap-1">
            <ActionButton action={Action.COPY} onClick={handleShareClicked} />

            {moment(event.registrationOpen).unix() < moment().unix() && moment(event.registrationDeadline).unix() > moment().unix() && (
              <TextButton text={isRegistered() ? 'Unregister' : 'Register'} onClick={isRegistered() ? handleUnregisterClicked : handleRegisterClicked} />
            )}

            {isRegistered() && moment(event.dateTo).unix() < moment().unix() && (
              <div className="ml-1">
                <Link href={`${routeEvents}/${eventId}/feedback`}>
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

export default EventDetails;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await auth(context);

  return {
    props: {
      session: session,
    },
  };
};
