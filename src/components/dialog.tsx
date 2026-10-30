'use client';

/**
 * URL query–driven modal (e.g. `?delete=1`).
 * Uses the shared Radix dialog so overlay, motion, and chrome match every other dialog.
 */
import { useSearchParams } from 'next/navigation';
import ActionButton from './common/action-button';
import { Action } from '@/domain/enums/action';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { Dialog as DialogRoot, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface IDialogProps {
  title: string;
  queryParam: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
  executeCancelAfterConfirmClicked?: boolean;
  children: React.ReactNode;
}

const dialogFooterClassName = 'flex shrink-0 flex-row items-center justify-end gap-2';
const dialogTextButtonClassName = cn(ctaActionButtonClassName, 'min-w-0 sm:min-w-36');

const Dialog = ({ title, queryParam, onCancel, onConfirm, confirmText, executeCancelAfterConfirmClicked = true, children }: IDialogProps) => {
  const searchParams = useSearchParams();
  const open = searchParams?.get(queryParam) === '1';

  const clickConfirm = () => {
    onConfirm?.();
    if (executeCancelAfterConfirmClicked) onCancel?.();
  };

  return (
    <DialogRoot
      open={open}
      onOpenChange={next => {
        if (!next) onCancel?.();
      }}
    >
      <DialogContent aria-describedby={undefined} className="flex max-h-[min(85dvh,calc(100dvh-2rem))] flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle className="pr-6">{title}</DialogTitle>
        </DialogHeader>

        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto text-sm">{children}</div>

        {onConfirm && (
          <div className={dialogFooterClassName}>
            {!confirmText && <ActionButton action={Action.ACCEPT} onClick={clickConfirm} />}
            {confirmText && (
              <Button type="button" variant="action" className={dialogTextButtonClassName} onClick={clickConfirm}>
                {confirmText}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </DialogRoot>
  );
};

export default Dialog;
