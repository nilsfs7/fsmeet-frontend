'use client';

import type { ChangeEvent, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface INumberInput {
  id: string;
  label: string;
  labelOnTop?: boolean;
  placeholder?: string;
  defValue?: number;
  value?: number;
  step?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

const NumberInput = ({ id, label, labelOnTop = true, placeholder, defValue, value, step, onChange, onKeyDown }: INumberInput) => {
  const inputClass = cn('h-full min-h-10 w-full p-1');

  const field = (
    <Input
      id={id}
      className={inputClass}
      type="number"
      placeholder={placeholder}
      defaultValue={defValue}
      value={value}
      step={step}
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  );

  if (!labelOnTop) {
    return (
      <div className="m-2 grid grid-cols-2 items-start gap-x-2 gap-y-1">
        <label htmlFor={id} className="pt-2 text-sm font-medium leading-none">
          {label}
        </label>
        <div className="min-w-0">{field}</div>
      </div>
    );
  }

  return (
    <div className="m-2 flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium leading-none">
        {label}
      </label>
      {field}
    </div>
  );
};

export default NumberInput;
