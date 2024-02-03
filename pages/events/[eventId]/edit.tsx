import EventEditor from '@/components/events/EventEditor';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Event } from '@/types/event';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/types/enums/action';
import { routeEventSubs, routeEvents, routeLogin } from '@/types/consts/routes';
import Dialog from '@/components/Dialog';
import ErrorMessage from '@/components/ErrorMessage';
import { getEvent } from '@/services/fsmeet-backend/get-event';
import { validateSession } from '@/types/funcs/validate-session';

const EventEditing = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;

  const [event, setEvent] = useState<Event>();
  const [error, setError] = useState('');

  const handleSaveClicked = async () => {
    setError('');

    const body = JSON.stringify({
      id: eventId,
      name: event?.name.trim(),
      alias: event?.alias,
      description: event?.description.trim(),
      dateFrom: event?.dateFrom,
      dateTo: event?.dateTo,
      registrationOpen: event?.registrationOpen,
      registrationDeadline: event?.registrationDeadline,
      venueHouseNo: event?.venueHouseNo.trim(),
      venueStreet: event?.venueStreet.trim(),
      venuePostCode: event?.venuePostCode.trim(),
      venueCity: event?.venueCity.trim(),
      venueCountry: event?.venueCountry.trim(),
      participationFee: event?.participationFee,
      type: event?.type,
      livestreamUrl: event?.livestreamUrl,
      paymentMethodCash: { enabled: event?.paymentMethodCash.enabled },
      paymentMethodSepa: {
        enabled: event?.paymentMethodSepa.enabled,
        bank: event?.paymentMethodSepa.bank,
        recipient: event?.paymentMethodSepa.recipient,
        iban: event?.paymentMethodSepa.iban,
        reference: event?.paymentMethodSepa.reference,
      },
      autoApproveRegistrations: event?.autoApproveRegistrations,
      notifyOnRegistration: event?.notifyOnRegistration,
      notifyOnComment: event?.notifyOnComment,
      published: event?.published,
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events`, {
      method: 'PATCH',
      body: body,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    if (response.status == 200) {
      router.replace(`/events/${eventId}?auth=1`);
    } else {
      const error = await response.json();
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleDeleteClicked = async () => {
    router.replace(`${routeEvents}/${eventId}/edit?delete=1`, undefined, { shallow: true });
  };

  const handleConfirmDeleteClicked = async () => {
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
      router.push(routeEventSubs);
    }
  };

  const handleCancelDeleteClicked = async () => {
    router.replace(`${routeEvents}/${eventId}/edit`, undefined, { shallow: true });
  };

  useEffect(() => {
    if (eventId && typeof eventId === 'string') {
      getEvent(eventId, true, session).then((event: Event) => {
        setEvent(event);
      });
    }
  }, []);

  return (
    <>
      <Dialog title="Delete Event" queryParam="delete" onCancel={handleCancelDeleteClicked} onConfirm={handleConfirmDeleteClicked}>
        <p>Do you really want to delete this event?</p>
      </Dialog>

      <div className={'flex columns-1 flex-col items-center'}>
        <h1 className="m-2 text-xl">Edit Event</h1>
        <EventEditor
          event={event}
          onEventUpdate={(event: Event) => {
            setEvent(event);
          }}
        />

        <ErrorMessage message={error} />

        <div className="my-2 flex">
          <div className="px-1">
            <ActionButton action={Action.CANCEL} onClick={() => router.back()} />
          </div>
          <div className="px-1">
            <ActionButton action={Action.DELETE} onClick={handleDeleteClicked} />
          </div>
          <div className="px-1">
            <ActionButton action={Action.SAVE} onClick={handleSaveClicked} />
          </div>
        </div>
      </div>
    </>
  );
};

export default EventEditing;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
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
