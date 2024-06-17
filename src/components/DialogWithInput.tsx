import { useSearchParams } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';
import ActionButton from './common/ActionButton';
import { Action } from '@/types/enums/action';
import TextButton from './common/TextButton';

interface IDialogProps {
  title: string;
  description: string;
  queryParam: string;
  onCancel: () => void;
  onConfirm: (inputText: string) => void;
  cancelText?: string;
  confirmText?: string;
}

const DialogWithInput = ({ title, description, queryParam, onCancel, onConfirm, cancelText, confirmText }: IDialogProps) => {
  const searchParams = useSearchParams();
  const dialogRef = useRef<null | HTMLDialogElement>(null);
  const showDialog = searchParams?.get(queryParam);
  const [input, setInput] = useState<string>();

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
    if (input) {
      onConfirm(input);
      dialogRef.current?.close();
      onCancel();
    }
  };

  return showDialog === '1' ? (
    <dialog ref={dialogRef}>
      <div className="p-2 fixed inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-backgound rounded-lg">
          <div className="rounded-t-lg bg-secondary-light p-2 text-center">
            <h1 className="text-2xl">{title}</h1>
          </div>
          <div className="rounded-b-lg bg-background p-2">
            <div className="p-2">{description}</div>
            <div className="flex h-full p-2">
              <textarea
                className={`h-full w-full resize-none rounded-lg p-1`}
                onChange={(e) => {
                  setInput(e.currentTarget.value.trim());
                }}
              />
            </div>
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

export default DialogWithInput;
