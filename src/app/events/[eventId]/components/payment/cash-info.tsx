import { CurrencyCode } from '@/domain/enums/currency-code';
import { convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';
import { getCurrencySymbol } from '@/functions/get-currency-symbol';

interface ICashInfo {
  participationFee: number;
  currency: CurrencyCode;
}

export const CashInfo = ({ participationFee, currency }: ICashInfo) => {
  return (
    <div className="grid grid-cols-1 justify-between">
      <div className="underline">{`Cash (pay on arrival)`}</div>

      <div className="grid grid-cols-2 justify-between">
        <div>{`Amount`}</div>
        <div className="select-text">{`${convertCurrencyIntegerToDecimal(participationFee, currency).toFixed(2).replace('.', ',')} ${getCurrencySymbol(currency)}`}</div>
      </div>
    </div>
  );
};
