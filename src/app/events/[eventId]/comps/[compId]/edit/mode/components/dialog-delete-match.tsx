'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Dialog from '@/components/dialog';
import { useTranslations } from 'next-intl';

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
      <div className="flex min-w-0 flex-col">
        <div className="min-w-0">{`${matchName} - ${t('dlgDeleteMatchText')}`}</div>
      </div>
    </Dialog>
  );
};

export default DialogDeleteMatch;
