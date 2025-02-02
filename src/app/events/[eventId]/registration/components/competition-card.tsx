'use client';

import CheckBox from '@/components/common/CheckBox';
import { Competition } from '@/types/competition';

interface ICompetitionCard {
  comp: Competition;
  disabled?: boolean;
  selectable?: boolean;
  checked?: boolean;
  onCheckedChange?: (selected: boolean) => void;
}

export const CompetitionCard = ({ comp, disabled = false, selectable = false, checked = false, onCheckedChange }: ICompetitionCard) => {
  return (
    <div key={comp.id} className={`rounded-lg border border-secondary-dark ${selectable ? 'hover:border-primary' : ''} bg-secondary-light gap-x-4 p-2`}>
      <div className="flex">
        <div className="w-full grid grid-cols-2 gap-x-2 ">
          <div>{`Competition`}</div>
          <div>{comp.name}</div>

          <div>{`Type`}</div>
          <div className="capitalize">{comp.type}</div>

          <div>{`Gender`}</div>
          <div className="capitalize">{comp.gender}</div>
        </div>

        {selectable && (
          <CheckBox
            id={`cb-selected`}
            label={''}
            value={checked}
            disabled={disabled}
            onChange={e => {
              if (onCheckedChange) onCheckedChange(!checked);
            }}
          />
        )}
      </div>
    </div>
  );
};
