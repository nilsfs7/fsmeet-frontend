'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Dialog from '@/components/dialog';
import { TimePicker } from '@/components/common/time-picker';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import { DialogField, DialogToggle, dialogFormClassName } from './dialog-fields';

interface IDialogProps {
  title: string;
  queryParam: string;
  onCancel?: () => void;
  onConfirm?: (roundIndex: number, matchIndex: number, matchName: string, matchTime: string | null, slotsPerMatch: number, isExtraMatch: boolean) => void;
  cancelText?: string;
  confirmText?: string;
}

const DialogAddMatch = ({ title, queryParam, onCancel, onConfirm, cancelText, confirmText }: IDialogProps) => {
  const t = useTranslations('/events/eventid/comps/compid/edit/mode');

  const searchParams = useSearchParams();
  const showDialog = searchParams?.get(queryParam);
  const roundIndex = +(searchParams?.get('rid') || 0);
  const matchIndex = +(searchParams?.get('mid') || 0);
  const [slotsPerMatch, setSlotsPerMatch] = useState<number>(2);

  const [matchName, setMatchName] = useState<string>(t('defaultMatchName', { index: matchIndex + 1 }));
  const [matchTime, setMatchTime] = useState<string | null>(null);
  const [isExtraMatch, setIsExtraMatch] = useState<boolean>(false);

  useEffect(() => {
    if (showDialog === '1') {
      setMatchName(t('defaultMatchName', { index: matchIndex + 1 }));
      setSlotsPerMatch(2);
    }
  }, [showDialog, matchIndex]);

  return (
    <Dialog
      title={title}
      queryParam={queryParam}
      onCancel={onCancel}
      onConfirm={() => {
        onConfirm && onConfirm(roundIndex, matchIndex, matchName, matchTime, slotsPerMatch, isExtraMatch);
      }}
      cancelText={cancelText}
      confirmText={confirmText}
    >
      <div className={dialogFormClassName}>
        <DialogField label={t('dlgAddMatchName')} htmlFor="input-match-name">
          <Input id="input-match-name" value={matchName} onChange={e => setMatchName(e.currentTarget.value)} />
        </DialogField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DialogField label={t('dlgAddMatchTime')} htmlFor="input-match-time">
            <TimePicker id="input-match-time" value={matchTime} onChange={setMatchTime} />
          </DialogField>

          <DialogField label={t('dlgAddMatchAmountPlayers')} htmlFor="input-slots-per-match">
            <Input
              id="input-slots-per-match"
              type="number"
              inputMode="numeric"
              min={2}
              max={99}
              value={slotsPerMatch}
              onChange={e => {
                setSlotsPerMatch(+e.currentTarget.value);
              }}
            />
          </DialogField>
        </div>

        <DialogToggle id="input-is-extra-battle" label={t('dlgAddMatchIsExtraBattle')} checked={isExtraMatch} onCheckedChange={setIsExtraMatch} />
      </div>
    </Dialog>
  );
};

export default DialogAddMatch;
