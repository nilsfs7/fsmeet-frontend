'use client';

import { CurrencyCode } from '@/domain/enums/currency-code';
import { convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';
import { getCurrencySymbol } from '@/functions/get-currency-symbol';
import { Accommodation } from '@/domain/types/accommodation';

interface IAccommodationList {
  accommodations: Accommodation[];
  paymentFeeCover: boolean;
  currency: CurrencyCode;
  disabled?: boolean[];
  checked?: boolean[];
  selectable?: boolean;
  onCheckedChange?: (selected: boolean, accommodationId: string) => void;
}

export const AccommodationList = ({ accommodations, paymentFeeCover, currency, disabled = [], checked = [], selectable = false, onCheckedChange }: IAccommodationList) => {
  return (
    <table className={`border-secondary-dark bg-secondary-light gap-x-4 p-2 w-full`}>
      {/* todo: color code for head bg*/}
      <thead className="bg-gray-200 text-primary uppercase text-sm leading-normal">
        <tr className="text-left whitespace-nowrap">
          <th className="py-3 px-3 rounded-l-lg">{`Description`}</th>
          <th className={`py-3 px-3 ${selectable ? '' : 'rounded-r-lg'}`}>{`Cost`}</th>
          {selectable && <th className="py-3 px-3 rounded-r-lg">{`Select`}</th>}
        </tr>
      </thead>
      <tbody className="text-primary text-sm">
        {accommodations.map((acc, i) => (
          <tr key={i} className={`${i < accommodations.length - 1 ? 'border-b border-secondary-dark' : ''} hover:bg-secondary-light`}>
            <td className="py-3 px-3">{acc.description}</td>
            <td className="py-3 px-3 text-right capitalize whitespace-nowrap">
              {`${paymentFeeCover ? convertCurrencyIntegerToDecimal(acc.costIncPaymentCosts, currency).toFixed(2) : convertCurrencyIntegerToDecimal(acc.cost, currency).toFixed(2)} ${getCurrencySymbol(currency)}`.replace(
                '.',
                ','
              )}
            </td>
            {selectable && (
              <td className="py-3 px-3 text-center">
                <input
                  id={`input-${i}`}
                  className="h-4 w-4"
                  type="checkbox"
                  checked={checked[i]}
                  disabled={disabled[i]}
                  onChange={() => {
                    if (onCheckedChange && acc.id) onCheckedChange(!checked, acc.id);
                  }}
                />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
