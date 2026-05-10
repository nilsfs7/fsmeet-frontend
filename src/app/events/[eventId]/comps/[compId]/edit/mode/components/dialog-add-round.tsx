'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Dialog from '@/components/dialog';
import ComboBox from '@/components/common/combo-box';
import moment from 'moment';
import { getMenuAvailableDays } from '@/domain/constants/menus/menu-available-days';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslations } from 'next-intl';

interface IDialogProps {
  title: string;
  queryParam: string;
  onCancel?: () => void;
  onConfirm?: (slotsPerMatch: number, advancingTotal: number, roundName: string, roundDate: string, roundTimeLimit: boolean) => void;
  cancelText?: string;
  confirmText?: string;
  roundIndex: number;
  availablePlayers: number;
  dateFrom: string;
  dateTo: string;
}

const DialogAddRound = ({ title, queryParam, onCancel, onConfirm, cancelText, confirmText, roundIndex, availablePlayers, dateFrom, dateTo }: IDialogProps) => {
  const t = useTranslations('/events/eventid/comps/compid/edit/mode');

  const searchParams = useSearchParams();
  const showDialog = searchParams?.get(queryParam);
  const [slotsPerMatch, setSlotsPerMatch] = useState<number>(2);
  const [advancingTotal, setAdvancingTotal] = useState<number>(0);
  const [roundName, setRoundName] = useState<string>('');
  const [roundDate, setRoundDate] = useState<string>(dateFrom);
  const [roundTimeLimit, setRoundTimeLimit] = useState<boolean>(false);

  function getAdvancing(): number {
    const availablePlayersHalf = Math.floor(availablePlayers / 2);
    if (availablePlayersHalf === 1) {
      return availablePlayersHalf;
    }

    const availablePlayersHalfEven = availablePlayersHalf % 2 === 0 ? availablePlayersHalf : availablePlayersHalf - 1;
    return availablePlayersHalfEven;
  }

  useEffect(() => {
    if (showDialog === '1') {
      setRoundName(`Round ${roundIndex + 1}`);
      setRoundDate(dateFrom);
      setRoundTimeLimit(false);
      setAdvancingTotal(getAdvancing());
      setSlotsPerMatch(2);
    }
  }, [showDialog]);

  return (
    <Dialog
      title={title}
      queryParam={queryParam}
      onCancel={onCancel}
      onConfirm={() => {
        onConfirm && onConfirm(slotsPerMatch, advancingTotal, roundName, roundDate, roundTimeLimit);
      }}
      cancelText={cancelText}
      confirmText={confirmText}
    >
      <div className="grid gap-1">
        <div className="grid grid-cols-2 items-center gap-2">
          <div className="min-w-0">{t('dlgAddRoundName')}</div>
          <Input id="input-round-name" value={roundName} onChange={e => setRoundName(e.currentTarget.value)} />
        </div>

        <div className="relative z-[60] grid grid-cols-2 items-center gap-2">
          <div className="min-w-0">{t('dlgAddRoundDay')}</div>
          <div className="flex w-full">
            <ComboBox
              menus={getMenuAvailableDays(dateFrom, dateTo)}
              value={moment(roundDate).format('YYYY-MM-DD') || getMenuAvailableDays(dateFrom, dateTo)[0].value}
              onChange={(value: unknown) => {
                setRoundDate(moment(value as string).startOf('day').utc().format());
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 items-center gap-2">
          <div className="min-w-0">{t('dlgAddRoundAvailablePlayers')}</div>
          <div className="min-w-0">{availablePlayers}</div>
        </div>

        <div className="grid grid-cols-2 items-center gap-2">
          <div className="min-w-0">{t('dlgAddRoundPlayersAdvancing')}</div>
          <Input
            id="input-advancingTotal"
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

        <div className="grid grid-cols-2 items-center gap-2">
          <div className="min-w-0">{t('dlgAddRoundPlayersPerMatch')}</div>
          <Input
            id="input-slots-per-match"
            type="number"
            min={2}
            max={availablePlayers}
            value={slotsPerMatch}
            disabled={advancingTotal === 1}
            onChange={e => {
              setSlotsPerMatch(+e.currentTarget.value);
            }}
          />
        </div>

        <div className="grid grid-cols-2 items-center gap-2">
          <div className="min-w-0">{t('dlgAddRoundAmountMatches')}</div>
          <div className="min-w-0">{Math.ceil(availablePlayers / slotsPerMatch)}</div>
        </div>

        <div className="grid grid-cols-2 items-center gap-2">
          <div className="min-w-0">{t('dlgAddRoundTimeLimit')}</div>
          <Checkbox
            id="input-time-limit"
            checked={roundTimeLimit}
            onCheckedChange={v => {
              setRoundTimeLimit(v === true);
            }}
            className="shrink-0"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default DialogAddRound;
