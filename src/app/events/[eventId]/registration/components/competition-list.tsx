'use client';

import { CurrencyCode } from '@/domain/enums/currency-code';
import { convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';
import { getCurrencySymbol } from '@/functions/get-currency-symbol';
import { Competition } from '@/domain/types/competition';

interface ICompetitionList {
  competitions: Competition[];
  amountRegistrations: number[];
  paymentFeeCover: boolean;
  currency: CurrencyCode;
  disabled?: boolean[];
  checked?: boolean[];
  selectable?: boolean;
  onCheckedChange?: (selected: boolean, compId: string) => void;
}

export const CompetitionList = ({ competitions, amountRegistrations, paymentFeeCover, currency, disabled = [], checked = [], selectable = false, onCheckedChange }: ICompetitionList) => {
  return (
    <table className={`border-secondary-dark bg-secondary-light gap-x-4 p-2 w-full`}>
      {/* todo: color code for head bg*/}
      <thead className="bg-gray-200 text-primary uppercase text-sm leading-normal">
        <tr className="text-left whitespace-nowrap">
          <th className="py-3 px-3 rounded-l-lg">{`Type`}</th>
          <th className="py-3 px-3">{`Name`}</th>
          <th className="py-3 px-3">{`Gender`}</th>
          <th className={`py-3 px-3 ${selectable ? '' : 'rounded-r-lg'}`}>{`Fee`}</th>
          {selectable && <th className="py-3 px-3 rounded-r-lg">{`Select`}</th>}
        </tr>
      </thead>
      <tbody className="text-primary text-sm">
        {competitions.map((comp, i) => (
          <tr key={i} className={`${i < competitions.length - 1 ? 'border-b border-secondary-dark' : ''} hover:bg-secondary-light`}>
            <td className="py-3 px-3 capitalize">{comp.type.replaceAll('_', ' ')}</td>
            <td className="py-3 px-3">{comp.maxAmountParticipants > 0 ? `${comp.name} [${amountRegistrations[i]}/${comp.maxAmountParticipants}]` : `${comp.name}`}</td>
            <td className="py-3 px-3 capitalize">{comp.gender}</td>
            <td className="py-3 px-3 text-right capitalize whitespace-nowrap">
              {`${paymentFeeCover ? convertCurrencyIntegerToDecimal(comp.participationFeeIncPaymentCosts, currency).toFixed(2) : convertCurrencyIntegerToDecimal(comp.participationFee, currency).toFixed(2)} ${getCurrencySymbol(currency)}`.replace(
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
                    if (onCheckedChange && comp.id) onCheckedChange(!checked, comp.id);
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
