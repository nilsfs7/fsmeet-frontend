import { useSearchParams } from 'next/navigation';
import { useRef, useEffect } from 'react';
import ActionButton from './common/ActionButton';
import { Action } from '@/types/enums/action';
import TextButton from './common/TextButton';

interface IDialogProps {
  title: string;
  queryParam: string;
  onCancel: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
  children: React.ReactNode;
}

const Dialog = ({ title, queryParam, onCancel, onConfirm, cancelText, confirmText, children }: IDialogProps) => {
  const searchParams = useSearchParams();
  const dialogRef = useRef<null | HTMLDialogElement>(null);
  const showDialog = searchParams.get(queryParam);

  useEffect(() => {
    if (showDialog === '1') {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [showDialog]);

  const clickCancel = () => {
    dialogRef.current?.close();
    onCancel();
  };

  const clickConfirm = () => {
    onConfirm();
    dialogRef.current?.close();
    onCancel();
  };

  return showDialog === '1' ? (
    <dialog ref={dialogRef}>
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="rounded-lg bg-background">
          <div className="rounded-t-lg bg-secondary-light p-2 text-center">
            <h1 className="text-2xl">{title}</h1>
          </div>
          <div className="rounded-b-lg bg-background p-2">
            <div className="p-2">{children}</div>
            <div className="flex flex-row justify-between p-2">
              {!cancelText && <ActionButton action={Action.CANCEL} onClick={clickCancel} />}
              {cancelText && <TextButton text={cancelText} onClick={clickCancel} />}

              {!confirmText && <ActionButton action={Action.ACCEPT} onClick={clickConfirm} />}
              {confirmText && <TextButton text={confirmText} onClick={clickConfirm} />}
            </div>
          </div>
        </div>
      </div>
    </dialog>
  ) : null;
};

export default Dialog;
