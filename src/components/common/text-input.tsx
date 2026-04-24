'use client';

import type { ChangeEvent, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ITextInput {
  id: string;
  label: string;
  labelOnTop?: boolean;
  placeholder?: string;
  defValue?: string;
  value?: string;
  maxInputLength?: number;
  type?: string;
  readOnly?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

const TextInput = ({ id, label, labelOnTop = true, placeholder, defValue, value, maxInputLength, type, readOnly = false, onChange, onKeyDown }: ITextInput) => {
  const inputClass = cn('h-full min-h-10 w-full', readOnly && 'bg-secondary-light');

  return (
    <>
      {labelOnTop && (
        <div className="m-2 flex h-[100%] flex-col">
          <div>{label}</div>
          <div className="flex h-full">
            <Input
              id={id}
              className={inputClass}
              type={type}
              placeholder={placeholder}
              defaultValue={defValue}
              value={value}
              readOnly={readOnly}
              onChange={onChange}
              onKeyDown={onKeyDown}
            />
          </div>

          {maxInputLength && <div className="flex justify-end p-1 text-xs">{`(${value?.length || 0}/${maxInputLength})`}</div>}
        </div>
      )}

      {!labelOnTop && (
        <div className="m-2 grid h-[100%] grid-cols-2">
          <div>{label}</div>
          <Input
            id={id}
            className={inputClass}
            type={type}
            placeholder={placeholder}
            defaultValue={defValue}
            value={value}
            readOnly={readOnly}
            onChange={onChange}
            onKeyDown={onKeyDown}
          />

          <div></div>
          {maxInputLength && <div className="flex justify-end p-1 text-xs">{`(${value?.length || 0}/${maxInputLength})`}</div>}
        </div>
      )}
    </>
  );
};

export default TextInput;
