import { Event } from '@/types/event';
import { Session } from 'next-auth';

export async function updateEvent(event: Event, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events`;

  const body = JSON.stringify({
    id: event.id,
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
    allowComments: event?.allowComments,
    notifyOnComment: event?.notifyOnComment,
  });

  const response = await fetch(url, {
    method: 'PATCH',
    body: body,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Editing event successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
