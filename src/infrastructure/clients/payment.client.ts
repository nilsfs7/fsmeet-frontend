import { Session } from 'next-auth';
import { ReadPaymentResponseDto } from './dtos/payment/read-payment.response.dto';
import { CreateRefundBodyDto } from './dtos/payment/create-refund.body.dto';
import { defaultHeaders } from './default-headers';

export async function getPayments(session: Session | null): Promise<ReadPaymentResponseDto[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/payments`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`Error fetching payments.`);
  }
}

export async function createRefund(intentId: string, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/payments/refund`;

  const body = new CreateRefundBodyDto(intentId);

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Creating refund successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}
