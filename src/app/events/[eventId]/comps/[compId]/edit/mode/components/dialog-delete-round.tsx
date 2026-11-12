'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Dialog from '@/components/dialog';
import { useTranslations } from 'next-intl';
import { DialogDeleteNotice } from './dialog-fields';

interface IDialogProps {
  title: string;
  queryParam: string;
  onCancel?: () => void;
  onConfirm?: (roundIndex: number) => void;
  cancelText?: string;
  confirmText?: string;
}

const DialogDeleteRound = ({ title, queryParam, onCancel, onConfirm, cancelText, confirmText }: IDialogProps) => {
  const t = useTranslations('/events/eventid/comps/compid/edit/mode');

  const searchParams = useSearchParams();
  const showDialog = searchParams?.get(queryParam);
  const roundIndex = +(searchParams?.get('rid') || 0);
  const rname = searchParams?.get('rname') || '';

  const [roundName, setRoundName] = useState<string>('');

  useEffect(() => {
    if (showDialog === '1') {
      setRoundName(rname);
    }
  }, [showDialog, rname]);

  return (
    <Dialog
      title={title}
      queryParam={queryParam}
      onCancel={onCancel}
      onConfirm={() => {
        onConfirm && onConfirm(roundIndex);
      }}
      cancelText={cancelText}
      confirmText={confirmText}
    >
      <DialogDeleteNotice name={roundName} text={t('dlgDeleteRoundText')} hint={t('dlgDeleteRoundHint')} />
    </Dialog>
  );
};

export default DialogDeleteRound;
