import { Session } from 'next-auth';
import { ReadPaymentResponseDto } from './dtos/payment/read-payment.response.dto';

export async function getPayments(session: Session | null): Promise<ReadPaymentResponseDto[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/payments`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  return await response.json();
}
