'use client';

import { useSearchParams } from 'next/navigation';
import ActionButton from './common/ActionButton';
import { Action } from '@/domain/enums/action';
import TextButton from './common/TextButton';

interface IDialogProps {
  title: string;
  queryParam: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
  children: React.ReactNode;
}

const Dialog = ({ title, queryParam, onCancel, onConfirm, cancelText, confirmText, children }: IDialogProps) => {
  const searchParams = useSearchParams();
  const showDialog = searchParams?.get(queryParam);

  const clickCancel = () => {
    onCancel && onCancel();
  };

  const clickConfirm = () => {
    onConfirm && onConfirm();
    onCancel && onCancel();
  };

  return showDialog === '1' ? (
    <div className="p-2 fixed inset-0 flex flex-col items-center justify-center bg-primary bg-opacity-50">
      <div className="min-w-[250px] max-h-[80%] flex flex-col rounded-lg bg-background">
        <div className="rounded-t-lg bg-secondary-light p-2 text-center">
          <h1 className="text-2xl">{title}</h1>
        </div>

        <div className="p-2 bg-background overflow-hidden">
          <div className="h-full overflow-y-auto">{children}</div>
        </div>

        <div className="flex flex-row justify-between p-2">
          {onCancel && (
            <>
              {!cancelText && <ActionButton action={Action.CANCEL} onClick={clickCancel} />}
              {cancelText && <TextButton text={cancelText} onClick={clickCancel} />}
            </>
          )}
          {!onCancel && <div />}

          {onConfirm && (
            <>
              {!confirmText && <ActionButton action={Action.ACCEPT} onClick={clickConfirm} />}
              {confirmText && <TextButton text={confirmText} onClick={clickConfirm} />}
            </>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default Dialog;
