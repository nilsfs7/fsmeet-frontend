'use client';

import type { ChangeEvent, KeyboardEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ITextInput {
  id: string;
  label: string;
  labelOnTop?: boolean;
  placeholder?: string;
  defValue?: string;
  value?: string;
  maxInputLength?: number;
  resizable?: boolean;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
}

const labelClass = 'text-sm font-medium leading-none';

const TextInputLarge = ({ id, label, labelOnTop = true, placeholder, defValue, value, maxInputLength, resizable = false, onChange, onKeyDown }: ITextInput) => {
  const inputClass = cn('min-h-20 w-full', resizable ? 'resize-y' : 'resize-none');

  const input = (
    <Textarea
      id={id}
      className={inputClass}
      placeholder={placeholder}
      defaultValue={defValue}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  );

  const lengthHint =
    maxInputLength != null ? (
      <p className="text-end text-xs text-muted-foreground">{`(${value?.length ?? 0}/${maxInputLength})`}</p>
    ) : null;

  return (
    <div
      className={cn(labelOnTop ? 'flex flex-col gap-1.5' : 'grid grid-cols-2 items-start gap-x-2 gap-y-1')}
    >
      {labelOnTop ? (
        <>
          <label htmlFor={id} className={labelClass}>
            {label}
          </label>
          {input}
          {lengthHint}
        </>
      ) : (
        <>
          <label htmlFor={id} className={cn('pt-2', labelClass)}>
            {label}
          </label>
          <div className="flex min-w-0 flex-col gap-1">
            {input}
            {lengthHint}
          </div>
        </>
      )}
    </div>
  );
};

export default TextInputLarge;
