import { useSearchParams } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';
import ActionButton from './common/ActionButton';
import { Action } from '@/types/enums/action';

interface IDialogProps {
  title: string;
  description: string;
  queryParam: string;
  onClose: () => void;
  onOk: (inputText: string) => void;
  closeAction?: Action;
  okAction?: Action;
}

const DialogWithInput = ({ title, description, queryParam, onClose, onOk, closeAction = Action.CANCEL, okAction = Action.ACCEPT }: IDialogProps) => {
  const searchParams = useSearchParams();
  const dialogRef = useRef<null | HTMLDialogElement>(null);
  const showDialog = searchParams.get(queryParam);
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
    onClose();
  };

  const clickOk = () => {
    if (input) {
      onOk(input);
      dialogRef.current?.close();
      onClose();
    }
  };

  return showDialog === '1' ? (
    <dialog ref={dialogRef}>
      <div className="white fixed inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="rounded-lg bg-white">
          <div className="rounded-t-lg bg-zinc-300 p-2 text-center">
            <h1 className="text-2xl">{title}</h1>
          </div>
          <div className="rounded-b-lg bg-white p-2">
            <div className="p-2">{description}</div>
            <div className="flex h-full p-2">
              <textarea
                className={`h-full w-full resize-none rounded-lg p-1`}
                onChange={e => {
                  setInput(e.currentTarget.value.trim());
                }}
              />
            </div>
            <div className="flex flex-row justify-between p-2">
              <ActionButton action={closeAction} onClick={clickCancel} />
              <ActionButton action={okAction} onClick={clickOk} />
            </div>
          </div>
        </div>
      </div>
    </dialog>
  ) : null;
};

export default DialogWithInput;
