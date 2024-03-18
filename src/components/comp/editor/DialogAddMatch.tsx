import { useSearchParams } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';
import ActionButton from '../../common/ActionButton';
import { Action } from '@/types/enums/action';
import TextButton from '../../common/TextButton';

interface IDialogProps {
  title: string;
  queryParam: string;
  onCancel?: () => void;
  onConfirm?: (roundIndex: number, matchIndex: number, slotsPerMatch: number, matchName: string) => void;
  cancelText?: string;
  confirmText?: string;
}

const DialogAddMatch = ({ title, queryParam, onCancel, onConfirm, cancelText, confirmText }: IDialogProps) => {
  const searchParams = useSearchParams();
  const dialogRef = useRef<null | HTMLDialogElement>(null);
  const showDialog = searchParams.get(queryParam);
  const roundIndex = +(searchParams.get('rid') || 0);
  const matchIndex = +(searchParams.get('mid') || 0);
  const [slotsPerMatch, setSlotsPerMatch] = useState<number>(2);

  const [matchName, setMatchName] = useState<string>(`Match ${matchIndex + 1}`);

  useEffect(() => {
    if (showDialog === '1') {
      setMatchName(`Match ${matchIndex + 1}`);

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
    onConfirm && onConfirm(roundIndex, matchIndex, slotsPerMatch, matchName);
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
            <div className="p-2 grid gap-1">
              <div className="grid grid-cols-2 justify-between gap-2">
                <div>Match name</div>
                <input
                  id={`input-match-name`}
                  className="flex bg-transparent border-secondary-dark border rounded-md hover:border-primary"
                  value={matchName}
                  onChange={e => {
                    setMatchName(e.currentTarget.value);
                  }}
                />
              </div>

              <div className="grid grid-cols-2 justify-between gap-2">
                <div>Amount of players</div>
                <input
                  id={`input-slots-per-match`}
                  className="flex bg-transparent border-secondary-dark border rounded-md hover:border-primary"
                  type="number"
                  min={2}
                  // max={availablePlayers}
                  defaultValue={slotsPerMatch}
                  onChange={e => {
                    setSlotsPerMatch(+e.currentTarget.value);
                  }}
                />
              </div>
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

export default DialogAddMatch;
