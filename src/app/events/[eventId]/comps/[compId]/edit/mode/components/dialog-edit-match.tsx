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
  onConfirm?: (roundIndex: number, matchIndex: number, matchName: string, matchTime: string | null, slots: number, isExtraMatch: boolean) => void;
  cancelText?: string;
  confirmText?: string;
}

const DialogEditMatch = ({ title, queryParam, onCancel, onConfirm, cancelText, confirmText }: IDialogProps) => {
  const t = useTranslations('/events/eventid/comps/compid/edit/mode');

  const searchParams = useSearchParams();
  const showDialog = searchParams?.get(queryParam);
  const roundIndex = +(searchParams?.get('rid') || 0);
  const matchIndex = +(searchParams?.get('mid') || 0);
  const mname = searchParams?.get('mname') || '';
  const mtime = searchParams?.get('mtime') || '';
  const mslots = +(searchParams?.get('mslots') || 2);
  const mextra = searchParams?.get('mextra') === 'true';

  const [matchName, setMatchName] = useState<string>('');
  const [matchTime, setMatchTime] = useState<string | null>(null);
  const [matchSlots, setMatchSlots] = useState<number>(2);
  const [isExtraMatch, setIsExtraMatch] = useState<boolean>(false);

  useEffect(() => {
    if (showDialog === '1') {
      setMatchName(mname);
      setMatchTime(mtime);
      setMatchSlots(mslots);
      setIsExtraMatch(mextra);
    }
  }, [showDialog, mname, mtime, mslots, mextra]);

  return (
    <Dialog
      title={title}
      queryParam={queryParam}
      onCancel={onCancel}
      onConfirm={() => {
        onConfirm && onConfirm(roundIndex, matchIndex, matchName, matchTime, matchSlots, isExtraMatch);
      }}
      cancelText={cancelText}
      confirmText={confirmText}
    >
      <div className="grid gap-1">
        <div className="grid grid-cols-2 items-center gap-2">
          <div className="min-w-0">{t('dlgEditMatchName')}</div>
          <Input id="input-round-name" value={matchName} onChange={e => setMatchName(e.currentTarget.value)} />
        </div>

        <div className="grid grid-cols-2 items-center gap-2">
          <div className="min-w-0">{t('dlgEditMatchTime')}</div>
          <TimePicker value={matchTime} onChange={setMatchTime} className="rounded-lg" />
        </div>

        <div className="grid grid-cols-2 items-center gap-2">
          <div className="min-w-0">{t('dlgEditMatchAmountPlayers')}</div>
          <Input
            id="input-slots-per-match"
            type="number"
            min={1}
            max={999}
            value={matchSlots}
            onChange={e => {
              setMatchSlots(+e.currentTarget.value);
            }}
          />
        </div>

        <div className="grid grid-cols-2 items-center gap-2">
          <div className="min-w-0">{t('dlgEditMatchIsExtraBattle')}</div>
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

export default DialogEditMatch;
