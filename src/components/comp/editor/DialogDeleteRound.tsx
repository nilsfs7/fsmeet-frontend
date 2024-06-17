import { useSearchParams } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';
import ActionButton from '../../common/ActionButton';
import { Action } from '@/types/enums/action';
import TextButton from '../../common/TextButton';

interface IDialogProps {
  title: string;
  queryParam: string;
  onCancel?: () => void;
  onConfirm?: (roundIndex: number) => void;
  cancelText?: string;
  confirmText?: string;
}

const DialogDeleteRound = ({ title, queryParam, onCancel, onConfirm, cancelText, confirmText }: IDialogProps) => {
  const searchParams = useSearchParams();
  const dialogRef = useRef<null | HTMLDialogElement>(null);
  const showDialog = searchParams?.get(queryParam);
  const roundIndex = +(searchParams?.get('rid') || 0);
  const matchIndex = +(searchParams?.get('mid') || 0);
  const rname = searchParams?.get('rname') || '';

  const [matchName, setRoundName] = useState<string>('');

  useEffect(() => {
    if (showDialog === '1') {
      setRoundName(rname);

      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [showDialog]);

  const clickCancel = () => {
    dialogRef.current?.close();
    onCancel && onCancel();
  };

  const clickConfirm = () => {
    onConfirm && onConfirm(roundIndex);
    dialogRef.current?.close();
    onCancel && onCancel();
  };

  return showDialog === '1' ? (
    <dialog ref={dialogRef}>
      <div className="p-2 fixed inset-0 flex flex-col items-center justify-center bg-primary bg-opacity-50 ">
        <div className="min-w-[250px] rounded-lg bg-background">
          <div className="rounded-t-lg bg-secondary-light p-2 text-center">
            <h1 className="text-2xl">{title}</h1>
          </div>
          <div className="rounded-b-lg bg-background p-2">
            <div className="p-2 flex flex-col">
              <div>{`Delete ${matchName}?`}</div>
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
      </div>
    </dialog>
  ) : null;
};

export default DialogDeleteRound;
