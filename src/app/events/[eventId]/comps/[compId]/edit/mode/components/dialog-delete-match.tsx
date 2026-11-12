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
  onConfirm?: (roundIndex: number, matchIndex: number) => void;
  cancelText?: string;
  confirmText?: string;
}

const DialogDeleteMatch = ({ title, queryParam, onCancel, onConfirm, cancelText, confirmText }: IDialogProps) => {
  const t = useTranslations('/events/eventid/comps/compid/edit/mode');

  const searchParams = useSearchParams();
  const showDialog = searchParams?.get(queryParam);
  const roundIndex = +(searchParams?.get('rid') || 0);
  const matchIndex = +(searchParams?.get('mid') || 0);
  const mname = searchParams?.get('mname') || '';

  const [matchName, setMatchName] = useState<string>('');

  useEffect(() => {
    if (showDialog === '1') {
      setMatchName(mname);
    }
  }, [showDialog, mname]);

  return (
    <Dialog
      title={title}
      queryParam={queryParam}
      onCancel={onCancel}
      onConfirm={() => {
        onConfirm && onConfirm(roundIndex, matchIndex);
      }}
      cancelText={cancelText}
      confirmText={confirmText}
    >
      <DialogDeleteNotice name={matchName} text={t('dlgDeleteMatchText')} hint={t('dlgApplyHint')} />
    </Dialog>
  );
};

export default DialogDeleteMatch;
