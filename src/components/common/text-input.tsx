'use client';

import type { ChangeEvent, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ITextInput {
  id: string;
  label: string;
  /** Optional help shown on hover/focus when the label is the trigger. */
  labelTooltip?: string;
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

function Label({
  id,
  label,
  labelTooltip,
  className,
}: {
  id: string;
  label: string;
  labelTooltip?: string;
  className: string;
}) {
  if (!labelTooltip) {
    return (
      <label htmlFor={id} className={className}>
        {label}
      </label>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <label
            htmlFor={id}
            className={cn(
              className,
              'w-fit max-w-full self-start justify-self-start',
              'cursor-help underline decoration-dotted decoration-muted-foreground underline-offset-2',
            )}
          >
            {label}
          </label>
        </TooltipTrigger>
        <TooltipContent side="top" align="start" sideOffset={6} className="max-w-xs text-left">
          <p>{labelTooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const TextInput = ({
  id,
  label,
  labelTooltip,
  labelOnTop = true,
  placeholder,
  defValue,
  value,
  maxInputLength,
  type,
  readOnly = false,
  onChange,
  onKeyDown,
}: ITextInput) => {
  const inputClass = cn('w-full', readOnly && 'bg-secondary-light');

  const input = (
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
  );

  const lengthHint =
    maxInputLength != null ? (
      <p className="text-end text-xs text-muted-foreground">{`(${value?.length ?? 0}/${maxInputLength})`}</p>
    ) : null;

  if (!labelOnTop) {
    return (
      <div className="grid grid-cols-2 items-start gap-x-2 gap-y-1">
        <Label
          id={id}
          label={label}
          labelTooltip={labelTooltip}
          className="pt-2 text-sm font-medium leading-none"
        />
        <div className="flex min-w-0 flex-col gap-1">
          {input}
          {lengthHint}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label id={id} label={label} labelTooltip={labelTooltip} className="text-sm font-medium leading-none" />
      {input}
      {lengthHint}
    </div>
  );
};

export default TextInput;
