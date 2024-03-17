import { useSearchParams } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';
import ActionButton from './common/ActionButton';
import { Action } from '@/types/enums/action';
import TextButton from './common/TextButton';

interface IDialogProps {
  title: string;
  queryParam: string;
  onCancel?: () => void;
  onConfirm?: (slotsPerMatch: number, advancingTotal: number, roundName: string) => void;
  cancelText?: string;
  confirmText?: string;
  roundIndex: number;
  availablePlayers: number;
}

const DialogAddRound = ({ title, queryParam, onCancel, onConfirm, cancelText, confirmText, roundIndex, availablePlayers }: IDialogProps) => {
  function getAdvancing(): number {
    const availablePlayersHalf = Math.floor(availablePlayers / 2);
    if (availablePlayersHalf === 1) {
      return availablePlayersHalf;
    }

    const availablePlayersHalfEven = availablePlayersHalf % 2 === 0 ? availablePlayersHalf : availablePlayersHalf - 1;
    return availablePlayersHalfEven;
  }

  const searchParams = useSearchParams();
  const dialogRef = useRef<null | HTMLDialogElement>(null);
  const showDialog = searchParams.get(queryParam);
  const [slotsPerMatch, setSlotsPerMatch] = useState<number>(2);
  const [advancingTotal, setAdvancingTotal] = useState<number>(0);
  const [roundName, setRoundName] = useState<string>('');

  useEffect(() => {
    if (showDialog === '1') {
      setRoundName(`Round ${roundIndex + 1}`);
      setAdvancingTotal(getAdvancing());
      setSlotsPerMatch(2);

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
    onConfirm && onConfirm(slotsPerMatch, advancingTotal, roundName);
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
                <div>Round name</div>
                <input
                  id={`input-round-name`}
                  className="flex bg-transparent border-secondary-dark border rounded-md hover:border-primary"
                  value={roundName}
                  onChange={e => {
                    setRoundName(e.currentTarget.value);
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>Available players in pool</div>
                <div>{availablePlayers}</div>
              </div>

              {/* TODO: add checkbox: is final battle? */}

              <div className="grid grid-cols-2 gap-2">
                <div>Advancing to next round</div>
                <input
                  id={`input-advancingTotal`}
                  className="flex bg-transparent border-secondary-dark border rounded-md hover:border-primary"
                  type="number"
                  min={1}
                  max={availablePlayers}
                  value={advancingTotal}
                  onChange={e => {
                    setAdvancingTotal(+e.currentTarget.value);
                    setSlotsPerMatch(Math.ceil(availablePlayers / +e.currentTarget.value));
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>Players per match</div>
                <input
                  id={`input-slots-per-match`}
                  className="flex bg-transparent border-secondary-dark border rounded-md hover:border-primary"
                  type="number"
                  min={2}
                  max={availablePlayers}
                  value={slotsPerMatch}
                  disabled={advancingTotal === 1}
                  onChange={e => {
                    console.log(+e.currentTarget.value);
                    setSlotsPerMatch(+e.currentTarget.value);
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>Amount of matches</div>
                <div>{Math.ceil(availablePlayers / slotsPerMatch)}</div>
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

export default DialogAddRound;
