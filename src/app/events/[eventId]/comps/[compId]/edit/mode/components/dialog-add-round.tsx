'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Dialog from '@/components/dialog';
import moment from 'moment';
import { getMenuAvailableDays } from '@/domain/constants/menus/menu-available-days';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import { DialogDaySelect, DialogField, DialogStats, DialogToggle, dialogFormClassName } from './dialog-fields';

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
      setRoundName(t('defaultRoundName', { index: roundIndex + 1 }));
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
      <div className={dialogFormClassName}>
        <DialogField label={t('dlgAddRoundName')} htmlFor="input-round-name">
          <Input id="input-round-name" value={roundName} onChange={e => setRoundName(e.currentTarget.value)} />
        </DialogField>

        <DialogField label={t('dlgAddRoundDay')} htmlFor="input-round-day">
          <DialogDaySelect
            id="input-round-day"
            menus={getMenuAvailableDays(dateFrom, dateTo)}
            value={moment(roundDate).format('YYYY-MM-DD') || getMenuAvailableDays(dateFrom, dateTo)[0].value}
            onChange={value => {
              setRoundDate(moment(value).startOf('day').utc().format());
            }}
          />
        </DialogField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DialogField label={t('dlgAddRoundPlayersAdvancing')} htmlFor="input-advancingTotal">
            <Input
              id="input-advancingTotal"
              type="number"
              inputMode="numeric"
              min={1}
              max={availablePlayers}
              value={advancingTotal}
              onChange={e => {
                setAdvancingTotal(+e.currentTarget.value);
                setSlotsPerMatch(Math.ceil(availablePlayers / +e.currentTarget.value));
              }}
            />
          </DialogField>

          <DialogField label={t('dlgAddRoundPlayersPerMatch')} htmlFor="input-slots-per-match">
            <Input
              id="input-slots-per-match"
              type="number"
              inputMode="numeric"
              min={2}
              max={availablePlayers}
              value={slotsPerMatch}
              disabled={advancingTotal === 1}
              onChange={e => {
                setSlotsPerMatch(+e.currentTarget.value);
              }}
            />
          </DialogField>
        </div>

        <DialogStats
          items={[
            { label: t('dlgAddRoundAvailablePlayers'), value: availablePlayers },
            { label: t('dlgAddRoundAmountMatches'), value: Math.ceil(availablePlayers / slotsPerMatch) },
          ]}
        />

        <DialogToggle id="input-time-limit" label={t('dlgAddRoundTimeLimit')} checked={roundTimeLimit} onCheckedChange={setRoundTimeLimit} />
      </div>
    </Dialog>
  );
};

export default DialogAddRound;
