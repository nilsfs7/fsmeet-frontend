import { Session } from 'next-auth';
import { CreateDonationCheckoutBodyDto } from './dtos/donation/create-donation-checkout.body.dto';
import { ReadStripeCheckoutResponseDto } from './dtos/donation/read-stripe-checkout.response.dto';
import { defaultHeaders } from './default-headers';

export async function createCheckout(amount: number, session: Session | null): Promise<ReadStripeCheckoutResponseDto> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/donations/checkout`;

  const body = new CreateDonationCheckoutBodyDto(amount);

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    const dto: ReadStripeCheckoutResponseDto = await response.json();
    console.info('Creating stripe checkout successful');

    return dto;
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
