'use client';

/**
 * URL query–driven modal (e.g. `?delete=1`). For standard in-page dialogs, prefer `@/components/ui/dialog` (Radix).
 * Portals to `document.body` so `position: fixed` is viewport-relative (ancestors with backdrop-blur/filter would trap it).
 */
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import ActionButton from './common/action-button';
import { Action } from '@/domain/enums/action';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/** Above app overlays (e.g. event poster preview z-[100]) and below typical toast layers. */
const URL_QUERY_DIALOG_Z = 'z-[200]';

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

const dialogFooterClassName = 'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end';

const Dialog = ({ title, queryParam, onCancel, onConfirm, cancelText, confirmText, executeCancelAfterConfirmClicked = true, children }: IDialogProps) => {
  const searchParams = useSearchParams();
  const showDialog = searchParams?.get(queryParam);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const clickCancel = () => {
    onCancel && onCancel();
  };

  const clickConfirm = () => {
    onConfirm && onConfirm();

    if (executeCancelAfterConfirmClicked) {
      onCancel && onCancel();
    }
  };

  if (showDialog !== '1' || !mounted) {
    return null;
  }

  return createPortal(
    <div className={cn('fixed inset-0 overflow-y-auto', URL_QUERY_DIALOG_Z)} role="presentation">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm dark:bg-zinc-950/80" aria-hidden />
      <div
        className={cn(
          'relative flex min-h-dvh w-full items-center justify-center',
          'p-4 px-3 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6',
        )}
      >
        <div
          className={cn(
            'relative z-[1] flex max-h-[min(85dvh,calc(100dvh-2rem))] w-full max-w-lg min-h-0 flex-col gap-4 overflow-hidden p-6',
            'border border-zinc-200 bg-white shadow-lg',
            'sm:rounded-lg',
            'dark:border-zinc-800 dark:bg-zinc-950',
          )}
          role="dialog"
          aria-modal
          aria-labelledby="url-query-dialog-title"
        >
          <div className="shrink-0 text-center sm:text-left">
            <h2 id="url-query-dialog-title" className="text-lg font-semibold leading-none tracking-tight">
              {title}
            </h2>
          </div>

          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto pr-0.5 text-sm">{children}</div>

          <div className={cn('shrink-0', dialogFooterClassName)}>
            {onCancel && (
              <>
                {!cancelText && <ActionButton action={Action.CANCEL} onClick={clickCancel} />}
                {cancelText && (
                  <Button type="button" variant="action" className={ctaActionButtonClassName} onClick={clickCancel}>
                    {cancelText}
                  </Button>
                )}
              </>
            )}

            {onConfirm && (
              <>
                {!confirmText && <ActionButton action={Action.ACCEPT} onClick={clickConfirm} />}
                {confirmText && (
                  <Button type="button" variant="action" className={ctaActionButtonClassName} onClick={clickConfirm}>
                    {confirmText}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default Dialog;
