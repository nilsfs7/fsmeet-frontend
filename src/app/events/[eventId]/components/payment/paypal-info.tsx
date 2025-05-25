import { CurrencyCode } from '@/domain/enums/currency-code';
import { convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';
import { getCurrencySymbol } from '@/functions/get-currency-symbol';
import { PaymentMethodPayPal } from '@/types/payment-method-paypal';

interface IPayPalInfo {
  participationFee: number;
  currency: CurrencyCode;
  payPalInfo: PaymentMethodPayPal;
  usernameForReference: string;
}

export const PayPalInfo = ({ participationFee, currency, payPalInfo }: IPayPalInfo) => {
  return (
    <div className="grid grid-cols-1 justify-between">
      <div className="underline">PayPal</div>

      <div className="grid grid-cols-2 justify-between">
        <div>Recipient</div>
        <div className="select-text">
          <a target="_blank" rel="noopener noreferrer" href={`https://paypal.me/${payPalInfo.payPalHandle}`} className="hover:underline">{`paypal.me/${payPalInfo.payPalHandle}`}</a>
        </div>
      </div>

      <div className="grid grid-cols-2 justify-between">
        <div>{`Amount`}</div>
        <div className="select-text">{`${convertCurrencyIntegerToDecimal(participationFee, currency).toFixed(2).replace('.', ',')} ${getCurrencySymbol(currency)}`}</div>
      </div>
    </div>
  );
};
