import EventEditor from '@/components/events/EventEditor';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { Event } from '@/types/event';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/types/enums/action';
import { routeEventSubs, routeEvents, routeLogin } from '@/types/consts/routes';
import Dialog from '@/components/Dialog';
import ErrorMessage from '@/components/ErrorMessage';

const EventEditing = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;

  const [event, setEvent] = useState<Event>();
  const [error, setError] = useState('');

  if (!session) {
    router.push(routeLogin);
  }

  const fetchEvent = async (id: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${id}`);
    return await response.json();
  };

  const handleSaveEventClicked = async () => {
    setError('');

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events`, {
      method: 'PATCH',
      body: JSON.stringify({
        id: eventId,
        name: event?.name.trim(),
        description: event?.description.trim(),
        dateFrom: event?.dateFrom.unix(),
        dateTo: event?.dateTo.unix(),
        registrationOpen: event?.registrationOpen.unix(),
        registrationDeadline: event?.registrationDeadline.unix(),
        venueHouseNo: event?.venueHouseNo.trim(),
        venueStreet: event?.venueStreet.trim(),
        venuePostCode: event?.venuePostCode.trim(),
        venueCity: event?.venueCity.trim(),
        venueCountry: event?.venueCountry.trim(),
        participationFee: event?.participationFee,
        type: event?.type,
        autoApproveRegistrations: event?.autoApproveRegistrations,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    switch (response.status) {
      case 200:
        router.replace(routeEventSubs);
        break;

      default:
        const error = await response.json();
        setError(error.message);
        console.error(response.statusText);
        break;
    }
  };

  const handleDeleteEventClicked = async () => {
    router.replace(`${routeEvents}/${eventId}/edit?delete=1`, undefined, { shallow: true });
  };

  const handleConfirmDeleteEventClicked = async () => {
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

  const handleCancelDeleteEventClicked = async () => {
    router.replace(`${routeEvents}/${eventId}/edit`, undefined, { shallow: true });
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
          participationFee: res.participationFee,
          // @ts-ignore
          registrationOpen: moment.unix(res.registrationOpen),
          // @ts-ignore
          registrationDeadline: moment.unix(res.registrationDeadline),
          description: res.description,
          venueHouseNo: res.venueHouseNo,
          venueStreet: res.venueStreet,
          venueCity: res.venueCity,
          venuePostCode: res.venuePostCode,
          venueCountry: res.venueCountry,
          type: res.type,
          autoApproveRegistrations: res.autoApproveRegistrations,
          eventRegistrations: [],
          eventCompetitions: [],
        };

        setEvent(e);
      });
    }
  }, []);

  return (
    <>
      <Dialog title="Delete Account" queryParam="delete" onClose={handleCancelDeleteEventClicked} onOk={handleConfirmDeleteEventClicked}>
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
            <ActionButton action={Action.DELETE} onClick={handleDeleteEventClicked} />
          </div>
          <div className="px-1">
            <ActionButton action={Action.SAVE} onClick={handleSaveEventClicked} />
          </div>
        </div>
      </div>
    </>
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
