'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ActionButton from '../../../../../../../../components/common/ActionButton';
import { Action } from '@/domain/enums/action';
import TextButton from '../../../../../../../../components/common/TextButton';
import ComboBox from '@/components/common/ComboBox';
import { getMenuAvailableDays } from '@/domain/constants/menus/menu-available-days';
import moment from 'moment';
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
  }, [showDialog]);

  const clickCancel = () => {
    onCancel && onCancel();
  };

  const clickConfirm = () => {
    onConfirm && onConfirm(roundIndex, roundName, roundDate, roundTimeLimit, advancingTotal);
    onCancel && onCancel();
  };

  return showDialog === '1' ? (
    <div className="p-2 fixed inset-0 flex flex-col items-center justify-center bg-primary bg-opacity-50">
      <div className="min-w-[250px] rounded-lg bg-background">
        <div className="rounded-t-lg bg-secondary-light p-2 text-center">
          <h1 className="text-2xl">{title}</h1>
        </div>
        <div className="rounded-b-lg bg-background p-2">
          <div className="p-2 grid gap-1">
            <div className="grid grid-cols-2 justify-between gap-2">
              <div>{t('dlgEditRoundName')}</div>
              <input
                id={`input-round-name`}
                className="flex bg-transparent border-secondary-dark border rounded-md hover:border-primary"
                value={roundName}
                onChange={e => {
                  setRoundName(e.currentTarget.value);
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 items-center relative z-60">
              <div>{t('dlgEditRoundDay')}</div>
              <div className="flex w-full">
                <ComboBox
                  menus={getMenuAvailableDays(dateFrom, dateTo)}
                  value={moment(roundDate).format('YYYY-MM-DD') || getMenuAvailableDays(dateFrom, dateTo)[0].value}
                  onChange={(value: any) => {
                    setRoundDate(moment(value).startOf('day').utc().format());
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>{t('dlgEditRoundPlayersAdvancing')}</div>
              <input
                id={`input-advancingTotal`}
                className="flex bg-transparent border-secondary-dark border rounded-md hover:border-primary"
                type="number"
                min={1}
                value={advancingTotal}
                onChange={e => {
                  setAdvancingTotal(+e.currentTarget.value);
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 items-center">
              <div>{t('dlgEditRoundTimeLimit')}</div>
              <input
                id={'input-time-limit'}
                className="h-4 w-4"
                type="checkbox"
                checked={roundTimeLimit}
                onChange={e => {
                  setRoundTimeLimit(!roundTimeLimit);
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

export default DialogEditRound;
