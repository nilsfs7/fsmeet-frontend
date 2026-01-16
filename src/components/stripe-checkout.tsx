'use client';

import { useState } from 'react';
import { PaymentElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { Appearance, loadStripe, StripePaymentElementOptions } from '@stripe/stripe-js';
import TextButton from './common/text-button';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface IPaymentForm {
  confirmPaymentBtnText: string;
  returnUrl: string;
}

function PaymentForm({ confirmPaymentBtnText, returnUrl }: IPaymentForm) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message);
    } else {
      setMessage('An unexpected error occurred.');
    }

    setIsLoading(false);
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: 'tabs',
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />

      <div className="p-2 flex justify-center w-full">
        {isLoading ? <div className="spinner" id="spinner" /> : <TextButton disabled={isLoading || !stripe || !elements} id="submit" text={confirmPaymentBtnText} />}
      </div>

      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}

interface ICheckoutForm {
  clientSecret: string;
  stripeAccount?: string;
  confirmPaymentBtnText: string;
  returnUrl: string;
}

export default function CheckoutForm({ clientSecret, stripeAccount, confirmPaymentBtnText, returnUrl }: ICheckoutForm) {
  const appearance: Appearance = {
    theme: 'stripe',
  };

  return (
    <Elements stripe={stripePromise} options={{ appearance, clientSecret }}>
      <PaymentForm confirmPaymentBtnText={confirmPaymentBtnText} returnUrl={returnUrl} />
    </Elements>
  );
}
