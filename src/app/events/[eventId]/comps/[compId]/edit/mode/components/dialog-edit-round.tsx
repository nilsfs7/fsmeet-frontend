'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Dialog from '@/components/dialog';
import { getMenuAvailableDays } from '@/domain/constants/menus/menu-available-days';
import moment from 'moment';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import { DialogDaySelect, DialogField, DialogToggle, dialogFormClassName } from './dialog-fields';

interface IDialogProps {
  title: string;
  queryParam: string;
  onCancel?: () => void;
  onConfirm?: (roundIndex: number, roundName: string, roundDate: string, roundTimeLimit: boolean, advancingTotal: number) => void;
  cancelText?: string;
  confirmText?: string;
  dateFrom: string;
  dateTo: string;
}

const DialogEditRound = ({ title, queryParam, onCancel, onConfirm, cancelText, confirmText, dateFrom, dateTo }: IDialogProps) => {
  const t = useTranslations('/events/eventid/comps/compid/edit/mode');

  const searchParams = useSearchParams();
  const showDialog = searchParams?.get(queryParam);
  const rname = searchParams?.get('rname') || '';
  const rdate = searchParams?.get('rdate') || '';
  const rTimeLimit = searchParams?.get('rtimelimit') === 'true';
  const radvancing = +(searchParams?.get('radvancing') || 1);
  const roundIndex = +(searchParams?.get('rid') || 0);

  const [roundName, setRoundName] = useState<string>('');
  const [advancingTotal, setAdvancingTotal] = useState<number>(1);
  const [roundDate, setRoundDate] = useState<string>(dateFrom);
  const [roundTimeLimit, setRoundTimeLimit] = useState<boolean>(false);

  useEffect(() => {
    if (showDialog === '1') {
      setRoundName(rname);
      setRoundDate(rdate);
      setAdvancingTotal(radvancing);
      setRoundTimeLimit(rTimeLimit);
    }
  }, [showDialog, rname, rdate, rTimeLimit, radvancing]);

  return (
    <Dialog
      title={title}
      queryParam={queryParam}
      onCancel={onCancel}
      onConfirm={() => {
        onConfirm && onConfirm(roundIndex, roundName, roundDate, roundTimeLimit, advancingTotal);
      }}
      cancelText={cancelText}
      confirmText={confirmText}
    >
      <div className={dialogFormClassName}>
        <DialogField label={t('dlgEditRoundName')} htmlFor="input-round-name">
          <Input id="input-round-name" value={roundName} onChange={e => setRoundName(e.currentTarget.value)} />
        </DialogField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DialogField label={t('dlgEditRoundDay')} htmlFor="input-round-day">
            <DialogDaySelect
              id="input-round-day"
              menus={getMenuAvailableDays(dateFrom, dateTo)}
              value={moment(roundDate).format('YYYY-MM-DD') || getMenuAvailableDays(dateFrom, dateTo)[0].value}
              onChange={value => {
                setRoundDate(moment(value).startOf('day').utc().format());
              }}
            />
          </DialogField>

          <DialogField label={t('dlgEditRoundPlayersAdvancing')} htmlFor="input-advancingTotal">
            <Input
              id="input-advancingTotal"
              type="number"
              inputMode="numeric"
              min={1}
              value={advancingTotal}
              onChange={e => {
                setAdvancingTotal(+e.currentTarget.value);
              }}
            />
          </DialogField>
        </div>

        <DialogToggle id="input-time-limit" label={t('dlgEditRoundTimeLimit')} checked={roundTimeLimit} onCheckedChange={setRoundTimeLimit} />
      </div>
    </Dialog>
  );
};

export default DialogEditRound;
