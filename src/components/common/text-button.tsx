'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { ButtonStyle } from '@/domain/enums/button-style';
import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';

interface IButton {
  text: string;
  style?: ButtonStyle;
  disabled?: boolean;
  id?: string;
  className?: string;
  onClick?: () => void;
}

function styleToVariant(style: ButtonStyle): NonNullable<VariantProps<typeof buttonVariants>['variant']> {
  switch (style) {
    case ButtonStyle.CRITICAL:
      return 'actionCritical';
    case ButtonStyle.WARNING:
      return 'actionWarning';
    case ButtonStyle.DEFAULT:
    default:
      return 'action';
  }
}

/**
 * Primary app text CTA. Implemented on top of {@link Button} (`@/components/ui/button`) for a single button system.
 */
const TextButton = ({ text, style = ButtonStyle.DEFAULT, disabled = false, id = '', className = '', onClick }: IButton) => {
  return (
    <Button
      id={id}
      type="button"
      variant={styleToVariant(style)}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'min-w-36 rounded-lg text-base font-medium transition-transform duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100',
        className,
      )}
    >
      {text}
    </Button>
  );
};

export default TextButton;
