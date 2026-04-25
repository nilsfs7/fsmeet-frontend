'use client';

import { Checkbox } from '@/components/ui/checkbox';

interface ICheckBoxInput {
  id: string;
  label: string;
  value?: boolean;
  disabled?: boolean;
  onChange?: (event: any) => void;
}

const CheckBox = ({ id, label, value, disabled = false, onChange }: ICheckBoxInput) => {
  return (
    <div className="m-2 flex min-w-0 w-full flex-col gap-1.5 sm:grid sm:grid-cols-[minmax(0,1fr),minmax(0,1.5fr)] sm:items-center sm:gap-3">
      <label htmlFor={id} className="min-w-0 text-sm font-medium leading-none">
        {label}
      </label>
      <div className="flex min-h-10 w-full min-w-0 items-center sm:min-w-0">
        <Checkbox
          id={id}
          checked={value}
          disabled={disabled}
          onCheckedChange={() => onChange?.({})}
          className="shrink-0"
        />
      </div>
    </div>
  );
};

export default CheckBox;
