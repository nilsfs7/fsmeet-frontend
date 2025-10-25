'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ActionButton from '../../../../../../../../components/common/action-button';
import { Action } from '@/domain/enums/action';
import TextButton from '../../../../../../../../components/common/text-button';
import ComboBox from '@/components/common/combo-box';
import moment from 'moment';
import { getMenuAvailableDays } from '@/domain/constants/menus/menu-available-days';
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

  const clickCancel = () => {
    onCancel && onCancel();
  };

  const clickConfirm = () => {
    onConfirm && onConfirm(slotsPerMatch, advancingTotal, roundName, roundDate, roundTimeLimit);
    onCancel && onCancel();
  };

  return showDialog === '1' ? (
    <div className="p-2 fixed inset-0 flex flex-col items-center justify-center bg-primary bg-opacity-50 z-50">
      <div className="min-w-[250px] rounded-lg bg-background">
        <div className="rounded-t-lg bg-secondary-light p-2 text-center">
          <h1 className="text-2xl">{title}</h1>
        </div>
        <div className="rounded-b-lg bg-background p-2">
          <div className="p-2 grid gap-1">
            <div className="grid grid-cols-2 justify-between gap-2">
              <div>{t('dlgAddRoundName')}</div>
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
              <div>{t('dlgAddRoundDay')}</div>
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
              <div>{t('dlgAddRoundAvailablePlayers')}</div>
              <div>{availablePlayers}</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>{t('dlgAddRoundPlayersAdvancing')}</div>
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
              <div>{t('dlgAddRoundPlayersPerMatch')}</div>
              <input
                id={`input-slots-per-match`}
                className="flex bg-transparent border-secondary-dark border rounded-md hover:border-primary"
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

            <div className="grid grid-cols-2 gap-2">
              <div>{t('dlgAddRoundAmountMatches')}</div>
              <div>{Math.ceil(availablePlayers / slotsPerMatch)}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 items-center">
              <div>{t('dlgAddRoundTimeLimit')}</div>
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

export default DialogAddRound;
