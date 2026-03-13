'use client';

import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

interface IEmbeddedCheckout {
  clientSecret: string;
  stripeAccount?: string;
}

export default function StripeEmbeddedCheckout({ clientSecret, stripeAccount }: IEmbeddedCheckout) {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '', { stripeAccount });

  const options = { clientSecret };

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}
