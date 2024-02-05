import TextButton from '@/components/common/TextButton';
import EventEditor from '@/components/events/EventEditor';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import router from 'next/router';
import { useState } from 'react';
import { Event } from '@/types/event';
import { routeEventSubs, routeLogin } from '@/types/consts/routes';
import ErrorMessage from '@/components/ErrorMessage';
import { validateSession } from '@/types/funcs/validate-session';

const EventCreation = (props: any) => {
  const session = props.session;

  const [event, setEvent] = useState<Event>();
  const [error, setError] = useState('');

  const handleCreateClicked = async () => {
    setError('');

    const body = JSON.stringify({
      name: event?.name.trim(),
      alias: event?.alias,
      description: event?.description.trim(),
      dateFrom: event?.dateFrom,
      dateTo: event?.dateTo,
      registrationOpen: event?.registrationOpen,
      registrationDeadline: event?.registrationDeadline,
      venueHouseNo: event?.venueHouseNo.trim(),
      venueStreet: event?.venueStreet.trim(),
      venueCity: event?.venueCity.trim(),
      venuePostCode: event?.venuePostCode.trim(),
      venueCountry: event?.venueCountry.trim(),
      participationFee: event?.participationFee,
      type: event?.type,
      livestreamUrl: event?.livestreamUrl,
      paymentMethodCash: { enabled: event?.paymentMethodCash.enabled },
      paymentMethodPayPal: {
        enabled: event?.paymentMethodPayPal.enabled,
        payPalHandle: event?.paymentMethodPayPal.payPalHandle,
      },
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
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    if (response.status == 201) {
      router.replace(routeEventSubs);
    } else {
      const error = await response.json();
      setError(error.message);
      console.error(error.message);
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

      <ErrorMessage message={error} />

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
