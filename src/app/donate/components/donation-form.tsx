'use client';

import { useState } from 'react';
import TextButton from '../../../components/common/text-button';
import CurInput from '../../../components/common/currency-input';
import { useTranslations } from 'next-intl';
import { convertCurrencyDecimalToInteger, convertCurrencyIntegerToDecimal } from '../../../functions/currency-conversion';
import { CurrencyCode } from '../../../domain/enums/currency-code';
import { getCurrencySymbol } from '../../../functions/get-currency-symbol';
import CheckoutForm from '../../../components/stripe-checkout';
import { useSession } from 'next-auth/react';
import { createCheckout } from '../../../infrastructure/clients/donation.client';
import { routeDonateThankyou } from '../../../domain/constants/routes';

export default function DonationForm() {
  const t = useTranslations('/donate');
  const { data: session } = useSession();

  const [clientSecret, setClientSecret] = useState<string>();
  const [amount, setAmount] = useState<number>(1000);
  const [showInitiateDonationButton, setShowInitiateDonationButton] = useState<boolean>(true);

  const enableInitiateDonationButton = (): boolean => {
    if (amount < convertCurrencyDecimalToInteger(5, CurrencyCode.EUR)) return false;
    if (amount > convertCurrencyDecimalToInteger(999999.99, CurrencyCode.EUR)) return false;

    return true;
  };

  const handleAmountChanged = (values: { float: number | null; formatted: string; value: string }) => {
    setAmount(convertCurrencyDecimalToInteger(values.float || 0, CurrencyCode.EUR));
    setShowInitiateDonationButton(true);
  };

  const handleInitiateDonationClicked = async () => {
    await createCheckout(amount, session)
      .then(res => {
        setClientSecret(res.clientSecret);
        setShowInitiateDonationButton(false);
      })
      .catch((error: any) => {
        console.error(error);
        setShowInitiateDonationButton(true);
        setClientSecret(undefined);
      });
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <CurInput
        id={'amount'}
        label={`${t('inputAmount')} (${getCurrencySymbol(CurrencyCode.EUR)})`}
        placeholder="35,00"
        value={convertCurrencyIntegerToDecimal(amount, CurrencyCode.EUR)}
        onValueChange={(value, name, values) => {
          if (values) {
            handleAmountChanged(values);
          }
        }}
      />

      {showInitiateDonationButton && (
        <TextButton
          text={t('btnInitiateDonation')}
          disabled={!enableInitiateDonationButton()}
          onClick={() => {
            setShowInitiateDonationButton(false);
            handleInitiateDonationClicked();
          }}
        />
      )}

      {!showInitiateDonationButton && clientSecret && (
        <CheckoutForm key={clientSecret} clientSecret={clientSecret} confirmPaymentBtnText={t('btnDonate')} returnUrl={`${window.location.origin}${routeDonateThankyou}`} />
      )}
    </div>
  );
}
