import { convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';
import { PaymentMethodPayPal } from '@/types/payment-method-paypal';

interface IPayPalInfo {
  participationFee: number;
  payPalInfo: PaymentMethodPayPal;
  usernameForReference: string;
}

export const PayPalInfo = ({ participationFee, payPalInfo }: IPayPalInfo) => {
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
        <div className="select-text">{convertCurrencyIntegerToDecimal(participationFee, 'EUR').toString().replace('.', ',')}€</div>
      </div>
    </div>
  );
};
