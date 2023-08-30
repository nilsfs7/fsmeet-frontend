import TextButton from '@/components/common/TextButton';
import EventEditor from '@/components/events/EventEditor';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import router from 'next/router';
import { useState } from 'react';
import { Event } from '@/types/event';
import { routeEventSubs, routeLogin } from '@/types/consts/routes';

const EventCreation = (props: any) => {
  const session = props.session;

  const [event, setEvent] = useState<Event>();

  if (!session) {
    router.push(routeLogin);
  }

  const handleCreateClicked = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events`, {
      method: 'POST',
      body: JSON.stringify({
        name: event?.name.trim(),
        description: event?.description.trim(),
        dateFrom: event?.dateFrom.unix(),
        dateTo: event?.dateTo.unix(),
        registrationDeadline: event?.registrationDeadline.unix(),
        venueHouseNo: event?.venueHouseNo.trim(),
        venueStreet: event?.venueStreet.trim(),
        venueCity: event?.venueCity.trim(),
        venuePostCode: event?.venuePostCode.trim(),
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

    if (response.status == 201) {
      router.replace(routeEventSubs);
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
          <TextButton text={'Cancel'} onClick={() => router.back()} />
        </div>
        <div className="pl-1">
          <TextButton text={'Create'} onClick={handleCreateClicked} />
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
