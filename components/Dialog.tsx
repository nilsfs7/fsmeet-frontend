import { useSearchParams } from 'next/navigation';
import { useRef, useEffect } from 'react';
import ActionButton from './common/ActionButton';
import { Action } from '@/types/enums/action';

interface IDialogProps {
  title: string;
  queryParam: string;
  onClose: () => void;
  onOk: () => void;
  closeAction?: Action;
  okAction?: Action;
  children: React.ReactNode;
}

const Dialog = ({ title, queryParam, onClose, onOk, children, closeAction = Action.CANCEL, okAction = Action.ACCEPT }: IDialogProps) => {
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
    onClose();
  };

  const clickOk = () => {
    onOk();
    dialogRef.current?.close();
    onClose();
  };

  return showDialog === '1' ? (
    <dialog ref={dialogRef}>
      <div className="white fixed inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="rounded-lg bg-white">
          <div className="rounded-t-lg bg-zinc-300 p-2 text-center">
            <h1 className="text-2xl">{title}</h1>
          </div>
          <div className="rounded-b-lg bg-white p-2">
            <div className="p-2">{children}</div>
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

export default Dialog;
