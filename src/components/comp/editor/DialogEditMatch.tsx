'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ActionButton from '../../common/ActionButton';
import { Action } from '@/types/enums/action';
import TextButton from '../../common/TextButton';

interface IDialogProps {
  title: string;
  queryParam: string;
  onCancel?: () => void;
  onConfirm?: (roundIndex: number, matchIndex: number, matchName: string, slots: number, isExtraMatch: boolean) => void;
  cancelText?: string;
  confirmText?: string;
}

const DialogEditMatch = ({ title, queryParam, onCancel, onConfirm, cancelText, confirmText }: IDialogProps) => {
  const searchParams = useSearchParams();
  const showDialog = searchParams?.get(queryParam);
  const roundIndex = +(searchParams?.get('rid') || 0);
  const matchIndex = +(searchParams?.get('mid') || 0);
  const mname = searchParams?.get('mname') || '';
  const mslots = +(searchParams?.get('mslots') || 2);
  const mextra = searchParams?.get('mextra') === 'true';

  const [matchName, setMatchName] = useState<string>('');
  const [matchSlots, setMatchSlots] = useState<number>(2);
  const [isExtraMatch, setIsExtraMatch] = useState<boolean>(false);

  useEffect(() => {
    if (showDialog === '1') {
      setMatchName(mname);
      setMatchSlots(mslots);
      setIsExtraMatch(mextra);
    }
  }, [showDialog]);

  const clickCancel = () => {
    onCancel && onCancel();
  };

  const clickConfirm = () => {
    onConfirm && onConfirm(roundIndex, matchIndex, matchName, matchSlots, isExtraMatch);
    onCancel && onCancel();
  };

  return showDialog === '1' ? (
    <div className="p-2 fixed inset-0 flex flex-col items-center justify-center bg-primary bg-opacity-50 ">
      <div className="min-w-[250px] rounded-lg bg-background">
        <div className="rounded-t-lg bg-secondary-light p-2 text-center">
          <h1 className="text-2xl">{title}</h1>
        </div>
        <div className="rounded-b-lg bg-background p-2">
          <div className="p-2 grid gap-1">
            <div className="grid grid-cols-2 gap-2">
              <div>{'Match name'}</div>
              <input
                id={`input-round-name`}
                className="flex bg-transparent border-secondary-dark border rounded-md hover:border-primary"
                value={matchName}
                onChange={(e) => {
                  setMatchName(e.currentTarget.value);
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>{'Players per match'}</div>
              <input
                id={`input-slots-per-match`}
                className="flex bg-transparent border-secondary-dark border rounded-md hover:border-primary"
                type="number"
                min={1}
                max={99} // TODO
                value={matchSlots}
                onChange={(e) => {
                  setMatchSlots(+e.currentTarget.value);
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 items-center">
              <div>{'Is extra battle?'}</div>
              <input
                id={'input-is-extra-battle'}
                className="h-4 w-4"
                type="checkbox"
                checked={isExtraMatch}
                onChange={(e) => {
                  setIsExtraMatch(!isExtraMatch);
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
  ) : null;
};

export default DialogEditMatch;
