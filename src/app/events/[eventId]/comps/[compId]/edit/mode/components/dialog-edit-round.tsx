'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Dialog from '@/components/dialog';
import ComboBox from '@/components/common/combo-box';
import { getMenuAvailableDays } from '@/domain/constants/menus/menu-available-days';
import moment from 'moment';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslations } from 'next-intl';

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
      <div className="grid gap-1">
        <div className="grid grid-cols-2 items-center gap-2">
          <div className="min-w-0">{t('dlgEditRoundName')}</div>
          <Input id="input-round-name" value={roundName} onChange={e => setRoundName(e.currentTarget.value)} />
        </div>

        <div className="relative z-[60] grid grid-cols-2 items-center gap-2">
          <div className="min-w-0">{t('dlgEditRoundDay')}</div>
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
          <div className="min-w-0">{t('dlgEditRoundPlayersAdvancing')}</div>
          <Input
            id="input-advancingTotal"
            type="number"
            min={1}
            value={advancingTotal}
            onChange={e => {
              setAdvancingTotal(+e.currentTarget.value);
            }}
          />
        </div>

        <div className="grid grid-cols-2 items-center gap-2">
          <div className="min-w-0">{t('dlgEditRoundTimeLimit')}</div>
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

export default DialogEditRound;
