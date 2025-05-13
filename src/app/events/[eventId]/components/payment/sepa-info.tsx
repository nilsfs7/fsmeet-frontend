import { convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';
import { PaymentMethodSepa } from '@/types/payment-method-sepa';

interface ISepaInfo {
  participationFee: number;
  sepaInfo: PaymentMethodSepa;
  usernameForReference: string;
}

export const SepaInfo = ({ participationFee, sepaInfo, usernameForReference }: ISepaInfo) => {
  return (
    <div className="grid grid-cols-1 justify-between">
      <div className="underline">Bank transfer (SEPA)</div>

      <div className="grid grid-cols-2 justify-between">
        <div>Bank</div>
        <div className="select-text">{sepaInfo.bank}</div>
      </div>

      <div className="grid grid-cols-2 justify-between">
        <div>Recipient</div>
        <div className="select-text">{sepaInfo.recipient}</div>
      </div>

      <div className="grid grid-cols-2 justify-between">
        <div>IBAN</div>
        <div className="select-text">{sepaInfo.iban}</div>
      </div>

      <div className="grid grid-cols-2 justify-between">
        <div>{`Amount`}</div>
        <div className="select-text">{convertCurrencyIntegerToDecimal(participationFee, 'EUR').toString().replace('.', ',')}€</div>
      </div>

      <div className="grid grid-cols-2 justify-between">
        <div>Reference</div>
        <div className="select-text">
          {sepaInfo.reference}-{usernameForReference}
        </div>
      </div>
    </div>
  );
};
