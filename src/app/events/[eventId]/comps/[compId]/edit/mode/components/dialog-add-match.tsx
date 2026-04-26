'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Dialog from '@/components/dialog';
import { TimePicker } from '@/components/common/time-picker';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslations } from 'next-intl';

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

  const [matchName, setMatchName] = useState<string>(`Match ${matchIndex + 1}`);
  const [matchTime, setMatchTime] = useState<string | null>(null);
  const [isExtraMatch, setIsExtraMatch] = useState<boolean>(false);

  useEffect(() => {
    if (showDialog === '1') {
      setMatchName(`Match ${matchIndex + 1}`);
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
      <div className="grid gap-1">
        <div className="grid grid-cols-2 items-center gap-2">
          <div className="min-w-0">{t('dlgAddMatchName')}</div>
          <Input id="input-match-name" value={matchName} onChange={e => setMatchName(e.currentTarget.value)} />
        </div>

        <div className="grid grid-cols-2 items-center gap-2">
          <div className="min-w-0">{t('dlgAddMatchTime')}</div>
          <TimePicker value={matchTime} onChange={setMatchTime} className="rounded-lg" />
        </div>

        <div className="grid grid-cols-2 items-center gap-2">
          <div className="min-w-0">{t('dlgAddMatchAmountPlayers')}</div>
          <Input
            id="input-slots-per-match"
            type="number"
            min={2}
            max={99}
            value={slotsPerMatch}
            onChange={e => {
              setSlotsPerMatch(+e.currentTarget.value);
            }}
          />
        </div>

        <div className="grid grid-cols-2 items-center gap-2">
          <div className="min-w-0">{t('dlgAddMatchIsExtraBattle')}</div>
          <Checkbox
            id="input-is-extra-battle"
            checked={isExtraMatch}
            onCheckedChange={v => {
              setIsExtraMatch(v === true);
            }}
            className="shrink-0"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default DialogAddMatch;
